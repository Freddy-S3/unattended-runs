// AdSense configuration.
//
// This is the single place the AdSense publisher ID is defined. BaseLayout.astro
// and any ad-slot components import ADSENSE_PUBLISHER_ID from here rather than
// hardcoding it, so there is exactly one place to update once the site has a
// real AdSense account.
//
// TODO: replace with your real AdSense publisher ID from https://www.google.com/adsense
export const ADSENSE_PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXX";
