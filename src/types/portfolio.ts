// Contract for the bilingual portfolio data file. The runtime import is cast
// to `PortfolioData` so any shape drift in the JSON fails the build.
import portfolioDataRaw from "@/data/portfolio-data.json";

export type Locale = "en" | "fa";
export type Direction = "ltr" | "rtl";

export interface SocialLinks {
  linkedin: string;
  dribbble: string;
  github: string;
  email: string;
}

export interface PersonalData {
  name: string;
  role: string;
  resumeUrl: string;
  social: SocialLinks;
}

export interface NavigationData {
  home: string;
  hero: string;
  works: string;
  projects: string;
  contact: string;
  resumeCta: string;
}

export interface HeroData {
  headline: string;
  subline: string;
  badges: readonly string[];
  primaryCta: string;
  secondaryCta: string;
}

export interface ImpactMetric {
  // The headline number or short string for the metric (e.g. "+34%").
  value: string;
  // A short descriptor below the value (e.g. "Checkout conversion").
  label: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  tags: readonly string[];
  coverImage: string;
  accentColor: string;
  // Long-form content used by the per-project route. Optional so
  // secondary-tier projects (lightweight "explorations") can ship with
  // listing-only fields. The detail page renders a fallback card when
  // these are missing.
  role?: string;
  product?: string;
  team?: string;
  timeline?: string;
  overview?: string;
  challenge?: string;
  solution?: string;
  impact?: readonly ImpactMetric[];
}

// Two-tier presentation of the case studies on the home page. The detail
// route at /case-studies/[slug] walks both lists; the listing section
// renders them as separate grids.
export interface CaseStudiesGroup {
  featuredTitle: string;
  secondaryTitle: string;
  featured: readonly CaseStudy[];
  secondary: readonly CaseStudy[];
}

export interface ContactData {
  heading: string;
  description: string;
  email: string;
  copyText: string;
  copiedText: string;
  location: string;
}

export interface FooterLink {
  label: string;
  // In-page anchor, e.g. "#hero".
  href: string;
}

export interface FooterContent {
  copyright: string;
  colophon: string;
  backToTop: string;
  quickLinks: readonly FooterLink[];
}

export interface PortfolioData {
  personal: Record<Locale, PersonalData>;
  navigation: Record<Locale, NavigationData>;
  hero: Record<Locale, HeroData>;
  caseStudies: Record<Locale, CaseStudiesGroup>;
  contact: Record<Locale, ContactData>;
  footer: Record<Locale, FooterContent>;
}

// Single typed entry point for runtime consumers. The `as PortfolioData`
// cast forces a structural check against the literal-typed JSON import.
export const portfolioData: PortfolioData = portfolioDataRaw as PortfolioData;
