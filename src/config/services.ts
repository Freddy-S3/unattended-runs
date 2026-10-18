// The services offered alongside the blog, and the structure of the Services
// section. Every services page and the nav are generated from this list, the
// same way tag pages and the homepage pillar section are generated from
// `pillars.ts` - adding or renaming an offering is a change here only.
//
// Each branch gets a page at `/services/<slug>/`. The `offerings` inside a
// branch are sections on that page, not separate routes: they are variants of
// one engagement rather than independently sellable things, and giving each a
// thin page of its own would spread the same argument over four URLs.

export interface ServiceOffering {
  /** Heading for this variant within its branch page. */
  title: string;
  /** One-line framing of who it is for. */
  audience: string;
  /** What the engagement actually produces. */
  summary: string;
  /** Concrete deliverables. Kept factual - these describe work already built. */
  deliverables: string[];
}

export interface ServiceBranch {
  slug: string;
  /** Nav and card label. */
  label: string;
  /** Short line used on cards and the services index. */
  tagline: string;
  /** Longer framing used at the top of the branch page. */
  description: string;
  /** The pillar tag whose posts back this branch, if any. */
  relatedTag?: string;
  offerings: ServiceOffering[];
}

export const SERVICE_BRANCHES: ServiceBranch[] = [
  {
    slug: "training",
    label: "Training",
    tagline: "Teaching people how to teach themselves.",
    description:
      "Most training hands you a curriculum for a tool that will be replaced within the year. This is the other thing: the method for picking up a language or a skill on your own, and for staying current in a field that reinvents its tooling every few months. The subject matter is the worked example; the method is the deliverable.",
    relatedTag: "self-taught",
    offerings: [
      {
        title: "Learning a skill solo",
        audience: "For an engineer picking up a language, stack, or discipline without a course or a mentor.",
        summary:
          "A working method for self-directed learning: how to choose what to learn next, how to build the feedback loop that tells you whether it is working, and how to get to real output instead of finished tutorials.",
        deliverables: [
          "A sequenced plan for the specific skill you are picking up, built around producing something rather than completing material",
          "The feedback loops to put in place so progress is measurable without an instructor grading it",
          "Working sessions on the actual material, where the method gets applied rather than described",
        ],
      },
      {
        title: "Staying current in a field that keeps moving",
        audience: "For engineers and teams who keep finding their tooling knowledge a release or two out of date.",
        summary:
          "Treating staying current as a practice with a cadence, rather than an occasional catch-up effort. This is the same self-teaching method applied continuously instead of once.",
        deliverables: [
          "A review cadence that fits the hours you actually have, not an aspirational one",
          "A filter for deciding what is worth learning now, what is worth tracking, and what to ignore",
          "A way to evaluate a new tool against your own work quickly, instead of on its own marketing",
        ],
      },
    ],
  },
  {
    slug: "automation",
    label: "Automation",
    tagline: "Agentic harnesses for a team, or for one engineer.",
    description:
      "Coding agents are capable and badly behaved by default. What makes them useful is the harness around them: the instructions they load, the skills they compose, the modes that decide how much autonomy they get, and the checks that stop a confident wrong answer reaching a branch. This is that harness work, applied to your workflow.",
    relatedTag: "harness-engineering",
    offerings: [
      {
        title: "Automating a team's workflow",
        audience: "For a team that has agents in the editor but no shared way of running them.",
        summary:
          "A harness the whole team shares: one set of instructions and skills, consistent operating modes, and the path from a ticket to a reviewable pull request wired up so it runs the same way for everyone.",
        deliverables: [
          "An agent-agnostic instruction layer, so the same rules apply across Claude Code, Codex, and whatever replaces them",
          "A composable skill library for your recurring work, instead of one prompt everybody edits separately",
          "Ticket-to-PR automation: an agent that picks up an issue, does the work on a branch, and opens a pull request for human review",
          "Supervised and unattended modes with explicit gates, so autonomy is a deliberate setting rather than an accident",
          "Concurrency safety for several agents in one repository - worktree claims, write-ahead state, and the checks that keep two agents off one tree",
        ],
      },
      {
        title: "Automating a single engineer's workflow",
        audience: "For one engineer who wants their own leverage without waiting for the team to adopt anything.",
        summary:
          "The same harness, scoped to how you personally work. Narrower to fit, and faster to stand up, because it only has to satisfy one person's conventions.",
        deliverables: [
          "A personal instruction layer and skill set built around the work you actually repeat",
          "An MCP server setup connecting the agent to the tools and data you already use",
          "Unattended runs for the overnight and background work, with the recoverability to let them fail safely",
          "A review habit that catches the failure modes agents actually have, rather than the ones they are assumed to have",
        ],
      },
    ],
  },
];

export function findBranch(slug: string): ServiceBranch | undefined {
  return SERVICE_BRANCHES.find((branch) => branch.slug === slug);
}
