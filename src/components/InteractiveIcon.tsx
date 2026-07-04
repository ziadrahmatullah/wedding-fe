import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { ReactNode } from "react";

interface InteractiveIconProps {
  children: ReactNode;
  className?: string;
  /**
   * Idle floating is opt-in: only a couple of icons per viewport should
   * drift, the rest stay still so the hero doesn't feel busy.
   */
  float?: boolean;
  floatDelay?: number;
  floatDuration?: number;
  floatDistance?: number;
  rotateRange?: number;
}

const BURST_ANGLES = [0, 60, 120, 180, 240, 300];

// Springy scale for tap release: underdamped so it overshoots slightly
// instead of snapping straight back.
const TAP_SPRING = { type: "spring", stiffness: 300, damping: 10 } as const;

export function InteractiveIcon({
  children,
  className,
  float = false,
  floatDelay = 0,
  floatDuration = 6,
  floatDistance = 7,
  rotateRange = 5,
}: InteractiveIconProps) {
  const reduceMotion = useReducedMotion();
  const [bursting, setBursting] = useState(false);

  function handleTap() {
    if (bursting) return;
    setBursting(true);
    window.setTimeout(() => setBursting(false), 700);
  }

  const floating = float && !reduceMotion;

  return (
    <motion.button
      type="button"
      aria-hidden="true"
      tabIndex={-1}
      onClick={handleTap}
      className={`absolute cursor-pointer ${className ?? ""}`}
      animate={
        floating
          ? { y: [0, -floatDistance, 0], rotate: [0, rotateRange, 0] }
          : undefined
      }
      whileTap={{ scale: 0.85 }}
      transition={{
        y: {
          duration: floatDuration,
          delay: floatDelay,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          duration: floatDuration,
          delay: floatDelay,
          repeat: Infinity,
          ease: "easeInOut",
        },
        scale: TAP_SPRING,
      }}
    >
      {children}

      <AnimatePresence>
        {bursting && (
          <span className="pointer-events-none absolute inset-0">
            {BURST_ANGLES.map((angle) => (
              <motion.span
                key={angle}
                className="absolute top-1/2 left-1/2 block h-1.5 w-1.5 rounded-full bg-primary/70"
                initial={{ opacity: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  x: Math.cos((angle * Math.PI) / 180) * 20,
                  y: Math.sin((angle * Math.PI) / 180) * 20,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
