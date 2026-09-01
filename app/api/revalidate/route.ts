/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const STATIC_PAGE_SLUGS = ["corporate", "faq", "privacy-policy", "delivery-returns"];

function pathsForModel(model: string, entry: any): string[] {
  const slug = typeof entry?.slug === "string" ? entry.slug : null;

  switch (model) {
    case "post":
      return ["/makaleler", "/makaleler/haberler", "/makaleler/uygulama-notlari", ...(slug ? [`/makaleler/${slug}`] : [])];

    case "category":
      return ["/makaleler"];

    case "product":
    case "category-product":
      return ["/products"];

    case "representative":
    case "representative-group":
      return ["/temsilcilikler"];

    case "custom-product-type":
      return ["/custom-products"];

    case "about-page":
      return ["/about"];

    case "main-page":
      return ["/"];

    case "quote-page":
      return ["/quote"];

    case "page":
      return slug ? [`/${slug}`] : STATIC_PAGE_SLUGS.map((s) => `/${s}`);

    // Global site-wide content — touches the shared layout (header/footer) on every route.
    case "site-setting":
      return ["/"];

    default:
      return [];
  }
}

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, message: "REVALIDATE_SECRET is not configured" },
      { status: 500 }
    );
  }

  const providedSecret =
    request.headers.get("x-revalidate-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    null;

  if (providedSecret !== secret) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  let body: any = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ revalidated: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const model: string | undefined = body?.model;
  const entry = body?.entry;

  if (!model) {
    return NextResponse.json({ revalidated: false, message: "Missing model" }, { status: 400 });
  }

  const paths = pathsForModel(model, entry);

  if (paths.length === 0) {
    return NextResponse.json({
      revalidated: false,
      message: `No path mapping for model "${model}"`,
    });
  }

  for (const path of paths) {
    revalidatePath(path, model === "site-setting" ? "layout" : undefined);
  }

  return NextResponse.json({ revalidated: true, model, paths });
}
