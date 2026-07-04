import { ORNAMENT_SVG_PROPS } from "../tokens";

interface IconProps {
  className?: string;
}

export function RingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 24" className={className} aria-hidden="true" {...ORNAMENT_SVG_PROPS}>
      <circle cx="12" cy="13" r="8" />
      <circle cx="20" cy="13" r="8" />
    </svg>
  );
}
