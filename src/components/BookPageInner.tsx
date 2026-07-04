import { motion } from "framer-motion";
import type { MotionValue } from "framer-motion";
import type { ReactNode } from "react";

interface BookPageInnerProps {
  children: ReactNode;
  enabled: boolean;
  rotateY: MotionValue<number>;
  shadowOpacity: MotionValue<number>;
}

/** Wraps a section's foreground content with the page-turn transform, when enabled. */
export function BookPageInner({
  children,
  enabled,
  rotateY,
  shadowOpacity,
}: BookPageInnerProps) {
  if (!enabled) return <>{children}</>;

  return (
    <motion.div
      className="relative"
      style={{ rotateY, transformStyle: "preserve-3d", transformOrigin: "center" }}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/0 via-transparent to-black/25"
        style={{ opacity: shadowOpacity }}
      />
    </motion.div>
  );
}
