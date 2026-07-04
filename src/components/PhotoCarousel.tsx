import { motion } from "framer-motion";
import { useRef, useState } from "react";
import type { ReactNode } from "react";

interface PhotoCarouselProps {
  count: number;
  renderItem: (index: number) => ReactNode;
  className?: string;
}

/**
 * Swipeable horizontal carousel, one full-size item per slide with a
 * position indicator ("2/5"). Snap-scroll driven — no drag gesture library
 * needed, native touch scrolling handles the swipe.
 */
export function PhotoCarousel({ count, renderItem, className }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const slideWidth = track.clientWidth;
    const next = Math.round(track.scrollLeft / slideWidth);
    setIndex(Math.min(Math.max(next, 0), count - 1));
  }

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  }

  if (count === 0) return null;

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="w-full shrink-0 snap-center px-1">
            {renderItem(i)}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="text-xs text-text-soft">
            {index + 1}/{count}
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: count }, (_, i) => (
              <motion.button
                key={i}
                type="button"
                aria-label={`Ke foto ${i + 1}`}
                onClick={() => goTo(i)}
                className="h-1.5 rounded-full bg-primary/30"
                animate={{ width: i === index ? 18 : 6, opacity: i === index ? 1 : 0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
