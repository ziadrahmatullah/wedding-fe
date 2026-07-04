import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { Area } from "react-easy-crop";
import { AudioWaveform } from "../components/AudioWaveform";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PhotoCarousel } from "../components/PhotoCarousel";
import { PhotoCropModal } from "../components/PhotoCropModal";
import { SinglePhotoFrame } from "../components/SinglePhotoFrame";
import { Toast } from "../components/Toast";
import { MAX_RECORDING_SECONDS, useAudioRecorder } from "../hooks/useAudioRecorder";
import { useWaveformBars } from "../hooks/useWaveformBars";
import { submitGuestbookMessage } from "../lib/api";
import { captureFrame, downloadBlob } from "../lib/exportFrame";
import { cropAndCompress, fileToDataUrl } from "../lib/image";
import type { CroppedPhoto } from "../lib/image";
import { FloralDivider } from "../svg/FloralDivider";
import { wedding } from "../data/wedding";
import type { GuestbookMessage } from "../types/api";

const MAX_PHOTOS = 5;
const MAX_MESSAGE_CHARS = 500;

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function shareUrlFor(id: number): string {
  return `${window.location.origin}/ucapan/lihat/${id}`;
}

export function GuestbookPage() {
  // --- photos ---
  const [photos, setPhotos] = useState<CroppedPhoto[]>([]);
  const [cropQueue, setCropQueue] = useState<string[]>([]);
  const [cropProcessing, setCropProcessing] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const frameRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  // --- form ---
  const [fromName, setFromName] = useState("");
  const [mode, setMode] = useState<"text" | "audio">("text");
  const [message, setMessage] = useState("");
  const recorder = useAudioRecorder();
  const waveform = useWaveformBars(recorder.stream, recorder.status === "recording");

  // --- submit ---
  const [phase, setPhase] = useState<"form" | "submitting" | "success">("form");
  const [progress, setProgress] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<GuestbookMessage | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const atPhotoLimit = photos.length + cropQueue.length >= MAX_PHOTOS;

  async function handleFilesSelected(e: ChangeEvent<HTMLInputElement>) {
    // Copy the FileList before resetting the input — it's a live collection,
    // and clearing .value (to allow re-selecting the same file) empties it.
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const remaining = MAX_PHOTOS - photos.length - cropQueue.length;
    if (remaining <= 0) {
      setUploadNotice("Maksimal 5 foto.");
      return;
    }
    const accepted = files.slice(0, remaining);
    setUploadNotice(
      files.length > remaining
        ? `Maksimal 5 foto — ${files.length - remaining} foto terakhir tidak ditambahkan.`
        : null,
    );

    try {
      const dataUrls = await Promise.all(accepted.map(fileToDataUrl));
      setCropQueue((q) => [...q, ...dataUrls]);
    } catch {
      setUploadNotice("Gagal membaca file foto. Coba pilih ulang.");
    }
  }

  async function handleCropConfirm(area: Area) {
    const src = cropQueue[0];
    if (!src) return;
    setCropProcessing(true);
    try {
      const photo = await cropAndCompress(src, area);
      setPhotos((p) => [...p, photo]);
      setCropQueue((q) => q.slice(1));
    } catch {
      setUploadNotice("Gagal memproses foto. Coba lagi.");
      setCropQueue((q) => q.slice(1));
    } finally {
      setCropProcessing(false);
    }
  }

  function removePhoto(id: string) {
    setPhotos((p) => p.filter((photo) => photo.id !== id));
    setUploadNotice(null);
  }

  async function handleSubmit() {
    setFormError(null);

    if (!fromName.trim()) {
      setFormError("Nama pengirim (From) wajib diisi.");
      return;
    }
    const hasText = mode === "text" && message.trim().length > 0;
    const hasAudio = mode === "audio" && recorder.audioBlob !== null;
    if (photos.length === 0 && !hasText && !hasAudio) {
      setFormError("Isi minimal salah satu: foto, ucapan teks, atau rekaman suara.");
      return;
    }

    setPhase("submitting");
    setProgress(0);
    try {
      const res = await submitGuestbookMessage(
        {
          fullname: fromName.trim(),
          message: hasText ? message.trim() : undefined,
          voice: hasAudio ? (recorder.audioBlob ?? undefined) : undefined,
          images: photos.map((p) => p.blob),
        },
        setProgress,
      );
      setResult(res);
      setPhase("success");
    } catch (err) {
      let msg = "Gagal mengirim. Coba lagi ya — data kamu masih tersimpan.";
      if (axios.isAxiosError(err) && !err.response) {
        msg = "Gagal terhubung ke server. Periksa koneksi lalu coba lagi — data kamu masih tersimpan.";
      }
      setFormError(msg);
      setPhase("form");
    }
  }

  async function handleDownloadOne(photoId: string) {
    const node = frameRefs.current.get(photoId);
    if (!node) return;
    setDownloadingId(photoId);
    try {
      const blob = await captureFrame(node);
      const idx = photos.findIndex((p) => p.id === photoId);
      downloadBlob(blob, `kenangan-zainab-ziad-${idx + 1}.png`);
    } catch {
      setToastMsg("Gagal membuat gambar. Coba lagi.");
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDownloadAll() {
    setDownloadingAll(true);
    try {
      for (let i = 0; i < photos.length; i++) {
        const node = frameRefs.current.get(photos[i].id);
        if (!node) continue;
        const blob = await captureFrame(node);
        downloadBlob(blob, `kenangan-zainab-ziad-${i + 1}.png`);
        // small gap so the browser doesn't treat rapid downloads as a popup burst
        await new Promise((r) => setTimeout(r, 300));
      }
    } catch {
      setToastMsg("Gagal mengunduh sebagian foto. Coba lagi.");
    } finally {
      setDownloadingAll(false);
    }
  }

  async function handleShareLink() {
    if (!result) return;
    const url = shareUrlFor(result.id);
    const title = `Ucapan untuk ${wedding.displayNames}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the share sheet
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

  function resetAll() {
    setResult(null);
    setPhotos([]);
    setCropQueue([]);
    setFromName("");
    setMessage("");
    setMode("text");
    recorder.reset();
    waveform.reset();
    setFormError(null);
    setUploadNotice(null);
    setProgress(0);
    setPhase("form");
    window.scrollTo({ top: 0 });
  }

  const timerWarning = recorder.seconds >= MAX_RECORDING_SECONDS - 10;

  return (
    <div className="min-h-svh bg-primary-dark/5 sm:flex sm:justify-center sm:py-10">
      <div className="mx-auto min-h-svh w-full max-w-[430px] bg-bg px-6 py-10 sm:min-h-0 sm:rounded-[2.5rem] sm:shadow-2xl">
        <header className="text-center">
          <p className="font-display text-3xl text-primary-dark">
            {wedding.displayNames}
          </p>
          <h1 className="mt-2 font-script text-2xl text-primary">
            Bagikan Kenangan &amp; Ucapanmu
          </h1>
          <FloralDivider className="mx-auto mt-3 w-32 text-accent-gold" />
        </header>

        {phase === "success" && result ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col gap-5"
          >
            <p className="text-center text-sm text-text">
              Terima kasih, <span className="font-semibold">{result.fullname}</span>!
              Kenangan &amp; ucapanmu sudah terkirim.
            </p>

            {photos.length > 0 && (
              <>
                <PhotoCarousel
                  count={photos.length}
                  renderItem={(i) => {
                    const photo = photos[i];
                    return (
                      <div className="flex flex-col gap-3">
                        <SinglePhotoFrame
                          ref={(el) => {
                            if (el) frameRefs.current.set(photo.id, el);
                            else frameRefs.current.delete(photo.id);
                          }}
                          src={photo.dataUrl}
                        />
                        <Button
                          variant="secondary"
                          type="button"
                          className="w-full"
                          loading={downloadingId === photo.id}
                          onClick={() => void handleDownloadOne(photo.id)}
                        >
                          Download
                        </Button>
                      </div>
                    );
                  }}
                />

                {photos.length > 1 && (
                  <Button
                    variant="secondary"
                    type="button"
                    loading={downloadingAll}
                    onClick={() => void handleDownloadAll()}
                  >
                    Download Semua
                  </Button>
                )}
              </>
            )}

            <Button type="button" onClick={() => void handleShareLink()}>
              Share
            </Button>

            <Button type="button" variant="secondary" onClick={resetAll}>
              Kirim Ucapan Lagi
            </Button>
          </motion.div>
        ) : (
          <div className="mt-8 flex flex-col gap-6">
            {/* --- Upload foto --- */}
            <Card>
              <h2 className="font-script text-lg text-primary-dark">
                Foto Kenangan <span className="text-sm text-text-soft">(maks. 5)</span>
              </h2>
              <div className="mt-3 flex gap-3">
                <Button
                  variant="secondary"
                  type="button"
                  className="flex-1"
                  disabled={atPhotoLimit}
                  onClick={() => cameraInputRef.current?.click()}
                >
                  Ambil Foto
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  className="flex-1"
                  disabled={atPhotoLimit}
                  onClick={() => galleryInputRef.current?.click()}
                >
                  Pilih dari Galeri
                </Button>
              </div>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFilesSelected}
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
              />

              {uploadNotice && (
                <p className="mt-2 text-xs text-primary-dark">{uploadNotice}</p>
              )}

              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.dataUrl}
                        alt="Foto terpilih"
                        className="aspect-square w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        aria-label="Hapus foto"
                        className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-dark text-[11px] text-white"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* --- Preview bingkai (1 per foto) --- */}
            <AnimatePresence>
              {photos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <PhotoCarousel
                    count={photos.length}
                    renderItem={(i) => <SinglePhotoFrame src={photos[i].dataUrl} />}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* --- From --- */}
            <Card>
              <label className="flex flex-col gap-1 text-sm text-text">
                <span className="font-script text-lg text-primary-dark">From</span>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="Nama kamu"
                  className="rounded-lg border border-accent-gold/30 px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
            </Card>

            {/* --- Ucapan: teks / audio --- */}
            <Card>
              <div className="flex rounded-full border border-accent-gold/30 p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setMode("text")}
                  className={`flex-1 rounded-full py-2 transition-colors ${
                    mode === "text" ? "bg-primary text-white" : "text-text-soft"
                  }`}
                >
                  Tulis Ucapan
                </button>
                <button
                  type="button"
                  onClick={() => setMode("audio")}
                  className={`flex-1 rounded-full py-2 transition-colors ${
                    mode === "audio" ? "bg-primary text-white" : "text-text-soft"
                  }`}
                >
                  Rekam Suara
                </button>
              </div>

              {mode === "text" ? (
                <div className="mt-4">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_CHARS))}
                    rows={4}
                    placeholder="Tulis doa & ucapan terbaikmu untuk kedua mempelai..."
                    className="w-full rounded-lg border border-accent-gold/30 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <p className="mt-1 text-right text-xs text-text-soft">
                    {message.length}/{MAX_MESSAGE_CHARS}
                  </p>
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-center gap-3">
                  {recorder.error && (
                    <p className="text-center text-xs text-primary-dark">
                      {recorder.error}
                    </p>
                  )}

                  {recorder.status === "idle" && (
                    <Button type="button" onClick={() => void recorder.start()}>
                      Mulai Rekam
                    </Button>
                  )}

                  {recorder.status === "recording" && (
                    <>
                      {waveform.supported ? (
                        <AudioWaveform bars={waveform.bars} active className="w-full" />
                      ) : (
                        <motion.span
                          className="h-3 w-3 rounded-full bg-red-500"
                          animate={{ opacity: [1, 0.35, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        />
                      )}
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-2xl ${
                            timerWarning ? "text-red-600" : "text-text"
                          }`}
                        >
                          {formatTime(recorder.seconds)}
                        </span>
                        <span className="text-xs text-text-soft">
                          / {formatTime(MAX_RECORDING_SECONDS)}
                        </span>
                      </div>
                      <Button type="button" variant="secondary" onClick={recorder.stop}>
                        Stop
                      </Button>
                    </>
                  )}

                  {recorder.status === "recorded" && recorder.audioUrl && (
                    <>
                      {waveform.supported && waveform.bars.length > 0 && (
                        <AudioWaveform bars={waveform.bars} active={false} className="w-full" />
                      )}
                      <audio controls src={recorder.audioUrl} className="w-full" />
                      <div className="flex w-full gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          className="flex-1"
                          onClick={() => {
                            waveform.reset();
                            recorder.reset();
                          }}
                        >
                          Rekam Ulang
                        </Button>
                      </div>
                      <p className="text-xs text-text-soft">
                        Rekaman ini akan ikut terkirim saat kamu menekan Kirim.
                      </p>
                    </>
                  )}
                </div>
              )}
            </Card>

            {/* --- Submit --- */}
            {formError && (
              <p className="text-center text-sm text-primary-dark">{formError}</p>
            )}

            {phase === "submitting" && (
              <div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-primary/15">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1 text-center text-xs text-text-soft">
                  Mengunggah... {progress}%
                </p>
              </div>
            )}

            <Button
              type="button"
              loading={phase === "submitting"}
              onClick={() => void handleSubmit()}
            >
              Kirim
            </Button>
          </div>
        )}

        <PhotoCropModal
          key={cropQueue[0] ?? "empty"}
          imageSrc={cropQueue[0] ?? null}
          processing={cropProcessing}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropQueue((q) => q.slice(1))}
        />

        <Toast message={toastMsg} onDismiss={() => setToastMsg(null)} />
      </div>
    </div>
  );
}
