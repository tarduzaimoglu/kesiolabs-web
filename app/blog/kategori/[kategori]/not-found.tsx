import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Kategori bulunamadı</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Aradığın kategori kaldırılmış olabilir veya bağlantı hatalı.
      </p>

      <Link
        href="/blog"
        className="mt-6 inline-block rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50"
      >
        Blog’a dön
      </Link>
    </main>
  );
}
