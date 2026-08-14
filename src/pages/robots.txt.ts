import type { APIRoute } from "astro";
import { SITE_URL, SITE_URL_IS_PLACEHOLDER } from "../config/site";

/**
 * robots.txt, generated rather than kept in public/.
 *
 * The static version carried its own copy of the domain in the Sitemap line,
 * which is a second place for it to go stale. Generating it from SITE_URL
 * keeps the domain in one file, the same way sitemap.xml and rss.xml already
 * do.
 *
 * When SITE_URL has not been set, the build is carrying a placeholder domain
 * and every canonical link points off-site. Disallowing crawlers in that case
 * is the safer default: a preview build that gets indexed is harder to undo
 * than one that was never crawled.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL(SITE_URL);

  const body = SITE_URL_IS_PLACEHOLDER
    ? `# SITE_URL was not set for this build, so the canonical urls below it are
# placeholders. Crawling is disallowed until a real domain is configured.
User-agent: *
Disallow: /
`
    : `User-agent: *
Allow: /

Sitemap: ${new URL("/sitemap.xml", base).toString()}
`;

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
};
