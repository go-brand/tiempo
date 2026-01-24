import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import * as React from 'react';
import appCss from '@/styles/app.css?url';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'tiempo - Temporal API datetime utilities',
      },
      {
        name: 'description',
        content: 'A lightweight TypeScript library for timezone-aware datetime handling using the Temporal API.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/tiempo/favicon.svg' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/tiempo/favicon-96x96.png' },
      { rel: 'shortcut icon', href: '/tiempo/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/tiempo/apple-touch-icon.png' },
      { rel: 'manifest', href: '/tiempo/site.webmanifest' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // Force dark theme by adding dark class and disabling theme switching
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        {/*
          Theme configuration:
          - forcedTheme="dark": Forces dark theme, ignoring user preference
          - disableTransitionOnChange: Prevents flash when page loads
          - enableSystem={false}: Disables system preference detection
          - attribute="class": Uses class-based theming (Tailwind compatible)
        */}
        <RootProvider
          theme={{
            forcedTheme: 'dark',
            disableTransitionOnChange: true,
            enableSystem: false,
            attribute: 'class',
          }}
          search={{
            options: {
              api: '/tiempo/api/search',
            },
          }}
        >
          {children}
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
