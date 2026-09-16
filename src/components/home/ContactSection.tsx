"use client";

// Contact section. A single elevated card with a large headline, a one-click
// copy-email button (with a transient "Copied!" state), and a row of social
// links that respond with spring hover animations.

import { useCallback, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Mail, MapPin } from "lucide-react";

import { usePortfolioData } from "@/hooks/usePortfolioData";
import type { SocialLinks } from "@/types/portfolio";

// Brand glyphs. The current lucide-react build does not export the named
// brand icons, so we inline minimal SVG components here to keep the section
// self-contained. They inherit color from the surrounding text class.
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.22 0z" />
    </svg>
  );
}

function DribbbleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72" />
      <path d="M21.54 15.32c-4.93-1.4-9.05-1.36-13.74.42" />
      <path d="M2.86 11.32c4.55 1.5 8.27 1.85 13.07 1.13" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.05-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.61-5.49 5.91.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.22.7.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z"
      />
    </svg>
  );
}

// Section-level reveal schedule.
const SECTION_REVEAL = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
} as const;

const SECTION_ITEM = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
} as const;

export function ContactSection() {
  const { localized } = usePortfolioData();
  const { contact, personal } = localized;

  return (
    <section
      id="contact"
      aria-label={personal.role}
      className="relative px-4 pb-24 sm:pb-32"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={SECTION_REVEAL}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white px-6 py-12 shadow-sm sm:px-10 sm:py-16"
        >
          {/* Subtle ambient glow behind the card. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.18),transparent_70%)] blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(14,165,233,0.16),transparent_70%)] blur-2xl"
          />

          <div className="relative">
            <motion.span
              variants={SECTION_ITEM}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {contact.location}
            </motion.span>

            <motion.h2
              variants={SECTION_ITEM}
              className="mt-5 text-balance text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl"
            >
              {contact.heading}
            </motion.h2>

            <motion.p
              variants={SECTION_ITEM}
              className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-zinc-600 sm:text-lg"
            >
              {contact.description}
            </motion.p>

            {/* Copy-email + social row. */}
            <motion.div
              variants={SECTION_ITEM}
              className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <CopyEmailButton
                email={contact.email}
                copyText={contact.copyText}
                copiedText={contact.copiedText}
              />
              <SocialLinksRow social={personal.social} />
            </motion.div>

            {/* Location row. */}
            <motion.div
              variants={SECTION_ITEM}
              className="mt-8 flex items-center gap-2 text-sm text-zinc-500"
            >
              <MapPin className="size-3.5" aria-hidden="true" />
              <span>{contact.location}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// One-click copy-email button. Writes to the clipboard, then briefly shows
// a "Copied!" confirmation. Falls back to a hidden-textarea selection when
// the modern Clipboard API is unavailable (e.g. older browsers, insecure
// contexts).
function CopyEmailButton({
  email,
  copyText,
  copiedText,
}: {
  email: string;
  copyText: string;
  copiedText: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      } else if (typeof document !== "undefined") {
        // Fallback for environments without the async Clipboard API.
        const textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Swallow copy failures silently — the button still gives the user a
      // visible affordance to try again.
    }
  }, [email]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      className="group inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:ring-offset-2"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white transition-transform group-hover:scale-105">
        <AnimatePresence mode="wait" initial={false}>
          {isCopied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="size-4" aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Copy className="size-4" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="font-mono text-[13px] tracking-tight">{email}</span>
      <span
        aria-hidden="true"
        className="ml-1 inline-flex h-5 items-center rounded-full bg-zinc-100 px-2 text-[11px] font-medium uppercase tracking-wide text-zinc-600"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isCopied ? (
            <motion.span
              key="copied"
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-emerald-700"
            >
              {copiedText}
            </motion.span>
          ) : (
            <motion.span
              key="copy-label"
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {copyText}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}

// Horizontal row of social links. Each icon lifts and scales on hover via
// a spring; the corresponding label slides into view alongside.
function SocialLinksRow({ social }: { social: SocialLinks }) {
  return (
      <ul className="flex items-center gap-2">
        {social.email && <SocialLink
            href={`mailto:${social.email}`}
            label="Email"
            icon={<Mail className="size-4"/>}
        />}
        {social.linkedin && <SocialLink
            href={social.linkedin}
            label="LinkedIn"
            icon={<LinkedinIcon className="size-4"/>}
        />}
        {social.dribbble && <SocialLink
            href={social.dribbble}
            label="Dribbble"
            icon={<DribbbleIcon className="size-4"/>}
        />}
        {social.github && <SocialLink
            href={social.github}
            label="GitHub"
            icon={<GithubIcon className="size-4"/>}
        />}
      </ul>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <li>
      <motion.a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        aria-label={label}
        whileHover={{ y: -3, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
      >
        {icon}
      </motion.a>
    </li>
  );
}

export default ContactSection;
