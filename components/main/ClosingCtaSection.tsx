import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ClosingCta = {
  baslik: string;
  altMetin?: string | null;
  butonYazisi?: string | null;
  butonLink?: string | null;
} | null | undefined;

export default function ClosingCtaSection({ data }: { data: ClosingCta }) {
  if (!data?.baslik) return null;

  return (
    <section className="relative z-10 py-20 md:py-28 bg-[#0b1120] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-md">
          {data.baslik}
        </h2>

        {data.altMetin ? (
          <p className="mt-5 text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {data.altMetin}
          </p>
        ) : null}

        {data.butonYazisi && data.butonLink ? (
          <div className="mt-10">
            <Link
              href={data.butonLink}
              className="group inline-flex items-center gap-3 rounded-full bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:-translate-y-1 transition-all duration-300"
            >
              {data.butonYazisi}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
