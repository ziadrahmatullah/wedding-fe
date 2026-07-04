import { forwardRef } from "react";
import { CornerOrnament } from "../svg/CornerOrnament";
import { FloralDivider } from "../svg/FloralDivider";
import { wedding } from "../data/wedding";

interface SinglePhotoFrameProps {
  src: string;
  alt?: string;
  className?: string;
}

/**
 * One bordered frame per photo. Rendered with plain CSS/DOM (not canvas) so
 * that html-to-image can capture this exact node for download/share — the
 * export is guaranteed to look identical to what's on screen because it's
 * literally a screenshot of this element, not a redrawn approximation.
 */
export const SinglePhotoFrame = forwardRef<HTMLDivElement, SinglePhotoFrameProps>(
  function SinglePhotoFrame({ src, alt = "Foto kenangan", className }, ref) {
    return (
      <div
        ref={ref}
        className={`relative rounded-2xl border border-accent-gold/40 bg-surface p-4 ${className ?? ""}`}
      >
        <CornerOrnament className="absolute top-0 left-0 h-8 w-8 text-accent-gold" />
        <CornerOrnament className="absolute top-0 right-0 h-8 w-8 -scale-x-100 text-accent-gold" />
        <CornerOrnament className="absolute bottom-0 left-0 h-8 w-8 -scale-y-100 text-accent-gold" />
        <CornerOrnament className="absolute bottom-0 right-0 h-8 w-8 -scale-x-100 -scale-y-100 text-accent-gold" />

        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={src}
            alt={alt}
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
          />
        </div>

        <p className="mt-3 text-center font-display text-2xl text-primary-dark">
          {wedding.displayNames}
        </p>
        <FloralDivider className="mx-auto mt-1 w-28 text-accent-gold" />
        <p className="mt-2 text-center text-[11px] uppercase tracking-[0.25em] text-text-soft">
          Walimatul &apos;Ursy &middot; 16 Agustus 2026
        </p>
      </div>
    );
  },
);
