export default function BlogPage() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image Slot */}
      <div
        className="
          relative
          h-[1100px]
          w-full
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: "url(/blog-bg.png)",
        }}
      >
        {/* Dark overlay (kart okunurluğu için) */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-6 pt-24">
          {/* Header */}
          <div className="mb-12 flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-white">
              BlogLabs
            </h1>

            <button className="text-sm text-white/80 hover:text-white transition">
              Daha fazla →
            </button>
          </div>

          {/* Featured Posts */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Card 1 */}
            <article className="overflow-hidden rounded-2xl bg-white/95 shadow-xl">
              <div className="h-64 bg-slate-200" />
              <div className="p-6">
                <h3 className="text-lg font-semibold">
                  KesioLabs’te Üretimin Kalbi: Bambu Lab P1S
                </h3>
                <p className="mt-3 text-sm text-slate-600">
                  Üretim sürecimizde hız, kalite ve tekrar edilebilirlik için
                  kurduğumuz akışın kısa özeti.
                </p>
              </div>
            </article>

            {/* Card 2 */}
            <article className="overflow-hidden rounded-2xl bg-white/95 shadow-xl">
              <div className="h-64 bg-slate-200" />
              <div className="p-6">
                <h3 className="text-lg font-semibold">
                  3D Baskı ve Üretim: Yeni Nesil Üretim Anlayışı
                </h3>
                <p className="mt-3 text-sm text-slate-600">
                  Prototipten seri üretime uzanan yolda 3D baskının sağladığı
                  avantajlar.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
