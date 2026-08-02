import { motion } from "framer-motion";
import { wedding } from "../data/wedding";

// Natural decelerating ease for entrance reveals.
const ENTER_EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
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
    </section>
  );
}
