import { BookPageInner } from "../components/BookPageInner";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { useBookPageTransform } from "../hooks/useBookPageTransform";
import { CornerOrnament } from "../svg/CornerOrnament";
import { SubtlePattern } from "../svg/SubtlePattern";
import { wedding } from "../data/wedding";

export function AyatSection() {
  const { ref, enabled, rotateY, shadowOpacity } = useBookPageTransform<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative snap-start overflow-hidden px-6 py-16"
      style={enabled ? { perspective: 1400 } : undefined}
    >
      <SubtlePattern className="absolute inset-0 -z-10 text-accent-gold opacity-[0.05]" />

      <BookPageInner enabled={enabled} rotateY={rotateY} shadowOpacity={shadowOpacity}>
        <RevealOnScroll>
          <div className="relative rounded-2xl border border-accent-gold/30 bg-surface/70 px-6 py-10">
            <CornerOrnament className="absolute top-0 left-0 h-10 w-10 text-accent-gold" />
            <CornerOrnament className="absolute top-0 right-0 h-10 w-10 -scale-x-100 text-accent-gold" />
            <CornerOrnament className="absolute bottom-0 left-0 h-10 w-10 -scale-y-100 text-accent-gold" />
            <CornerOrnament className="absolute bottom-0 right-0 h-10 w-10 -scale-x-100 -scale-y-100 text-accent-gold" />

            <p
              lang="ar"
              dir="rtl"
              className="font-arabic text-2xl leading-[2.2] text-text"
            >
              {wedding.ayat.arabic}
            </p>
            <p className="mt-6 font-sans text-sm italic leading-relaxed text-text-soft">
              &ldquo;{wedding.ayat.translationId}&rdquo;
            </p>
            <p className="mt-4 font-sans text-xs text-accent-gold">
              {wedding.ayat.source}
            </p>
          </div>
        </RevealOnScroll>
      </BookPageInner>
    </section>
  );
}
