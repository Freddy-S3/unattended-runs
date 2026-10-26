// Site-wide configuration.

// The production domain. `astro.config.mjs` imports this as Astro's `site`, so
// this one value resolves every canonical link, OG url, sitemap entry, and RSS
// link in the build - there is no second place to update.
//
// This was previously env-only, falling back to `https://example.com` with a
// build warning. The warning did not work: the live site shipped that
// placeholder into every canonical tag, every sitemap entry and every RSS
// link, with `noindex` on each page and `Disallow: /` in robots.txt, because
// the host's environment variable was never set and the build succeeded
// anyway. A default that makes an unset variable catastrophic is the wrong
// default for a domain that is already registered and serving.
//
// So the real domain is committed, and SITE_URL still overrides it - that is
// what a preview or staging build sets. Being wrong now means pointing at the
// wrong real site, which is visible, rather than silently de-indexing this one.
//
// www, not the bare apex, because that is the direction the Amplify domain
// settings redirect: "Setup redirect from https://alazyengineer.com to
// https://www.alazyengineer.com" is enabled on this app. The canonical has to
// name the destination of that redirect, not its source. Storing the apex
// would put a redirect in front of every canonical link, OG url, sitemap entry
// and RSS link in the build - a hop on every crawl and every shared link.
//
// Requesting either hostname today still returns 200 with no redirect, so this
// does not match observed behaviour yet. That observation is not trustworthy
// here: both are served from CloudFront with `s-maxage=31536000`, a year, and
// the edge returns a cached hit even for a never-before-seen query string, so
// there is no way to see the origin's current behaviour from outside. The
// console setting is the configured intent and is what will hold once the
// cache turns over; matching it is the safe direction to be wrong in, because
// a canonical on the redirect's destination stays correct either way.
const PRODUCTION_SITE_URL = "https://www.alazyengineer.com";

function resolveSiteUrl(): string {
  const fromEnv = process.env.SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return PRODUCTION_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "A Lazy Engineer";
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
// Waitlist configuration.
//
// The waitlist is where client enquiries arrive, so it must not ship as a
// control that looks live and goes nowhere - the failure mode this repo
// already avoids for the newsletter. Exactly one of the two values below
// decides what the page renders, and when neither is set the page shows no
// form at all rather than a decorative one.
//
// Pick whichever is true when enquiries open:
//
//   WAITLIST_FORM_ACTION_URL - a real POST endpoint (Formspree, Basin, Tally,
//   or an API route you host). Submissions post to it and the visitor gets
//   that provider's confirmation. Preferred, because nothing depends on the
//   visitor having a mail client configured.
//
//   WAITLIST_CONTACT_EMAIL - an address to receive enquiries by mail. The page
//   renders a mailto link rather than a form, so the visitor can see exactly
//   where their message is going before they send it.
//
// Deliberately left empty: this blog is published anonymously, so the address
// that goes here is a decision about whether to connect it to a named
// identity, and that is not a default anything should pick. A role address on
// this domain keeps the separation; a personal address does not.
export const WAITLIST_FORM_ACTION_URL = "";
export const WAITLIST_CONTACT_EMAIL = "";

/** How enquiries can currently be received, if at all. */
export const WAITLIST_MODE: "form" | "email" | "closed" = WAITLIST_FORM_ACTION_URL
  ? "form"
  : WAITLIST_CONTACT_EMAIL
    ? "email"
    : "closed";
