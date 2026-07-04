import type { ReactNode } from "react";
import { CornerOrnament } from "../svg/CornerOrnament";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={`relative rounded-2xl bg-surface p-6 shadow-[0_8px_24px_-12px_rgba(156,79,88,0.25)] ${className ?? ""}`}
    >
      <CornerOrnament className="absolute top-0 left-0 w-8 h-8 text-accent-gold" />
      <CornerOrnament className="absolute top-0 right-0 w-8 h-8 text-accent-gold -scale-x-100" />
      <CornerOrnament className="absolute bottom-0 left-0 w-8 h-8 text-accent-gold -scale-y-100" />
      <CornerOrnament className="absolute bottom-0 right-0 w-8 h-8 text-accent-gold -scale-x-100 -scale-y-100" />
      <div className="relative">{children}</div>
    </div>
  );
}
