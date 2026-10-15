"""Render the static blog at representative widths and check visitor-visible invariants."""

from __future__ import annotations

import argparse
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import Page, sync_playwright


VIEWPORTS = {
    "desktop": (1440, 900),
    "tablet": (900, 1000),
    "mobile": (390, 844),
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
            check_page(page, f"{args.base_url}/", args.screenshots / f"home-{name}.png")
            page.close()
        browser.close()


if __name__ == "__main__":
    main()
