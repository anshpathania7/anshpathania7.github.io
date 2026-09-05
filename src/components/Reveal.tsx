"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The house reveal: copy rises and settles as if the sheet were being set.
 * `stagger` turns a container into a staggered group — children should be
 * <RevealItem/>.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
  amount = 0.25,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function RevealGroup({
  children,
  className,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

const lineVariants: Variants = {
  hidden: { y: "108%", rotate: 3, opacity: 0 },
  show: { y: "0%", rotate: 0, opacity: 1 },
};

/**
 * Headline treatment: the line is clipped and swings up from below the
 * baseline, the way a plate drops into a press.
 *
 * The viewport trigger has to sit on the OUTER span, not on the moving one.
 * The inner span starts translated a full line below the clip box, so an
 * IntersectionObserver attached to it reports zero intersection forever — it
 * would be hidden because it is out of view and out of view because it is
 * hidden, and the headline would never appear. Observing the untransformed
 * wrapper and letting the variant cascade avoids that deadlock.
 */
export function LineReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={`block overflow-hidden ${className ?? ""}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.span
        className="block"
        variants={lineVariants}
        transition={{ duration: 0.95, delay, ease: EASE }}
        style={{ transformOrigin: "left bottom" }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
