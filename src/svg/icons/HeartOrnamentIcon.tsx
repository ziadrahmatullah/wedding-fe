import { ORNAMENT_SVG_PROPS } from "../tokens";

interface IconProps {
  className?: string;
}

export function HeartOrnamentIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 28 24" className={className} aria-hidden="true" {...ORNAMENT_SVG_PROPS}>
      <path d="M14 21 C6 15 2 11 2 7.5 C2 4 5 2 8 3.5 C10.5 4.7 14 8 14 8 C14 8 17.5 4.7 20 3.5 C23 2 26 4 26 7.5 C26 11 22 15 14 21 Z" />
    </svg>
  );
}
