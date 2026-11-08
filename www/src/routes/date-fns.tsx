import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { useState } from 'react';
import { baseOptions } from '@/lib/layout.shared';
import { CodeExample } from '@/components/code-example';
import {
  DATE_FNS_EXAMPLE,
  DATE_FNS_PAGE_META,
  DATE_FNS_PAGE_URL,
  DATE_FNS_RENAMES,
  TIEMPO_EXAMPLE
} from '@/lib/date-fns-page';

export const Route = createFileRoute('/date-fns')({
  head: () => ({
    meta: [...DATE_FNS_PAGE_META],
    links: [{ rel: 'canonical', href: DATE_FNS_PAGE_URL }]
  }),
  component: DateFnsPage
});

const REASONS = [
  {
    title: 'Date has no timezone',
    description:
      'A Date is a UTC timestamp shown in whatever timezone the machine uses. Temporal values carry their timezone, so your code gives the same answer on a laptop and on a server.'
  },
  {
    title: 'Not every day is 24 hours',
    description:
      'Twice a year a day has 23 or 25 hours. addDays moves to the next calendar day at the same local time.'
  },
  {
    title: "A birthday isn't a moment",
    description:
      'Birthdays and due dates are PlainDates: no hidden midnight and no timezone to shift them to the day before.'
  }
] as const;

const linkClass =
  'text-neutral-200 underline decoration-neutral-700 underline-offset-4 transition-colors hover:text-amber-300';

function DateFnsPage() {
  const [copied, setCopied] = useState(false);

  async function copyInstall() {
    try {
      await navigator.clipboard.writeText('pnpm add @gobrand/tiempo');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <HomeLayout {...baseOptions()}>
      <section className="px-4 pb-12 pt-16 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-amber-400">
            For date-fns users
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-[1.15] tracking-tight text-neutral-100 md:text-5xl">
            date-fns for the Temporal API
          </h1>
          <p className="mb-8 max-w-2xl text-lg font-light leading-relaxed text-neutral-400 md:text-xl">
            tiempo keeps the date-fns function names and argument order, and replaces{' '}
            <code className="text-neutral-300">Date</code> with Temporal. Timezones become explicit,
            daylight-saving math stays correct, and a birthday stays a date.
          </p>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <code className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900/80 px-4 py-2.5 font-mono text-sm text-neutral-300 sm:w-auto">
              <span>
                <span className="text-neutral-500">$</span> pnpm add @gobrand/tiempo
              </span>
              <button
                type="button"
                className="rounded px-2 py-1 text-xs text-neutral-400 transition-colors hover:bg-neutral-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                onClick={copyInstall}
              >
                <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </code>
            <Link
              to="/docs/$"
              params={{ _splat: 'date-fns' }}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              See the full function mapping
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-3xl font-bold text-neutral-100">Same task, both libraries</h2>
          <p className="mb-8 max-w-2xl text-lg text-neutral-400">
            Deliver two days after an order placed in New York, just before the clocks change on
            March 8. With <code className="text-neutral-300">Date</code>, the answer depends on
            where your server runs.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="min-w-0">
              <h3 className="mb-3 text-sm font-medium text-neutral-400">date-fns + date-fns-tz</h3>
              <CodeExample code={DATE_FNS_EXAMPLE} />
            </div>
            <div className="min-w-0">
              <h3 className="mb-3 text-sm font-medium text-amber-400">tiempo</h3>
              <CodeExample code={TIEMPO_EXAMPLE} />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-bold text-neutral-100">Why Temporal instead of Date</h2>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-neutral-800/50 md:grid-cols-3">
            {REASONS.map((reason) => (
              <div key={reason.title} className="bg-neutral-900/30 p-8">
                <h3 className="mb-2 text-lg font-semibold text-neutral-100">{reason.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-400">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-3xl font-bold text-neutral-100">What changes</h2>
          <p className="mb-8 text-lg text-neutral-400">
            Most functions keep their name and arguments. These are the ones that ask you to say
            what you mean.
          </p>
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-medium">date-fns</th>
                  <th className="px-4 py-3 font-medium">tiempo</th>
                </tr>
              </thead>
              <tbody className="font-mono text-neutral-300">
                {DATE_FNS_RENAMES.map(([before, after]) => (
                  <tr key={before} className="border-b border-neutral-800/60 last:border-0">
                    <td className="px-4 py-3 text-neutral-500">{before}</td>
                    <td className="px-4 py-3">{after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-neutral-400">
            Every other function, side by side:{' '}
            <Link to="/docs/$" params={{ _splat: 'date-fns' }} className={linkClass}>
              Coming from date-fns
            </Link>
            . New to tiempo?{' '}
            <Link to="/docs/$" params={{ _splat: '' }} className={linkClass}>
              Start with the docs
            </Link>
            .
          </p>
        </div>
      </section>

      <footer className="border-t border-neutral-800/50 px-4 py-10">
        <p className="mx-auto max-w-6xl text-sm text-neutral-500">
          date-fns is an independent open-source project. tiempo is not affiliated with it; it
          follows date-fns naming so your existing knowledge carries over.
        </p>
      </footer>
    </HomeLayout>
  );
}
