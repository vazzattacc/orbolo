"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps every route's content with an entrance transition keyed by pathname,
 * so moving from the selection screen into a path's destination reads as
 * progression rather than an abrupt page jump (FR-004). Gated by
 * prefers-reduced-motion (FR-017).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
