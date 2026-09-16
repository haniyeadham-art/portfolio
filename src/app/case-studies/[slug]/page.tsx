// Dynamic case-study route. Statically generates one page per slug at
// build time. The default export is a thin server component that hands off
// to the client view in CaseStudyView.tsx for the actual rendering and
// animations.
//
// generateStaticParams() walks BOTH the featured and secondary tiers in
// the English locale — the slug strings are shared between locales by
// design, so a single pass covers every route we need.

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyView } from "@/components/home/CaseStudyView";
import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";
import { portfolioData } from "@/types/portfolio";

interface RouteParams {
  slug: string;
}

interface PageProps {
  params: Promise<RouteParams>;
}

// Flat slug list across both tiers. Used by generateStaticParams and
// the notFound check. Memoized at module scope so the file parses the
// English case-study list exactly once per build.
const ALL_SLUGS: readonly string[] = [
  ...portfolioData.caseStudies.en.featured.map((study) => study.slug),
  ...portfolioData.caseStudies.en.secondary.map((study) => study.slug),
];

export function generateStaticParams(): Array<{ slug: string }> {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = findStudy(slug);
  if (!study) {
    return { title: "Case study not found" };
  }
  return {
    title: `${study.title} — Adham Hesaraki`,
    description: study.summary,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;

  // The slug list is shared across locales, so checking the English tiers
  // is sufficient to know whether the build should emit a page here.
  if (!ALL_SLUGS.includes(slug)) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <CaseStudyView slug={slug} />
        <Footer />
      </main>
    </>
  );
}

// Resolve a study by slug across both tiers. Returns undefined if the
// slug doesn't match anything, which lets callers fall through to a
// notFound() or a generic metadata title.
function findStudy(slug: string) {
  const { featured, secondary } = portfolioData.caseStudies.en;
  return (
    featured.find((entry) => entry.slug === slug) ??
    secondary.find((entry) => entry.slug === slug)
  );
}
