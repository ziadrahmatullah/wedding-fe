/**
 * Shared design tokens for every decorative SVG so the ornaments read as one
 * family. All ornaments are LINE-ART: outline only, no filled shapes (the
 * paper-cut couple silhouette is the single deliberate exception — it's an
 * illustration, not an ornament). Strokes render at a uniform on-screen width
 * via `vector-effect: non-scaling-stroke` (applied globally in index.css to
 * every `svg[data-ornament]`), so STROKE_WIDTH is the final pixel width
 * regardless of each SVG's viewBox scale.
 */
export const STROKE_WIDTH = 1.5;

/** Max two ornament colors, used via text-* classes or these vars directly. */
export const ORNAMENT_COLORS = {
  /** Dominant ornament color (dividers, corners, frames). */
  gold: "var(--color-accent-gold)",
  /** Secondary ornament color (accents, playful icons). */
  rose: "var(--color-primary)",
} as const;

/** Rounded-corner radius for rectangular ornament shapes (e.g. envelope). */
export const CORNER_RADIUS = 3;

/** Shared props for ornament <svg> roots: tags them for the global stroke rule. */
export const ORNAMENT_SVG_PROPS = {
  "data-ornament": true,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: STROKE_WIDTH,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
