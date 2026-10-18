"""Render the static blog at representative widths and check visitor-visible invariants."""

from __future__ import annotations

import argparse
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import Page, sync_playwright


VIEWPORTS = {
    "desktop": (1440, 900),
    "tablet": (900, 1000),
    "mobile": (375, 812),
}

# Every top-level route, plus one representative post and one pillar tag page.
# Keyed by the screenshot name so a failure says which page broke.
PAGES = {
    "home": "/",
    "blog": "/blog/",
    "services": "/services/",
    "services-training": "/services/training/",
    "services-automation": "/services/automation/",
    "waitlist": "/waitlist/",
    "post": "/blog/pick-your-posture-before-the-prompt/",
    "tag": "/blog/tags/self-taught/",
}


def check_page(page: Page, url: str, screenshot: Path) -> None:
    page_errors: list[str] = []
    request_failures: list[str] = []
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.on(
        "requestfailed",
        lambda request: request_failures.append(request.url),
    )

    page.goto(url, wait_until="networkidle")
    page.screenshot(path=str(screenshot), full_page=True)

    assert "A Lazy Engineer" in page.title(), f"brand missing from title: {url}"
    assert "The Compounding Engineer" not in page.content(), f"old brand remains: {url}"
    banner = page.locator(".header-banner")
    assert banner.count() == 1, f"header banner missing: {url}"
    assert banner.locator("img").get_attribute("src") == "/header-banner.svg", f"header banner asset missing: {url}"
    assert page.locator(".adsbygoogle").count() == 0, f"placeholder ad slot rendered: {url}"

    # Both top-level sections must be reachable from every page.
    nav = page.locator(".site-nav")
    assert nav.count() == 1, f"section nav missing: {url}"
    nav_targets = nav.locator("a").evaluate_all("els => els.map(a => a.getAttribute('href'))")
    for required in ("/blog/", "/services/", "/waitlist/"):
        assert required in nav_targets, f"nav missing {required}: {url}"

    # No control may look live and do nothing.
    #
    # The newsletter signup is excluded deliberately. It renders disabled
    # inputs alongside copy that says it is not connected to a provider, which
    # is a pre-existing and defensible choice: nothing about it reads as
    # submittable. The waitlist took the stricter route instead - no inputs at
    # all until a destination is configured - because an enquiry form that
    # looks usable to a prospective client is a worse failure than a visibly
    # inert newsletter box.
    live_controls = page.locator(
        "form:not(.newsletter-signup form), "
        ".waitlist-form button, .waitlist-form input, .waitlist-form select, .waitlist-form textarea"
    )
    for control in live_controls.element_handles():
        disabled = control.get_property("disabled").json_value()
        assert not disabled, f"disabled control outside the newsletter on {url}"
    for form in page.locator("form:not(.newsletter-signup form)").element_handles():
        assert form.get_attribute("action"), f"form with no action on {url}"
    assert page.locator('link[rel="canonical"]').get_attribute("href").startswith(
        "https://alazyengineer.com/"
    ), f"canonical does not use production domain: {url}"
    assert page.locator("img").evaluate_all(
        "els => els.every(img => img.complete && img.naturalWidth > 0)"
    ), f"an image did not decode: {url}"
    widths = page.evaluate(
        "({inner: window.innerWidth, client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, body: document.body.getBoundingClientRect().toJSON(), site: document.querySelector('.site').getBoundingClientRect().toJSON()})"
    )
    overflowing = page.evaluate(
        "Array.from(document.querySelectorAll('*')).map(el => ({tag: el.tagName, className: String(el.className), style: el.getAttribute('style'), right: Math.round(el.getBoundingClientRect().right), width: Math.round(el.getBoundingClientRect().width)})).filter(item => item.right > window.innerWidth + 1).slice(0, 15)"
    )
    assert widths["scroll"] - widths["client"] <= 1, f"horizontal overflow: {url} ({widths}; {overflowing})"

    for href in page.locator("a").evaluate_all("els => els.map(a => a.getAttribute('href'))"):
        assert href and href != "#", f"empty link on {url}"
        parsed = urlparse(href)
        assert parsed.scheme in ("", "https"), f"unexpected link scheme {href} on {url}"

    assert not page_errors, f"page errors on {url}: {page_errors}"
    assert not request_failures or all(
        "googlesyndication.com" in failed or "fonts.googleapis.com" in failed
        for failed in request_failures
    ), f"unexpected failed requests on {url}: {request_failures}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4321")
    parser.add_argument("--screenshots", type=Path, default=Path("test-artifacts"))
    args = parser.parse_args()
    args.screenshots.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        for name, (width, height) in VIEWPORTS.items():
            page = browser.new_page(viewport={"width": width, "height": height})
            for label, path in PAGES.items():
                check_page(
                    page,
                    f"{args.base_url}{path}",
                    args.screenshots / f"{label}-{name}.png",
                )
            page.close()
        browser.close()


if __name__ == "__main__":
    main()
