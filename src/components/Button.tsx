import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  "unstyled" | "primary" | "secondary" | "gold" | "soft" | "link";

export type ButtonSize = "none" | "sm" | "md" | "form" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  unstyled: "",
  primary:
    "bg-[var(--color-brand-navy)] text-white hover:opacity-90 disabled:opacity-60",
  secondary:
    "bg-gray-200 text-gray-800 transition-colors hover:bg-gray-300 disabled:opacity-50",
  gold: "bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] transition-colors hover:bg-[var(--color-brand-gold-light)] disabled:opacity-50",
  soft: "bg-gray-100 text-gray-800 transition-colors hover:bg-gray-200 disabled:opacity-50",
  link: "text-[var(--color-brand-navy)] hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  none: "",
  sm: "px-3 py-1 rounded-md text-sm",
  md: "px-4 py-2 rounded-md",
  form: "py-2 rounded-md",
  icon: "p-2 rounded-md",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = "", size = "none", variant = "unstyled", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      {...props}
    />
  );
});

export default Button;
