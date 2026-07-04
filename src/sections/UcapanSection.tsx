import { BookPageInner } from "../components/BookPageInner";
import { Button } from "../components/Button";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { useBookPageTransform } from "../hooks/useBookPageTransform";
import { BackgroundBlobs } from "../svg/BackgroundBlobs";
import { FloralDivider } from "../svg/FloralDivider";
import { useRsvpMessages } from "../hooks/useRsvpMessages";
import { formatShortDateTimeID } from "../lib/date";

export function UcapanSection() {
  const { messages, hasMore, loading, loadingMore, error, loadOlder } =
    useRsvpMessages();
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
            Ucapan &amp; Doa
          </h2>
          <FloralDivider className="mx-auto mt-3 w-32 text-accent-gold" />
        </RevealOnScroll>

        <div className="mt-8">
          {loading ? (
            <p className="text-center text-sm text-text-soft">
              Memuat ucapan...
            </p>
          ) : messages.length === 0 ? (
            <p className="text-center text-sm text-text-soft">
              Belum ada ucapan. Jadilah yang pertama!
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {messages.map((m) => (
                <li
                  key={`${m.guest_id}-${m.created_at}`}
                  className="rounded-xl bg-surface p-4 shadow-sm"
                >
                  <span className="font-sans text-base font-semibold text-primary-dark">
                    {m.fullname}
                  </span>
                  {m.message && (
                    <p className="mt-1 text-sm text-text">{m.message}</p>
                  )}
                  <p className="mt-2 text-[11px] text-text-soft">
                    {formatShortDateTimeID(m.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {hasMore && (
            <div className="mt-4 text-center">
              <Button
                variant="secondary"
                type="button"
                loading={loadingMore}
                onClick={loadOlder}
              >
                Muat Ucapan Lebih Lama
              </Button>
            </div>
          )}

          {error && (
            <p className="mt-3 text-center text-xs text-primary-dark">
              {error}
            </p>
          )}
        </div>
      </BookPageInner>
    </section>
  );
}
