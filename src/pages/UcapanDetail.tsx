import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button";
import { PhotoCarousel } from "../components/PhotoCarousel";
import { SinglePhotoFrame } from "../components/SinglePhotoFrame";
import { Toast } from "../components/Toast";
import { fetchGuestbookMessageById } from "../lib/api";
import { captureFrame, downloadBlob } from "../lib/exportFrame";
import { FloralDivider } from "../svg/FloralDivider";
import { wedding } from "../data/wedding";
import type { GuestbookMessage } from "../types/api";

interface UcapanDetailProps {
  id: string;
}

type LoadState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; data: GuestbookMessage };

/**
 * Public page behind the share link — anyone with the URL can view this
 * single guestbook entry, no auth. Fetched fresh from the BE rather than
 * relying on any client state, since the link is meant to be shared/opened
 * by people who never touched the submit form.
 */
export function UcapanDetail({ id }: UcapanDetailProps) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [downloadingIdx, setDownloadingIdx] = useState<number | null>(null);
  const frameRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchGuestbookMessageById(id);
        if (!cancelled) setState({ kind: "ready", data });
      } catch {
        if (!cancelled) setState({ kind: "error" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleDownload(index: number) {
    const node = frameRefs.current.get(index);
    if (!node) return;
    setDownloadingIdx(index);
    try {
      const blob = await captureFrame(node);
      downloadBlob(blob, `kenangan-zainab-ziad-${index + 1}.png`);
    } catch {
      setToastMsg("Gagal membuat gambar. Coba lagi.");
    } finally {
      setDownloadingIdx(null);
    }
  }

  async function handleShare() {
    const url = window.location.href;
    const title = `Ucapan untuk ${wedding.displayNames}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // cancelled
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setToastMsg("Link disalin ke clipboard.");
    } catch {
      setToastMsg("Gagal menyalin link.");
    }
  }

  return (
    <div className="min-h-svh bg-primary-dark/5 sm:flex sm:justify-center sm:py-10">
      <div className="mx-auto min-h-svh w-full max-w-[430px] bg-bg px-6 py-10 sm:min-h-0 sm:rounded-[2.5rem] sm:shadow-2xl">
        <header className="text-center">
          <p className="font-display text-3xl text-primary-dark">
            {wedding.displayNames}
          </p>
          <h1 className="mt-2 font-script text-2xl text-primary">
            Ucapan &amp; Kenangan
          </h1>
          <FloralDivider className="mx-auto mt-3 w-32 text-accent-gold" />
        </header>

        {state.kind === "loading" && (
          <p className="mt-10 text-center text-sm text-text-soft">Memuat...</p>
        )}

        {state.kind === "error" && (
          <p className="mt-10 text-center text-sm text-primary-dark">
            Ucapan tidak ditemukan atau sudah tidak tersedia.
          </p>
        )}

        {state.kind === "ready" && (
          <div className="mt-8 flex flex-col gap-6">
            <div className="text-center">
              <p className="font-semibold text-text">{state.data.fullname}</p>
              {state.data.message && (
                <p className="mt-2 text-sm text-text">{state.data.message}</p>
              )}
              {state.data.voice_link && (
                <audio controls src={state.data.voice_link} className="mx-auto mt-3 w-full" />
              )}
            </div>

            {state.data.images.length > 0 && (
              <PhotoCarousel
                count={state.data.images.length}
                renderItem={(i) => (
                  <div className="flex flex-col gap-3">
                    <SinglePhotoFrame
                      ref={(el) => {
                        if (el) frameRefs.current.set(i, el);
                        else frameRefs.current.delete(i);
                      }}
                      src={state.data.images[i]}
                    />
                    <Button
                      variant="secondary"
                      type="button"
                      className="w-full"
                      loading={downloadingIdx === i}
                      onClick={() => void handleDownload(i)}
                    >
                      Download
                    </Button>
                  </div>
                )}
              />
            )}

            <Button type="button" onClick={() => void handleShare()}>
              Share
            </Button>
          </div>
        )}

        <Toast message={toastMsg} onDismiss={() => setToastMsg(null)} />
      </div>
    </div>
  );
}
