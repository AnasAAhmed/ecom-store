// app/sitemap.ts
import { MetadataRoute } from "next";
import { getAllCollections, getAllProducts } from "@/lib/actions/actions";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.ECOM_STORE_URL!||'http://localhost:3000';
  const now = new Date().toISOString();

  const products :[{ slug:string, media: string[], category:string, tags: string[] }]= await getAllProducts(); // [{ slug, media: [], category, tags: [] }]
  const collections:[{ title:string, image:string }] = await getAllCollections(); 
  const searchQueries = new Set<string>();

  products.forEach((p) => {
    if (p.category) searchQueries.add(p.category);
    p.tags.forEach((tag) => searchQueries.add(tag));
  });

  const urls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
    },
    ...collections.map((c) => ({
      url: `${baseUrl}/collections/${c.title}`,
      lastModified: now,
    })),
    ...products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      changeFrequency:'daily',
      lastModified: now,
    })),
    ...Array.from(searchQueries).map((query) => ({
      url: `${baseUrl}/search?query=${encodeURIComponent(query)}`,
      lastModified: now,
    })),
  ];

  return urls;
}
