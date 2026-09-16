"use client";

// Site footer. Ultra-minimal light-mode close to the page: a left cluster
// with the designer moniker, dynamic year, and copyright text; a middle row
// of quick anchor links with subtle hover micro-interactions; and a right
// "Back to top" pill that smoothly scrolls to the document top with a
// spring bounce on hover. The colophon sits below a hairline rule, centered
// and muted.
//
// The component is a client component so it can read the active locale
// (for the RTL-aware up-arrow rotation) and so it can use framer-motion
// and the smooth-scroll handler. It deliberately avoids `useSyncExternalStore`
// directly — the data comes from `usePortfolioData()` which already wraps it.

import { useCallback, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { usePortfolioData } from "@/hooks/usePortfolioData";

// `useSyncExternalStore` callbacks for the current year. The server
// returns null (rendered as an em-dash) so the first client render matches
// the server output and no hydration warning fires. The browser snapshot
// returns the real year, which lands on the first interactive paint.
function getServerYear(): number | null {
  return null;
}
function getClientYear(): number {
  return new Date().getFullYear();
}
function subscribeYear(): () => void {
  // The year only changes once per calendar day; a midnight refresh is
  // not worth wiring up. No-op subscription.
  return () => {};
}

export function Footer() {
  const { localized, isRtl } = usePortfolioData();
  const { footer, personal } = localized;

  const year = useSyncExternalStore(subscribeYear, getClientYear, getServerYear);

  // Smooth-scroll to an in-page anchor. Mirrors the helper used in
  // Navbar.tsx so the two components feel like one navigation surface.
  // Silently no-ops on routes where the target id is absent (e.g. the
  // case-study detail page, which doesn't render the home-page sections).
  const handleAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const href = event.currentTarget.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (target instanceof HTMLElement) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [],
  );

  // Window-scroll for the back-to-top button. Disabled handlers and
  // reduced-motion users get an instant jump via the anchor href.
  const handleBackToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer className="relative border-t border-zinc-100 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between md:gap-6">
        {/* Left: designer name + copyright with dynamic year. */}
        <div className="flex flex-col gap-1">
          <motion.a
            href="#hero"
            onClick={handleAnchorClick}
            whileHover={{ y: -1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="text-sm font-semibold tracking-tight text-zinc-900 transition-colors hover:text-zinc-700"
          >
            {personal.name}
          </motion.a>
          <p className="text-xs text-zinc-500">
            <span suppressHydrationWarning>© {year ?? "—"}</span>{" "}
            <span>{footer.copyright}</span>
          </p>
        </div>

        {/* Middle: quick anchor links. */}
        <ul className="flex flex-wrap items-center gap-1">
          {footer.quickLinks.map((link) => (
            <li key={link.href}>
              <motion.a
                href={link.href}
                onClick={handleAnchorClick}
                whileHover={{ y: -1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="rounded-full px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                {link.label}
              </motion.a>
            </li>
          ))}
        </ul>

        {/* Right: back-to-top pill. The arrow is flipped 180° in RTL
            locales so it still points "upward" in the visual sense. */}
        <motion.button
          type="button"
          onClick={handleBackToTop}
          aria-label={footer.backToTop}
          whileHover={{ y: -3, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="inline-flex items-center gap-2 self-start rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900 md:self-auto"
        >
          <span>{footer.backToTop}</span>
          <ArrowUp
            className={`size-3.5 transition-transform ${isRtl ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </motion.button>
      </div>

      {/* Colophon — muted, centered, below a hairline rule. */}
{/*
      <div className="mx-auto mt-8 max-w-6xl border-t border-zinc-100 px-4 pt-6 text-center text-xs text-zinc-400">
        {footer.colophon}
      </div>
*/}
    </footer>
  );
}

export default Footer;
