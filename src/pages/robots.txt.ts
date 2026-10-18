import type { APIRoute } from "astro";
import { SITE_URL } from "../config/site";

/**
 * robots.txt, generated rather than kept in public/.
 *
 * The static version carried its own copy of the domain in the Sitemap line,
 * which is a second place for it to go stale. Generating it from SITE_URL
 * keeps the domain in one file, the same way sitemap.xml and rss.xml already
 * do.
 *
 * This used to emit `Disallow: /` whenever SITE_URL was unset, which is the
 * state the live site was actually served in for months - the host variable was
 * never set, so the guard meant for preview builds de-indexed production
 * instead. SITE_URL now defaults to the real domain, so there is no unset case
 * left to guard and this always emits a crawlable robots.txt.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL(SITE_URL);

  const body = `User-agent: *
Allow: /

Sitemap: ${new URL("/sitemap.xml", base).toString()}
`;

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
};
