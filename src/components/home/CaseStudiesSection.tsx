"use client";

// Featured case studies. A 2-up grid of rich cards (3D tilt, cursor glow,
// 16:10 thumbnail, full metadata). The secondary "explorations" tier
// lives in OtherProjectsSection.tsx and reuses the SectionHeader,
// Thumbnail, and monogram helpers exported from this file.

import { useRef, useState, type MouseEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import type { CaseStudy } from "@/types/portfolio";

// Reveal schedule shared by every section on the page. Reused by
// OtherProjectsSection so the two tiers animate in lockstep.
export const SECTION_REVEAL = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
} as const;

export const SECTION_ITEM = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
} as const;

export const GRID_REVEAL = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
} as const;

export const CARD_REVEAL = {
  hidden: { y: 28, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
} as const;

export function CaseStudiesSection() {
  const { localized } = usePortfolioData();
  const { caseStudies, navigation } = localized;

  return (
    <section
      id="case-studies"
      aria-label={navigation.works}
      className="relative px-4 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* Top-level section header (uses the navigation label). */}
        <SectionHeader
          eyebrow={navigation.works}
          title={caseStudies.featuredTitle}
        />

        {/* Featured tier: 2-up grid. */}
        <FeaturedGrid studies={caseStudies.featured} />
      </div>
    </section>
  );
}

// Shared animated section header. The eyebrow is the navigation-level
// label ("Works" / "نمونه‌کارها"); the title is the tier title from the
// data file. Reused by OtherProjectsSection.
export function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <motion.header
      variants={SECTION_REVEAL}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="mb-10 flex flex-col items-start gap-2 sm:mb-12"
    >
      <motion.span
        variants={SECTION_ITEM}
        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" aria-hidden="true" />
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={SECTION_ITEM}
        className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl"
      >
        {title}
      </motion.h2>
    </motion.header>
  );
}

// Featured tier: 2-up desktop grid with the rich 3D-tilt card.
function FeaturedGrid({ studies }: { studies: readonly CaseStudy[] }) {
  return (
    <motion.ul
      variants={GRID_REVEAL}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      {studies.map((study) => (
        <motion.li key={study.id} variants={CARD_REVEAL}>
          <FeaturedCaseStudyCard study={study} />
        </motion.li>
      ))}
    </motion.ul>
  );
}

// Featured card: the existing 3D tilt + cursor glow + 16:10 thumbnail +
// category pill + tags + "View Case Study" footer. The whole card is a
// link, so a generous hit target wraps the surface.
function FeaturedCaseStudyCard({ study }: { study: CaseStudy }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse-relative coordinates drive the 3D tilt. Spring-damped so the
  // card settles into the cursor position rather than snapping to it.
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const tiltX = useSpring(useTransform(pointerY, [0, 1], [6, -6]), {
    stiffness: 220,
    damping: 20,
  });
  const tiltY = useSpring(useTransform(pointerX, [0, 1], [-6, 6]), {
    stiffness: 220,
    damping: 20,
  });

  // Accent-colored radial glow that follows the cursor across the card.
  const glowX = useTransform(pointerX, (value) => `${value * 100}%`);
  const glowY = useTransform(pointerY, (value) => `${value * 100}%`);
  const glowBackground = useMotionTemplate`radial-gradient(220px circle at ${glowX} ${glowY}, ${study.accentColor}33, transparent 70%)`;

  const handleMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
    setIsHovered(false);
  };

  return (
    <motion.a
      ref={cardRef}
      href={`/case-studies/${study.slug}`}
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleLeave}
      style={{
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className="group relative block rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-sm transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:ring-offset-2"
    >
      {/* Cursor-following accent glow. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glowBackground }}
      />

      {/* Static border glow that brightens on hover. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/5 transition-shadow duration-300 group-hover:ring-2 group-hover:ring-zinc-900/10"
      />

      <div className="relative" style={{ transform: "translateZ(20px)" }}>
        {/* High-aspect-ratio mock thumbnail. */}
        <Thumbnail
          study={study}
          isHovered={isHovered}
          aspect="16/10"
          monogramSize="lg"
        />

        <div className="px-2 pb-2 pt-5">
          {/* Category pill. */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-700"
              style={{ color: study.accentColor }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: study.accentColor }}
                aria-hidden="true"
              />
              {study.category}
            </span>
          </div>

          {/* Title + summary. */}
          <h3 className="text-balance text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
            {study.title}
          </h3>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-zinc-600">
            {study.summary}
          </p>

          {/* Tag chips. */}
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {study.tags.map((tag) => (
              <li key={tag}>
                <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                  {tag}
                </span>
              </li>
            ))}
          </ul>

          {/* View-case-study link. */}
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-900">
              View Case Study
            </span>
            <motion.span
              aria-hidden="true"
              animate={isHovered ? { x: 2, y: -2 } : { x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-white"
            >
              <ArrowUpRight className="size-3.5" />
            </motion.span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

// Mock thumbnail. Renders a soft gradient surface with a grid texture,
// the project monogram in the center, and a corner accent dot. The
// `aspect` and `monogramSize` props let the same primitive serve both
// the featured (16:10, large monogram) and secondary (4:3, small
// monogram) cards. Reused by OtherProjectsSection.
export function Thumbnail({
  study,
  isHovered = false,
  aspect,
  monogramSize,
}: {
  study: CaseStudy;
  isHovered?: boolean;
  aspect: "16/10" | "4/3";
  monogramSize: "sm" | "lg";
}) {
  const aspectClass = aspect === "16/10" ? "aspect-[16/10]" : "aspect-[4/3]";
  const monogramClass =
    monogramSize === "lg"
      ? "text-5xl sm:text-6xl"
      : "text-2xl sm:text-3xl";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg border border-zinc-200/80 ${aspectClass}`}
      style={{
        background: `linear-gradient(135deg, ${study.accentColor}1a 0%, ${study.accentColor}0a 60%, transparent 100%)`,
      }}
    >
      {/* Soft grid texture. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {/* Project monogram in the center. Scales subtly on hover. */}
      <motion.div
        aria-hidden="true"
        animate={isHovered ? { scale: 1.06 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span
          className={`font-semibold tracking-tighter ${monogramClass}`}
          style={{ color: study.accentColor, opacity: 0.85 }}
        >
          {monogram(study.title)}
        </span>
      </motion.div>

      {/* Corner accent. */}
      <div
        aria-hidden="true"
        className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: study.accentColor }}
      />
    </div>
  );
}

// Project monogram: first letter of each word, up to 3 chars, uppercase.
// Reused by OtherProjectsSection.
export function monogram(title: string): string {
  return title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

// Re-exported so the page can render the section without importing the
// individual symbols.
export default CaseStudiesSection;
