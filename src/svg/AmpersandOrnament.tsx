import { ORNAMENT_SVG_PROPS } from "./tokens";

interface AmpersandOrnamentProps {
  className?: string;
}

/** Decorative stand-in for "&" between the couple's names — two linked rings. */
export function AmpersandOrnament({ className }: AmpersandOrnamentProps) {
  return (
    <svg viewBox="0 0 48 28" className={className} aria-hidden="true" {...ORNAMENT_SVG_PROPS}>
      <circle cx="18" cy="14" r="10" />
      <circle cx="30" cy="14" r="10" />
    </svg>
  );
}
