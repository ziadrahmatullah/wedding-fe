import { BookPageInner } from "../components/BookPageInner";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { useBookPageTransform } from "../hooks/useBookPageTransform";
import { BackgroundBlobs } from "../svg/BackgroundBlobs";
import { FloralDivider } from "../svg/FloralDivider";
import { wedding } from "../data/wedding";
import { formatLongDateID } from "../lib/date";

export function EventDetail() {
  const dateLabel = formatLongDateID(wedding.weddingDateISO);
  const { ref, enabled, rotateY, shadowOpacity } = useBookPageTransform<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative snap-start overflow-hidden px-6 py-16"
      style={enabled ? { perspective: 1400 } : undefined}
    >
      <BackgroundBlobs variant="default" className="absolute inset-0 -z-10 h-full w-full" />

      <BookPageInner enabled={enabled} rotateY={rotateY} shadowOpacity={shadowOpacity}>
        <RevealOnScroll>
          <h2 className="text-center font-script text-2xl text-primary-dark">
            Detail Acara
          </h2>
          <FloralDivider className="mx-auto mt-3 w-32 text-accent-gold" />
        </RevealOnScroll>

        <div className="mt-8 flex flex-col gap-6">
          <RevealOnScroll delay={0.1}>
            <Card>
              <h3 className="font-script text-lg text-primary-dark">
                {wedding.akad.label}
              </h3>
              <p className="mt-1 text-sm text-text">
                {dateLabel} &middot; {wedding.akad.time} WIB
              </p>
              <p className="text-sm text-text-soft">{wedding.akad.floor}</p>
            </Card>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <Card>
              <h3 className="font-script text-lg text-primary-dark">
                {wedding.resepsi.label}
              </h3>
              <p className="mt-1 text-sm text-text">
                {dateLabel} &middot; {wedding.resepsi.time} WIB
              </p>
              <p className="text-sm text-text-soft">{wedding.resepsi.floor}</p>
            </Card>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <Card>
              <h3 className="font-script text-lg text-primary-dark">Lokasi</h3>
              <p className="mt-1 text-sm text-text">{wedding.venue.name}</p>
              <p className="text-sm text-text-soft">{wedding.venue.address}</p>
              <a
                href={wedding.venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block"
              >
                <Button variant="secondary" type="button">
                  Buka di Google Maps
                </Button>
              </a>
            </Card>
          </RevealOnScroll>
        </div>
      </BookPageInner>
    </section>
  );
}
