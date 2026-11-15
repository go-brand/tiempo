export const SITE_URL = 'https://tiempo.gobrand.app';
export const OG_IMAGE_URL = `${SITE_URL}/og.jpg`;

type PageMeta = { title: string; description: string; url: string };

// Search and social tags for one page. Every page shares the same preview image.
export function pageMeta({ title, description, url }: PageMeta) {
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: 'Tiempo' },
    { property: 'og:image', content: OG_IMAGE_URL },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'tiempo: date-fns-style functions for the Temporal API' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: OG_IMAGE_URL }
  ];
}

// Function reference pages live at /docs/<category>/<function>.
export function docsPageTitle(title: string, url: string): string {
  const segments = url.split('/').filter(Boolean);
  if (segments.length === 1) return 'tiempo docs: date-fns-style functions for the Temporal API';
  if (segments.length === 3) return `${title} for the Temporal API · tiempo`;
  return `${title} · tiempo`;
}

export function guideTitle(title: string, url: string): string {
  return url === '/guides' ? `${title} · tiempo` : `${title} · tiempo guides`;
}

export function blogTitle(title: string): string {
  return `${title} · tiempo blog`;
}

const PUBLISHER = {
  '@type': 'Organization',
  name: 'Go Brand',
  url: 'https://gobrand.app'
};

type Article = {
  type: 'TechArticle' | 'BlogPosting';
  title: string;
  description: string;
  url: string;
  published: string;
  updated?: string;
  author?: string;
  section: { name: string; url: string };
};

// schema.org article plus breadcrumbs: Home > section > article.
export function articleStructuredData(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': article.type,
        headline: article.title,
        description: article.description,
        url: article.url,
        mainEntityOfPage: article.url,
        image: OG_IMAGE_URL,
        datePublished: article.published,
        dateModified: article.updated ?? article.published,
        author: article.author ? { '@type': 'Person', name: article.author } : PUBLISHER,
        publisher: PUBLISHER,
        inLanguage: 'en'
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'tiempo', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: article.section.name, item: article.section.url },
          { '@type': 'ListItem', position: 3, name: article.title, item: article.url }
        ]
      }
    ]
  } as const;
}

// About 220 words a minute; code blocks are not counted.
export function readingMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDay(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
