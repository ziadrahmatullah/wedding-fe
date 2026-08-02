import { motion, useReducedMotion } from "framer-motion";
import { wedding } from "../data/wedding";

// Natural decelerating ease for entrance reveals.
const ENTER_EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-svh snap-start items-center justify-center overflow-hidden">
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: ENTER_EASE }}
        src="/image1.png"
        alt={`Undangan pernikahan ${wedding.brideName} & ${wedding.groomName}`}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2, ease: ENTER_EASE }}
        className="absolute bottom-8 flex flex-col items-center gap-1 text-text-soft"
      >
        <span className="text-[11px] uppercase tracking-widest">Scroll</span>
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          &darr;
        </motion.span>
      </motion.div>
    </section>
  );
}
