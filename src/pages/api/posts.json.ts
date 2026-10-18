import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const allPosts = await getCollection("posts", ({ data }) => !data.draft);
  const posts = allPosts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => ({
      slug: post.slug,
      url: `/blog/${post.slug}/`,
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate.toISOString(),
      tags: post.data.tags,
    }));

  return new Response(JSON.stringify(posts, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
