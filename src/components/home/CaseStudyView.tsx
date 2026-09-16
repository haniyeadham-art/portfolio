"use client";

// Long-form case-study view. Owns the animated surface for one case study:
// a sticky back button, a hero with the project metadata, an overview
// paragraph, paired challenge / solution cards, an impact stat-tile row, a
// mockup gallery, and a "Next Project" footer link. Reads the active locale
// from usePortfolioData() and looks up the study by slug.

import { useMemo, type MouseEvent } from "react";
import { motion } from "framer-motion";
import {ArrowLeft, ArrowRight, ArrowUpRight, Carrot, Users, User} from "lucide-react";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import type { CaseStudy, ImpactMetric } from "@/types/portfolio";

// Reveal schedule shared by every section on the page. Tuned slightly
// slower than the home-page reveals because each page is read in depth
// and the user benefits from content settling into place.
const REVEAL_CONTAINER = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} as const;

const REVEAL_ITEM = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
} as const;

export function CaseStudyView({ slug }: { slug: string }) {
  const { localized, isRtl } = usePortfolioData();
  const { caseStudies } = localized;

  // Build a flat rotation list across both tiers so "Next Project" walks
  // featured and secondary projects in the same order. Slugs are shared
  // across locales, so this works the same way for both English and
  // Persian.
  const { current, next } = useMemo(() => {
    const flat = [...caseStudies.featured, ...caseStudies.secondary];
    const index = flat.findIndex((study) => study.slug === slug);
    if (index < 0) {
      const fallback = flat[0];
      return {
        current: fallback,
        next: flat[1 % flat.length] ?? fallback,
      };
    }
    const nextIndex = (index + 1) % flat.length;
    return {
      current: flat[index],
      next: flat[nextIndex],
    };
  }, [caseStudies.featured, caseStudies.secondary, slug]);

  // The back button mirrors the user's reading direction: an ArrowLeft in
  // LTR, ArrowRight in RTL.
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const handleBack = (event: MouseEvent<HTMLAnchorElement>) => {
    // If we landed on this page directly (no in-page #case-studies target),
    // let the browser navigate to "/#case-studies" normally. If the home
    // page is already loaded in the same tab, intercept and smooth-scroll
    // so the user stays in flow.
    if (typeof window === "undefined") return;
    const onHome = window.location.pathname === "/" || window.location.pathname === "";
    if (!onHome) return;
    const target = window.document.querySelector("#case-studies");
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <article className="relative">
      {/* Sticky back button. Blurs the page behind it and lives above the
          case-study content with a comfortable inset from the top. */}
      <div className="pointer-events-none sticky top-4 z-40 px-4">
        <motion.a
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          href="/#case-studies"
          onClick={handleBack}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/80 px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:text-zinc-900"
        >
          <BackIcon className="size-3.5" aria-hidden="true" />
          <span>Back</span>
        </motion.a>
      </div>

      <Hero study={current} />

      <div className="mx-auto max-w-5xl px-4 pb-24">
        <OverviewSection study={current} />
        <ProblemSolutionSection study={current} />
        <ImpactSection impact={current.impact} accentColor={current.accentColor} />
        <MockupGallery study={current} />
        <NextProject current={current} next={next} />
      </div>
    </article>
  );
}

// Hero: category pill, project title, accent monogram, and a row of
// metadata (role + timeline). Animates in on first paint rather than on
// scroll because the user lands here from a list.
function Hero({ study }: { study: CaseStudy }) {
  return (
    <motion.header
      variants={REVEAL_CONTAINER}
      initial="hidden"
      animate="visible"
      className="relative mx-auto mt-10 max-w-5xl px-4 pb-12 sm:mt-16"
    >
      <motion.span
        variants={REVEAL_ITEM}
        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur"
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: study.accentColor }}
          aria-hidden="true"
        />
        {study.category}
      </motion.span>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <motion.h1
            variants={REVEAL_ITEM}
            className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl"
          >
            {study.title}
          </motion.h1>
          <motion.p
            variants={REVEAL_ITEM}
            className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-zinc-600 sm:text-lg"
          >
            {study.summary}
          </motion.p>
        </div>

{/*
        <motion.div
          variants={REVEAL_ITEM}
          className="hidden h-32 w-32 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white shadow-sm md:flex"
          style={{
            background: `linear-gradient(135deg, ${study.accentColor}1a 0%, transparent 70%)`,
          }}
        >
          <span
            className="text-3xl font-semibold tracking-tighter"
            style={{ color: study.accentColor }}
            aria-hidden="true"
          >
            {monogram(study.title)}
          </span>
        </motion.div>
*/}
      </div>

      {/* Metadata pills. Role + Timeline only render when the data file
          carries them (featured projects). Tags always render. */}
      <motion.dl
        variants={REVEAL_ITEM}
        className="mt-10 flex flex-wrap items-center gap-2"
      >
        {study.product && (
            <MetadataPill icon={<Carrot className="size-3.5" />} label="Product" value={study.product} />
        )}
        {study.role && (
          <MetadataPill icon={<User className="size-3.5" />} label="Role" value={study.role} />
        )}
        {study.team && (
          <MetadataPill icon={<Users className="size-3.5" />} label="Team" value={study.team} />
        )}
        {study.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600"
          >
            {tag}
          </span>
        ))}
      </motion.dl>
    </motion.header>
  );
}

function MetadataPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 shadow-sm">
      <span className="text-zinc-500" aria-hidden="true">
        {icon}
      </span>
      <span className="font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </span>
      <span className="text-zinc-900">{value}</span>
    </span>
  );
}

function OverviewSection({ study }: { study: CaseStudy }) {
  return (
    <motion.section
      variants={REVEAL_CONTAINER}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="mt-12 border-t border-zinc-200/80 pt-12"
      aria-label="Overview"
    >
      <motion.h2
        variants={REVEAL_ITEM}
        className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500"
      >
        Overview
      </motion.h2>
      {study.overview ? (
        <motion.p
          variants={REVEAL_ITEM}
          className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-zinc-800 sm:text-xl"
        >
          {study.overview}
        </motion.p>
      ) : (
        <ComingSoon />
      )}
    </motion.section>
  );
}

// Side-by-side problem/solution cards on desktop, stacked on mobile. Each
// card has a colored top stripe keyed to the project's accent for visual
// continuity. If either side is missing, the grid collapses to a single
// column with a fallback card on the empty side.
function ProblemSolutionSection({ study }: { study: CaseStudy }) {
  const hasChallenge = Boolean(study.challenge);
  const hasSolution = Boolean(study.solution);

  // If neither side has content, render a single fallback.
  if (!hasChallenge && !hasSolution) {
    return (
      <section className="mt-16" aria-label="Problem and solution">
        <ComingSoon />
      </section>
    );
  }

  return (
    <motion.section
      variants={REVEAL_CONTAINER}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2"
      aria-label="Problem and solution"
    >
      {hasChallenge ? (
        <motion.article
          variants={REVEAL_ITEM}
          className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1"
            style={{ backgroundColor: study.accentColor }}
          />
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            The Challenge
          </h3>
          <p className="mt-3 text-pretty text-base leading-relaxed text-zinc-800 sm:text-lg">
            {study.challenge}
          </p>
        </motion.article>
      ) : (
        <ComingSoon />
      )}

      {hasSolution ? (
        <motion.article
          variants={REVEAL_ITEM}
          className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1"
            style={{ backgroundColor: study.accentColor, opacity: 0.6 }}
          />
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            The Solution
          </h3>
          <p className="mt-3 text-pretty text-base leading-relaxed text-zinc-800 sm:text-lg">
            {study.solution}
          </p>
        </motion.article>
      ) : (
        <ComingSoon />
      )}
    </motion.section>
  );
}

// Row of stat tiles. Each tile rises and fades in on scroll, staggered.
// Renders a fallback when no impact metrics are provided (secondary
// projects).
function ImpactSection({
  impact,
  accentColor,
}: {
  impact: readonly ImpactMetric[] | undefined;
  accentColor: string;
}) {
  if (!impact || impact.length === 0) {
    return (
      <section className="mt-16" aria-label="Impact">
        <ComingSoon />
      </section>
    );
  }

  return (
    <motion.section
      variants={REVEAL_CONTAINER}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="mt-16"
      aria-label="Impact"
    >
      <motion.h2
        variants={REVEAL_ITEM}
        className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500"
      >
        The Impact
      </motion.h2>
      <motion.ul
        variants={REVEAL_ITEM}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {impact.map((metric) => (
          <ImpactTile key={metric.label} metric={metric} accentColor={accentColor} />
        ))}
      </motion.ul>
    </motion.section>
  );
}

// Fallback card for sections whose long-form content hasn't been written
// yet (secondary-tier projects). Matches the visual language of the
// real cards — border, padding, subtle border highlight — so the page
// still feels intentional.
function ComingSoon() {
  return (
    <motion.div
      variants={REVEAL_ITEM}
      className="rounded-2xl border border-dashed border-zinc-200/80 bg-white/60 p-6 sm:p-8"
    >
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Coming Soon
      </h3>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-zinc-600 sm:text-base">
        A longer writeup of this project is in progress. In the meantime,
        the listing card above captures the highlights.
      </p>
    </motion.div>
  );
}

function ImpactTile({
  metric,
  accentColor,
}: {
  metric: ImpactMetric;
  accentColor: string;
}) {
  return (
    <li
      className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm"
      style={{
        background: `linear-gradient(160deg, ${accentColor}10 0%, transparent 70%)`,
      }}
    >
      <span
        className="block text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl"
        style={{ color: accentColor }}
      >
        {metric.value}
      </span>
      <span className="mt-2 block text-sm text-zinc-600">{metric.label}</span>
    </li>
  );
}

// Three stylized mockups: a hero device, a side detail, and a wide
// composition. Each is faux-chrome with the project's accent gradient.
function MockupGallery({ study }: { study: CaseStudy }) {
  return (
    <motion.section
      variants={REVEAL_CONTAINER}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="mt-16"
      aria-label="Visual mockups"
    >
      <motion.h2
        variants={REVEAL_ITEM}
        className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500"
      >
        Visual Direction
      </motion.h2>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <motion.div variants={REVEAL_ITEM} className="md:col-span-2">
          <MockupCard
            aspect="16/10"
            title={study.title}
            accentColor={study.accentColor}
            variant="hero"
          />
        </motion.div>
        <motion.div variants={REVEAL_ITEM}>
          <MockupCard
            aspect="4/5"
            title={study.title}
            accentColor={study.accentColor}
            variant="detail"
          />
        </motion.div>
        <motion.div variants={REVEAL_ITEM} className="md:col-span-3">
          <MockupCard
            aspect="21/9"
            title={study.title}
            accentColor={study.accentColor}
            variant="wide"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}

function MockupCard({
  aspect,
  title,
  accentColor,
  variant,
}: {
  aspect: "16/10" | "4/5" | "21/9";
  title: string;
  accentColor: string;
  variant: "hero" | "detail" | "wide";
}) {
  const aspectClass =
    aspect === "16/10" ? "aspect-[16/10]" : aspect === "4/5" ? "aspect-[4/5]" : "aspect-[21/9]";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm ${aspectClass}`}
      style={{
        background: `linear-gradient(135deg, ${accentColor}1a 0%, ${accentColor}05 60%, transparent 100%)`,
      }}
    >
      {/* Faux browser chrome. */}
      <div className="flex items-center gap-1.5 border-b border-zinc-200/80 bg-zinc-50 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" aria-hidden="true" />
        <span className="ms-3 font-mono text-[10px] text-zinc-500">
          {slugify(title)}.app / {variant}
        </span>
      </div>

      {/* Body: grid texture + monogram. The grid pattern reuses the
          existing thumbnail treatment from CaseStudiesSection. */}
      <div className="relative h-[calc(100%-32px)] w-full">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <span
            className="text-5xl font-semibold tracking-tighter sm:text-6xl"
            style={{ color: accentColor, opacity: 0.85 }}
            aria-hidden="true"
          >
            {monogram(title)}
          </span>
          <span className="mt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            {variant}
          </span>
        </div>
        <div
          aria-hidden="true"
          className="absolute right-3 top-3 h-2 w-2 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
}

// Footer card that points to the next case study. Uses the same card
// pattern as the listing so it reads as "the next one in the series".
function NextProject({
  current,
  next,
}: {
  current: CaseStudy;
  next: CaseStudy;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mt-24 border-t border-zinc-200/80 pt-12"
      aria-label="Next project"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Next Project
      </span>

      <motion.a
        href={`/case-studies/${next.slug}`}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className="group mt-6 flex flex-col gap-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-8"
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${next.accentColor}1a 0%, transparent 70%)`,
            }}
          >
            <span
              className="text-xl font-semibold tracking-tighter"
              style={{ color: next.accentColor }}
              aria-hidden="true"
            >
              {monogram(next.title)}
            </span>
          </div>
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: next.accentColor }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: next.accentColor }}
                aria-hidden="true"
              />
              {next.category}
            </span>
            <h3 className="mt-1 text-balance text-2xl font-semibold tracking-tight text-zinc-950">
              {next.title}
            </h3>
            <p className="mt-1 text-sm text-zinc-600">{next.summary}</p>
          </div>
        </div>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </motion.a>

      <div className="mt-6 text-xs text-zinc-500">
        You just read: <span className="text-zinc-700">{current.title}</span>
      </div>
    </motion.section>
  );
}

// Helpers ---------------------------------------------------------------------

function monogram(title: string): string {
  return title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Re-exported so the route file can import a single symbol.
export default CaseStudyView;
