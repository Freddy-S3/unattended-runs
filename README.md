# A Lazy Engineer

Repo name (`unattended-runs`) is internal/technical and does not need to match the public site name - the published brand is "A Lazy Engineer", set via `SITE_NAME` in `src/config/site.ts`.

## Structure

The site has two top-level sections, plus the waitlist that feeds the second one:

- **`/blog/`** - the writing. The pillars, tag pages, and every post live under here (`/blog/<slug>/`, `/blog/tags/<tag>/`).
- **`/services/`** - the work, offered as engagements. Two branches, generated from `src/config/services.ts`: `/services/training/` and `/services/automation/`.
- **`/waitlist/`** - where client enquiries arrive. See "The waitlist" below; it does not accept enquiries until a destination is configured.

`/` is the fork between the two sections rather than the blog itself.

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

For the Amplify deployment this is set in `amplify.yml` rather than only in the console. The console
field was never set, and the result was invisible in a diff: builds succeeded, fell back to the
placeholder, and published the live site with off-site canonicals, `noindex` on every page, and
`Disallow: /` in robots.txt. Keeping the value in the build spec makes the deployed configuration
reviewable. A console environment variable of the same name still overrides it, so a preview branch
can point elsewhere.

Every other free-tier host has a field for this too (Netlify, Vercel, and Cloudflare Pages all
expose build-time environment variables).

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

Every tag automatically gets a page at `/blog/tags/<tag>/` (`src/pages/blog/tags/[tag].astro`) listing every published post carrying it — nothing to register manually, it's generated from whatever tags actually appear in `src/content/posts/`.

The two pillar tags — `harness-engineering` and `self-taught` — are special only in that they're listed in `src/config/pillars.ts` with a label and description, which makes them show up in the "Two threads" section on the homepage and gives their tag page a title/description instead of just the raw tag string. Every post should carry the pillar tag for whichever thread it belongs to (`harness-engineering` or `self-taught`), plus whatever specific tags describe it (e.g. `harness-design`, `language-learning`, `ai-engineering`). A post can carry both pillar tags if it genuinely bridges both — for example a post about applying self-teaching method to harness design.

To add a third pillar later: add an entry to the `PILLARS` array in `src/config/pillars.ts` and start tagging posts with its tag. No routing or homepage code needs to change.

### Adding a post by hand

1. Create `src/content/posts/<slug>.md`, where `<slug>` becomes the URL path under `/blog/`.
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

## Services

The two service branches, their offerings, and their deliverables are data in `src/config/services.ts`, in the same spirit as `pillars.ts`. The services index, both branch pages, the homepage cards, and the sitemap all read from that one list - adding or renaming an offering is a change to that file and nothing else.

An offering is a section on its branch page, not a route of its own. The two automation offerings (a team's workflow, a single engineer's) are variants of one engagement rather than independently sellable things, and giving each a thin page would spread one argument over four URLs.

## The waitlist

`/waitlist/` has three states, decided by two values in `src/config/site.ts`:

| Config | State | What renders |
|---|---|---|
| `WAITLIST_FORM_ACTION_URL` set | `form` | A real form posting to that endpoint |
| `WAITLIST_CONTACT_EMAIL` set | `email` | A mailto link with the destination shown in the copy |
| neither set (current) | `closed` | An explanation, and no input controls at all |

**It currently ships closed.** That is deliberate rather than unfinished: an enquiry form with nothing behind it silently discards whatever a prospective client writes, which is the failure this repo already avoids for the newsletter. The closed state renders no inputs and no button, so there is no control that looks live.

Opening it is one decision and one line. The decision is which address receives enquiries, and it is a real one because this blog is published anonymously - a role address on this domain keeps that separation, a personal address does not. `tools/test_site.py` enforces the invariant: any form it finds must have an action, and no control outside the newsletter may render disabled.

### The availability claim

The waitlist copy claims exactly three things, all of which are policy rather than history, and all of which should stay true before it goes live:

1. This work runs alongside a full-time job.
2. A maximum of two concurrent engagements.
3. Enquiries are reviewed in batches rather than on arrival.

It deliberately makes no claim about current or past clients, capacity being full, or anyone already being served.

## AdSense configuration

The AdSense publisher ID lives in one place: `src/config/ads.ts`, exported as `ADSENSE_PUBLISHER_ID`.
`BaseLayout.astro` and the `AdSlot` component both import it from there rather than hardcoding it inline.

Right now it's set to an obviously fake placeholder (`ca-pub-XXXXXXXXXXXXXXXX`).
Replacing it with a real publisher ID from an actual Google AdSense account is a manual step for whoever owns this repo — it isn't something to fabricate or guess at.
