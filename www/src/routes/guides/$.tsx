import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { createServerFn } from '@tanstack/react-start';
import { guidesSource } from '@/lib/source';
import browserCollections from 'fumadocs-mdx:collections/browser';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { baseOptions } from '@/lib/layout.shared';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense } from 'react';
import {
  articleStructuredData,
  formatDay,
  guideTitle,
  pageMeta,
  readingMinutes,
  SITE_URL
} from '@/lib/seo';

export const Route = createFileRoute('/guides/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? [];
    const data = await serverLoader({ data: slugs });
    await clientLoader.preload(data.path);
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `${SITE_URL}${loaderData.url}`;
    const scripts = loaderData.published
      ? [
          {
            type: 'application/ld+json',
            children: JSON.stringify(
              articleStructuredData({
                type: 'TechArticle',
                title: loaderData.heading,
                description: loaderData.description,
                url,
                published: loaderData.published,
                updated: loaderData.updated,
                section: { name: 'Guides', url: `${SITE_URL}/guides` }
              })
            )
          }
        ]
      : [];
    return {
      meta: pageMeta({ title: loaderData.title, description: loaderData.description, url }),
      links: [{ rel: 'canonical', href: url }],
      scripts
    };
  }
});

const serverLoader = createServerFn({ method: 'GET' })
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = guidesSource.getPage(slugs);
    if (!page) throw notFound();

    const text = page.data.structuredData.contents.map((block) => block.content).join(' ');
    return {
      path: page.path,
      url: page.url,
      heading: page.data.title,
      title: guideTitle(page.data.title, page.url),
      description: page.data.description ?? '',
      published: page.data.published,
      updated: page.data.updated,
      minutes: readingMinutes(text),
      pageTree: await guidesSource.serializePageTree(guidesSource.getPageTree())
    };
  });

const clientLoader = browserCollections.guides.createClientLoader({
  component({ toc, frontmatter, default: MDX }, props: { byline?: string }) {
    return (
      <DocsPage toc={toc}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        {props.byline && <p className="-mt-4 text-sm text-fd-muted-foreground">{props.byline}</p>}
        <DocsBody>
          <MDX components={{ ...defaultMdxComponents }} />
        </DocsBody>
      </DocsPage>
    );
  }
});

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());
  const date = data.updated ?? data.published;
  const byline = date
    ? `${data.updated ? 'Updated' : 'Published'} ${formatDay(date)} · ${data.minutes} min read`
    : undefined;

  return (
    <DocsLayout {...baseOptions()} tree={data.pageTree} links={[]}>
      <Suspense>{clientLoader.useContent(data.path, { byline })}</Suspense>
    </DocsLayout>
  );
}
