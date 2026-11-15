import { loader } from 'fumadocs-core/source';
import { blog, docs, guides } from 'fumadocs-mdx:collections/server';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: '/docs',
  plugins: [lucideIconsPlugin()],
});

export const guidesSource = loader({
  source: guides.toFumadocsSource(),
  baseUrl: '/guides',
});

export const blogSource = loader({
  source: toFumadocsSource(blog, []),
  baseUrl: '/blog',
});

// Newest first.
export function blogPosts() {
  return blogSource
    .getPages()
    .sort((a, b) => b.data.published.localeCompare(a.data.published));
}
