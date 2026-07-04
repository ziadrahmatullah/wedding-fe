interface CoupleIllustrationProps {
  className?: string;
}

/**
 * Paper-cut style couple: two solid single-color silhouettes, no internal
 * detail. Left figure reads as a hijabi woman (head and veil as one smooth
 * teardrop flowing into a long gown); right as a man in a peci and long koko
 * robe. Deliberately minimal — generic shapes, not a portrait of anyone.
 * Color comes from the parent via currentColor (use a soft opacity like
 * text-primary-dark/80).
 */
export function CoupleIllustration({ className }: CoupleIllustrationProps) {
  return (
    <svg viewBox="0 0 200 230" className={className} aria-hidden="true">
      <g fill="currentColor">
        {/* Woman: hijab head merging into an A-line gown */}
        <path d="M62 18 C74 18 84 28 84 42 C84 50 81 56 76 61 C88 70 95 92 98 122 C101 155 101 185 99 210 C99 219 88 223 62 223 C36 223 25 219 25 210 C23 185 23 155 26 122 C29 92 36 70 48 61 C43 56 40 50 40 42 C40 28 50 18 62 18 Z" />
        {/* Man: peci and head as one form, straight long robe */}
        <path d="M142 20 C150 20 156 23 156 28 L156 40 C156 51 150 58 142 58 C134 58 128 51 128 40 L128 28 C128 23 134 20 142 20 Z" />
        <path d="M120 72 C126 65 133 62 142 62 C151 62 158 65 164 72 C170 82 174 100 176 128 C178 160 178 190 176 211 C176 220 164 224 142 224 C120 224 108 220 108 211 C106 190 106 160 108 128 C110 100 114 82 120 72 Z" />
      </g>
    </svg>
  );
}
