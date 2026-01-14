import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={className}
      {...props}
    />
  );
}