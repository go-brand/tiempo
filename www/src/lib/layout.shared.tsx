import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2">
          <span
            className="inline-block w-4 h-4 rounded-full"
            style={{
              background: 'linear-gradient(to top, #fdba74, #fb923c, #f97316, #ea580c)',
            }}
          />
          tiempo
        </span>
      ),
    },
    githubUrl: 'https://github.com/go-brand/tiempo',
    links: [
      {
        text: 'Documentation',
        url: '/docs',
        active: 'nested-url',
      },
    ],
    // Disable theme toggle since we're forcing dark theme only
    themeSwitch: {
      enabled: false,
    },
  };
}
