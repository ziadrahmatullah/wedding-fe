import { ORNAMENT_SVG_PROPS } from "../tokens";

interface IconProps {
  className?: string;
}

export function TinyFlowerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden="true" {...ORNAMENT_SVG_PROPS}>
      <circle cx="14" cy="8" r="4" />
      <circle cx="14" cy="20" r="4" />
      <circle cx="8" cy="14" r="4" />
      <circle cx="20" cy="14" r="4" />
      <circle cx="14" cy="14" r="2.5" />
    </svg>
  );
}
