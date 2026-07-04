import { ORNAMENT_SVG_PROPS } from "./tokens";

interface CornerOrnamentProps {
  className?: string;
}

/** Islamic 8-point star corner motif, meant to sit in a card/frame corner. */
export function CornerOrnament({ className }: CornerOrnamentProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true" {...ORNAMENT_SVG_PROPS}>
      <path d="M2 30 Q2 2 30 2" />
      <path d="M2 46 Q2 2 46 2" opacity="0.6" />
      <g transform="translate(14,14)">
        <path d="M0 8 L8 0 L16 8 L8 16 Z" />
        <path d="M8 0 L8 16 M0 8 L16 8" opacity="0.5" />
      </g>
    </svg>
  );
}
