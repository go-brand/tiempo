import { describe, expect, test } from 'vitest';
import { docsPageTitle, OG_IMAGE_URL, pageMeta } from './seo';

describe('page metadata', () => {
  test('names function pages after the function and the Temporal API', () => {
    expect(docsPageTitle('addDays', '/docs/arithmetic/add-days')).toBe(
      'addDays for the Temporal API · tiempo'
    );
  });

  test('keeps guide and overview titles as written', () => {
    expect(docsPageTitle('Recipes', '/docs/recipes')).toBe('Recipes · tiempo');
    expect(docsPageTitle('Add days across DST', '/docs/guides/dst')).toBe(
      'Add days across DST · tiempo'
    );
    expect(docsPageTitle('Introduction', '/docs')).toContain('Temporal API');
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
