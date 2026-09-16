"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { PathCard as PathCardData } from "@/lib/paths/types";

export interface PathCardProps {
  path: PathCardData;
}

const MotionLink = motion.create(Link);

/**
 * Renders one selectable path. The whole card is a real anchor
 * (`<Link href={path.destination}>`), never a `div onClick`, so selection
 * works with a mouse, keyboard (Enter natively, Space via the handler
 * below), touch, and — without the animated transition — with JavaScript
 * disabled (FR-007, FR-009, FR-014, FR-023).
 *
 * No branch of this component is specific to any individual path — every
 * visual decision here is driven entirely by the `path` prop (FR-005).
 */
export function PathCard({ path }: PathCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // A native <a> only activates on Enter by default; FR-007 requires Space
  // to work too, matching button-like semantics layered onto a real link.
  function handleKeyDown(event: KeyboardEvent<HTMLAnchorElement>) {
    if (event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  return (
    <MotionLink
      href={path.destination}
      onKeyDown={handleKeyDown}
      aria-label={`${path.title}: ${path.description}`}
      className="group relative flex h-full min-h-[22rem] touch-manipulation flex-col justify-end overflow-hidden bg-forest text-cream outline-none focus-visible:ring-4 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
      whileHover={prefersReducedMotion ? undefined : { scale: 1.015 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
      whileFocus={prefersReducedMotion ? undefined : { scale: 1.015 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
    >
      {!imageFailed && path.image.src ? (
        <Image
          src={path.image.src}
          alt={path.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          onError={() => setImageFailed(true)}
        />
      ) : (
        // Shared branded fallback: no per-path fallback asset required (FR-021).
        // A tonal forest gradient, not an invented accent color — the
        // moodboard's flat UI palette is cream + forest only (research.md §7).
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-forest/60 via-forest/80 to-forest"
        />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent"
      />

      <div className="relative z-10 flex flex-col gap-2 p-6">
        <span
          data-testid="path-card-underline"
          className="h-0.5 w-16 origin-left scale-x-[0.625] bg-cream transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
        />
        <h2 className="font-display text-2xl tracking-wide2 text-cream sm:text-3xl">{path.title}</h2>
        <p className="max-w-prose text-sm text-cream/90 line-clamp-3 sm:text-base">{path.description}</p>
      </div>
    </MotionLink>
  );
}
