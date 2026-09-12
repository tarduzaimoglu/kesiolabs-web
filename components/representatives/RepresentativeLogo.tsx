import Image from "next/image";
import { Building2 } from "lucide-react";

export function RepresentativeLogo({ name, logo }: { name: string; logo: string | null }) {
  return (
    <div className="flex h-28 items-center justify-center border border-black/[0.06] bg-[#F7F7F5] p-5">
      {logo ? (
        <Image src={logo} alt={`${name} logosu`} width={220} height={96} className="max-h-16 w-auto max-w-full object-contain" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-black/40" role="img" aria-label={`${name} logosu mevcut değil`}>
          <Building2 className="h-7 w-7 stroke-[1.4]" />
          <span className="text-center text-xs font-bold uppercase tracking-[0.12em]">{name}</span>
        </div>
      )}
    </div>
  );
}
