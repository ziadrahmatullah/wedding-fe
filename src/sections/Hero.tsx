import { motion, useReducedMotion } from "framer-motion";
import { InteractiveIcon } from "../components/InteractiveIcon";
import { AmpersandOrnament } from "../svg/AmpersandOrnament";
import { ArchSilhouette } from "../svg/ArchSilhouette";
import { BackgroundBlobs } from "../svg/BackgroundBlobs";
import { CoupleIllustration } from "../svg/CoupleIllustration";
import { CrescentStar } from "../svg/CrescentStar";
import { DoveIcon } from "../svg/icons/DoveIcon";
import { EnvelopeIcon } from "../svg/icons/EnvelopeIcon";
import { HeartOrnamentIcon } from "../svg/icons/HeartOrnamentIcon";
import { RingsIcon } from "../svg/icons/RingsIcon";
import { SparkleIcon } from "../svg/icons/SparkleIcon";
import { TinyFlowerIcon } from "../svg/icons/TinyFlowerIcon";
import { SubtlePattern } from "../svg/SubtlePattern";
import { wedding } from "../data/wedding";
import { formatLongDateID } from "../lib/date";

// Natural decelerating ease for entrance reveals.
const ENTER_EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-svh snap-start flex-col items-center justify-center overflow-hidden px-6 text-center">
      <BackgroundBlobs variant="rich" className="absolute inset-0 -z-10 h-full w-full" />
      <SubtlePattern className="absolute inset-0 -z-10 text-accent-gold opacity-[0.08]" />

      <div
        aria-hidden="true"
        className="absolute top-8 right-10 text-accent-gold/50"
      >
        <CrescentStar className="h-8 w-8" />
      </div>

      {/* Only three icons drift (varied durations); the rest sit still but stay tappable. */}
      <InteractiveIcon
        className="top-[8%] left-[10%] text-primary/70"
        float
        floatDuration={5.5}
        floatDistance={6}
        rotateRange={-4}
      >
        <RingsIcon className="h-8 w-8" />
      </InteractiveIcon>

      <InteractiveIcon className="top-[16%] right-[16%] text-accent-gold">
        <SparkleIcon className="h-5 w-5" />
      </InteractiveIcon>

      <InteractiveIcon className="top-[46%] left-[6%] text-primary/60">
        <TinyFlowerIcon className="h-7 w-7" />
      </InteractiveIcon>

      <InteractiveIcon
        className="top-[50%] right-[7%] text-accent-gold"
        float
        floatDelay={0.9}
        floatDuration={7}
        floatDistance={7}
        rotateRange={-5}
      >
        <EnvelopeIcon className="h-8 w-8" />
      </InteractiveIcon>

      <InteractiveIcon className="top-[68%] left-[11%] text-primary/60">
        <HeartOrnamentIcon className="h-7 w-7" />
      </InteractiveIcon>

      <InteractiveIcon
        className="top-[63%] right-[11%] text-primary/60"
        float
        floatDelay={1.7}
        floatDuration={8.5}
        floatDistance={8}
        rotateRange={4}
      >
        <DoveIcon className="h-8 w-8" />
      </InteractiveIcon>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: ENTER_EASE }}
        className="relative mx-auto flex h-40 w-48 items-end justify-center"
      >
        <ArchSilhouette className="absolute inset-0 h-full w-full text-primary" animate />
        <CoupleIllustration className="relative h-32 w-auto text-primary-dark/80" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2, ease: ENTER_EASE }}
        className="mt-6 font-sans text-xs uppercase tracking-[0.3em] text-text-soft"
      >
        Walimatul &apos;Ursy
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.4, ease: ENTER_EASE }}
        className="mt-3 flex flex-col items-center gap-1"
      >
        <span
          className="font-display leading-tight text-primary-dark"
          style={{ fontSize: "clamp(2.25rem, 12vw, 3.5rem)" }}
        >
          {wedding.brideName}
        </span>
        <AmpersandOrnament className="h-6 w-10 text-accent-gold" />
        <span
          className="font-display leading-tight text-primary-dark"
          style={{ fontSize: "clamp(1.75rem, 9vw, 3rem)" }}
        >
          {wedding.groomName}
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6, ease: ENTER_EASE }}
        className="mt-2 font-sans text-sm text-text-soft"
      >
        {formatLongDateID(wedding.weddingDateISO)}
      </motion.p>

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
