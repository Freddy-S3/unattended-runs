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
 *
 * This is half of that guard. Disallow stops a crawler fetching the page, but a
 * url linked from somewhere else can still be listed without ever being
 * fetched, so BaseLayout also emits `noindex` on a placeholder build.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL(SITE_URL);

  const body = SITE_URL_IS_PLACEHOLDER
    ? `# SITE_URL was not set for this build, so every canonical link in it points
# at a placeholder domain. Crawling is disallowed, and the pages themselves
# carry noindex, until a real domain is configured.
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
