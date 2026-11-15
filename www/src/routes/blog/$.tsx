import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { DocsBody } from 'fumadocs-ui/layouts/docs/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import browserCollections from 'fumadocs-mdx:collections/browser';
import { Suspense } from 'react';
import { baseOptions } from '@/lib/layout.shared';
import { blogSource } from '@/lib/source';
import {
  articleStructuredData,
  blogTitle,
  formatDay,
  pageMeta,
  readingMinutes,
  SITE_URL
} from '@/lib/seo';

export const Route = createFileRoute('/blog/$')({
  component: Post,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? [];
    const data = await serverLoader({ data: slugs });
    await clientLoader.preload(data.path);
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `${SITE_URL}${loaderData.url}`;
    return {
      meta: [
        ...pageMeta({ title: blogTitle(loaderData.title), description: loaderData.description, url }),
        { property: 'article:published_time', content: loaderData.published },
        ...(loaderData.updated
          ? [{ property: 'article:modified_time', content: loaderData.updated }]
          : [])
      ],
      links: [{ rel: 'canonical', href: url }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            articleStructuredData({
              type: 'BlogPosting',
              title: loaderData.title,
              description: loaderData.description,
              url,
              published: loaderData.published,
              updated: loaderData.updated,
              author: loaderData.author,
              section: { name: 'Blog', url: `${SITE_URL}/blog` }
            })
          )
        }
      ]
    };
  }
});

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = blogSource.getPage(slugs);
    if (!page) throw notFound();

    const text = page.data.structuredData.contents.map((block) => block.content).join(' ');
    return {
      path: page.path,
      url: page.url,
      title: page.data.title,
      description: page.data.description ?? '',
      published: page.data.published,
      updated: page.data.updated,
      author: page.data.author,
      minutes: readingMinutes(text)
    };
  });

const clientLoader = browserCollections.blog.createClientLoader({
  component({ default: MDX }) {
    return (
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    );
  }
});

function Post() {
  const post = Route.useLoaderData();

  return (
    <HomeLayout {...baseOptions()}>
      <main className="px-4 pb-24 pt-16 md:pt-24">
        <article className="mx-auto max-w-3xl">
          <Link to="/blog" className="text-sm text-amber-400 hover:text-amber-300">
            ← Blog
          </Link>
          <h1 className="mb-4 mt-6 text-4xl font-bold leading-tight tracking-tight text-neutral-100">
            {post.title}
          </h1>
          <p className="mb-4 text-lg text-neutral-400">{post.description}</p>
          <p className="mb-10 text-sm text-neutral-500">
            <time dateTime={post.published}>{formatDay(post.published)}</time> · {post.author} ·{' '}
            {post.minutes} min read
            {post.updated && <> · Updated {formatDay(post.updated)}</>}
          </p>
          <Suspense>{clientLoader.useContent(post.path)}</Suspense>
        </article>
      </main>
    </HomeLayout>
  );
}
