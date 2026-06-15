import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export const metadata = {
  title: "İletişim | KesioLabs",
  description: "KesioLabs ile iletişime geçin. 3D baskı ve endüstriyel tasarım projeleriniz için buradayız.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0b1120] text-slate-300 pt-24 pb-16 font-sans relative overflow-hidden">
      {/* Arka Plan Efektleri */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Sayfa Başlığı */}
        <div className="mb-16 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Bize Ulaşın
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Projeniz mi var? 3D baskı, endüstriyel tasarım veya toptan üretim ihtiyaçlarınız için formu doldurun veya doğrudan bizimle iletişime geçin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* SOL BÖLÜM: İletişim Formu */}
          <div className="lg:col-span-3 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-10 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-white mb-8">Mesaj Gönderin</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Ad Soyad */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-400">Adınız Soyadınız</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="Ahmet Yılmaz"
                    required
                  />
                </div>
                {/* E-posta */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-400">E-posta Adresiniz</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="ornek@sirket.com"
                    required
                  />
                </div>
              </div>

              {/* Konu */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-slate-400">Konu</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="3D Baskı Fiyat Teklifi Hakkında"
                  required
                />
              </div>

              {/* Mesaj */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-400">Mesajınız</label>
                <textarea 
                  id="message" 
                  rows={5}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  placeholder="Projenizden kısaca bahsedin..."
                  required
                />
              </div>

              {/* Gönder Butonu */}
              <button 
                type="button" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-medium transition-colors"
              >
                <span>Mesajı Gönder</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* SAĞ BÖLÜM: Bilgiler ve Harita */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* İletişim Bilgileri Kartları */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-sm space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Adres</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Acıbadem Mahallesi, Akçaağaç Sokak No: 8 <br /> Üsküdar / İSTANBUL
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Telefon</h3>
                  <a href="tel:+905465868005" className="text-slate-400 text-sm hover:text-white transition-colors">
                    +(90) 546 586 80 05
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">E-Posta</h3>
                  <a href="mailto:info@kesiolabs.com" className="text-slate-400 text-sm hover:text-white transition-colors">
                    info@kesiolabs.com
                  </a>
                </div>
              </div>
            </div>

            {/* Google Haritalar Embed */}
            <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.0854497911667!2d29.0371661!3d40.9926839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab87265814bfb%3A0x86bd61c828da035a!2sAc%C4%B1badem%2C%20Ak%C3%A7aa%C4%9Fa%C3%A7%20Sk.%20No%3A8%2C%2034660%20%C3%9Csk%C3%BCdar%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(100%)" }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="KesioLabs Konum"
              />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}