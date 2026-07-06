import { ORNAMENT_SVG_PROPS } from "../tokens";

interface IconProps {
  className?: string;
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...ORNAMENT_SVG_PROPS}>
      <path d="M12 4v10" />
      <path d="M7.5 10 L12 14.5 L16.5 10" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}
