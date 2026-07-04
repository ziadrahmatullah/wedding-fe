import { MotionConfig } from "framer-motion";
import { useRef, useState } from "react";
import { AyatSection } from "./sections/AyatSection";
import { CoverScreen } from "./sections/CoverScreen";
import { Countdown } from "./sections/Countdown";
import { EventDetail } from "./sections/EventDetail";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { MempelaiSection } from "./sections/MempelaiSection";
import { RSVPSection } from "./sections/RSVPSection";
import { UcapanSection } from "./sections/UcapanSection";
import { ScrollContainerContext } from "./lib/scrollContainerContext";
import { SubtlePattern } from "./svg/SubtlePattern";

function App() {
  const [opened, setOpened] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative h-svh bg-primary-dark/5 sm:flex sm:justify-center sm:py-10">
        <div className="pointer-events-none absolute inset-0 hidden text-primary-dark/10 sm:block">
          <SubtlePattern />
        </div>

        {/*
          This is the actual scroll container (bounded height + overflow-y),
          not the outer wrapper — it also has overflow-hidden for the rounded
          corners at the sm: breakpoint, and CSS scroll-snap only applies to
          the nearest scroll-container ancestor of the sections, so
          scroll-snap-type has to live here rather than on <html>.
        */}
        <ScrollContainerContext.Provider value={scrollRef}>
          <div
            ref={scrollRef}
            className={`relative mx-auto h-full w-full max-w-[430px] scroll-smooth bg-bg shadow-none sm:rounded-[2.5rem] sm:shadow-2xl ${
              opened
                ? "snap-y snap-proximity overflow-y-auto overscroll-contain"
                : "overflow-hidden"
            }`}
          >
            <Hero />
            <MempelaiSection />
            <AyatSection />
            <EventDetail />
            <Countdown />
            <RSVPSection />
            <UcapanSection />
            <Footer />
          </div>
        </ScrollContainerContext.Provider>
      </div>

      {!opened && <CoverScreen onOpened={() => setOpened(true)} />}
    </MotionConfig>
  );
}

export default App;
