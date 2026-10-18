import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE_URL } from "../config/site";
import { SERVICE_BRANCHES } from "../config/services";
import { PILLARS } from "../config/pillars";

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(SITE_URL);
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  const now = new Date().toISOString();

  // Static routes are listed from the same config the pages are generated
  // from, so adding a service branch or a pillar does not leave the sitemap
  // behind. Tag pages for non-pillar tags are intentionally omitted: they are
  // thin index pages and the posts they list are all here already.
  const urls = [
    { loc: new URL("/", base).toString(), lastmod: now },
    { loc: new URL("/blog/", base).toString(), lastmod: now },
    { loc: new URL("/services/", base).toString(), lastmod: now },
    { loc: new URL("/waitlist/", base).toString(), lastmod: now },
    ...SERVICE_BRANCHES.map((branch) => ({
      loc: new URL(`/services/${branch.slug}/`, base).toString(),
      lastmod: now,
    })),
    ...PILLARS.map((pillar) => ({
      loc: new URL(`/blog/tags/${pillar.tag}/`, base).toString(),
      lastmod: now,
    })),
    ...posts.map((post) => ({
      loc: new URL(`/blog/${post.slug}/`, base).toString(),
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
