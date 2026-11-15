import { loader } from 'fumadocs-core/source';
import { blog, docs, guides } from 'fumadocs-mdx:collections/server';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';

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
  source: blog.toFumadocsSource(),
  baseUrl: '/blog',
});

// Newest first.
export function blogPosts() {
  return blogSource
    .getPages()
    .sort((a, b) => b.data.published.localeCompare(a.data.published));
}
