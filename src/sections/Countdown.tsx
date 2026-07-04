import { useEffect, useState } from "react";
import { BookPageInner } from "../components/BookPageInner";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { useBookPageTransform } from "../hooks/useBookPageTransform";
import { BackgroundBlobs } from "../svg/BackgroundBlobs";
import { FloralDivider } from "../svg/FloralDivider";
import { wedding } from "../data/wedding";

function getTimeLeft(targetISO: string) {
  const diff = Math.max(new Date(targetISO).getTime() - Date.now(), 0);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeLeft(wedding.countdownTargetISO),
  );
  const { ref, enabled, rotateY, shadowOpacity } = useBookPageTransform<HTMLElement>();

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(wedding.countdownTargetISO));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const units: Array<[string, number]> = [
    ["Hari", timeLeft.days],
    ["Jam", timeLeft.hours],
    ["Menit", timeLeft.minutes],
    ["Detik", timeLeft.seconds],
  ];

  return (
    <section
      ref={ref}
      className="relative snap-start overflow-hidden px-6 py-16 text-center"
      style={enabled ? { perspective: 1400 } : undefined}
    >
      <BackgroundBlobs variant="default" className="absolute inset-0 -z-10 h-full w-full" />

      <BookPageInner enabled={enabled} rotateY={rotateY} shadowOpacity={shadowOpacity}>
        <RevealOnScroll>
          <h2 className="font-script text-2xl text-primary-dark">
            Menuju Hari Bahagia
          </h2>
          <FloralDivider className="mx-auto mt-3 w-32 text-accent-gold" />
        </RevealOnScroll>
        <RevealOnScroll delay={0.15}>
          <div className="mt-8 grid grid-cols-4 gap-3">
            {units.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-surface py-4 shadow-sm">
                <div className="font-script text-3xl text-primary-dark">
                  {String(value).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wide text-text-soft">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </BookPageInner>
    </section>
  );
}
