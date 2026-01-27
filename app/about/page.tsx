// app/about/page.tsx
import Image from "next/image";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

type NormalizedMedia = {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

function normalizeMedia(input: any): NormalizedMedia | null {
  if (!input) return null;

  // Strapi v5 (media direkt obje)
  if (typeof input?.url === "string") {
    return {
      url: input.url,
      alternativeText: input.alternativeText ?? null,
      width: input.width ?? null,
      height: input.height ?? null,
    };
  }

  // Bazı kurulumlar: { data: { url } }
  if (typeof input?.data?.url === "string") {
    return {
      url: input.data.url,
      alternativeText: input.data.alternativeText ?? null,
      width: input.data.width ?? null,
      height: input.data.height ?? null,
    };
  }

  // Strapi v4: { data: { attributes: { url } } }
  const v4attrs = input?.data?.attributes;
  if (v4attrs?.url) {
    return {
      url: v4attrs.url,
      alternativeText: v4attrs.alternativeText ?? null,
      width: v4attrs.width ?? null,
      height: v4attrs.height ?? null,
    };
  }

  // { data: [ { attributes: { url } } ] }
  const v4arr0 = Array.isArray(input?.data) ? input.data[0]?.attributes : null;
  if (v4arr0?.url) {
    return {
      url: v4arr0.url,
      alternativeText: v4arr0.alternativeText ?? null,
      width: v4arr0.width ?? null,
      height: v4arr0.height ?? null,
    };
  }

  // { attributes: { url } }
  const attrs = input?.attributes;
  if (attrs?.url) {
    return {
      url: attrs.url,
      alternativeText: attrs.alternativeText ?? null,
      width: attrs.width ?? null,
      height: attrs.height ?? null,
    };
  }

  // Direkt string: "/uploads/xxx.png"
  if (typeof input === "string" && input.includes("/")) {
    return { url: input, alternativeText: null, width: null, height: null };
  }

  return null;
}

function absStrapiUrl(maybeRelative?: string) {
  if (!maybeRelative) return "";
  if (maybeRelative.startsWith("http://") || maybeRelative.startsWith("https://"))
    return maybeRelative;
  return `${STRAPI_URL}${maybeRelative}`;
}

function textFromBlocks(blocks: any): string[] {
  if (!Array.isArray(blocks)) return [];
  const paras: string[] = [];
  for (const node of blocks) {
    if (node?.type === "paragraph" && Array.isArray(node.children)) {
      const t = node.children.map((c: any) => c?.text || "").join("");
      const trimmed = (t || "").trim();
      if (trimmed) paras.push(trimmed);
    }
  }
  return paras;
}

type TeamMember = {
  id?: number;
  name?: string;
  role?: string;
  title?: string;
  bio?: string;
  photo?: any;
};

type AboutPageData = {
  title?: string;
  intro1?: string;
  intro2?: string;
  body2?: string;

  // SADECE BU 4 GÖRSEL
  heroImageDesktop?: any;
  heroImageMobile?: any;
  midImageDesktop?: any;
  midImageMobile?: any;

  heroAlt?: string;
  midAlt?: string;

  teamTitle?: string;
  team?: TeamMember[];
  body1?: any;
};

async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: {
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    cache: "no-store",
  });

  const status = res.status;
  let json: any = null;
  try {
    json = await res.json();
  } catch {}

  return { ok: res.ok, status, json };
}

async function fetchAboutPage(): Promise<{
  ok: boolean;
  status: number;
  url: string;
  raw: any | null;
  data: AboutPageData | null;
}> {
  // ✅ Senin Strapi'nin kabul ettiği format: populate[0]=...
  // Sadece 4 görsel + team populate
  const url =
    `${STRAPI_URL}/api/about-page` +
    `?populate[0]=heroImageDesktop` +
    `&populate[1]=heroImageMobile` +
    `&populate[2]=midImageDesktop` +
    `&populate[3]=midImageMobile` +
    `&populate[4]=team` +
    `&populate[5]=team.photo`;

  const r = await fetchJson(url);
  const d = r.json?.data;
  const data: AboutPageData | null = d ? (d.attributes ?? d) : null;

  return { ok: r.ok, status: r.status, url, raw: r.json ?? null, data };
}

// max-w olsa bile full-bleed
function FullBleed({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      {children}
    </div>
  );
}

export default async function AboutPage() {
  const result = await fetchAboutPage();

  if (!result.ok || !result.data) {
    return (
      <div className="mx-auto max-w-[1100px] px-6 py-16">
        <h1 className="text-3xl font-semibold">AboutPage yüklenemedi</h1>
        <div className="mt-6 rounded-xl border bg-white p-6 text-sm">
          <div className="font-medium">STRAPI_URL: {STRAPI_URL}</div>
          <div className="font-medium">Fetch URL: {result.url}</div>
          <div className="font-medium">Status: {result.status}</div>
          <pre className="mt-4 overflow-auto rounded-lg bg-slate-50 p-4">
            {JSON.stringify(result.raw, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  const a = result.data;

  // SADECE 4 GÖRSEL
  const heroD = normalizeMedia(a.heroImageDesktop);
  const heroM = normalizeMedia(a.heroImageMobile);
  const midD = normalizeMedia(a.midImageDesktop);
  const midM = normalizeMedia(a.midImageMobile);

  const heroDUrl = heroD ? absStrapiUrl(heroD.url) : "";
  const heroMUrl = heroM ? absStrapiUrl(heroM.url) : "";
  const midDUrl = midD ? absStrapiUrl(midD.url) : "";
  const midMUrl = midM ? absStrapiUrl(midM.url) : "";

  const body1Paras = textFromBlocks(a.body1);
  const team = Array.isArray(a.team) ? a.team : [];

  // Ölçüler
  const WHITE_OVER_HERO_MB = "mt-[-96px]";
  const WHITE_OVER_HERO_MD = "md:mt-[-192px]";
  const RADIUS_MB = "rounded-tl-[96px]";
  const RADIUS_MD = "md:rounded-tl-[192px]";
  const MID_OVER_WHITE_MB = "-mt-[32px]";
  const MID_OVER_WHITE_MD = "md:-mt-[48px]";
  const WHITE_PB_MB = "pb-[96px]";
  const WHITE_PB_MD = "md:pb-[140px]";

  return (
    <main className="bg-white">
      {/* HERO (radius YOK) */}
      <FullBleed>
        <section className="relative w-full">
          <div
            className="
              relative w-full overflow-hidden bg-slate-100
              h-[42vh] min-h-[280px] max-h-[520px]
              md:h-[52vh] md:min-h-[360px] md:max-h-[640px]
            "
          >
            {heroMUrl ? (
              <Image
                src={heroMUrl}
                alt={a.heroAlt || heroM?.alternativeText || "Hero"}
                fill
                className="object-cover md:hidden"
                priority
                sizes="100vw"
              />
            ) : null}

            {heroDUrl ? (
              <Image
                src={heroDUrl}
                alt={a.heroAlt || heroD?.alternativeText || "Hero"}
                fill
                className="hidden md:block object-cover"
                priority
                sizes="100vw"
              />
            ) : null}

            {!heroMUrl && !heroDUrl ? (
              <div className="flex h-full w-full items-center justify-center text-slate-500">
                Hero görseli yok
              </div>
            ) : null}
          </div>
        </section>
      </FullBleed>

      {/* WHITE BLOCK: sadece sol-üst radius, hero üstüne biner */}
      <section className="relative z-20">
        <FullBleed>
          <div
            className={[
              "relative bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]",
              WHITE_OVER_HERO_MB,
              WHITE_OVER_HERO_MD,
              RADIUS_MB,
              RADIUS_MD,
              WHITE_PB_MB,
              WHITE_PB_MD,
            ].join(" ")}
          >
            <div className="mx-auto max-w-[1100px] px-6 pt-12 md:pt-16">
              <h1 className="text-center text-3xl md:text-4xl font-semibold text-slate-900">
                {a.title || "Hakkımızda"}
              </h1>

              <div className="mx-auto mt-6 max-w-[860px] space-y-5 text-[13px] md:text-sm leading-6 md:leading-7 text-slate-600 text-center">
                {a.intro1 ? <p>{a.intro1}</p> : null}
                {a.intro2 ? <p>{a.intro2}</p> : null}
              </div>
            </div>
          </div>
        </FullBleed>
      </section>

      {/* MID: radius YOK (mobil + desktop) */}
      <section className="relative z-10">
        <FullBleed>
          <div
            className={[
              "relative w-full overflow-hidden bg-slate-100 rounded-none",
              MID_OVER_WHITE_MB,
              MID_OVER_WHITE_MD,
              "h-[48vh] min-h-[320px] max-h-[640px]",
              "md:h-[56vh] md:min-h-[440px] md:max-h-[780px]",
            ].join(" ")}
          >
            {midMUrl ? (
              <Image
                src={midMUrl}
                alt={a.midAlt || midM?.alternativeText || "Mid"}
                fill
                className="object-cover md:hidden"
                sizes="100vw"
              />
            ) : null}

            {midDUrl ? (
              <Image
                src={midDUrl}
                alt={a.midAlt || midD?.alternativeText || "Mid"}
                fill
                className="hidden md:block object-cover"
                sizes="100vw"
              />
            ) : null}

            {!midMUrl && !midDUrl ? (
              <div className="flex h-full w-full items-center justify-center text-slate-500">
                Mid görseli yok
              </div>
            ) : null}
          </div>
        </FullBleed>
      </section>

      {/* BODY */}
      <section className="mx-auto max-w-[1100px] px-6 pb-16">
        {body1Paras.length ? (
          <div className="mx-auto mt-10 max-w-[980px] space-y-4 text-[13px] md:text-sm leading-6 md:leading-7 text-slate-600">
            {body1Paras.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        ) : null}

        {a.body2 ? (
          <div className="mx-auto mt-6 max-w-[980px] text-[13px] md:text-sm leading-6 md:leading-7 text-slate-600">
            <p>{a.body2}</p>
          </div>
        ) : null}

        {/* TEAM */}
        <div className="mt-16">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-slate-900">
            {a.teamTitle || "Ekibimiz"}
          </h2>

          <div className="mt-10 grid gap-6 grid-cols-2 md:gap-8 md:grid-cols-3 lg:grid-cols-4">
            {team.map((m, idx) => {
              const photo = normalizeMedia(m.photo);
              const photoUrl = photo ? absStrapiUrl(photo.url) : "";

              return (
                <div
                  key={m.id ?? idx}
                  className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden"
                >
                  <div className="relative w-full aspect-[3/4] bg-slate-100 overflow-hidden rounded-tl-[45px]">
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={m.name || "Team member"}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        Fotoğraf yok
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="text-sm md:text-base font-semibold text-slate-900">
                      {m.name || "-"}
                    </div>
                    <div className="mt-1 text-[11px] md:text-xs text-slate-500">
                      {m.role || m.title || ""}
                    </div>
                    {m.bio ? (
                      <div className="mt-2 text-[12px] leading-5 text-slate-600 line-clamp-3">
                        {m.bio}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
