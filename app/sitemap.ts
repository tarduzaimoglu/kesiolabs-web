import type { MetadataRoute } from "next";
import { getCatalogProducts, getPosts } from "@/lib/strapi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.kesiolabs.com";
  const [products, posts] = await Promise.all([getCatalogProducts().catch(() => []), getPosts().catch(() => [])]);
  const staticRoutes = ["", "/about", "/products", "/temsilcilikler", "/makaleler", "/makaleler/haberler", "/makaleler/uygulama-notlari", "/contact", "/quote", "/custom-products"];
  return [
    ...staticRoutes.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...products.map((product) => ({ url: `${base}/products/${product.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...posts.map((post) => ({ url: `${base}/makaleler/${post.slug}`, lastModified: post.date ? new Date(post.date) : undefined, changeFrequency: "monthly" as const, priority: 0.65 })),
  ];
}
