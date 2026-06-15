import Link from "next/link";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

// Adres ve Harita Bilgileri
const ADDRESS = "Acıbadem Mahallesi, Akçaağaç Sokak No: 8 Üsküdar, İSTANBUL";
const MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(ADDRESS);

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0b1120] text-slate-300 font-sans border-t border-white/5">
      {/* İnce bir üst ışık efekti (Görseldeki premium hissiyatı verir) */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* 1. SÜTUN: Marka & Açıklama */}
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
              Kesio<span className="text-indigo-400">Labs</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-400 mb-8 pr-4">
              KesioLabs bünyesinde, işletmeler ve bireyler için yüksek kapasiteli ve kaliteli 3D baskı, endüstriyel tasarım çözümleri sunuyoruz. Hızlı üretim, uygun maliyet.
            </p>
            
            {/* Sigortalı Teslimat Rozeti */}
            <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl p-3 lg:pr-6 w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-white/90 leading-tight">
                Türkiye'nin Her Yerine <br /> Sigortalı Teslimat
              </span>
            </div>
          </div>

          {/* 2. SÜTUN: İletişim */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">BİZE ULAŞIN</h4>
            <div className="space-y-5">
              <a href="tel:+905465868005" className="flex items-start gap-4 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/[0.03] border border-white/10 group-hover:bg-white/[0.08] transition-colors shrink-0">
                  <Phone className="w-4 h-4 text-indigo-300" />
                </div>
                <div className="flex flex-col justify-center min-h-[2.5rem]">
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">0546 586 80 05</span>
                </div>
              </a>

              <a href="mailto:info@kesiolabs.com" className="flex items-start gap-4 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/[0.03] border border-white/10 group-hover:bg-white/[0.08] transition-colors shrink-0">
                  <Mail className="w-4 h-4 text-indigo-300" />
                </div>
                <div className="flex flex-col justify-center min-h-[2.5rem]">
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">info@kesiolabs.com</span>
                </div>
              </a>

              <a href={MAPS_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/[0.03] border border-white/10 group-hover:bg-white/[0.08] transition-colors shrink-0">
                  <MapPin className="w-4 h-4 text-indigo-300" />
                </div>
                <div className="flex flex-col justify-center min-h-[2.5rem]">
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors leading-relaxed">
                    Acıbadem Mah. Akçaağaç Sokak <br /> No: 8 Üsküdar / İstanbul
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* 3. SÜTUN: Kurumsal Linkler */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">KURUMSAL</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/corporate" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/delivery-returns" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Mesafeli Satış Sözleşmesi
                </Link>
              </li>
              <li>
                <Link href="/delivery-returns" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Teslimat & İade Koşulları
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Sık Sorulan Sorular
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. SÜTUN: Çalışma Saatleri & Sosyal Medya */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">ÇALIŞMA SAATLERİ</h4>
            
            {/* Saatler Kutusu */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">Hafta İçi</span>
                <span className="text-sm font-medium text-white">08:00 - 20:00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">Cumartesi</span>
                <span className="text-sm font-medium text-white">08:00 - 16:00</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-slate-400">Pazar</span>
                <span className="text-sm font-medium text-rose-400">Kapalı</span>
              </div>
            </div>

            {/* Sosyal Medya Butonu */}
            <a 
              href="https://instagram.com/kesiolabs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-colors rounded-full pl-2 pr-5 py-2"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
                <span className="text-xs font-bold text-white">IG</span>
              </div>
              <span className="text-sm font-medium text-slate-300">BİZİ TAKİP EDİN</span>
            </a>
          </div>

        </div>

        {/* ALT BİLGİ ÇUBUĞU (Copyright & Yasal Info) */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © 2026 <strong className="text-slate-300 font-semibold">KesioLabs</strong> Bilişim ve Teknoloji. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Vergi No: <span className="text-slate-400">Gerekli İse Eklenebilir</span></span>
            <span className="w-px h-3 bg-white/10" /> {/* Ayırıcı çizgi */}
            <span>Mersis No: <span className="text-slate-400">Gerekli İse Eklenebilir</span></span>
          </div>
        </div>

      </div>
    </footer>
  );
}
