// NOTE: Any time this config changes, make sure to turn off the server
// and run `npx astro sync`.
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// Define a `type` and `schema` for each collection.
const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    author: z.string(),
    description: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string().optional()
    }).optional(),
    pubDate: z.date(),
    tags: z.array(z.string()).optional(),
    title: z.string(),
    slug: z.string(),
  })
});

// Export a single `collections` object to register your collection(s).
export const collections = {
  posts: postsCollection,
};
