import Image from "next/image";
import { Building2 } from "lucide-react";

export function RepresentativeLogo({ name, logo }: { name: string; logo: string | null }) {
  return (
    <div className="flex h-28 w-full items-center justify-center overflow-hidden border border-black/[0.06] bg-[#F7F7F5] p-4 sm:p-5 lg:p-6">
      {logo ? (
        <div className="relative h-full w-full overflow-hidden">
          <Image src={logo} alt={`${name} logosu`} fill sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 20vw" className="object-contain object-center" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-black/40" role="img" aria-label={`${name} logosu mevcut değil`}>
          <Building2 className="h-7 w-7 stroke-[1.4]" />
          <span className="text-center text-xs font-bold uppercase tracking-[0.12em]">{name}</span>
        </div>
      )}
    </div>
  );
}
