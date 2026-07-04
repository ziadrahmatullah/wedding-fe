import { useEffect, useRef } from "react";

interface AudioWaveformProps {
  bars: number[];
  active: boolean;
  className?: string;
}

const BAR_WIDTH = 3;
const BAR_GAP = 2;
const MIN_BAR_H = 4;

/**
 * Redraws the amplitude history as scrolling vertical bars every frame —
 * canvas instead of one DOM element per bar, since this repaints at up to
 * 60fps while recording.
 */
export function AudioWaveform({ bars, active, className }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Canvas can't read CSS custom properties directly — resolve the color
    // through a throwaway element instead.
    const barColor = active
      ? "var(--color-primary-dark)"
      : "color-mix(in srgb, var(--color-primary-dark) 55%, transparent)";
    const probe = document.createElement("span");
    probe.style.color = barColor;
    document.body.appendChild(probe);
    ctx.fillStyle = getComputedStyle(probe).color;
    probe.remove();

    const step = BAR_WIDTH + BAR_GAP;
    let x = width - BAR_WIDTH;
    for (let i = bars.length - 1; i >= 0 && x >= 0; i--) {
      const h = Math.max(bars[i] * height, MIN_BAR_H);
      const y = (height - h) / 2;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, BAR_WIDTH, h, BAR_WIDTH / 2);
      } else {
        ctx.rect(x, y, BAR_WIDTH, h);
      }
      ctx.fill();
      x -= step;
    }
  }, [bars, active]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: 56 }}
      aria-hidden="true"
    />
  );
}
