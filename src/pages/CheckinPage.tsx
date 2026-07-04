import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { readQrcode } from "../lib/api";
import { FloralDivider } from "../svg/FloralDivider";
import { wedding } from "../data/wedding";

type CheckinState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; fullname: string }
  | { kind: "error"; message: string };

const AUTO_RESET_MS = 3500;
const RESUBMIT_GUARD_MS = 500;
// Scanners fire every character within a few ms of each other, then go
// silent the instant the code ends. 180ms of silence is long enough that a
// slow human typist won't get cut off mid-word, but short enough that a
// scan feels instant.
const SILENCE_SUBMIT_MS = 180;

function CheckIcon() {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="h-20 w-20 text-emerald-600 sm:h-24 sm:w-24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <circle cx="32" cy="32" r="28" />
      <path d="M20 33 L28 41 L44 24" />
    </motion.svg>
  );
}

function CrossIcon() {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className="h-20 w-20 text-[#9c4444] sm:h-24 sm:w-24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      aria-hidden="true"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <circle cx="32" cy="32" r="28" />
      <path d="M23 23 L41 41 M41 23 L23 41" />
    </motion.svg>
  );
}

function QrIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-16 w-16 text-primary sm:h-20 sm:w-20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="6" y="6" width="14" height="14" rx="2" />
      <rect x="28" y="6" width="14" height="14" rx="2" />
      <rect x="6" y="28" width="14" height="14" rx="2" />
      <path d="M28 28 h6 v6 h-6 Z M38 28 h4 M42 34 v8 M28 38 v4 h6" />
    </svg>
  );
}

export function CheckinPage() {
  const [state, setState] = useState<CheckinState>({ kind: "idle" });
  const [buffer, setBuffer] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resetTimerRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const lastSubmitAtRef = useRef(0);
  const isLoadingRef = useRef(false);

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const backToIdle = useCallback(() => {
    clearResetTimer();
    setState({ kind: "idle" });
    inputRef.current?.focus();
  }, [clearResetTimer]);

  const scheduleReset = useCallback(() => {
    clearResetTimer();
    resetTimerRef.current = window.setTimeout(backToIdle, AUTO_RESET_MS);
  }, [backToIdle, clearResetTimer]);

  useEffect(() => {
    return () => {
      clearResetTimer();
      clearSilenceTimer();
    };
  }, [clearResetTimer, clearSilenceTimer]);

  const submit = useCallback(
    async (raw: string) => {
      const now = Date.now();
      if (now - lastSubmitAtRef.current < RESUBMIT_GUARD_MS) return;
      if (isLoadingRef.current) return;

      const qrcode = raw.trim();
      if (!qrcode) return; // silence fired on an empty/whitespace-only input — not a real scan

      lastSubmitAtRef.current = now;
      isLoadingRef.current = true;
      setBuffer("");
      clearResetTimer();
      clearSilenceTimer();

      setState({ kind: "loading" });
      try {
        const result = await readQrcode(qrcode);
        setState({ kind: "success", fullname: result.fullname });
      } catch (err) {
        let message =
          "Terjadi kendala saat memeriksa QR. Silakan coba lagi atau hubungi panitia di meja registrasi.";
        if (axios.isAxiosError(err)) {
          if (!err.response) {
            message =
              "Gagal terhubung ke server. Periksa koneksi internet, lalu coba scan ulang.";
          } else {
            const body = err.response.data as { message?: string } | undefined;
            message =
              body?.message ??
              "QR code tidak ditemukan atau sudah tidak berlaku. Silakan hubungi panitia di meja registrasi.";
          }
        }
        setState({ kind: "error", message });
      }
      isLoadingRef.current = false;
      scheduleReset();
      inputRef.current?.focus();
    },
    [clearResetTimer, clearSilenceTimer, scheduleReset],
  );

  function handleChange(value: string) {
    setBuffer(value);
    clearSilenceTimer();
    if (value.trim().length === 0) return;
    silenceTimerRef.current = window.setTimeout(() => {
      void submit(value);
    }, SILENCE_SUBMIT_MS);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      clearSilenceTimer();
      void submit(buffer);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center bg-bg px-6 py-10 text-text">
      <header className="text-center">
        <p
          className="font-display leading-tight text-primary-dark"
          style={{ fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)" }}
        >
          {wedding.displayNames}
        </p>
        <p className="mt-2 text-lg font-semibold uppercase tracking-[0.15em] text-primary sm:text-xl">
          Registrasi Kehadiran
        </p>
        <FloralDivider className="mx-auto mt-4 w-40 text-accent-gold" />
      </header>

      <main className="flex w-full max-w-2xl flex-1 items-center justify-center py-8">
        <AnimatePresence mode="wait">
          {state.kind === "idle" && (
            <motion.div
              key="idle"
              className="flex flex-col items-center gap-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <QrIcon />
              <h1 className="text-2xl font-medium text-primary-dark sm:text-3xl">
                Silakan scan QR undangan Anda
              </h1>
              <div className="flex items-center gap-2 text-sm text-text-soft">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>
                Siap menerima scan
              </div>
            </motion.div>
          )}

          {state.kind === "loading" && (
            <motion.div
              key="loading"
              className="flex flex-col items-center gap-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <svg
                className="h-16 w-16 animate-spin text-primary"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <p className="text-3xl text-text-soft">Memeriksa...</p>
            </motion.div>
          )}

          {state.kind === "success" && (
            <motion.div
              key="success"
              className="flex w-full flex-col items-center gap-4 rounded-3xl border-2 border-emerald-200 bg-emerald-50 px-8 py-12 text-center"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <CheckIcon />
              <p className="font-display text-4xl text-emerald-800 sm:text-5xl">
                Selamat Datang, {state.fullname} 🌸
              </p>
              <p className="max-w-md text-base text-emerald-700 sm:text-lg">
                Terima kasih telah hadir di pernikahan kami. Semoga Allah SWT
                senantiasa melimpahkan keberkahan untuk kita semua yang hadir
                di sini.
              </p>
              <p className="text-sm text-text-soft">
                Kehadiran Anda telah tercatat.
              </p>
              <button
                type="button"
                onClick={backToIdle}
                className="mt-2 rounded-full border border-emerald-300 px-5 py-2 text-sm text-emerald-700 hover:bg-emerald-100"
              >
                Scan Berikutnya
              </button>
            </motion.div>
          )}

          {state.kind === "error" && (
            <motion.div
              key="error"
              className="flex w-full flex-col items-center gap-4 rounded-3xl border-2 border-[#d9a8a8] bg-[#f9ecec] px-8 py-12 text-center"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <CrossIcon />
              <p className="font-display text-3xl text-[#7e3b3b] sm:text-4xl">
                Mohon Maaf 🙏
              </p>
              <p className="max-w-md text-base text-[#8a5252] sm:text-lg">
                {state.message}
              </p>
              <button
                type="button"
                onClick={backToIdle}
                className="mt-2 rounded-full border border-[#c99898] px-5 py-2 text-sm text-[#7e3b3b] hover:bg-[#f3dede]"
              >
                Scan Berikutnya
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-xl">
        <input
          ref={inputRef}
          autoFocus
          value={buffer}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            window.setTimeout(() => inputRef.current?.focus(), 100);
          }}
          placeholder="Scan QR di sini, atau ketik kode manual..."
          className="w-full rounded-full border border-accent-gold/40 bg-surface px-5 py-3 text-sm outline-none focus:border-primary"
          aria-label="Kode QR"
        />
        <p className="mt-2 text-center text-xs text-text-soft">
          Input selalu aktif — hasil scan diproses otomatis, tidak perlu klik apapun.
        </p>
      </footer>
    </div>
  );
}
