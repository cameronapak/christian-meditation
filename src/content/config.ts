// NOTE: Any time this config changes, make sure to turn off the server
// and run `npx astro sync`.
import { z, defineCollection } from "astro:content";

// Define a `type` and `schema` for each collection.
const postsCollection = defineCollection({
  type: 'content',
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
  })
});

// Export a single `collections` object to register your collection(s).
export const collections = {
  posts: postsCollection,
};
