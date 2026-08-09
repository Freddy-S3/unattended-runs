# Unattended Runs

## About

This is a blog about harness engineering: designing agentic coding harnesses, writing reusable skills instead of one giant prompt, and running coding agents unattended without losing sleep over it, literally and figuratively.
I write it anonymously.
No name, no employer, just notes from actually building and running these systems.
If you spend your days deciding how much autonomy to give a coding agent and how to recover when it does something you didn't expect, this is written for you.

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

## Publishing a new post

Posts live as markdown files in `src/content/posts/`.
Each file needs frontmatter matching the schema in `src/content/config.ts`:

| Field | Type | Notes |
|---|---|---|
| `title` | string | required |
| `description` | string | required, used for the homepage excerpt and meta description |
| `pubDate` | date | required, e.g. `2026-08-09` |
| `tags` | string array | optional, defaults to `[]` |
| `draft` | boolean | optional, defaults to `false`; drafts are excluded from the homepage, the post pages, and `/api/posts.json` |

To add a post by hand:

1. Create `src/content/posts/<slug>.md`, where `<slug>` becomes the URL path.
2. Add the frontmatter block above, then write the post body in markdown.
3. Run `npm run build` to confirm it compiles and the schema validates.
4. Commit on a branch and open a pull request.

To add a post with an agent, a short recipe that works well:

1. Give the harness a short prompt or story describing what the post should cover.
2. Have it draft the post in the established anonymous, first-person, technical voice — no names, no employer, no references to a specific company's internals, general practice only.
3. Have it fill in the frontmatter fields above, with `draft: false` once the post is ready to publish.
4. Run `npm run build` to verify the content collection schema passes and the site still builds.
5. Commit the new file on a branch with a plain, descriptive commit message and open a pull request for review before merging.

## AdSense configuration

The AdSense publisher ID lives in one place: `src/config/ads.ts`, exported as `ADSENSE_PUBLISHER_ID`.
`BaseLayout.astro` and the `AdSlot` component both import it from there rather than hardcoding it inline.

Right now it's set to an obviously fake placeholder (`ca-pub-XXXXXXXXXXXXXXXX`).
Replacing it with a real publisher ID from an actual Google AdSense account is a manual step for whoever owns this repo — it isn't something to fabricate or guess at.
