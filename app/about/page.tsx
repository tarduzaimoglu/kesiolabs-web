// app/about/page.tsx
import Image from "next/image";
import { Cpu, Target, Users } from "lucide-react";
import { getAboutPage, mediaUrl } from "@/lib/strapi";

type NormalizedMedia = {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

// --- VERİ DÜZENLEME FONKSİYONLARI ---
function normalizeMedia(input: any): NormalizedMedia | null {
  if (!input) return null;
  if (typeof input?.url === "string") return { url: input.url, alternativeText: input.alternativeText ?? null, width: input.width ?? null, height: input.height ?? null };
  if (typeof input?.data?.url === "string") return { url: input.data.url, alternativeText: input.data.alternativeText ?? null, width: input.data.width ?? null, height: input.data.height ?? null };
  const v4attrs = input?.data?.attributes;
  if (v4attrs?.url) return { url: v4attrs.url, alternativeText: v4attrs.alternativeText ?? null, width: v4attrs.width ?? null, height: v4attrs.height ?? null };
  const v4arr0 = Array.isArray(input?.data) ? input.data[0]?.attributes : null;
  if (v4arr0?.url) return { url: v4arr0.url, alternativeText: v4arr0.alternativeText ?? null, width: v4arr0.width ?? null, height: v4arr0.height ?? null };
  const attrs = input?.attributes;
  if (attrs?.url) return { url: attrs.url, alternativeText: attrs.alternativeText ?? null, width: attrs.width ?? null, height: attrs.height ?? null };
  if (typeof input === "string" && input.includes("/")) return { url: input, alternativeText: null, width: null, height: null };
  return null;
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

// --- YENİ EKRAN TASARIMI (UI) ---
export default async function AboutPage() {
  const result = await getAboutPage();

  if (!result.ok || !result.data) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-white">
        <h1 className="text-3xl font-semibold text-rose-500">Sayfa verileri yüklenemedi.</h1>
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6 text-sm font-mono">
          <div>Status: {result.status}</div>
          <div>URL: {result.url}</div>
        </div>
      </div>
    );
  }

  const a = result.data;
  const heroD = normalizeMedia(a.heroImageDesktop);
  const heroM = normalizeMedia(a.heroImageMobile);
  const midD = normalizeMedia(a.midImageDesktop);
  const midM = normalizeMedia(a.midImageMobile);

  const heroDUrl = heroD ? mediaUrl(heroD.url) ?? "" : "";
  const heroMUrl = heroM ? mediaUrl(heroM.url) ?? "" : "";
  const midDUrl = midD ? mediaUrl(midD.url) ?? "" : "";
  const midMUrl = midM ? mediaUrl(midM.url) ?? "" : "";

  const body1Paras = textFromBlocks(a.body1);
  const team = Array.isArray(a.team) ? a.team : [];

  return (
    <main className="min-h-screen bg-[#0b1120] text-slate-300 font-sans pb-24 overflow-hidden">
      
      {/* 1. KAHRAMAN BÖLÜMÜ (HERO) */}
      <section className="relative w-full h-[65vh] min-h-[500px] flex flex-col justify-center items-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroDUrl && <Image src={heroDUrl} alt="Hero Desktop" fill className="object-cover hidden md:block" priority unoptimized />}
          {heroMUrl && <Image src={heroMUrl} alt="Hero Mobile" fill className="object-cover md:hidden" priority unoptimized />}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120]/60 via-[#0b1120]/80 to-[#0b1120]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center mt-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
            {a.title || "Hakkımızda"}
          </h1>
          {a.intro1 && (
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
              {a.intro1}
            </p>
          )}
        </div>
      </section>

      {/* 2. ALTYAPI VE TEKNOLOJİ (Glassmorphism Kartı) */}
      {a.intro2 && (
        <section className="relative z-20 max-w-5xl mx-auto px-6 -mt-16 md:-mt-24 mb-24">
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl flex flex-col md:flex-row gap-8 items-start">
            <div className="shrink-0 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <Cpu className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">Üretim Altyapımız</h3>
              <p className="text-base md:text-lg text-slate-400 leading-relaxed">
                {a.intro2}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 3. PARALLAX GÖRSEL (Ayrıştırıcı Bant) */}
      {(midDUrl || midMUrl) && (
        <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden my-24 border-y border-white/5">
          <div className="absolute inset-0 z-0">
            {midDUrl && <Image src={midDUrl} alt="Mid Desktop" fill className="object-cover hidden md:block" unoptimized />}
            {midMUrl && <Image src={midMUrl} alt="Mid Mobile" fill className="object-cover md:hidden" unoptimized />}
            <div className="absolute inset-0 bg-[#0b1120]/70 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-[#0b1120]" />
          </div>
          
          <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white tracking-wider text-center px-6 drop-shadow-2xl">
            {a.midAlt || "Üretilebilir Tasarım Odaklı Çözümler"}
          </h2>
        </section>
      )}

      {/* 4. VİZYON VE YAKLAŞIM BÖLÜMÜ */}
      <section className="max-w-4xl mx-auto px-6 mb-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-10">
          <div className="flex items-center gap-4 mb-4">
            <Target className="w-8 h-8 text-indigo-400" />
            <h3 className="text-3xl font-bold text-white">Yaklaşımımız ve Vizyonumuz</h3>
          </div>
          
          <div className="space-y-8 text-[15px] md:text-[17px] leading-relaxed text-slate-400">
            {body1Paras.map((p, idx) => (
              <p key={idx} className="pl-6 border-l-2 border-indigo-500/30">
                {p}
              </p>
            ))}
            {a.body2 && (
              <p className="pl-6 border-l-2 border-indigo-500/30">
                {a.body2}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 5. EKİBİMİZ */}
      {team.length > 0 && (
        <section className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center mb-16 text-center">
            <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/10 mb-6">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {a.teamTitle || "Ekibimiz"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {team.map((m, idx) => {
              const photoUrl = m.photo ? mediaUrl(normalizeMedia(m.photo)?.url) ?? "" : "";

              return (
                <div key={m.id ?? idx} className="group bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-300">
                  {/* Fotoğraf Alanı */}
                  <div className="relative w-full aspect-[4/5] bg-black/20 overflow-hidden border-b border-white/5">
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={m.name || "Ekip Üyesi"}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-600 font-mono text-sm">
                        Fotoğraf Yok
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120]/60 via-transparent to-transparent opacity-80" />
                  </div>

                  {/* İsim ve Unvan */}
                  <div className="p-6 pt-5">
                    <h3 className="text-xl font-bold text-white">{m.name || "-"}</h3>
                    <p className="text-sm font-medium text-indigo-400 mt-1">
                      {m.role || m.title || ""}
                    </p>
                    {m.bio && (
                      <p className="mt-4 text-sm leading-relaxed text-slate-400 line-clamp-3">
                        {m.bio}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </main>
  );
}
