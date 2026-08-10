// The two content pillars this blog covers. Every post should carry the tag
// of at least one pillar so it surfaces on that pillar's tag page and in the
// homepage pillar section below the hero.
//
// To add a new pillar: add an entry here, then tag posts with its `tag`.
// No other file needs to change — tag pages and the homepage section are
// generated from this list plus whatever's actually in src/content/posts/.
export interface Pillar {
  tag: string;
  label: string;
  description: string;
}

export const PILLARS: Pillar[] = [
  {
    tag: "harness-engineering",
    label: "Harness engineering",
    description:
      "Designing agentic coding harnesses, writing reusable skills instead of one giant prompt, and running coding agents unattended.",
  },
  {
    tag: "self-taught",
    label: "Self-directed learning",
    description:
      "How self-teaching actually works, from picking up a language solo to staying current in a field that reinvents its tooling every few months.",
  },
];
