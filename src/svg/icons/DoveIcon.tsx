import { ORNAMENT_SVG_PROPS } from "../tokens";

interface IconProps {
  className?: string;
}

export function DoveIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...ORNAMENT_SVG_PROPS}>
      <path d="M6 18 C10 10 20 8 26 12 C22 12 19 14 17 17 C22 17 25 20 26 24 C21 21 15 21 12 24 C13 20 12 17 9 15 C8 16 7 17 6 18 Z" />
    </svg>
  );
}
