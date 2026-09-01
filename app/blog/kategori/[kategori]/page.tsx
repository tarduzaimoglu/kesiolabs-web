import { permanentRedirect } from "next/navigation";
export default async function BlogCategoryRedirect({ params }: { params: Promise<{ kategori: string }> }) { const { kategori } = await params; permanentRedirect(`/makaleler?kategori=${encodeURIComponent(kategori)}`); }
