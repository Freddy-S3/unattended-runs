import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE_URL } from "../config/site";

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(SITE_URL);
  const posts = await getCollection("posts", ({ data }) => !data.draft);

  const urls = [
    { loc: new URL("/", base).toString(), lastmod: new Date().toISOString() },
    ...posts.map((post) => ({
      loc: new URL(`/${post.slug}/`, base).toString(),
      lastmod: post.data.pubDate.toISOString(),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join("\n")}
</urlset>
`;

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
};
