"use client";

// Floating pill navigation. Sticks below the top edge, blurs the page behind
// it, and houses the designer name, in-page anchor links, a resume CTA, and
// the EN/FA language switch. The desktop layout collapses into a slide-down
// panel on small screens.

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import { usePortfolioData } from "@/hooks/usePortfolioData";

// Anchor targets used by the smooth-scroll links. The HeroSection renders
// with id="hero"; the placeholder sections in `page.tsx` carry the other two
// ids so the links land somewhere even before the case-study and contact
// sections are built.
const ANCHOR_LINKS = [
  { id: "/#hero", labelKey: "home" },
  { id: "/#case-studies", labelKey: "Case Studies" },
  { id: "/#other-projects", labelKey: "projects" },
  { id: "/#contact", labelKey: "contact" },
] as const;

export function Navbar() {
  const { localized, locale, setLocale } = usePortfolioData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLabel = (key: (typeof ANCHOR_LINKS)[number]["labelKey"]) => {
    if (key === "home") return localized.navigation.home;
    if (key === "Case Studies") return localized.navigation.works;
    if (key === "projects") return localized.navigation.projects;
    return localized.navigation.contact;
  };

  const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-4 z-50 px-4"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-zinc-200/80 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md sm:px-6"
      >
        {/* Designer name (left) with subtle hover micro-interaction. */}
        <motion.a
          href="/#hero"
          onClick={handleAnchorClick}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="text-sm font-semibold tracking-tight text-zinc-900 sm:text-base"
        >
          {localized.personal.name}
        </motion.a>

        {/* Center anchor links — hidden on mobile, visible from md up. */}
        <ul className="hidden items-center gap-1 md:flex">
          {ANCHOR_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`${link.id}`}
                onClick={handleAnchorClick}
                className="rounded-full px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                {navLabel(link.labelKey)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right cluster: language switch + resume CTA (desktop). */}
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitch locale={locale} setLocale={setLocale} />
          <a
            href={localized.personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "rounded-full",
            )}
          >
            <Download className="size-3.5" aria-hidden="true" />
            {localized.navigation.resumeCta}
          </a>
        </div>

        {/* Mobile menu trigger. */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-50 md:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMenuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="size-4" aria-hidden="true" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu className="size-4" aria-hidden="true" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile slide-down panel. */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mx-auto mt-2 max-w-6xl rounded-2xl border border-zinc-200/80 bg-white/90 p-3 shadow-sm backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {ANCHOR_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={handleAnchorClick}
                    className="block rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
                  >
                    {navLabel(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-zinc-200 pt-3">
              <LanguageSwitch locale={locale} setLocale={setLocale} />
              <a
                href={localized.personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "rounded-full",
                )}
              >
                <Download className="size-3.5" aria-hidden="true" />
                {localized.navigation.resumeCta}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// EN/FA pill switch. Uses a shared `layoutId` so the active background glides
// between the two options when the locale changes.
function LanguageSwitch({
  locale,
  setLocale,
}: {
  locale: "en" | "fa";
  setLocale: (next: "en" | "fa") => void;
}) {
  return (
    <LayoutGroup id="language-switch">
      <div
        role="group"
        aria-label="Language"
        className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 p-0.5 text-xs font-medium"
      >
        {(["en", "fa"] as const).map((code) => {
          const isActive = code === locale;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              aria-pressed={isActive}
              className="relative rounded-full px-2.5 py-1 text-zinc-600 transition-colors aria-pressed:text-zinc-900"
            >
              {isActive && (
                <motion.span
                  layoutId="language-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 uppercase tracking-wide">
                {code}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
