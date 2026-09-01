import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const address = "Acıbadem Mahallesi, Akçaağaç Sokak No: 8 Üsküdar, İstanbul";

export default function Footer() {
  return (
    <footer className="border-t-4 border-[#DA291C] bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="text-2xl font-black italic tracking-[-0.045em]">KESIO<span className="text-[#DA291C]">LABS</span></Link>
          <p className="mt-5 text-sm leading-7 text-[#B7B7B7]">İşletmeler için dijital üretim, 3D baskı ve endüstriyel tasarım çözümleri.</p>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">İletişim</h2>
          <div className="mt-5 space-y-4 text-sm text-[#B7B7B7]">
            <a className="flex gap-3 hover:text-white" href="tel:+905465868005"><Phone className="h-4 w-4 text-[#DA291C]" />0546 586 80 05</a>
            <a className="flex gap-3 hover:text-white" href="mailto:info@kesiolabs.com"><Mail className="h-4 w-4 text-[#DA291C]" />info@kesiolabs.com</a>
            <a className="flex gap-3 leading-6 hover:text-white" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer"><MapPin className="mt-1 h-4 w-4 shrink-0 text-[#DA291C]" />{address}</a>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Keşfet</h2>
          <div className="mt-5 grid gap-3 text-sm text-[#B7B7B7]">
            <Link href="/products" className="hover:text-white">Ürünler</Link><Link href="/temsilcilikler" className="hover:text-white">Temsilcilikler</Link><Link href="/makaleler" className="hover:text-white">Makaleler</Link><Link href="/contact" className="hover:text-white">İletişim</Link>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Kurumsal</h2>
          <div className="mt-5 grid gap-3 text-sm text-[#B7B7B7]">
            <Link href="/about" className="hover:text-white">Hakkımızda</Link><Link href="/privacy-policy" className="hover:text-white">Gizlilik Politikası</Link><Link href="/delivery-returns" className="hover:text-white">Teslimat ve İade</Link><Link href="/faq" className="hover:text-white">Sık Sorulan Sorular</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15 px-6 py-5 text-center text-xs text-[#B7B7B7]">© 2026 Kesiolabs. Tüm hakları saklıdır.</div>
    </footer>
  );
}
