import { ORNAMENT_SVG_PROPS } from "../tokens";

interface IconProps {
  className?: string;
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ORNAMENT_SVG_PROPS}>
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
    </svg>
  );
}
