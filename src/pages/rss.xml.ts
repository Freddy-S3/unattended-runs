import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "../config/site";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(SITE_URL);
  const posts = (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  const items = posts
    .map((post) => {
      const url = new URL(`/${post.slug}/`, base).toString();
      return `  <item>
    <title>${escapeXml(post.data.title)}</title>
    <link>${url}</link>
    <guid>${url}</guid>
    <description>${escapeXml(post.data.description)}</description>
    <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
  </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(SITE_NAME)}</title>
  <link>${base}</link>
  <description>${escapeXml(SITE_DESCRIPTION)}</description>
${items}
</channel>
</rss>
`;

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "application/xml" },
  });
};
