import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { MusicNoteIcon } from "../svg/icons/MusicNoteIcon";

export interface BackgroundMusicHandle {
  /** Starts playback; must be invoked synchronously from a user gesture. */
  play: () => void;
}

interface BackgroundMusicProps {
  /** Hides the toggle while the cover screen (also z-50) is still up. */
  visible: boolean;
}

/**
 * Renders the hidden <audio> element plus a floating toggle. It's mounted
 * for the whole app lifetime (not just once opened) so `play()` is already
 * wired up when the cover screen's "Buka Undangan" click fires — calling it
 * later (e.g. after the open animation) risks losing the user-gesture
 * context that autoplay policies require.
 */
export const BackgroundMusic = forwardRef<BackgroundMusicHandle, BackgroundMusicProps>(
  function BackgroundMusic({ visible }, ref) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);

    useImperativeHandle(ref, () => ({
      play() {
        audioRef.current
          ?.play()
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      },
    }));

    function toggle() {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) {
        audio
          .play()
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      } else {
        audio.pause();
        setPlaying(false);
      }
    }

    return (
      <>
        <audio ref={audioRef} src="/music.mp4" loop playsInline preload="auto" />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Jeda musik" : "Putar musik"}
          aria-hidden={!visible}
          tabIndex={visible ? 0 : -1}
          className={`fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:bg-primary-dark active:scale-95 ${
            visible ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <MusicNoteIcon
            className={`h-5 w-5 ${playing ? "animate-spin-slow" : "opacity-70"}`}
          />
        </button>
      </>
    );
  },
);
