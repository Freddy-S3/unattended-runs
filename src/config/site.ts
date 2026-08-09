// Site-wide configuration.
//
// TODO: replace with the real production domain once this is deployed, and
// update astro.config.mjs `site` to match (Astro uses that value to resolve
// canonical/OG URLs and the sitemap during the build).
export const SITE_URL = "https://example.com";
export const SITE_NAME = "Unattended Runs";
export const SITE_DESCRIPTION =
  "Notes on harness engineering: agentic dev harnesses, skills, and unattended coding workflows.";

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
