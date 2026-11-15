import { createFileRoute, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { blogPosts } from '@/lib/source';
import { formatDay, pageMeta, SITE_URL } from '@/lib/seo';

const BLOG_URL = `${SITE_URL}/blog`;
const TITLE = 'Blog · tiempo';
const DESCRIPTION =
  'Releases and notes on dates, times, and the Temporal API in JavaScript and TypeScript.';

const listPosts = createServerFn({ method: 'GET' }).handler(async () =>
  blogPosts().map((post) => ({
    url: post.url,
    title: post.data.title,
    description: post.data.description ?? '',
    published: post.data.published
  }))
);

export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
  loader: () => listPosts(),
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESCRIPTION, url: BLOG_URL }),
    links: [{ rel: 'canonical', href: BLOG_URL }]
  })
});

function BlogIndex() {
  const posts = Route.useLoaderData();

  return (
    <HomeLayout {...baseOptions()}>
      <main className="px-4 pb-24 pt-16 md:pt-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-100">Blog</h1>
          <p className="mb-12 text-lg text-neutral-400">
            {DESCRIPTION}{' '}
            <a className="text-amber-400 hover:text-amber-300" href="/rss.xml">
              RSS
            </a>
          </p>
          <ul className="flex flex-col gap-10">
            {posts.map((post) => (
              <li key={post.url}>
                <time dateTime={post.published} className="text-sm text-neutral-500">
                  {formatDay(post.published)}
                </time>
                <h2 className="mt-1 text-2xl font-semibold text-neutral-100">
                  <Link to={post.url} className="hover:text-amber-300">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-neutral-400">{post.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </HomeLayout>
  );
}
