"use client";

// Secondary case studies. A 3-up grid of compact exploration cards
// rendered under the CaseStudiesSection. The shared SectionHeader,
// Thumbnail, and monogram helpers are imported from CaseStudiesSection
// so the visual treatment (accent-color monogram, grid texture, eyebrow
// pill) stays consistent across both tiers.

import { motion } from "framer-motion";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import type { CaseStudy } from "@/types/portfolio";

import {
  CARD_REVEAL,
  GRID_REVEAL,
  SectionHeader,
  Thumbnail,
} from "@/components/home/CaseStudiesSection";

export function OtherProjectsSection() {
  const { localized } = usePortfolioData();
  const { caseStudies, navigation } = localized;

  return (
    <section
      id="other-projects"
      aria-label={navigation.works}
      className="relative px-4 pb-24 sm:pb-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow={navigation.works}
          title={caseStudies.secondaryTitle}
        />

        {/* Secondary tier: 3-up grid (1/2/3 columns at sm/md/lg). */}
        <motion.ul
          variants={GRID_REVEAL}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {caseStudies.secondary.map((study) => (
            <motion.li key={study.id} variants={CARD_REVEAL}>
              <SecondaryCaseStudyCard study={study} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

// Compact card. No 3D tilt, no cursor glow, smaller monogram, no tag
// chips, no "View" footer — the whole card is the link. Hover lifts the
// card slightly and darkens its border.
function SecondaryCaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <motion.a
      href={`/case-studies/${study.slug}`}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className="group relative block overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-2.5 shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:ring-offset-2"
    >
      <Thumbnail
        study={study}
        aspect="4/3"
        monogramSize="sm"
      />

      <div className="px-1 pb-1 pt-3">
        {/* Category pill. */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: study.accentColor }}
          >
            <span
              className="h-1 w-1 rounded-full"
              style={{ backgroundColor: study.accentColor }}
              aria-hidden="true"
            />
            {study.category}
          </span>
        </div>

        {/* Title + summary (truncated to two lines for compactness). */}
        <h3 className="line-clamp-2 text-balance text-base font-semibold tracking-tight text-zinc-950">
          {study.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-pretty text-[13px] leading-relaxed text-zinc-600">
          {study.summary}
        </p>
      </div>
    </motion.a>
  );
}

// Re-exported so the page can render the section without importing the
// individual symbols.
export default OtherProjectsSection;
