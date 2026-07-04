import { ORNAMENT_SVG_PROPS, STROKE_WIDTH } from "./tokens";

interface SubtlePatternProps {
  className?: string;
  id?: string;
}

/** Low-opacity repeating geometric tile, used as a background watermark. */
export function SubtlePattern({ className, id = "subtle-pattern" }: SubtlePatternProps) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      data-ornament
    >
      <defs>
        <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M20 2 L38 20 L20 38 L2 20 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            strokeLinejoin={ORNAMENT_SVG_PROPS.strokeLinejoin}
          />
          <circle
            cx="20"
            cy="20"
            r="3"
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
