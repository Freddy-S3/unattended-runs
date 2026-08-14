// Site-wide configuration.

// The production domain. `astro.config.mjs` imports this as Astro's `site`, so
// this one value resolves every canonical link, OG url, sitemap entry, and RSS
// link in the build - there is no second place to update.
//
// Set the SITE_URL environment variable at build time (every free-tier host
// exposes one: Netlify, Vercel, Cloudflare Pages) rather than committing the
// domain. The fallback below is a placeholder, not a real destination.
//
// This matters more than a normal placeholder: shipping a build with it means
// every page carries a canonical tag pointing at a domain that is not ours,
// which asks search engines not to index the site at all. The build warns
// loudly rather than failing, so a local `npm run build` still works.
const PLACEHOLDER_SITE_URL = "https://example.com";

function resolveSiteUrl(): string {
  const fromEnv = process.env.SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  console.warn(
    [
      "",
      "  SITE_URL is not set, falling back to " + PLACEHOLDER_SITE_URL + ".",
      "  Canonical links, OG urls, rss.xml, and sitemap.xml in this build all",
      "  point at that placeholder domain. Fine locally; do not deploy it.",
      "",
    ].join("\n"),
  );
  return PLACEHOLDER_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();

/** True when the build is using the placeholder domain rather than a real one. */
export const SITE_URL_IS_PLACEHOLDER = SITE_URL === PLACEHOLDER_SITE_URL;
export const SITE_NAME = "The Compounding Engineer";
export const SITE_DESCRIPTION =
  "Notes on compounding leverage: agentic dev harnesses, unattended coding workflows, and the self-teaching that keeps up with them.";

// Analytics configuration.
//
// This project ships a placeholder slot for privacy-respecting, script-based
// analytics (Plausible by default — swap the script src in BaseLayout.astro
// for Umami or GA4 if preferred). Nothing is sent anywhere until a real site
// is configured here.
//
// TODO: replace with your real Plausible site domain (or swap providers)
// once you have an analytics account. Leave empty to disable the script.
export const ANALYTICS_SITE_ID = "";
// TODO: if self-hosting Plausible/Umami, point this at your instance.
export const ANALYTICS_SCRIPT_SRC = "https://plausible.io/js/script.js";

// Newsletter configuration.
//
// The signup form in NewsletterSignup.astro currently has no backend — it is
// wired to nothing. TODO: connect a real email provider (e.g. Buttondown,
// ConvertKit) by pointing FORM_ACTION_URL at that provider's form endpoint
// and adjusting the field names in NewsletterSignup.astro to match.
export const NEWSLETTER_FORM_ACTION_URL = "";
