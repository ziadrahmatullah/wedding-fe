import { ORNAMENT_COLORS } from "./tokens";

interface BackgroundBlobsProps {
  className?: string;
  variant?: "rich" | "default" | "calm";
}

const VARIANTS = {
  rich: [
    { cx: 60, cy: 60, r: 150, fill: ORNAMENT_COLORS.gold, opacity: 0.22 },
    { cx: 340, cy: 180, r: 170, fill: ORNAMENT_COLORS.rose, opacity: 0.16 },
    { cx: 120, cy: 520, r: 160, fill: ORNAMENT_COLORS.gold, opacity: 0.16 },
    { cx: 320, cy: 640, r: 130, fill: ORNAMENT_COLORS.rose, opacity: 0.12 },
  ],
  default: [
    { cx: 350, cy: 80, r: 140, fill: ORNAMENT_COLORS.gold, opacity: 0.14 },
    { cx: 60, cy: 420, r: 150, fill: ORNAMENT_COLORS.rose, opacity: 0.1 },
  ],
  calm: [{ cx: 215, cy: 300, r: 160, fill: ORNAMENT_COLORS.gold, opacity: 0.08 }],
} as const;

/**
 * Soft blurred organic shapes used as a background depth layer. Not tagged as
 * an ornament: it's a fill-based blur wash, exempt from the line-art rule.
 */
export function BackgroundBlobs({ className, variant = "default" }: BackgroundBlobsProps) {
  const blobs = VARIANTS[variant];

  return (
    <svg
      viewBox="0 0 430 700"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter id="bg-blob-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="55" />
        </filter>
      </defs>
      <g filter="url(#bg-blob-blur)">
        {blobs.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.fill} opacity={b.opacity} />
        ))}
      </g>
    </svg>
  );
}
