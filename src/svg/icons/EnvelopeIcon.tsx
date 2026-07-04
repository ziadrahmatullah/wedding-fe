import { CORNER_RADIUS, ORNAMENT_SVG_PROPS } from "../tokens";

interface IconProps {
  className?: string;
}

export function EnvelopeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 24" className={className} aria-hidden="true" {...ORNAMENT_SVG_PROPS}>
      <rect x="2" y="3" width="28" height="18" rx={CORNER_RADIUS} />
      <path d="M3 5 L16 15 L29 5" />
    </svg>
  );
}
