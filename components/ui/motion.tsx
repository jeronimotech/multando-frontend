"use client";

import { ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";

interface MotionWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Fade in from opacity 0 to 1.
 */
export function FadeIn({ children, className, delay = 0 }: MotionWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide up from translateY(20px) + opacity 0 to final position.
 */
export function SlideUp({ children, className, delay = 0 }: MotionWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parent wrapper that staggers children by 0.1s delay.
 * Each direct child should be wrapped in a motion-aware component (FadeIn, SlideUp, etc.)
 * or use `staggerChildrenVariants` for automatic staggering.
 */
const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
}

export function StaggerChildren({ children, className }: StaggerChildrenProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

/**
 * Item to be used inside StaggerChildren for automatic stagger animation.
 */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
}

/**
 * AnimatePresence wrapper for route transitions.
 */
interface PageTransitionProps {
  children: ReactNode;
  /** A unique key for each page to trigger exit/enter animations */
  pageKey: string;
}

export function PageTransition({ children, pageKey }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
