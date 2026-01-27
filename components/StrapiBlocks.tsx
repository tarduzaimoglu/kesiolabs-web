import React from "react";

type AnyObj = Record<string, any>;

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL || "http://localhost:1337";

function absolutizeUrl(url: string) {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // relative "/uploads/..." ise strapi host ekle
  if (url.startsWith("/")) return `${STRAPI_URL}${url}`;
  return url;
}

function isTextNode(node: AnyObj) {
  return node && typeof node.text === "string";
}

function getMarksClass(node: AnyObj) {
  const className: string[] = [];
  const marks: string[] = Array.isArray(node?.marks) ? node.marks : [];

  const isBold = !!node?.bold || marks.includes("bold");
  const isItalic = !!node?.italic || marks.includes("italic");
  const isUnderline = !!node?.underline || marks.includes("underline");
  const isCode = !!node?.code || marks.includes("code");
  const isStrike =
    !!node?.strikethrough || !!node?.strike || marks.includes("strikethrough");

  if (isBold) className.push("font-semibold");
  if (isItalic) className.push("italic");
  if (isUnderline) className.push("underline");
  if (isStrike) className.push("line-through");
  if (isCode) className.push("font-mono text-[12px] bg-slate-100 px-1 py-[1px] rounded");

  return className.join(" ");
}

function renderInline(node: AnyObj, key: React.Key): React.ReactNode {
  if (!node) return null;

  // hard break
  if (node.type === "break") return <br key={key} />;

  // text node
  if (isTextNode(node)) {
    const cls = getMarksClass(node);
    const parts = node.text.split("\n");

    if (parts.length === 1) {
      return (
        <span key={key} className={cls}>
          {node.text}
        </span>
      );
    }

    return (
      <span key={key} className={cls}>
        {parts.map((p: string, idx: number) => (
          <React.Fragment key={`${key}-nl-${idx}`}>
            {p}
            {idx < parts.length - 1 ? <br /> : null}
          </React.Fragment>
        ))}
      </span>
    );
  }

  // link
  if (node.type === "link") {
    const url = node.url || node.href || node?.data?.url || "#";
    const children = Array.isArray(node.children) ? node.children : [];

    return (
      <a
        key={key}
        href={url}
        className="text-blue-600 hover:underline"
        target={url?.startsWith("http") ? "_blank" : undefined}
        rel={url?.startsWith("http") ? "noreferrer" : undefined}
      >
        {children.map((c: AnyObj, i: number) => renderInline(c, `${key}-link-${i}`))}
      </a>
    );
  }

  // generic children
  if (Array.isArray(node.children)) {
    return (
      <React.Fragment key={key}>
        {node.children.map((c: AnyObj, i: number) => renderInline(c, `${key}-ch-${i}`))}
      </React.Fragment>
    );
  }

  return null;
}

function renderInlines(nodes: AnyObj[], keyPrefix: string) {
  return nodes.map((n, i) => renderInline(n, `${keyPrefix}-${i}`));
}

/**
 * ✅ List-item içinde paragraph gelirse onu düzgün render eder.
 * - list-item -> paragraph -> (text nodes)
 * - list-item -> (text nodes)
 */
function renderListItemContent(itemChildren: AnyObj[], keyPrefix: string) {
  // Eğer list-item’in içinde paragraph varsa, onun children’ını inline render et.
  const para = itemChildren.find((c) => c?.type === "paragraph" && Array.isArray(c?.children));
  if (para) return renderInlines(para.children, `${keyPrefix}-p`);

  // Yoksa direkt inline dene (text/link/break vs.)
  return renderInlines(itemChildren, `${keyPrefix}-i`);
}

function renderBlock(block: AnyObj, idx: number): React.ReactNode {
  const type = block?.type;
  const children = Array.isArray(block?.children) ? block.children : [];

  // Paragraph
  if (type === "paragraph" || !type) {
    return (
      <p
        key={idx}
        className="text-[13px] leading-7 text-slate-700 mt-4 whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
        style={{ textIndent: "1.25rem" }}
      >
        {renderInlines(children, `${idx}-p`)}
      </p>
    );
  }

  // Heading
  if (type === "heading") {
    const level = block?.level ?? block?.depth ?? 2;
    const L = Math.min(Math.max(Number(level) || 2, 1), 6);
    const Tag = (`h${L}` as any);

    const size =
      L === 1 ? "text-xl" :
      L === 2 ? "text-lg" :
      L === 3 ? "text-base" : "text-sm";

    return (
      <Tag key={idx} className={`${size} font-semibold text-slate-900 mt-6`}>
        {renderInlines(children, `${idx}-h`)}
      </Tag>
    );
  }

  // List
  if (type === "list") {
    const format = block?.format || block?.listType || block?.style || "unordered";
    const isOrdered = format === "ordered" || format === "ol";
    const ListTag = (isOrdered ? "ol" : "ul") as "ol" | "ul";

    const listClass = isOrdered
      ? "list-decimal pl-5 text-[13px] leading-7 text-slate-700"
      : "list-disc pl-5 text-[13px] leading-7 text-slate-700";

    return (
      <ListTag key={idx} className={`${listClass} mt-4`}>
        {children.map((item: AnyObj, i: number) => {
          const itemChildren = Array.isArray(item?.children) ? item.children : [];

          if (item?.type === "list-item") {
            return (
              <li key={`${idx}-li-${i}`}>
                {renderListItemContent(itemChildren, `${idx}-li-${i}`)}
              </li>
            );
          }

          // fallback
          return (
            <li key={`${idx}-li-${i}`}>
              {renderListItemContent(itemChildren.length ? itemChildren : [item], `${idx}-li-${i}`)}
            </li>
          );
        })}
      </ListTag>
    );
  }

  // Quote
  if (type === "quote") {
    return (
      <blockquote
        key={idx}
        className="mt-4 border-l-4 border-slate-200 pl-4 text-[13px] leading-7 text-slate-700 italic"
      >
        {renderInlines(children, `${idx}-q`)}
      </blockquote>
    );
  }

  // Code block
  if (type === "code") {
    const codeText =
      typeof block?.text === "string"
        ? block.text
        : children
            .map((n: AnyObj) => (typeof n?.text === "string" ? n.text : ""))
            .join("");

    return (
      <pre
        key={idx}
        className="mt-4 overflow-auto rounded-lg bg-slate-900 p-4 text-slate-100 text-[12px]"
      >
        <code className="whitespace-pre">{codeText}</code>
      </pre>
    );
  }

  // Image block
  if (type === "image") {
    const img = block?.image || block?.media || block?.asset || null;
    const rawUrl = img?.url || img?.data?.attributes?.url;
    if (!rawUrl) return null;

    const url = absolutizeUrl(rawUrl);

    const alt =
      img?.alternativeText ||
      img?.alt ||
      img?.data?.attributes?.alternativeText ||
      "";

    const caption = img?.caption || img?.data?.attributes?.caption || "";

    return (
      <figure key={idx} className="mt-6">
        <img
          src={url}
          alt={alt}
          className="w-full rounded-xl border border-slate-200"
          draggable={false}
        />
        {caption ? (
          <figcaption className="mt-2 text-xs text-slate-500">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  // Fallback
  return (
    <div key={idx} className="mt-3">
      {renderInlines(children, `${idx}-f`)}
    </div>
  );
}

export function StrapiBlocks({ blocks }: { blocks: any }) {
  const safeBlocks = Array.isArray(blocks) ? blocks : [];
  return <>{safeBlocks.map((b: AnyObj, i: number) => renderBlock(b, i))}</>;
}
