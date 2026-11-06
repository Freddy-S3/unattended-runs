# A Lazy Engineer site iteration research

Checked 2026-11-06 against first-party AI product pages.

## Summary

Current AI product sites tend to make the work visible through concrete examples, explicit states, and a clear first action.
That is a better fit for A Lazy Engineer than generic claims about transformation or autonomy.

The practical rules for this site are:

- Lead with the result a visitor can expect, then explain the method.
- Show the work in public through specific posts, examples, or artifacts.
- Name review points and boundaries so automation reads as controlled work rather than magic.
- Keep one primary action per page, with a lower-friction proof path for visitors who are not ready to enquire.

## Applied in the current iteration

- The homepage now names three concrete first results before the section cards.
- Service detail pages surface related blog notes as proof before the enquiry CTA.
- The services index states useful starting conditions and non-fits.
- The existing supervised workflow language remains explicit; no claim of fully autonomous delivery was added.

## Next candidates

- Add one verified, redacted example for each service branch when a real example exists.
- Add analytics only after an account, privacy language, and a measurement question are decided.
- Replace the mail client handoff with a real enquiry endpoint only when enquiry volume justifies it.

## Evidence ledger

| Finding | Primary source | Confidence |
| --- | --- | --- |
| AI product pages make the first action concrete and immediately understandable. | [OpenAI Help Center - The ChatGPT home page](https://help.openai.com/en/articles/9125172-the-chatgpt-home-page), which describes starting by entering a prompt. | Inferred |
| Showing runnable examples and templates helps visitors understand what an AI tool produces. | [Vercel AI SDK](https://vercel.com/ai-sdk), which presents code examples, feature capabilities, and starter templates. | Confirmed |
| Explicit work states and artifacts make agentic workflows legible. | [Cursor product page](https://cursor.com/en-US/product), which shows task states such as in progress and ready for review alongside generated files. | Confirmed |
| The site's services should explain supervision and review boundaries instead of promising magic. | Inference from the site's own existing service description in `src/config/services.ts`, combined with the workflow-state pattern above. | Inferred |

