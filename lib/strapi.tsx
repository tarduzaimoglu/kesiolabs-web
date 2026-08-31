// lib/strapi.tsx
import type { ReactNode } from "react";

type AnyObj = Record<string, any>;

// ✅ Tek kaynak: Strapi base URL
export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") || "http://localhost:1337";

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

/** Strapi v4/v5 REST response formatlarını normalize eder */
function unwrapEntity(entity: any) {
  // v4: { id, attributes: {...} }
  if (entity && typeof entity === "object" && "attributes" in entity) {
    return { id: entity.id, ...entity.attributes };
  }
  // v5: { id, ...fields } veya { documentId, ...fields }
  return entity;
}

function unwrapCollection(res: any) {
  const arr = Array.isArray(res?.data) ? res.data : [];
  return arr.map(unwrapEntity).filter(Boolean);
}

function unwrapRelation(rel: any) {
  if (!rel) return null;
  // v4 relation: { data: { id, attributes } }
  if (rel && typeof rel === "object" && "data" in rel) return unwrapEntity(rel.data);
  // v5 relation: { id, ...fields }
  return unwrapEntity(rel);
}

/** URLSearchParams ile Strapi query üret (blog tarafı için kullanılıyor) */
export function buildQuery(params: Record<string, any>) {
  const sp = new URLSearchParams();

  const add = (key: string, val: any) => {
    if (val === undefined || val === null || val === "") return;
    sp.set(key, String(val));
  };

  // filters (genişletilebilir)
  if (params.filters?.slug?.$eq) add("filters[slug][$eq]", params.filters.slug.$eq);
  if (params.filters?.category?.slug?.$eq)
    add("filters[category][slug][$eq]", params.filters.category.slug.$eq);

  // sort[0]=date:desc
  if (Array.isArray(params.sort)) {
    params.sort.forEach((s: string, i: number) => add(`sort[${i}]`, s));
  }

  // pagination
  if (params.pagination?.pageSize) add("pagination[pageSize]", params.pagination.pageSize);

  // populate (blog tarafı için)
  if (params.populate) {
    const pop = params.populate;

    const pushFields = (prefix: string, fields: any[]) => {
      fields.forEach((f, i) => add(`populate[${prefix}][fields][${i}]`, f));
    };

    const pushPopulate = (prefix: string, value: any) => {
      if (value === undefined || value === null) return;

      if (value === true || value === "*") {
        add(`populate[${prefix}]`, "*");
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((child) => {
          if (!child) return;
          add(`populate[${prefix}][populate][${String(child)}]`, "*");
        });
        return;
      }

      if (typeof value === "object") {
        if (Array.isArray(value.fields)) pushFields(prefix, value.fields);

        if (value.populate) {
          const p = value.populate;
          if (p === "*" || p === true) {
            add(`populate[${prefix}][populate]`, "*");
          } else if (Array.isArray(p)) {
            p.forEach((child) => {
              if (!child) return;
              add(`populate[${prefix}][populate][${String(child)}]`, "*");
            });
          } else if (typeof p === "object") {
            Object.keys(p).forEach((k) => {
              pushPopulate(`${prefix}][populate][${k}`, p[k]);
            });
          }
        }
      }
    };

    if (typeof pop === "string") {
      add("populate", pop);
    } else if (Array.isArray(pop)) {
      pop.forEach((field) => {
        if (!field) return;
        if (String(field) === "coverImage") {
          pushPopulate("coverImage", { fields: ["url", "alternativeText", "formats"] });
        } else {
          add(`populate[${String(field)}]`, "*");
        }
      });
    } else if (typeof pop === "object") {
      for (const k of Object.keys(pop)) {
        const v = pop[k];
        if (k === "coverImage" && (v === "*" || v === true)) {
          pushPopulate("coverImage", { fields: ["url", "alternativeText", "formats"] });
        } else {
          pushPopulate(k, v);
        }
      }
    }
  }

  const q = sp.toString();
  return q ? `?${q}` : "";
}

export async function strapiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${STRAPI_URL}${path}`;
  const headers = new Headers(init?.headers);

  if (STRAPI_TOKEN) headers.set("Authorization", `Bearer ${STRAPI_TOKEN}`);

  const res = await fetch(url, {
    ...init,
    headers,
    cache: init?.cache,
    next: (init as any)?.next ?? { revalidate: 300 },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Strapi error ${res.status} on ${path}: ${txt}`);
  }

  return (await res.json()) as T;
}

/** strapiFetch'in aksine hata fırlatmaz; ok/status/json döner (graceful-degrade sayfalar için) */
async function strapiFetchRaw(
  path: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; json: any }> {
  const url = `${STRAPI_URL}${path}`;
  const headers = new Headers(init?.headers);

  if (STRAPI_TOKEN) headers.set("Authorization", `Bearer ${STRAPI_TOKEN}`);

  const res = await fetch(url, {
    ...init,
    headers,
    cache: init?.cache,
    next: (init as any)?.next ?? { revalidate: 300 },
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {}

  return { ok: res.ok, status: res.status, json };
}

/* ---------------------------------------
   ✅ MEDIA HELPERS (single + multi)
---------------------------------------- */

function absMediaUrl(maybeRelativeUrl?: string | null) {
  if (!maybeRelativeUrl) return null;
  if (maybeRelativeUrl.startsWith("/uploads/")) return `/backend${maybeRelativeUrl}`;
  try {
    const url = new URL(maybeRelativeUrl);
    if (url.origin === "https://kesiolabs-slave1.tail4be241.ts.net:8443" && url.pathname.startsWith("/uploads/")) {
      return `/backend${url.pathname}${url.search}${url.hash}`;
    }
  } catch {}
  return maybeRelativeUrl;
}

/**
 * ✅ Media alanını URL listesine çevirir (single/multi + v4/v5)
 * - v4 single: { data: { attributes: { url } } }
 * - v4 multi : { data: [ { attributes: { url } } ] }
 * - v5 multi : { data: [ { url } ] } veya { data: [ { attributes: { url } } ] }
 * - v5 single: { url } veya { data: { url } } veya { data: { attributes: { url } } }
 */
export function getMediaUrls(media: any): string[] {
  if (!media) return [];

  // ✅ SENİN FORMATIN: image: [{ url: "/uploads/..." }, ...]
  if (Array.isArray(media)) {
    return media
      .map((x: any) => x?.url ?? x?.attributes?.url)
      .map(absMediaUrl)
      .filter((u: any) => typeof u === "string" && u.length > 0) as string[];
  }

  // 1) multi: { data: [...] }
  if (Array.isArray(media?.data)) {
    return media.data
      .map((x: any) => x?.attributes?.url ?? x?.url)
      .map(absMediaUrl)
      .filter((u: any) => typeof u === "string" && u.length > 0) as string[];
  }

  // 2) v4 single: { data: { attributes: { url } } }
  const v4Single = media?.data?.attributes?.url;
  if (typeof v4Single === "string" && v4Single) {
    const u = absMediaUrl(v4Single);
    return u ? [u] : [];
  }

  // 3) v5 single: { data: { url } } veya { data: { attributes: { url } } }
  const v5Single = media?.data?.url ?? media?.data?.attributes?.url;
  if (typeof v5Single === "string" && v5Single) {
    const u = absMediaUrl(v5Single);
    return u ? [u] : [];
  }

  // 4) v5: { url }
  const v5Url = media?.url;
  if (typeof v5Url === "string" && v5Url) {
    const u = absMediaUrl(v5Url);
    return u ? [u] : [];
  }

  return [];
}

export function getMediaUrl(media: any): string | null {
  return getMediaUrls(media)[0] ?? null;
}

/** URL string ile çalışmak için (kurumsal sayfalar vs.) */
export function mediaUrl(maybeRelativeUrl?: string | null) {
  return absMediaUrl(maybeRelativeUrl);
}

export function getCategorySlug(category: any): string | null {
  if (!category) return null;
  const v4 = category?.data?.attributes?.slug;
  const v5 = category?.slug;
  return v4 || v5 || null;
}

export function getCategoryTitle(category: any): string | null {
  if (!category) return null;
  const v4 = category?.data?.attributes?.title;
  const v5 = category?.title;
  return v4 || v5 || null;
}

/** Strapi Blocks (rich text) -> basit JSX (paragraf) */
export function renderBlocks(blocks: any): ReactNode[] {
  if (!Array.isArray(blocks)) return [];

  return blocks
    .filter((b) => b?.type === "paragraph" && Array.isArray(b.children))
    .map((b, idx) => {
      const text = b.children
        .filter((c: AnyObj) => c?.type === "text")
        .map((c: AnyObj) => c.text || "")
        .join("");

      // boş paragraf ise küçük boşluk bırak
      if (!text.trim()) return <div key={idx} className="h-3" />;

      return (
        <p key={idx} className="text-sm md:text-base leading-relaxed text-slate-600">
          {text}
        </p>
      );
    });
}

/* -----------------------------
   BLOG API
------------------------------ */

export type StrapiCategory = {
  id: number;
  title: string;
  slug: string;
  description?: string;
};

export type StrapiPost = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  date?: string;
  coverImage?: any;
  category?: any;
  contentBlocks?: any;
};

export async function getCategories(): Promise<StrapiCategory[]> {
  const q = buildQuery({
    sort: ["title:asc"],
    pagination: { pageSize: 200 },
  });

  const res = await strapiFetch<any>(`/api/categories${q}`, {
    next: { revalidate: 300 },
  });
  const items = unwrapCollection(res);

  return items.map((x: AnyObj) => ({
    id: x?.id,
    title: x?.title || "",
    slug: x?.slug || "",
    description: x?.description || "",
  }));
}

export async function getPosts(): Promise<StrapiPost[]> {
  const q = buildQuery({
    sort: ["date:desc"],
    pagination: { pageSize: 100 },
    populate: {
      coverImage: { fields: ["url", "alternativeText", "formats"] },
      category: { fields: ["title", "slug", "description"] },
    },
  });

  const res = await strapiFetch<any>(`/api/posts${q}`, {
    next: { revalidate: 300 },
  });
  const items = unwrapCollection(res);

  return items.map((x: AnyObj) => ({
    id: x?.id,
    title: x?.title || "",
    slug: x?.slug || "",
    excerpt: x?.excerpt || "",
    date: x?.date || "",
    coverImage: x?.coverImage,
    category: x?.category,
    contentBlocks: x?.contentBlocks,
  }));
}

export async function getPostBySlug(slug: string): Promise<StrapiPost | null> {
  const q = buildQuery({
    filters: { slug: { $eq: slug } },
    pagination: { pageSize: 1 },
    populate: {
      coverImage: { fields: ["url", "alternativeText", "formats"] },
      category: { fields: ["title", "slug", "description"] },
    },
  });

  const res = await strapiFetch<any>(`/api/posts${q}`, {
    next: { revalidate: 300 },
  });
  const items = unwrapCollection(res);
  const x = items?.[0];
  if (!x) return null;

  return {
    id: x?.id,
    title: x?.title || "",
    slug: x?.slug || "",
    excerpt: x?.excerpt || "",
    date: x?.date || "",
    coverImage: x?.coverImage,
    category: x?.category,
    contentBlocks: x?.contentBlocks,
  };
}

/* ---------------------------------------
   CATALOG / PRODUCTS
---------------------------------------- */

function normalizeStringArray(input: any): string[] {
  if (!input) return [];
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
      return [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(input)) return input.map(String).filter(Boolean);
  return [];
}

/**
 * ✅ CategoryProduct tablarını Strapi’den çeker
 * UID: /api/category-products
 */
export async function getCatalogCategories(): Promise<{ key: string; label: string }[]> {
  const path =
    "/api/category-products" +
    "?sort=order:asc" +
    "&sort=createdAt:desc" +
    "&filters[isActive][$eq]=true" +
    "&fields[0]=slug" +
    "&fields[1]=title";

  const res = await strapiFetch<any>(path, { next: { revalidate: 300 } });
  const items = unwrapCollection(res);

  type CategoryItem = { key: string; label: string };

return items
  .map((x: AnyObj): CategoryItem => ({
    key: String(x?.slug ?? x?.id ?? ""),
    label: String(x?.title ?? x?.slug ?? "Kategori"),
  }))
  .filter((x: CategoryItem) => Boolean(x.key && x.label));
}

/**
 * ✅ Products: image (multi) + category_product relation
 */
export async function getCatalogProducts(): Promise<any[]> {
  const path =
    "/api/products" +
    "?sort=order:asc" +
    "&sort=createdAt:desc" +
    "&pagination[page]=1" +
    "&pagination[pageSize]=200" +
    "&filters[isActive][$eq]=true" +
    "&populate[0]=image" +
    "&populate[1]=category_product" +
    "&fields[0]=title" +
    "&fields[1]=featured" +
    "&fields[2]=order" +
    "&fields[3]=createdAt" +
    "&fields[4]=wholesalePrice" +
    "&fields[5]=minQtyText" +
    "&fields[6]=bullets" +
    "&fields[7]=specs" +
    "&fields[8]=qtyNoteRich";

  const res = await strapiFetch<any>(path, { next: { revalidate: 300 } });
  const items = unwrapCollection(res);

  return items.map((x: AnyObj) => {
    const cat = unwrapRelation(x?.category_product);
    const categoryKey = String(cat?.slug ?? cat?.key ?? "");

    const imgField = x?.image;
    const imageUrls = (Array.isArray(imgField) ? imgField : [imgField])
      .map((m: any) => getMediaUrl(m))
      .filter((u): u is string => typeof u === "string" && u.length > 0);

    const primaryImg = imageUrls[0] || mediaUrl(x?.imageUrl) || "";

    return {
      id: String(x?.id ?? x?.documentId ?? ""),
      title: x?.title || "",
      category: categoryKey || "other",
      featured: !!x?.featured,
      createdAtISO: x?.createdAt
        ? new Date(x.createdAt).toISOString()
        : new Date().toISOString(),
      imageUrls,
      primaryImg,
      image: primaryImg,
      wholesalePrice:
        typeof x?.wholesalePrice === "number" ? x.wholesalePrice : undefined,
      minQtyText: x?.minQtyText || "",
      bullets: normalizeStringArray(x?.bullets),
      specs: normalizeStringArray(x?.specs),
      qtyNoteRich: typeof x?.qtyNoteRich === "string" ? x.qtyNoteRich : "",
    };
  });
}

/* ---------------------------------------
   CUSTOM PRODUCTS (CustomProductTypes)
---------------------------------------- */

export async function getCustomProductTypes(): Promise<any[]> {
  const path =
    "/api/custom-product-types" +
    "?sort=order:asc" +
    "&sort=createdAt:desc" +
    "&filters[isActive][$eq]=true" +
    "&populate[0]=image";

  const res = await strapiFetch<any>(path, { next: { revalidate: 300 } });
  const items = unwrapCollection(res);

  return items.map((x: AnyObj) => {
    const img = getMediaUrl(x?.image) || mediaUrl(x?.imageUrl) || "/products/placeholder.png";

    return {
      id: String(x?.id ?? x?.documentId ?? ""),
      title: x?.title ?? x?.name ?? "",
      slug: x?.slug ?? "",
      order: typeof x?.order === "number" ? x.order : 0,
      isActive: !!x?.isActive,
      image: img,
      imageUrl: img,
    };
  });
}

/* ---------------------------------------
   MAIN PAGE (anasayfa)
---------------------------------------- */

export type MainPageData = {
  id: number;
  heroBanners: Array<{
    id: number;
    title: string;
    subtitle?: string | null;
    buttonText?: string | null;
    buttonLink?: string | null;
    imageDesktop?: AnyObj | null;
    imageMobile?: AnyObj | null;
  }>;
  whiteSection?: {
    id: number;
    title: string;
    description?: any;
    buttonText?: string | null;
    buttonLink?: string | null;
  } | null;
  grayBanners: Array<{
    id: number;
    title: string;
    subtitle?: string | null;
    buttonText?: string | null;
    buttonLink?: string | null;
    image?: AnyObj | null;
  }>;
  howItWorks?: {
    id: number;
    title: string;
    description?: string | null;
    video?: AnyObj | null;
    posterImage?: AnyObj | null;
  } | null;
  faqs: Array<{
    id: number;
    question: string;
    answer?: any;
  }>;
  quickLinks: Array<{
    id: number;
    title: string;
    subtitle?: string | null;
    href: string;
    icon?: "box" | "book" | "bag" | null;
  }>;
  closingCta?: {
    id: number;
    baslik: string;
    altMetin?: string | null;
    butonYazisi?: string | null;
    butonLink?: string | null;
  } | null;
};

export async function getMainPage(): Promise<MainPageData | null> {
  const qs =
    "populate[heroBanners][populate]=*&populate[whiteSection][populate]=*&populate[grayBanners][populate]=*&populate[howItWorks][populate]=*&populate[faqs][populate]=*&populate[quickLinks][populate]=*&populate[closingCta][populate]=*";

  const r = await strapiFetchRaw(`/api/main-page?${qs}`, { next: { revalidate: 3600 } });
  if (!r.ok) return null;

  return r.json?.data ?? null;
}

/* ---------------------------------------
   QUOTE PAGE
---------------------------------------- */

export async function getQuotePage(): Promise<any | null> {
  const qs = new URLSearchParams();
  qs.set("populate", "howItWorksVideo");

  const r = await strapiFetchRaw(`/api/quote-page?${qs.toString()}`, {
    next: { revalidate: 3600 },
  });
  if (!r.ok) return null;

  return r.json?.data ?? null;
}

/* ---------------------------------------
   ABOUT PAGE
---------------------------------------- */

export type AboutTeamMember = {
  id?: number;
  name?: string;
  role?: string;
  title?: string;
  bio?: string;
  photo?: any;
};

export type AboutPageData = {
  title?: string;
  intro1?: string;
  intro2?: string;
  body2?: string;
  heroImageDesktop?: any;
  heroImageMobile?: any;
  midImageDesktop?: any;
  midImageMobile?: any;
  heroAlt?: string;
  midAlt?: string;
  teamTitle?: string;
  team?: AboutTeamMember[];
  body1?: any;
};

export async function getAboutPage(): Promise<{
  ok: boolean;
  status: number;
  url: string;
  raw: any | null;
  data: AboutPageData | null;
}> {
  const path =
    "/api/about-page?populate[0]=heroImageDesktop&populate[1]=heroImageMobile&populate[2]=midImageDesktop&populate[3]=midImageMobile&populate[4]=team&populate[5]=team.photo";

  const r = await strapiFetchRaw(path, { next: { revalidate: 3600 } });
  const d = r.json?.data;
  const data: AboutPageData | null = d ? (d.attributes ?? d) : null;

  return { ok: r.ok, status: r.status, url: `${STRAPI_URL}${path}`, raw: r.json ?? null, data };
}

/* ---------------------------------------
   STATIC PAGES (corporate / faq / privacy-policy / delivery-returns)
---------------------------------------- */

export async function getPageBySlug(slug: string): Promise<any | null> {
  const fetchList = async (path: string) => {
    const res = await strapiFetch<any>(path, { next: { revalidate: 3600 } });
    return unwrapCollection(res);
  };

  const pick = (list: any[]) => list.find((x) => x?.slug === slug) ?? null;

  // 1) Strapi standard: filters
  const list1 = await fetchList(`/api/pages?filters[slug][$eq]=${encodeURIComponent(slug)}`);
  const hit1 = pick(list1);
  if (hit1) return hit1;

  // 2) Bazı setup'larda var ama filtrelemiyor olabilir
  const list2 = await fetchList(`/api/pages?filter[slug][$eq]=${encodeURIComponent(slug)}`);
  const hit2 = pick(list2);
  if (hit2) return hit2;

  // 3) Son çare: tüm sayfaları çek ve slug'a göre seç
  const list3 = await fetchList(`/api/pages`);
  return pick(list3);
}
