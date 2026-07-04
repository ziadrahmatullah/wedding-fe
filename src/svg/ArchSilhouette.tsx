import { ORNAMENT_SVG_PROPS } from "./tokens";

interface ArchSilhouetteProps {
  className?: string;
  animate?: boolean;
}

/** Stylized dome/arch outline used behind the Hero heading. */
export function ArchSilhouette({ className, animate = false }: ArchSilhouetteProps) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true" {...ORNAMENT_SVG_PROPS}>
      <path
        d="M20 190 V100 Q20 20 120 20 Q220 20 220 100 V190"
        pathLength={1}
        className={animate ? "arch-draw" : undefined}
      />
      <path
        d="M46 190 V104 Q46 44 120 44 Q194 44 194 104 V190"
        pathLength={1}
        opacity="0.55"
        className={animate ? "arch-draw" : undefined}
        style={animate ? { animationDelay: "0.3s" } : undefined}
      />
      <circle cx="120" cy="20" r="4" opacity="0.7" />
    </svg>
  );
}
