import { defineCollections, defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const docs = defineDocs({
  dir: 'content/docs',
});

// Guides and posts carry hand-written dates for structured data, the sitemap, and RSS.
// YAML reads `2026-11-15` as a Date; keep it as the YYYY-MM-DD string it was written as.
const day = z.coerce.date().transform((date) => date.toISOString().slice(0, 10));

export const guides = defineDocs({
  dir: 'content/guides',
  docs: {
    schema: frontmatterSchema.extend({
      published: day.optional(),
      updated: day.optional(),
    }),
  },
});

// Posts have no sidebar, so the blog is a plain doc collection without meta files,
// as in Fumadocs' collection docs.
export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: frontmatterSchema.extend({
    published: day,
    updated: day.optional(),
    author: z.string(),
  }),
});

export default defineConfig();
