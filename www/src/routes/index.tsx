import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import {
  HOME_PAGE_META,
  HOME_PAGE_STRUCTURED_DATA,
  HOME_PAGE_URL,
  TIEMPO_AGENT_PROMPT,
} from "@/lib/homepage";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [...HOME_PAGE_META],
    links: [{ rel: "canonical", href: HOME_PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(HOME_PAGE_STRUCTURED_DATA),
      },
    ],
  }),
  component: Home,
});

// Static arrays for clock markers
const HOUR_MARKERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
const MINUTE_MARKERS = [
  1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 26, 27, 28, 29, 31, 32,
  33, 34, 36, 37, 38, 39, 41, 42, 43, 44, 46, 47, 48, 49, 51, 52, 53, 54, 56, 57, 58, 59,
] as const;

// Animated clock hands visualization
function ClockVisualization({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [time, setTime] = useState(() => new Date(0));

  useEffect(() => {
    const updateTime = () => setTime(new Date());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const isLight = variant === "light";

  return (
    <div className="relative w-[380px] h-[380px] md:w-[500px] md:h-[500px]">
      {/* Aura rings - soft glowing shadows with wavy ripple effect */}
      <motion.div
        className={`absolute inset-[-30px] md:inset-[-50px] rounded-full ${isLight ? "shadow-[0_0_40px_8px_rgba(255,255,255,0.15)]" : "shadow-[0_0_40px_8px_rgba(251,191,36,0.15)]"}`}
        initial={{ opacity: 0, scale: 0.7, filter: "blur(12px)" }}
        animate={{ opacity: 1, scale: [0.7, 1.08, 0.96, 1.02, 1], filter: "blur(0px)" }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
          scale: { duration: 1.4, times: [0, 0.4, 0.6, 0.8, 1], ease: "easeOut" },
        }}
      />
      <motion.div
        className={`absolute inset-[-70px] md:inset-[-110px] rounded-full ${isLight ? "shadow-[0_0_60px_12px_rgba(255,255,255,0.08)]" : "shadow-[0_0_60px_12px_rgba(251,191,36,0.08)]"}`}
        initial={{ opacity: 0, scale: 0.7, filter: "blur(16px)" }}
        animate={{ opacity: 1, scale: [0.7, 1.06, 0.97, 1.01, 1], filter: "blur(0px)" }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.12,
          scale: { duration: 1.4, times: [0, 0.4, 0.6, 0.8, 1], ease: "easeOut", delay: 0.12 },
        }}
      />
      <motion.div
        className={`absolute inset-[-120px] md:inset-[-180px] rounded-full ${isLight ? "shadow-[0_0_80px_16px_rgba(255,255,255,0.04)]" : "shadow-[0_0_80px_16px_rgba(251,191,36,0.04)]"}`}
        initial={{ opacity: 0, scale: 0.7, filter: "blur(20px)" }}
        animate={{ opacity: 1, scale: [0.7, 1.04, 0.98, 1], filter: "blur(0px)" }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.24,
          scale: { duration: 1.4, times: [0, 0.45, 0.7, 1], ease: "easeOut", delay: 0.24 },
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
        className={`absolute inset-4 rounded-full border ${isLight ? "border-white/40" : "border-amber-500/20"} overflow-hidden`}
        initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
      >
        {/* Background layer - fades in after border */}
        <motion.div
          className={`absolute inset-0 ${isLight ? "bg-white/15" : "bg-gradient-to-br from-neutral-900/80 to-neutral-950/90 backdrop-blur-sm"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 1.3 }}
        />

        {/* Hour markers - outer lines, appear first */}
        {HOUR_MARKERS.map((hour) => (
          <motion.div
            key={`hour-${hour}`}
            className={`absolute inset-0 flex justify-center ${isLight ? "text-white/60" : "text-amber-500/40"}`}
            style={{ transform: `rotate(${hour * 30}deg)` }}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.5 }}
          >
            <div className="w-0.5 h-4 mt-2 bg-current" />
          </motion.div>
        ))}

        {/* Minute markers - inner lines, appear after hour markers */}
        {MINUTE_MARKERS.map((minute) => (
          <motion.div
            key={`minute-${minute}`}
            className={`absolute inset-0 flex justify-center ${isLight ? "text-white/30" : "text-amber-500/20"}`}
            style={{ transform: `rotate(${minute * 6}deg)` }}
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.7 }}
          >
            <div className="w-px h-2 mt-3 bg-current" />
          </motion.div>
        ))}

        {/* Center dot */}
        <motion.div
          className={`absolute left-1/2 top-1/2 w-3 h-3 rounded-full ${isLight ? "bg-white" : "bg-amber-500 shadow-lg shadow-amber-500/50"}`}
          style={{ x: "-50%", y: "-50%" }}
          initial={{ opacity: 0, scale: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 1.9 }}
        />

        {/* Hour hand - rotates from center, extends upward */}
        <motion.div
          className={`absolute left-1/2 top-1/2 w-1.5 h-20 md:h-24 rounded-full ${isLight ? "bg-white" : "bg-gradient-to-b from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30"}`}
          style={{
            x: "-50%",
            y: "-100%",
            rotate: hourDeg,
            transformOrigin: "center bottom",
          }}
          initial={{ opacity: 0, scaleY: 0, filter: "blur(3px)" }}
          animate={{ opacity: 1, scaleY: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 2.0 }}
        />

        {/* Minute hand - rotates from center, extends upward */}
        <motion.div
          className={`absolute left-1/2 top-1/2 w-1 md:w-0.5 h-24 md:h-28 rounded-full ${isLight ? "bg-white/90" : "bg-gradient-to-b from-amber-300 to-amber-500 shadow-lg shadow-amber-500/20"}`}
          style={{
            x: "-50%",
            y: "-100%",
            rotate: minuteDeg,
            transformOrigin: "center bottom",
          }}
          initial={{ opacity: 0, scaleY: 0, filter: "blur(3px)" }}
          animate={{ opacity: 1, scaleY: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 2.05 }}
        />

        {/* Second hand - rotates from center, extends upward */}
        <motion.div
          className={`absolute left-1/2 top-1/2 w-px h-28 md:h-32 ${isLight ? "bg-white/70" : "bg-gradient-to-b from-orange-400 to-orange-600"}`}
          style={{
            x: "-50%",
            y: "-100%",
            rotate: secondDeg,
            transformOrigin: "center bottom",
          }}
          initial={{ opacity: 0, scaleY: 0, filter: "blur(2px)" }}
          animate={{ opacity: 1, scaleY: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 2.1 }}
        />
      </motion.div>

      {/* Orbiting timezone indicators - coordinated orbits at harmonic ratios */}
      <motion.div
        className="absolute inset-0 animate-[spin_120s_linear_infinite]"
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 2.3 }}
      >
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 px-2 py-0.5 rounded-full text-[10px] font-mono ${isLight ? "bg-white/20 border border-white/30 text-white/80" : "bg-amber-500/10 border border-amber-500/20 text-amber-400/70"}`}
        >
          UTC
        </div>
      </motion.div>
      <motion.div
        className="absolute inset-0 animate-[spin_120s_linear_infinite]"
        style={{ animationDelay: "-60s" }}
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 2.4 }}
      >
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 px-2 py-0.5 rounded-full text-[10px] font-mono ${isLight ? "bg-white/20 border border-white/30 text-white/80" : "bg-orange-500/10 border border-orange-500/20 text-orange-400/70"}`}
        >
          PST
        </div>
      </motion.div>
    </div>
  );
}

// Syntax highlighting for code examples
function highlightCode(code: string): React.ReactNode[] {
  const keywords = [
    "import",
    "from",
    "const",
    "let",
    "var",
    "function",
    "return",
    "async",
    "await",
  ];
  const keywordPattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");

  return code.split("\n").map((line, lineIndex) => {
    const parts: React.ReactNode[] = [];
    let partKey = 0;

    // Handle comments first
    const commentIndex = line.indexOf("//");
    const mainPart = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
    const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : "";

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
            parts.push(
              <span key={partKey++} className="text-amber-400">
                {part}
              </span>,
            );
          } else {
            parts.push(<span key={partKey++}>{part}</span>);
          }
        });
      }
      // The string itself
      parts.push(
        <span key={partKey++} className="text-orange-300">
          {strMatch.text}
        </span>,
      );
      currentPos = strMatch.end;
    }

    // Remaining text after last string
    if (currentPos < mainPart.length) {
      const remainingText = mainPart.slice(currentPos);
      const keywordParts = remainingText.split(keywordPattern);
      keywordParts.forEach((part) => {
        if (keywords.includes(part)) {
          parts.push(
            <span key={partKey++} className="text-amber-400">
              {part}
            </span>,
          );
        } else {
          parts.push(<span key={partKey++}>{part}</span>);
        }
      });
    }

    // Add comment if present
    if (commentPart) {
      parts.push(
        <span key={partKey++} className="text-neutral-500">
          {commentPart}
        </span>,
      );
    }

    const lineKey = `${line.slice(0, 20).replace(/\s/g, "_")}-${lineIndex}`;
    return (
      <div key={lineKey} className="leading-relaxed">
        {parts.length > 0 ? parts : "\u00A0"}
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
  const [copied, setCopied] = useState<"agent" | "install" | null>(null);

  async function copyToClipboard(
    value: string,
    target: "agent" | "install",
  ) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(target);
      window.setTimeout(() => {
        setCopied((current) => (current === target ? null : current));
      }, 2000);
    } catch {
      setCopied(null);
    }
  }

  const usageCode = `import { addDays, endOfDay, format, toIso, toZonedTime } from '@gobrand/tiempo';

const teamTimezone = 'America/New_York';

// ISO from your backend → the team's calendar
// task.dueAt = "2026-03-07T15:00:00Z"
const dueAt = toZonedTime(task.dueAt, teamTimezone);

// "Tomorrow, end of day" stays correct through DST
const rescheduled = endOfDay(addDays(dueAt, 1));

format(rescheduled, "MMM d, h:mm a");
// → "Mar 8, 11:59 PM"

// Zoned value → exact UTC ISO back to the API
await api.tasks.update({ dueAt: toIso(rescheduled) });`;

  return (
    <HomeLayout {...baseOptions()}>
      {/* Hero Section */}
      <section className="relative px-4 pb-8 pt-16 md:pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6 text-4xl font-bold leading-[1.15] tracking-tight text-neutral-100 md:text-5xl lg:text-6xl">
            Date and time code you can trust.
          </h1>

          <p className="mb-8 max-w-2xl text-lg font-light leading-relaxed text-neutral-400 md:text-xl">
            Join thousands of developers who stopped struggling with timezones. Tiempo makes
            Temporal conversions, formatting, and date math feel simple.
          </p>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 sm:w-auto"
              onClick={() => copyToClipboard(TIEMPO_AGENT_PROMPT, "agent")}
            >
              {copied === "agent" ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 12 4 4L19 6"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
              <span aria-live="polite">
                {copied === "agent"
                  ? "Prompt copied"
                  : "Copy prompt for your agent"}
              </span>
            </button>

            <code className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900/80 px-4 py-2.5 font-mono text-sm text-neutral-300 sm:w-auto">
              <span>
                <span className="text-neutral-500">$</span>{" "}
                pnpm add @gobrand/tiempo
              </span>
              <button
                type="button"
                className="rounded p-1 transition-colors hover:bg-neutral-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                onClick={() =>
                  copyToClipboard("pnpm add @gobrand/tiempo", "install")
                }
                aria-label={
                  copied === "install"
                    ? "Package command copied"
                    : "Copy package command"
                }
              >
                <svg
                  className="h-4 w-4 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={
                      copied === "install"
                        ? "m5 12 4 4L19 6"
                        : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    }
                  />
                </svg>
              </button>
            </code>
            <Link
              to="/docs/$"
              params={{ _splat: "" }}
              className="inline-flex min-h-11 items-center justify-center px-2 text-sm font-medium text-amber-400 transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              Read the docs
            </Link>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500">
            The prompt points your coding agent to Tiempo&apos;s{" "}
            <a
              className="text-neutral-300 underline decoration-neutral-700 underline-offset-4 transition-colors hover:text-amber-300"
              href="/llms.txt"
            >
              llms.txt
            </a>{" "}
            and installable{" "}
            <a
              className="text-neutral-300 underline decoration-neutral-700 underline-offset-4 transition-colors hover:text-amber-300"
              href="/.well-known/agent-skills/tiempo/SKILL.md"
            >
              Agent Skill
            </a>
            .
          </p>
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
              backgroundSize: "8px 8px",
            }}
          />
          {/* Noise/grain texture overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.3] mix-blend-multiply pointer-events-none"
            aria-hidden="true"
          >
            <title>Background texture</title>
            <filter id="heroNoise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#heroNoise)" />
          </svg>
        </div>

        <div className="relative z-10 flex justify-center pt-8">
          <ClockVisualization variant="light" />
        </div>
      </section>

      <section className="px-4 pb-6 pt-2">
        <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {[
            ["90", "typed utilities"],
            ["418", "timezone identifiers"],
            ["1 ns", "Temporal precision"],
            ["MIT", "open source"],
          ].map(([value, label]) => (
            <div key={label} className="px-4 py-6 md:px-6">
              <div className="font-mono text-xl font-semibold text-neutral-100">{value}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.14em] text-neutral-500">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/5 to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-4">
              The hard parts of time should feel simple.
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Work in the timezone the business uses, move calendar days safely through DST, and
              return exact ISO back to your API.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 rounded-xl border overflow-clip">
            <FeatureCard
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              }
              title="Your team's timezone, anywhere"
              description="Convert an ISO timestamp into America/New_York, Asia/Tokyo, or UTC—regardless of where your code runs."
            />
            <FeatureCard
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              title="DST-safe calendar math"
              description="Adding a day means the next calendar day, not 24 hours. Your 9 AM schedule stays at 9 AM when clocks change."
            />
            <FeatureCard
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              title="A date is not a timestamp"
              description="Billing dates, birthdays, and holidays stay PlainDate values until you decide they represent a real moment."
            />
            <FeatureCard
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              title="Timezone mistakes get caught early"
              description="Autocomplete valid timezone names, including UTC, and keep invalid identifiers out of production."
            />
            <FeatureCard
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              }
              title="Nanosecond precision"
              description="Keep exact API and database timestamps without routing them through Date's millisecond limit."
            />
            <FeatureCard
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              title="No hidden date mutations"
              description="Every operation returns a new value, so updating one schedule cannot quietly change another part of your app."
            />
          </div>
        </div>
      </section>

      {/* Code examples section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-3">
              The usual time problems, solved.
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Receive an ISO timestamp, work in the team's timezone, then send an exact ISO
              string back to your API.
            </p>
          </div>

          <div className="space-y-8 overflow-hidden">
            {/* End-to-end timezone workflow */}
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-16 items-start">
              <div className="lg:col-span-2 flex flex-col justify-center lg:py-4">
                <h3 className="text-xl font-semibold text-neutral-100 mb-2">
                  Reschedule a team task without losing its timezone
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  The backend deals in ISO. The team deals in local calendar days. Tiempo makes
                  that boundary explicit, safe through DST, and easy to send back.
                </p>
              </div>
              <div className="lg:col-span-3 min-w-0">
                <CodeExample code={usageCode} />
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
                Make time code obvious.
              </h2>
              <p className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto">
                Use Temporal without making every call site solve Temporal from scratch. Install
                Tiempo and let the types carry the meaning.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/docs/$"
                  params={{ _splat: "" }}
                  className="group relative px-6 py-2.5 rounded-lg border border-amber-500/50 text-amber-400 hover:text-amber-300 hover:border-amber-400/60 font-medium transition-all duration-300"
                >
                  Start with the docs
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
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
