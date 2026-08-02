import { BookPageInner } from "../components/BookPageInner";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { useBookPageTransform } from "../hooks/useBookPageTransform";
import { wedding } from "../data/wedding";

export function MempelaiSection() {
  const { ref, enabled, rotateY, shadowOpacity } = useBookPageTransform<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative snap-start overflow-hidden"
      style={enabled ? { perspective: 1400 } : undefined}
    >
      <BookPageInner enabled={enabled} rotateY={rotateY} shadowOpacity={shadowOpacity}>
        <RevealOnScroll>
          <img
            src="/image2.png"
            alt={`Profil mempelai ${wedding.mempelai.wanita.nama} & ${wedding.mempelai.pria.nama}`}
            className="h-auto w-full object-cover"
          />
        </RevealOnScroll>
      </BookPageInner>
    </section>
  );
}
