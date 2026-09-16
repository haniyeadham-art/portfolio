"use client";

// Unified hook that returns the active-locale portfolio data along with locale
// controls. Components should usually read from `localized`; `data` is the raw
// bilingual source for cases that legitimately need both locales (e.g. a
// language switcher preview).

import { useContext, useMemo } from "react";

import { LanguageContext } from "@/context/LanguageContext";
import { LOCALE_DIRECTION, type Direction, type Locale } from "@/lib/i18n";
import {
  portfolioData,
  type CaseStudiesGroup,
  type ContactData,
  type FooterContent,
  type HeroData,
  type NavigationData,
  type PersonalData,
  type PortfolioData,
} from "@/types/portfolio";

export interface LocalizedPortfolio {
  personal: PersonalData;
  navigation: NavigationData;
  hero: HeroData;
  caseStudies: CaseStudiesGroup;
  contact: ContactData;
  footer: FooterContent;
}

export interface UsePortfolioData {
  data: PortfolioData;
  localized: LocalizedPortfolio;
  locale: Locale;
  direction: Direction;
  isRtl: boolean;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
}

export function usePortfolioData(): UsePortfolioData {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("usePortfolioData must be used within a LanguageProvider");
  }

  const { locale, setLocale, toggleLocale } = ctx;
  const direction: Direction = LOCALE_DIRECTION[locale];

  return useMemo<UsePortfolioData>(
    () => ({
      data: portfolioData,
      localized: {
        personal: portfolioData.personal[locale],
        navigation: portfolioData.navigation[locale],
        hero: portfolioData.hero[locale],
        caseStudies: portfolioData.caseStudies[locale],
        contact: portfolioData.contact[locale],
        footer: portfolioData.footer[locale],
      },
      locale,
      direction,
      isRtl: direction === "rtl",
      setLocale,
      toggleLocale,
    }),
    [locale, direction, setLocale, toggleLocale],
  );
}
