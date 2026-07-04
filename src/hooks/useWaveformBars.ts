import { useEffect, useRef, useState } from "react";

const MAX_BARS = 70;
const FREEZE_BARS = 24;

/**
 * Samples amplitude from a live MediaStream into a scrolling bar-height
 * history (newest on the right, oldest pushed out on the left) — the
 * classic voice-memo waveform look. `supported` flips to false when
 * AnalyserNode isn't available so the caller can fall back to a plain timer
 * indicator instead.
 */
export function useWaveformBars(stream: MediaStream | null, active: boolean) {
  const [bars, setBars] = useState<number[]>([]);
  const [supported, setSupported] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || !stream) return;

    const AudioCtx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) {
      queueMicrotask(() => setSupported(false));
      return;
    }

    let analyser: AnalyserNode;
    let dataArray: Uint8Array<ArrayBuffer>;
    try {
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      dataArray = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    } catch {
      queueMicrotask(() => setSupported(false));
      return;
    }

    function tick() {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const level = sum / dataArray.length / 255; // normalize 0-1
      setBars((prev) => {
        const next = [...prev, level];
        return next.length > MAX_BARS ? next.slice(next.length - MAX_BARS) : next;
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
      // Recording just stopped (deps changed away from active) — freeze a
      // short tail as a visual souvenir instead of clearing to blank.
      setBars((prev) => prev.slice(-FREEZE_BARS));
    };
  }, [stream, active]);

  function reset() {
    setBars([]);
  }

  return { bars, supported, reset };
}
