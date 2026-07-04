import { useEffect, useState } from "react";

const SAMPLE_FRAMES = 20;
const SLOW_FRAME_MS = 24; // ~40fps threshold

/**
 * Lightweight heuristic: samples a burst of animation frames right after mount
 * and flags the device as "low perf" if frames are consistently slow. Used to
 * auto-degrade heavier 3D scroll effects rather than assuming device capability
 * from user-agent sniffing.
 */
export function useLowPerfDevice(): boolean {
  const [lowPerf, setLowPerf] = useState(false);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let totalDelta = 0;
    let raf = 0;

    function tick(now: number) {
      const delta = now - last;
      last = now;
      if (frame > 0) totalDelta += delta;
      frame += 1;

      if (frame > SAMPLE_FRAMES) {
        const avg = totalDelta / (frame - 1);
        setLowPerf(avg > SLOW_FRAME_MS);
        return;
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return lowPerf;
}
