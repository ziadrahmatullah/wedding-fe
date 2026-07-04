import { ORNAMENT_SVG_PROPS } from "./tokens";

interface FloralDividerProps {
  className?: string;
}

/** Stylized botanical divider line for separating section content. */
export function FloralDivider({ className }: FloralDividerProps) {
  return (
    <svg viewBox="0 0 200 24" className={className} aria-hidden="true" {...ORNAMENT_SVG_PROPS}>
      <path d="M0 12 H70" opacity="0.6" />
      <path d="M130 12 H200" opacity="0.6" />
      <path d="M100 12 C94 4 84 4 82 12 C84 20 94 20 100 12 Z" />
      <path d="M100 12 C106 4 116 4 118 12 C116 20 106 20 100 12 Z" />
      <circle cx="100" cy="12" r="2.5" />
    </svg>
  );
}
