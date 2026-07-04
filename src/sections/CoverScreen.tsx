import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button";
import { ArchSilhouette } from "../svg/ArchSilhouette";
import { HeartOrnamentIcon } from "../svg/icons/HeartOrnamentIcon";
import { STROKE_WIDTH } from "../svg/tokens";
import { wedding } from "../data/wedding";

interface CoverScreenProps {
  onOpened: () => void;
}

type Phase = "closed" | "opening" | "hidden";

// Envelope canvas: 208x140 (~1.5:1, landscape like a real envelope).
const ENV_W = 208;
const ENV_H = 140;
const FLAP_H = 76;
const LETTER_W = ENV_W * 0.85;
const LETTER_H = ENV_H * 0.9;
// How far the letter rises out of the envelope; its lower edge stays inside
// the pocket so it reads as "pulled out", not teleported.
const LETTER_RISE = ENV_H * 0.72;

// Slight overshoot at the end — paper falling open, not a mechanical hinge.
const FLAP_EASE = [0.34, 1.56, 0.64, 1] as const;

/**
 * Opening choreography (t=0 is the button press):
 *   0.00-0.18  wax seal breaks (scale up + fade)
 *   0.12-0.67  flap folds back past vertical (rotateX -> -168deg); at ~0.30
 *              it crosses the fold line so its stacking drops behind the
 *              letter; envelope settles from its -2deg resting tilt
 *   0.45-1.10  letter slides up out of the envelope (spring), tilting
 *              slightly like a hand-pulled card, shadow deepening as it lifts
 *   1.25       cover starts its exit fade (overlapping the Hero behind it)
 */
export function CoverScreen({ onOpened }: CoverScreenProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [flapBehind, setFlapBehind] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(window.clearTimeout);
  }, []);

  function handleOpen() {
    if (phase !== "closed") return;
    setPhase("opening");
    timersRef.current.push(
      window.setTimeout(() => setFlapBehind(true), 300),
      window.setTimeout(() => setPhase("hidden"), 1250),
    );
  }

  const opening = phase === "opening";

  return (
    <AnimatePresence onExitComplete={onOpened}>
      {phase !== "hidden" && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-bg px-8 text-center"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ArchSilhouette className="h-24 w-32 text-primary" />

          {/* Envelope. The letter travels well above it, so no overflow clipping here. */}
          <motion.div
            className="relative"
            style={{ width: ENV_W, height: ENV_H }}
            initial={{ rotate: -2 }}
            animate={opening ? { rotate: 0 } : { rotate: -2 }}
            transition={{ type: "spring", stiffness: 160, damping: 12, delay: 0.12 }}
          >
            {/* Layer 4a: ground shadow */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 -bottom-4 h-3 w-40 -translate-x-1/2 rounded-full bg-text/15 blur-md"
            />

            {/* Layer 1: envelope body (back) */}
            <div
              className="absolute inset-0 rounded-lg border border-accent-gold/50 bg-primary/10"
              style={{ borderWidth: STROKE_WIDTH }}
            />

            {/* Layer 2: the letter — tucked inside, rises out on open */}
            <motion.div
              className="absolute left-1/2 z-10 flex flex-col items-center gap-2 rounded-md bg-surface px-4 pt-4"
              style={{ width: LETTER_W, height: LETTER_H, top: 6, x: "-50%" }}
              animate={
                opening
                  ? {
                      y: -LETTER_RISE,
                      rotate: [0, -3, 2],
                      scale: 1,
                      boxShadow: "0 18px 30px -12px rgba(74, 46, 48, 0.35)",
                    }
                  : {
                      y: 0,
                      rotate: 0,
                      scale: 0.92,
                      boxShadow: "0 0 0 rgba(74, 46, 48, 0)",
                    }
              }
              transition={{
                delay: opening ? 0.45 : 0,
                y: { type: "spring", stiffness: 120, damping: 14 },
                scale: { type: "spring", stiffness: 120, damping: 14 },
                rotate: { duration: 0.6, times: [0, 0.5, 1], ease: "easeOut" },
                boxShadow: { duration: 0.5, ease: "easeOut" },
              }}
            >
              <HeartOrnamentIcon className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div className="h-1.5 w-3/4 rounded-full bg-text-soft/20" />
              <div className="h-1.5 w-2/3 rounded-full bg-text-soft/20" />
              <div className="h-1.5 w-1/2 rounded-full bg-text-soft/20" />
            </motion.div>

            {/* Layer 1b: envelope front face — fully occludes the tucked letter;
                side-fold creases mirror where the flap sat once it opens */}
            <div
              className="absolute inset-0 z-20 overflow-hidden rounded-lg border border-accent-gold/50"
              style={{ borderWidth: STROKE_WIDTH }}
            >
              <div className="absolute inset-0 bg-bg" />
              <div className="absolute inset-0 bg-primary/[0.07]" />
              <svg
                viewBox={`0 0 ${ENV_W} ${ENV_H}`}
                className="absolute inset-0 h-full w-full text-accent-gold/40"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE_WIDTH}
                strokeLinejoin="round"
              >
                <path d={`M0 2 L${ENV_W / 2} ${FLAP_H} L${ENV_W} 2`} />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-dark/[0.06]" />
            </div>

            {/* Layer 3: flap — plain div owns stacking (motion won't re-apply
                zIndex after mount), inner motion.div folds back from the crease */}
            <div
              className="absolute inset-x-0 top-0"
              style={{ height: FLAP_H, zIndex: flapBehind ? 5 : 30, perspective: 600 }}
              aria-hidden="true"
            >
              <motion.div
                className="h-full w-full"
                style={{ transformOrigin: "50% 0%" }}
                animate={opening ? { rotateX: -168 } : { rotateX: 0 }}
                transition={{ delay: 0.12, duration: 0.55, ease: FLAP_EASE }}
              >
                <svg viewBox={`0 0 ${ENV_W} ${FLAP_H}`} className="h-full w-full">
                  <path
                    d={`M1 1 L${ENV_W - 1} 1 L${ENV_W / 2} ${FLAP_H - 3} Z`}
                    fill="var(--color-bg)"
                    stroke="var(--color-accent-gold)"
                    strokeWidth={STROKE_WIDTH}
                    strokeLinejoin="round"
                  />
                  {/* inner-fold shading along the crease, sells the paper fold */}
                  <path
                    d={`M1 1 L${ENV_W - 1} 1 L${ENV_W / 2} ${FLAP_H - 3} Z`}
                    fill="var(--color-primary)"
                    opacity="0.12"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Wax seal at the flap tip — breaks just before the flap lifts */}
            <motion.div
              className="absolute left-1/2 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-sm"
              style={{ top: FLAP_H - 20, x: "-50%" }}
              animate={
                opening ? { scale: 1.3, opacity: 0 } : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <span className="font-display text-sm leading-none">
                {wedding.brideName[0]}&amp;{wedding.groomNickname[0]}
              </span>
            </motion.div>
          </motion.div>

          <div>
            <p className="font-display text-3xl text-primary-dark">
              {wedding.brideName} &amp; {wedding.groomNickname}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-text-soft">
              Undangan Pernikahan
            </p>
          </div>

          <Button type="button" onClick={handleOpen} disabled={opening}>
            Buka Undangan
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
