import Link from "next/link";
import { Box, BookOpen, ShoppingBag } from "lucide-react";

type QuickLink = {
  id?: number;
  title: string;
  subtitle?: string | null;
  href: string;
  icon?: "box" | "book" | "bag" | null;
};

function iconNode(icon?: QuickLink["icon"]) {
  const common = { className: "w-7 h-7", strokeWidth: 2 };
  if (icon === "book") return <BookOpen {...common} />;
  if (icon === "bag") return <ShoppingBag {...common} />;
  return <Box {...common} />;
}

function GlassCard({
  icon,
  title,
  subtitle,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between w-full h-full min-h-[280px] p-8 md:p-10 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04] hover:border-indigo-500/40 hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)]"
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-indigo-500/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div>
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 mb-8 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-500 shadow-inner">
          {icon}
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight leading-snug group-hover:text-indigo-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-[15px] text-slate-400 leading-relaxed font-medium">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}

export default function QuickLinksSection({ items }: { items: QuickLink[] }) {
  const visible = items.filter((c) => c && c.title && c.href);
  if (visible.length === 0) return null;

  return (
    <section className="relative z-10 py-20 md:py-32 bg-[#0b1120]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {visible.map((c, idx) => (
            <GlassCard
              key={c.id ?? idx}
              icon={iconNode(c.icon)}
              title={c.title}
              subtitle={c.subtitle ?? ""}
              href={c.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
