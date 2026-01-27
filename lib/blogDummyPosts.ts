export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "uretim" | "tasarim" | "malzeme" | "ipuclari";
  date: string;
  image: string; // kapak görseli
  content: string; // blog detay içeriği
};

export const blogDummyPosts: BlogPost[] = [
  {
    slug: "bambu-p1s-uretim-performansi",
    title: "Bambu P1S ile Seri Üretim Performansı",
    excerpt:
      "Kısa süreli üretimlerde Bambu P1S’in hız ve kalite avantajlarını inceledik.",
    category: "uretim",
    date: "2026-01-10",
    image: "/blog/covers/uretim-1.jpg",
    content: `KesioLabs’te üretim altyapımızı oluştururken hız, kalite ve süreklilik en önemli kriterlerimizden biri oldu.

Bambu Lab P1S, kısa süreli ve tekrarlı üretim senaryolarında sunduğu kararlılık sayesinde üretim süreçlerimizin merkezinde yer alıyor.

Bu yazıda, gerçek üretim deneyimlerimiz üzerinden P1S’in sağladığı avantajları ve hangi durumlarda tercih edilmesi gerektiğini paylaşıyoruz.`,
  },

  {
    slug: "prototiplemede-dogru-yontem",
    title: "Prototiplemede Doğru Yöntemi Seçmek",
    excerpt:
      "Hız, maliyet ve dayanım dengesini kurarken nelere dikkat edilmeli?",
    category: "uretim",
    date: "2026-01-08",
    image: "/blog/covers/uretim-2.jpg",
    content: `Prototipleme sürecinde doğru yöntemi seçmek, ürünün geleceğini doğrudan etkiler.

Bu yazıda, farklı üretim tekniklerinin avantajlarını ve hangi senaryolarda hangi yöntemin daha doğru olduğunu ele alıyoruz.

Hızlı prototiplemeden fonksiyonel testlere kadar kritik karar noktalarına değiniyoruz.`,
  },

  {
    slug: "endustriyel-tasarimda-karar-noktalari",
    title: "Endüstriyel Tasarımda Kritik Karar Noktaları",
    excerpt:
      "Bir ürünün tasarım sürecinde geri dönülmez kararlar nerede alınır?",
    category: "tasarim",
    date: "2026-01-07",
    image: "/blog/covers/tasarim-1.jpg",
    content: `Endüstriyel tasarım süreci yalnızca estetikten ibaret değildir.

Malzeme seçimi, üretim yöntemi ve tolerans kararları ürünün kaderini belirler.

Bu yazıda, tasarım sürecinde en kritik kararların hangi aşamalarda alındığını inceliyoruz.`,
  },

  {
    slug: "cad-modelleme-uretim-uyumu",
    title: "CAD Modelleme ve Üretim Uyumu",
    excerpt:
      "Modelleme aşamasında üretilebilirliği nasıl garanti altına alırız?",
    category: "tasarim",
    date: "2026-01-05",
    image: "/blog/covers/tasarim-2.jpg",
    content: `CAD ortamında yapılan küçük hatalar, üretim aşamasında büyük problemlere yol açabilir.

Bu yazıda, modelleme sırasında üretim uyumunu artırmak için dikkat edilmesi gereken temel prensipleri ele alıyoruz.

Doğru modelleme, hızlı ve sorunsuz üretimin anahtarıdır.`,
  },

  {
    slug: "pla-vs-abs-secim-rehberi",
    title: "PLA vs ABS: Doğru Malzeme Seçimi",
    excerpt:
      "Kullanım senaryosuna göre PLA mı ABS mi tercih edilmeli?",
    category: "malzeme",
    date: "2026-01-04",
    image: "/blog/covers/malzeme-1.jpg",
    content: `PLA ve ABS, 3D baskıda en sık kullanılan iki malzemedir ancak kullanım alanları oldukça farklıdır.

Bu yazıda, her iki malzemenin avantajlarını ve sınırlamalarını karşılaştırıyoruz.

Doğru malzeme seçimi ile hem dayanım hem de yüzey kalitesini optimize edebilirsiniz.`,
  },

  {
    slug: "abs-isi-dayanimi",
    title: "ABS’in Isı Dayanımı ve Kullanım Alanları",
    excerpt:
      "Yüksek sıcaklık gerektiren parçalarda ABS neden öne çıkar?",
    category: "malzeme",
    date: "2026-01-03",
    image: "/blog/covers/malzeme-2.jpg",
    content: `ABS, yüksek sıcaklık dayanımı gerektiren uygulamalarda sıkça tercih edilir.

Bu yazıda ABS’in mekanik ve termal özelliklerini, hangi sektörlerde öne çıktığını inceliyoruz.

Uzun ömürlü ve dayanıklı parçalar için ABS’in rolünü ele alıyoruz.`,
  },

  {
    slug: "baski-kalitesini-artirmanin-5-yolu",
    title: "Baskı Kalitesini Artırmanın 5 Yolu",
    excerpt:
      "Yüzey kalitesi ve toleransları iyileştirmek için pratik ipuçları.",
    category: "ipuclari",
    date: "2026-01-02",
    image: "/blog/covers/ipuclari-1.jpg",
    content: `Baskı kalitesi, yalnızca yazıcıya değil ayarlara da bağlıdır.

Bu yazıda, yüzey kalitesini artırmak için uygulanabilir 5 temel yöntemi paylaşıyoruz.

Küçük ayar değişiklikleriyle büyük farklar yaratmak mümkün.`,
  },

  {
    slug: "model-hazirliginda-yapilan-hatalar",
    title: "Model Hazırlığında En Sık Yapılan Hatalar",
    excerpt:
      "Baskı öncesi yapılan küçük hatalar büyük sorunlara yol açabilir.",
    category: "ipuclari",
    date: "2026-01-01",
    image: "/blog/covers/ipuclari-2.jpg",
    content: `Baskıdan önce yapılan hatalar, zaman ve malzeme kaybına neden olabilir.

Bu yazıda, model hazırlığında en sık yapılan hataları ve nasıl önlenebileceğini ele alıyoruz.

Doğru hazırlık, sorunsuz baskının temelidir.`,
  },
];
