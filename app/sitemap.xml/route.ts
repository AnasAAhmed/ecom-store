// app/sitemap.xml/route.ts
import { getAllCollections, getAllProducts } from "@/lib/actions/actions";
import { NextResponse } from "next/server";

//custom sitmap for images nextjs  MetadataRoute.Sitemap is not supporting images in nextjs 14

export const dynamic='force-static';

export async function GET() {
  const baseUrl = process.env.ECOM_STORE_URL!;
  const now = new Date().toISOString();

  const products : { slug: string, media: string[], category: string, tags: string[] }[] = await getAllProducts(); // [{ slug, media: [], category, tags: [] }]
  const collections: { title: string, image: string }[] = await getAllCollections(); // [{ title, image }]
  const searchQueries = new Set<string>();

  products.forEach((p) => {
    if (p.category) searchQueries.add(p.category);
    p.tags.forEach((tag) => searchQueries.add(tag));
  });

  const urls = [
    {
      loc: baseUrl,
      lastmod: now,
      changefreq: "daily",
      images:[],
      priority: "1.0",
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: now,
      changefreq: "daily",
      images:[],
      priority: "0.6",
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: now,
      changefreq: "daily",
      images:[],
      priority: "0.7",
    },
    ...collections.map((c) => ({
      loc: `${baseUrl}/collections/${c.title}`,
      lastmod: now,
      priority: "0.8",
      changefreq: "daily",
      images: [c.image],
    })),
    ...products.map((p) => ({
      loc: `${baseUrl}/products/${p.slug}`,
      lastmod: now,
      changefreq: "weekly",
      priority: "0.9",
      images: p.media,
    })),
    ...Array.from(searchQueries).map((query) => ({
      loc: `${baseUrl}/search?query=${encodeURIComponent(query)}`,
      lastmod: now,
      changefreq: "daily",
      images:[],
      priority: "0.6",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
  ${urls
    .map((url) => {
      const imagesXml = url.images
        ? url.images
            .map(
              (img:string) => `
        <image:image>
          <image:loc>${img}</image:loc>
        </image:image>`
            )
            .join("")
        : "";

      return `
    <url>
      <loc>${url.loc}</loc>
      <lastmod>${url.lastmod}</lastmod>
      ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
      ${url.priority ? `<priority>${url.priority}</priority>` : ""}
      ${imagesXml}
    </url>`;
    })
    .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
