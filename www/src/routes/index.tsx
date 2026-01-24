import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const Route = createFileRoute('/')({
  component: Home,
});

// Static arrays for clock markers
const HOUR_MARKERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
const MINUTE_MARKERS = [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 26, 27, 28, 29, 31, 32, 33, 34, 36, 37, 38, 39, 41, 42, 43, 44, 46, 47, 48, 49, 51, 52, 53, 54, 56, 57, 58, 59] as const;


// Animated clock hands visualization
function ClockVisualization({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const isLight = variant === 'light';

  return (
    <div className="relative w-[380px] h-[380px] md:w-[500px] md:h-[500px]">
      {/* Aura rings - soft glowing shadows with wavy ripple effect */}
      <motion.div
        className={`absolute inset-[-30px] md:inset-[-50px] rounded-full ${isLight ? 'shadow-[0_0_40px_8px_rgba(255,255,255,0.15)]' : 'shadow-[0_0_40px_8px_rgba(251,191,36,0.15)]'}`}
        initial={{ opacity: 0, scale: 0.7, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: [0.7, 1.08, 0.96, 1.02, 1], filter: 'blur(0px)' }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
          scale: { duration: 1.4, times: [0, 0.4, 0.6, 0.8, 1], ease: 'easeOut' }
        }}
      />
      <motion.div
        className={`absolute inset-[-70px] md:inset-[-110px] rounded-full ${isLight ? 'shadow-[0_0_60px_12px_rgba(255,255,255,0.08)]' : 'shadow-[0_0_60px_12px_rgba(251,191,36,0.08)]'}`}
        initial={{ opacity: 0, scale: 0.7, filter: 'blur(16px)' }}
        animate={{ opacity: 1, scale: [0.7, 1.06, 0.97, 1.01, 1], filter: 'blur(0px)' }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.12,
          scale: { duration: 1.4, times: [0, 0.4, 0.6, 0.8, 1], ease: 'easeOut', delay: 0.12 }
        }}
      />
      <motion.div
        className={`absolute inset-[-120px] md:inset-[-180px] rounded-full ${isLight ? 'shadow-[0_0_80px_16px_rgba(255,255,255,0.04)]' : 'shadow-[0_0_80px_16px_rgba(251,191,36,0.04)]'}`}
        initial={{ opacity: 0, scale: 0.7, filter: 'blur(20px)' }}
        animate={{ opacity: 1, scale: [0.7, 1.04, 0.98, 1], filter: 'blur(0px)' }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.24,
          scale: { duration: 1.4, times: [0, 0.45, 0.7, 1], ease: 'easeOut', delay: 0.24 }
        }}
      />

      {/* Outer glow - only for dark variant */}
      {!isLight && (
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      {/* Clock face - border only first, then background fades in */}
      <motion.div
        className={`absolute inset-4 rounded-full border ${isLight ? 'border-white/40' : 'border-amber-500/20'} overflow-hidden`}
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
      >
        {/* Background layer - fades in after border */}
        <motion.div
          className={`absolute inset-0 ${isLight ? 'bg-white/15' : 'bg-gradient-to-br from-neutral-900/80 to-neutral-950/90 backdrop-blur-sm'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 1.3 }}
        />

        {/* Hour markers - outer lines, appear first */}
        {HOUR_MARKERS.map((hour) => (
          <motion.div
            key={`hour-${hour}`}
            className={`absolute inset-0 flex justify-center ${isLight ? 'text-white/60' : 'text-amber-500/40'}`}
            style={{ transform: `rotate(${hour * 30}deg)` }}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.5 }}
          >
            <div className="w-0.5 h-4 mt-2 bg-current" />
          </motion.div>
        ))}

        {/* Minute markers - inner lines, appear after hour markers */}
        {MINUTE_MARKERS.map((minute) => (
          <motion.div
            key={`minute-${minute}`}
            className={`absolute inset-0 flex justify-center ${isLight ? 'text-white/30' : 'text-amber-500/20'}`}
            style={{ transform: `rotate(${minute * 6}deg)` }}
            initial={{ opacity: 0, filter: 'blur(3px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.7 }}
          >
            <div className="w-px h-2 mt-3 bg-current" />
          </motion.div>
        ))}

        {/* Center dot */}
        <motion.div
          className={`absolute left-1/2 top-1/2 w-3 h-3 rounded-full ${isLight ? 'bg-white' : 'bg-amber-500 shadow-lg shadow-amber-500/50'}`}
          style={{ x: '-50%', y: '-50%' }}
          initial={{ opacity: 0, scale: 0, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 1.9 }}
        />

        {/* Hour hand - rotates from center, extends upward */}
        <motion.div
          className={`absolute left-1/2 top-1/2 w-1.5 h-20 md:h-24 rounded-full ${isLight ? 'bg-white' : 'bg-gradient-to-b from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30'}`}
          style={{
            x: '-50%',
            y: '-100%',
            rotate: hourDeg,
            transformOrigin: 'center bottom',
          }}
          initial={{ opacity: 0, scaleY: 0, filter: 'blur(3px)' }}
          animate={{ opacity: 1, scaleY: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 2.0 }}
        />

        {/* Minute hand - rotates from center, extends upward */}
        <motion.div
          className={`absolute left-1/2 top-1/2 w-1 md:w-0.5 h-24 md:h-28 rounded-full ${isLight ? 'bg-white/90' : 'bg-gradient-to-b from-amber-300 to-amber-500 shadow-lg shadow-amber-500/20'}`}
          style={{
            x: '-50%',
            y: '-100%',
            rotate: minuteDeg,
            transformOrigin: 'center bottom',
          }}
          initial={{ opacity: 0, scaleY: 0, filter: 'blur(3px)' }}
          animate={{ opacity: 1, scaleY: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 2.05 }}
        />

        {/* Second hand - rotates from center, extends upward */}
        <motion.div
          className={`absolute left-1/2 top-1/2 w-px h-28 md:h-32 ${isLight ? 'bg-white/70' : 'bg-gradient-to-b from-orange-400 to-orange-600'}`}
          style={{
            x: '-50%',
            y: '-100%',
            rotate: secondDeg,
            transformOrigin: 'center bottom',
          }}
          initial={{ opacity: 0, scaleY: 0, filter: 'blur(2px)' }}
          animate={{ opacity: 1, scaleY: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 2.1 }}
        />
      </motion.div>

      {/* Orbiting timezone indicators - coordinated orbits at harmonic ratios */}
      <motion.div
        className="absolute inset-0 animate-[spin_120s_linear_infinite]"
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 2.3 }}
      >
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 px-2 py-0.5 rounded-full text-[10px] font-mono ${isLight ? 'bg-white/20 border border-white/30 text-white/80' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400/70'}`}>
          UTC
        </div>
      </motion.div>
      <motion.div
        className="absolute inset-0 animate-[spin_120s_linear_infinite]"
        style={{ animationDelay: '-60s' }}
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 2.4 }}
      >
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 px-2 py-0.5 rounded-full text-[10px] font-mono ${isLight ? 'bg-white/20 border border-white/30 text-white/80' : 'bg-orange-500/10 border border-orange-500/20 text-orange-400/70'}`}>
          PST
        </div>
      </motion.div>
    </div>
  );
}

// Syntax highlighting for code examples
function highlightCode(code: string): React.ReactNode[] {
  const keywords = ['import', 'from', 'const', 'let', 'var', 'function', 'return', 'async', 'await'];
  const keywordPattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');

  return code.split('\n').map((line, lineIndex) => {
    const parts: React.ReactNode[] = [];
    let partKey = 0;

    // Handle comments first
    const commentIndex = line.indexOf('//');
    const mainPart = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
    const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : '';

    // Find all strings in the main part
    const stringPattern = /('[^']*'|"[^"]*")/g;
    const stringMatches: { start: number; end: number; text: string }[] = [];

    let match = stringPattern.exec(mainPart);
    while (match !== null) {
      stringMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
      match = stringPattern.exec(mainPart);
    }

    // Build the line with highlighting
    let currentPos = 0;
    for (const strMatch of stringMatches) {
      // Text before string
      if (strMatch.start > currentPos) {
        const beforeText = mainPart.slice(currentPos, strMatch.start);
        const keywordParts = beforeText.split(keywordPattern);
        keywordParts.forEach((part) => {
          if (keywords.includes(part)) {
            parts.push(<span key={partKey++} className="text-amber-400">{part}</span>);
          } else {
            parts.push(<span key={partKey++}>{part}</span>);
          }
        });
      }
      // The string itself
      parts.push(<span key={partKey++} className="text-orange-300">{strMatch.text}</span>);
      currentPos = strMatch.end;
    }

    // Remaining text after last string
    if (currentPos < mainPart.length) {
      const remainingText = mainPart.slice(currentPos);
      const keywordParts = remainingText.split(keywordPattern);
      keywordParts.forEach((part) => {
        if (keywords.includes(part)) {
          parts.push(<span key={partKey++} className="text-amber-400">{part}</span>);
        } else {
          parts.push(<span key={partKey++}>{part}</span>);
        }
      });
    }

    // Add comment if present
    if (commentPart) {
      parts.push(<span key={partKey++} className="text-neutral-500">{commentPart}</span>);
    }

    const lineKey = `${line.slice(0, 20).replace(/\s/g, '_')}-${lineIndex}`;
    return (
      <div key={lineKey} className="leading-relaxed">
        {parts.length > 0 ? parts : '\u00A0'}
      </div>
    );
  });
}

// Code example with syntax highlighting
function CodeExample({ code }: { code: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 overflow-hidden h-full w-full">
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="font-mono text-neutral-300 block">{highlightCode(code)}</code>
      </pre>
    </div>
  );
}

// Feature card
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative p-8 bg-gradient-to-br from-neutral-900/30 to-neutral-950/30 border border-neutral-800/50">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center text-amber-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-neutral-100 mb-2">{title}</h3>
      <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
    </div>
  );
}

function Home() {
  const usageCode = `import { toZonedTime, format, today } from 'tiempo';

// Get current time in a timezone
const nyTime = toZonedTime(new Date(), 'America/New_York');

// Format with full control
const formatted = format(nyTime, 'EEEE, MMMM d, yyyy h:mm a');
// → "Thursday, January 23, 2026 2:30 PM"

// Today's date in any timezone
const tokyoToday = today('Asia/Tokyo');`;

  const temporalCode = `import { addDays, differenceInHours, isSameDay } from 'tiempo';

// Add time with precision
const nextWeek = addDays(now, 7);

// Calculate differences
const hoursDiff = differenceInHours(meeting, now);

// Compare dates across timezones
const sameDay = isSameDay(localDate, remoteDate);`;

  return (
    <HomeLayout {...baseOptions()}>
      {/* Hero Section - Text at top */}
      <section className="relative pt-16 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-neutral-100 mb-6">
            Datetime utilities for Temporal.
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl font-light leading-relaxed mb-8">
            tiempo is a lightweight library for timezone conversions, formatting, and date math—built on the modern Temporal API for precision you can trust.
          </p>

          {/* Install command and CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <code className="px-4 py-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 font-mono text-sm flex items-center gap-3">
              <span className="text-neutral-500">$</span> pnpm add @gobrand/tiempo
              <button
                type="button"
                className="p-1 hover:bg-neutral-700/50 rounded transition-colors"
                onClick={() => navigator.clipboard.writeText('pnpm add @gobrand/tiempo')}
                aria-label="Copy to clipboard"
              >
                <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </code>
            <Link
              to="/docs/$"
              params={{ _splat: '' }}
              className="text-amber-400 hover:text-amber-300 font-medium text-sm transition-colors"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* Clock visualization with Cloudflare-style orange gradient background */}
      <section className="relative px-4 pt-8 pb-12 mt-8 overflow-hidden max-w-7xl w-full mx-auto">
        {/* Orange gradient background */}
        <div className="absolute inset-0 rounded-3xl mx-4 overflow-hidden">
          {/* Base orange gradient - strong bottom to top */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, #fdba74 0%, #fb923c 25%, #f97316 50%, #ea580c 75%, #c2410c 100%)`,
            }}
          />
          {/* Radial glow from bottom center */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 100% 60% at 50% 100%, rgba(255, 237, 213, 0.5), transparent 50%)`,
            }}
          />
          {/* Halftone dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
              backgroundSize: '8px 8px',
            }}
          />
          {/* Noise/grain texture overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.3] mix-blend-multiply pointer-events-none" aria-hidden="true">
            <title>Background texture</title>
            <filter id="heroNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#heroNoise)" />
          </svg>
        </div>

        {/* Clock content - centered */}
        <div className="relative z-10 flex justify-center pt-8">
          <ClockVisualization variant="light" />
        </div>
      </section>


      {/* Features section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/5 to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-4">
              Why tiempo?
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              JavaScript's <code className="text-amber-400/80">Date</code> was modeled after a Java class deprecated 25+ years ago. The Temporal API is its modern replacement—tiempo makes it accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 rounded-xl border overflow-clip">
            <FeatureCard
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              }
              title="Any Timezone, Anywhere"
              description="Date only works in UTC or device-local time. Temporal supports 400+ IANA timezones natively. Convert between America/New_York and Asia/Tokyo with confidence."
            />
            <FeatureCard
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Nanosecond Precision"
              description="Beyond milliseconds. Temporal provides nanosecond accuracy for scientific computing, financial systems, and high-frequency operations where every tick matters."
            />
            <FeatureCard
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="DST-Safe Arithmetic"
              description="Adding days means calendar days, not 24-hour periods. Temporal handles Daylight Saving Time transitions correctly—no more off-by-one-hour bugs."
            />
            <FeatureCard
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              title="Immutable by Design"
              description="Date's mutating setters cause countless bugs. Temporal operations always return new values—no side effects, no surprises, no debugging mysteries."
            />
            <FeatureCard
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              }
              title="Distinct Types"
              description="Date conflates timestamps with calendar dates. Temporal separates Instant (timestamp), ZonedDateTime (timezone-aware), and PlainDate (calendar date) to prevent misuse."
            />
            <FeatureCard
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Type-Safe & Familiar"
              description="Autocomplete for 400+ timezones, invalid configurations caught at compile time. A date-fns-style API you already know, built on modern foundations."
            />
          </div>
        </div>
      </section>

      {/* Code examples section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-3">
              Simple, expressive API
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Intuitive functions that do exactly what you expect. No magic, no surprises.
            </p>
          </div>

          <div className="space-y-8 overflow-hidden">
            {/* Timezone Conversion */}
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-16 items-start">
              <div className="lg:col-span-2 flex flex-col justify-center lg:py-4">
                <h3 className="text-xl font-semibold text-neutral-100 mb-2">Timezone Conversion</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Convert times between any timezone with precision. Get the current time in New York, format it beautifully, or find today's date in Tokyo.
                </p>
              </div>
              <div className="lg:col-span-3 min-w-0">
                <CodeExample code={usageCode} />
              </div>
            </div>

            {/* Date Arithmetic */}
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-16 items-start">
              <div className="lg:col-span-2 flex flex-col justify-center lg:py-4">
                <h3 className="text-xl font-semibold text-neutral-100 mb-2">Date Arithmetic</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Add, subtract, and compare dates naturally. Calculate differences, check if dates fall on the same day—all with DST-safe precision.
                </p>
              </div>
              <div className="lg:col-span-3 min-w-0">
                <CodeExample code={temporalCode} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-neutral-900/80 via-neutral-900/50 to-neutral-950/80 border border-neutral-800/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-4">
                Ready to handle time?
              </h2>
              <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
                Start building with tiempo today. It's open source, lightweight, and built for the future of JavaScript.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/docs/$"
                  params={{ _splat: '' }}
                  className="group relative px-6 py-2.5 rounded-lg border border-amber-500/50 text-amber-400 hover:text-amber-300 hover:border-amber-400/60 font-medium transition-all duration-300"
                >
                  Documentation
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-neutral-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-neutral-500">
            Built with precision. Open source under MIT.
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/go-brand/tiempo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/@gobrand/tiempo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              npm
            </a>
          </div>
        </div>
      </footer>
    </HomeLayout>
  );
}
