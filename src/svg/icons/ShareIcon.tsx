import { ORNAMENT_SVG_PROPS } from "../tokens";

interface IconProps {
  className?: string;
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ORNAMENT_SVG_PROPS}>
      <path d="M12 14V4" />
      <path d="M8 7.5 L12 3.5 L16 7.5" />
      <path d="M8.5 11H6a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-2.5" />
    </svg>
  );
}
