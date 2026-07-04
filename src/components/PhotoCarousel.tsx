import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface PhotoCarouselProps {
  count: number;
  renderItem: (index: number) => ReactNode;
  className?: string;
}

/**
 * Swipeable horizontal carousel. Slides are ~88% width with a visible gap so
 * neighboring photos peek in from the edges — that peek is what actually
 * teaches users "this scrolls", far more than the dot row does on its own.
 * Snap-scroll driven (native touch scrolling), with an IntersectionObserver
 * tracking which slide is centered rather than hand-rolled scrollLeft math,
 * since that math gets fragile once slides aren't full-width.
 */
export function PhotoCarousel({ count, renderItem, className }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasNudgedRef = useRef(false);
  const nudgeControls = useAnimation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || count === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const i = Number((entry.target as HTMLElement).dataset.index);
            setIndex(i);
          }
        }
      },
      { root: track, threshold: [0.6] },
    );
    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  // One-time "nudge" the first time a multi-photo carousel appears — a
  // brief shift-and-return that hints "this scrolls" without any text.
  useEffect(() => {
    if (count > 1 && !hasNudgedRef.current && !reduceMotion) {
      hasNudgedRef.current = true;
      void nudgeControls.start({
        x: [0, -34, 0],
        transition: { duration: 0.7, ease: "easeInOut" },
      });
    }
  }, [count, nudgeControls, reduceMotion]);

  function goTo(i: number) {
    slideRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  if (count === 0) return null;

  return (
    <div className={className}>
      <motion.div
        ref={trackRef}
        animate={nudgeControls}
        className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-smooth px-[6%] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            data-index={i}
            className="w-[88%] shrink-0 snap-center"
          >
            {renderItem(i)}
          </div>
        ))}
      </motion.div>

      {count > 1 && (
        <div className="mt-3 flex flex-col items-center gap-2">
          <p className="text-xs text-text-soft">Geser untuk lihat foto lainnya &rarr;</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-soft">
              {index + 1}/{count}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: count }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ke foto ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                    i === index ? "bg-primary" : "bg-text-soft/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
