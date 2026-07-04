import { BookPageInner } from "../components/BookPageInner";
import { Card } from "../components/Card";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { useBookPageTransform } from "../hooks/useBookPageTransform";
import { BackgroundBlobs } from "../svg/BackgroundBlobs";
import { CoupleIllustration } from "../svg/CoupleIllustration";
import { FloralDivider } from "../svg/FloralDivider";
import { wedding } from "../data/wedding";

export function MempelaiSection() {
  const { ref, enabled, rotateY, shadowOpacity } = useBookPageTransform<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative snap-start overflow-hidden px-6 py-16"
      style={enabled ? { perspective: 1400 } : undefined}
    >
      <BackgroundBlobs variant="calm" className="absolute inset-0 -z-10 h-full w-full" />

      <BookPageInner enabled={enabled} rotateY={rotateY} shadowOpacity={shadowOpacity}>
        <RevealOnScroll>
          <h2 className="text-center font-script text-3xl text-primary-dark">
            Mempelai
          </h2>
          <FloralDivider className="mx-auto mt-3 w-32 text-accent-gold" />
        </RevealOnScroll>

        <RevealOnScroll delay={0.05}>
          <CoupleIllustration className="mx-auto mt-6 h-36 w-auto text-primary-dark/80" />
        </RevealOnScroll>

        <div className="mt-8 flex flex-col gap-6">
          {[wedding.mempelai.wanita, wedding.mempelai.pria].map((m) => (
            <RevealOnScroll key={m.nama} delay={0.1}>
              <Card className="text-center">
                <p className="font-display text-3xl text-primary-dark">
                  {m.nama}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-text-soft">
                  {m.anakKe}
                </p>
                <p className="mt-2 text-sm text-text">{m.ayah}</p>
                <p className="text-xs text-text-soft">&amp;</p>
                <p className="text-sm text-text">{m.ibu}</p>
              </Card>
            </RevealOnScroll>
          ))}
        </div>
      </BookPageInner>
    </section>
  );
}
