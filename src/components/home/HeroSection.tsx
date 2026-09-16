"use client";

// Modern light-theme hero. Composes a dot/grid background, a subtle pastel
// gradient glow, a floating availability badge, a staggered typographic
// headline, the hero's data-driven skill badges, and a magnetic CTA that
// scrolls to the case studies section.

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { usePortfolioData } from "@/hooks/usePortfolioData";

// Stagger schedule for the headline / subline / CTA reveal. The `as const`
// keeps the cubic-bezier tuple as a tuple, which Framer Motion's `Easing`
// type requires (a bare `number[]` is too wide).
const REVEAL_CONTAINER = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
} as const;

const REVEAL_ITEM = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
} as const;

export function HeroSection() {
  const { localized } = usePortfolioData();
  const { hero, navigation } = localized;

  const handlePrimaryCta = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector("#case-studies");
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative isolate overflow-hidden px-4 pb-24 pt-16 sm:pt-24 h-screen"
    >
      {/* Background layers: dot grid + soft pastel glow. */}
      <BackgroundDecor />

      <motion.div
        variants={REVEAL_CONTAINER}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex max-w-5xl flex-col items-center text-center"
      >
        {/* Floating availability badge. */}
        <motion.div
          variants={REVEAL_ITEM}
          className="mb-8 inline-flex"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {hero.badges[0] ?? navigation.hero}
          </span>
        </motion.div>

        {/* Staggered typographic headline. */}
        <motion.h1
          variants={REVEAL_ITEM}
          className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl md:text-7xl"
        >
          {hero.headline}
        </motion.h1>

        <motion.p
          variants={REVEAL_ITEM}
          className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-zinc-600 sm:text-lg"
        >
          {hero.subline}
        </motion.p>

        {/* Hero pills: the rest of the badges from the data file. */}
        <motion.ul
          variants={REVEAL_ITEM}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {hero.badges.slice(1).map((label) => (
            <li key={label}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur">
                <Sparkles className="size-3 text-zinc-500" aria-hidden="true" />
                {label}
              </span>
            </li>
          ))}
        </motion.ul>

        {/* CTAs. Primary is magnetic; secondary is a static text link. */}
        <motion.div
          variants={REVEAL_ITEM}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticCta>
            <a
              href="#case-studies"
              onClick={handlePrimaryCta}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "rounded-full px-6",
              )}
            >
              {hero.primaryCta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </MagneticCta>
          <a
            href="#contact"
            onClick={(event) => {
              const target = document.querySelector("#contact");
              if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            {hero.secondaryCta} →
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Decorative background: a faint dot grid plus a softly animated pastel glow.
// Pure CSS via Tailwind; pointer events disabled so it never blocks clicks.
function BackgroundDecor() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[480px] w-[840px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.18),rgba(14,165,233,0.12)_45%,transparent_75%)] blur-2xl"
      />
    </>
  );
}

// Wraps a child element with a soft "magnetic" effect: the inner node drifts
// toward the cursor while it is hovering over the wrapper. The child handles
// its own click; the wrapper only provides the transform.
function MagneticCta({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  // Limit the maximum travel so the button never leaves the wrapper.
  const limit = 12;
  const tx = useTransform(springX, (value) => `${value}px`);
  const ty = useTransform(springY, (value) => `${value}px`);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = wrapperRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-limit, Math.min(limit, offsetX * 0.25)));
    y.set(Math.max(-limit, Math.min(limit, offsetY * 0.25)));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ display: "inline-block" }}
    >
      <motion.span style={{ x: tx, y: ty, display: "inline-block" }}>
        {children}
      </motion.span>
    </div>
  );
}
