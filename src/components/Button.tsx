import { motion } from "framer-motion";
import type { ButtonHTMLAttributes } from "react";
import { Spinner } from "./Spinner";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>;

interface ButtonProps extends NativeButtonProps {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

const variants = {
  primary: "bg-primary text-white shadow-sm hover:bg-primary-dark",
  secondary:
    "bg-surface text-primary-dark border border-primary/40 hover:bg-primary/5",
};

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`${base} ${variants[variant]} ${className ?? ""}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner className="w-4 h-4" />}
      {children}
    </motion.button>
  );
}
