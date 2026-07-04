import { ORNAMENT_SVG_PROPS } from "./tokens";

interface CrescentStarProps {
  className?: string;
}

/** Minor accent: crescent moon + small star, outline only. Use sparingly. */
export function CrescentStar({ className }: CrescentStarProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" {...ORNAMENT_SVG_PROPS}>
      <path d="M20 4 A14 14 0 1 0 20 32 A11 11 0 1 1 20 4 Z" />
      <path d="M31 8 L32.5 11.5 L36 13 L32.5 14.5 L31 18 L29.5 14.5 L26 13 L29.5 11.5 Z" />
    </svg>
  );
}
