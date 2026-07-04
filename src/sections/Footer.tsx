import { BookPageInner } from "../components/BookPageInner";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { useBookPageTransform } from "../hooks/useBookPageTransform";
import { BackgroundBlobs } from "../svg/BackgroundBlobs";
import { CrescentStar } from "../svg/CrescentStar";
import { FloralDivider } from "../svg/FloralDivider";
import { wedding } from "../data/wedding";

export function Footer() {
  const { ref, enabled, rotateY, shadowOpacity } = useBookPageTransform<HTMLElement>();

  return (
    <footer
      ref={ref}
      className="relative snap-start overflow-hidden px-6 pb-16 pt-10 text-center"
      style={enabled ? { perspective: 1400 } : undefined}
    >
      <BackgroundBlobs variant="calm" className="absolute inset-0 -z-10 h-full w-full" />

      <BookPageInner enabled={enabled} rotateY={rotateY} shadowOpacity={shadowOpacity}>
        <RevealOnScroll>
          <CrescentStar className="mx-auto h-6 w-6 text-accent-gold" />
          <FloralDivider className="mx-auto mt-4 w-32 text-accent-gold" />
          <p className="mt-6 font-script text-lg text-primary-dark">
            Jazakumullahu Khairan
          </p>
          <p className="mt-2 text-sm text-text-soft">
            Terima kasih atas doa dan kehadiran Bapak/Ibu/Saudara/i sekalian.
          </p>
          <p
            className="mt-6 font-display text-primary-dark"
            style={{ fontSize: "clamp(1.5rem, 8vw, 2rem)" }}
          >
            {wedding.displayNames}
          </p>
        </RevealOnScroll>
      </BookPageInner>
    </footer>
  );
}
