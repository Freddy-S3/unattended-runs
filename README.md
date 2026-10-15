# A Lazy Engineer

Repo name (`unattended-runs`) is internal/technical and does not need to match the public site name - the published brand is "A Lazy Engineer", set via `SITE_NAME` in `src/config/site.ts`.

## About

This blog has two pillars, defined in `src/config/pillars.ts`:

- **Harness engineering** (tag `harness-engineering`) — designing agentic coding harnesses, writing reusable skills instead of one giant prompt, and running coding agents unattended without losing sleep over it, literally and figuratively.
- **Self-directed learning** (tag `self-taught`) — how self-teaching actually works: picking up a language or a programming skill solo, and, as an ongoing application of the same method, staying current in a field (AI/agentic tooling) that reinvents itself every few months. Language learning and programming are the origin proof of the method; AI/harness engineering is where it gets used continuously, today.

I write it anonymously.
No name, no employer, just notes from actually building, learning, and running these things.
If you spend your days deciding how much autonomy to give a coding agent, teaching yourself something with no one grading you, or both, this is written for you.

## Running locally

```
npm install
npm run dev
```

This starts a local dev server, by default at `http://localhost:4321`.

To produce a production build:

```
npm run build
```

The static output is written to `dist/`.
`npm run preview` serves that build locally if you want to check it before deploying.

### The site domain

Canonical links, OpenGraph urls, `sitemap.xml`, `rss.xml`, and `robots.txt` are all
resolved from a single value, `SITE_URL` in `src/config/site.ts`, which `astro.config.mjs`
imports as Astro's `site`. There is no second place to update.

Set it as an environment variable at build time rather than committing the domain:

```
SITE_URL=https://your-domain.example npm run build
```

Every free-tier host has a field for this (Amplify, Netlify, Vercel, and Cloudflare Pages all expose
build-time environment variables).

When `SITE_URL` is unset the build still succeeds, so local work is unaffected, but it
falls back to a placeholder domain and prints a warning. In that state `robots.txt` is
generated with `Disallow: /`, because a build whose canonical tags point at a domain that
is not ours asks search engines not to index the real site - better to not be crawled at
all than to be crawled with off-site canonicals.

Every page in that build also carries `<meta name="robots" content="noindex, nofollow">`.
Both are needed rather than either: `Disallow` asks a crawler not to fetch the page, but a
url that is linked from somewhere else can still be listed on the strength of that link
alone, and `noindex` is the part that keeps it out of an index. Neither appears once
`SITE_URL` is set to a real domain.

## Publishing a new post

Posts live as markdown files in `src/content/posts/`.
Each file needs frontmatter matching the schema in `src/content/config.ts`:

| Field | Type | Notes |
|---|---|---|
| `title` | string | required |
| `description` | string | required, used for the homepage excerpt and meta description |
| `pubDate` | date | required, e.g. `2026-08-09` |
| `tags` | string array | optional, defaults to `[]`; see "Tags and pillars" below |
| `draft` | boolean | optional, defaults to `false`; drafts are excluded from the homepage, the post pages, and `/api/posts.json` |

### Tags and pillars

Every tag automatically gets a page at `/tags/<tag>/` (`src/pages/tags/[tag].astro`) listing every published post carrying it — nothing to register manually, it's generated from whatever tags actually appear in `src/content/posts/`.

The two pillar tags — `harness-engineering` and `self-taught` — are special only in that they're listed in `src/config/pillars.ts` with a label and description, which makes them show up in the "Two threads" section on the homepage and gives their tag page a title/description instead of just the raw tag string. Every post should carry the pillar tag for whichever thread it belongs to (`harness-engineering` or `self-taught`), plus whatever specific tags describe it (e.g. `harness-design`, `language-learning`, `ai-engineering`). A post can carry both pillar tags if it genuinely bridges both — for example a post about applying self-teaching method to harness design.

To add a third pillar later: add an entry to the `PILLARS` array in `src/config/pillars.ts` and start tagging posts with its tag. No routing or homepage code needs to change.

### Adding a post by hand

1. Create `src/content/posts/<slug>.md`, where `<slug>` becomes the URL path.
2. Add the frontmatter block above, including the relevant pillar tag, then write the post body in markdown.
3. Run `npm run build` to confirm it compiles and the schema validates.
4. Commit on a branch and open a pull request.

### Adding a post with an agent (prompt-to-article workflow)

This is the intended way to grow either pillar — hand the harness a short prompt, get a properly tagged, publish-ready post back. It works the same way for a harness-engineering post and a self-taught post; only the pillar tag and the voice's subject matter change.

1. Give the harness a short prompt or story describing what the post should cover, and say which pillar it belongs to (`harness-engineering` or `self-taught`) — or let the harness infer it from the subject matter and confirm.
2. Have it draft the post in the established anonymous, first-person, technical voice — no names, no employer, no references to a specific company's internals, general practice only. For `self-taught` posts specifically: frame concrete personal experience (language learning, learning to code, keeping up with AI/agentic tooling) as evidence for a transferable method, not as a one-off "here's what I learned" story — the throughline across the pillar is that self-teaching is an ongoing practice, and language/programming are the origin proof of a method that's now applied continuously to a fast-moving field.
3. Have it fill in the frontmatter fields above — `title`, `description`, `pubDate`, `tags` (including the pillar tag), and `draft: false` once the post is ready to publish.
4. Run `npm run build` to verify the content collection schema passes, the new tag page generates, and the site still builds.
5. Commit the new file on a branch with a plain, descriptive commit message and open a pull request for review before merging.

## AdSense configuration

The AdSense publisher ID lives in one place: `src/config/ads.ts`, exported as `ADSENSE_PUBLISHER_ID`.
`BaseLayout.astro` and the `AdSlot` component both import it from there rather than hardcoding it inline.

Right now it's set to an obviously fake placeholder (`ca-pub-XXXXXXXXXXXXXXXX`).
Replacing it with a real publisher ID from an actual Google AdSense account is a manual step for whoever owns this repo — it isn't something to fabricate or guess at.
