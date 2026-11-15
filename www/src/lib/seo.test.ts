import { describe, expect, test } from 'vitest';
import {
  articleStructuredData,
  blogTitle,
  docsPageTitle,
  formatDay,
  guideTitle,
  OG_IMAGE_URL,
  pageMeta,
  readingMinutes
} from './seo';

describe('page metadata', () => {
  test('names function pages after the function and the Temporal API', () => {
    expect(docsPageTitle('addDays', '/docs/arithmetic/add-days')).toBe(
      'addDays for the Temporal API · tiempo'
    );
  });

  test('keeps overview titles as written', () => {
    expect(docsPageTitle('Recipes', '/docs/recipes')).toBe('Recipes · tiempo');
    expect(docsPageTitle('Introduction', '/docs')).toContain('Temporal API');
  });

  test('names guides and posts after their section', () => {
    expect(guideTitle('Date and time guides', '/guides')).toBe('Date and time guides · tiempo');
    expect(guideTitle('Add days across DST', '/guides/dst')).toBe(
      'Add days across DST · tiempo guides'
    );
    expect(blogTitle('tiempo 3.2')).toBe('tiempo 3.2 · tiempo blog');
  });

  test('describes an article with its dates and breadcrumbs', () => {
    const data = articleStructuredData({
      type: 'TechArticle',
      title: 'Add days across DST',
      description: 'D',
      url: 'https://tiempo.gobrand.app/guides/dst',
      published: '2026-11-15',
      section: { name: 'Guides', url: 'https://tiempo.gobrand.app/guides' }
    });

    expect(data['@graph'][0]).toMatchObject({
      '@type': 'TechArticle',
      datePublished: '2026-11-15',
      dateModified: '2026-11-15',
      author: { '@type': 'Organization', name: 'Go Brand' }
    });
    expect(data['@graph'][1].itemListElement.map((item) => item.name)).toEqual([
      'tiempo',
      'Guides',
      'Add days across DST'
    ]);
  });

  test('estimates reading time and formats dates', () => {
    expect(readingMinutes('word '.repeat(660))).toBe(3);
    expect(readingMinutes('')).toBe(1);
    expect(formatDay('2026-11-15')).toBe('November 15, 2026');
  });

  test('gives every page a canonical URL and a large preview image', () => {
    const meta = pageMeta({ title: 'T', description: 'D', url: 'https://tiempo.gobrand.app/docs' });

    expect(meta).toEqual(
      expect.arrayContaining([
        { title: 'T' },
        { name: 'description', content: 'D' },
        { property: 'og:url', content: 'https://tiempo.gobrand.app/docs' },
        { property: 'og:image', content: OG_IMAGE_URL },
        { name: 'twitter:card', content: 'summary_large_image' }
      ])
    );
  });
});
