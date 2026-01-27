import Link from "next/link";
import { Clock, Instagram, Info, Mail, Phone } from "lucide-react";

const ADDRESS_LINE_1 = "İstanbul Maltepe, Fındıklı Mahallesi";
const ADDRESS_LINE_2 = "Ermiş Sokak No: 17";
const FULL_ADDRESS = `${ADDRESS_LINE_1} ${ADDRESS_LINE_2}`;

const MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent(FULL_ADDRESS);

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#0b1324] text-white border-t border-white/10">
      {/* Blur / Glass background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-white/5" />
        <div className="absolute inset-0 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Col 1 */}
          <div>
            <h3 className="text-lg font-semibold">
              KesioLabs Endüstriyel Tasarım &amp; 3D Printing
            </h3>

            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block text-white/80 hover:text-white transition-colors"
              title="Google Haritalar'da yol tarifi al"
            >
              <p>{ADDRESS_LINE_1}</p>
              <p className="mt-1">{ADDRESS_LINE_2}</p>
            </a>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-base font-semibold">İletişim</h4>

            <a
              href="tel:+905333839438"
              className="mt-5 flex items-center gap-3 text-white/80 hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+(90) 533 383 94 38</span>
            </a>

            <a
              href="tel:+905537538182"
              className="mt-3 flex items-center gap-3 text-white/80 hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+(90) 553 753 81 82</span>
            </a>

            <a
              href="mailto:kesiolabs.contact@gmail.com"
              className="mt-3 flex items-center gap-3 text-white/80 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>kesiolabs.contact@gmail.com</span>
            </a>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-base font-semibold">Çalışma Saatleri</h4>

            <div className="mt-5 flex items-center gap-3 text-white/80">
              <Clock className="h-4 w-4" />
              <span>Hafta içi: 08:00 - 20:00</span>
            </div>

            <div className="mt-3 flex items-center gap-3 text-white/80">
              <Clock className="h-4 w-4" />
              <span>Cumartesi: 08:00 - 16:00</span>
            </div>

            <div className="mt-3 flex items-center gap-3 text-white/80">
              <Clock className="h-4 w-4" />
              <span>Pazar: Kapalı</span>
            </div>

            <small className="mt-4 block text-white/70">
              Acil durumlarda WhatsApp üzerinden bizimle iletişime
              geçebilirsiniz.
            </small>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-base font-semibold">Sosyal Medya</h4>

            <a
              href="https://instagram.com/kesiolabs"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors"
            >
              <Instagram className="h-4 w-4" />
              <span>Instagram</span>
            </a>

            <h4 className="mt-8 text-base font-semibold">Hakkımızda</h4>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/corporate"
                  className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                >
                  <Info className="h-4 w-4" />
                  Kurumsal
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                >
                  <Info className="h-4 w-4" />
                  Gizlilik Politikası
                </Link>
              </li>

              <li>
                <Link
                  href="/delivery-returns"
                  className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                >
                  <Info className="h-4 w-4" />
                  Teslimat &amp; İade
                </Link>
              </li>

              <li>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                >
                  <Info className="h-4 w-4" />
                  Sık Sorulan Sorular
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/60">
          © 2025 KesioLabs. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
