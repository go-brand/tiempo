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

// Function reference pages live at /docs/<category>/<function>; guides at /docs/guides/<slug>.
export function docsPageTitle(title: string, url: string): string {
  const segments = url.split('/').filter(Boolean);
  if (segments.length === 1) return 'tiempo docs: date-fns-style functions for the Temporal API';
  if (segments.length === 3 && segments[1] !== 'guides') {
    return `${title} for the Temporal API · tiempo`;
  }
  return `${title} · tiempo`;
}
