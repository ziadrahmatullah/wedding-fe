import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useScrollContainerRef } from "../lib/scrollContainerContext";
import { useLowPerfDevice } from "./useLowPerfDevice";

/**
 * Scroll-linked "page turn" transform for a section: a subtle rotateY tilt as
 * the section enters/exits the viewport, plus a shadow sweep to sell the
 * paper-fold illusion. Disabled automatically for prefers-reduced-motion or
 * on devices that fail a quick frame-rate sample (see useLowPerfDevice) —
 * callers fall back to flat, untransformed content in that case.
 */
export function useBookPageTransform<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const containerRef = useScrollContainerRef();
  const reduceMotion = useReducedMotion();
  const lowPerf = useLowPerfDevice();
  const enabled = !reduceMotion && !lowPerf;

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef ?? undefined,
    offset: ["start end", "end start"],
  });

  const rotateY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [6, 0, 0, -6]);
  const shadowOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.18, 0, 0, 0.18],
  );

  return { ref, enabled, rotateY, shadowOpacity };
}
