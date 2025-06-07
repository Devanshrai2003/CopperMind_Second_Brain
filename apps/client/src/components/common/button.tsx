import type { ReactNode } from "react";

export interface ButtonProps {
  variant: "primary" | "secondary" | "card" | "delete" | "hero" | "sidebar";
  size: "sm" | "md" | "lg" | "hero";
  text?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

const baseStyle =
  "flex items-center justify-center rounded-full font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer";

const variantStyles = {
  primary: `
      bg-primary-800 text-white border border-primary-700 
      hover:bg-primary-700 hover:shadow-md 
      active:bg-primary-900 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
      disabled:bg-primary-200 disabled:text-white/70 
      transition-all duration-200 ease-in-out 
      rounded-full
    `,

  secondary: `
      bg-white text-primary-900 border border-primary-300 
      hover:border-primary-400 hover:bg-primary-50 
      active:bg-primary-100 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2
      disabled:text-primary-300 disabled:border-primary-100 
      transition-all duration-200 ease-in-out 
      rounded-full
    `,

  card: `
      bg-white text-primary-800 border border-primary-200 
      hover:border-primary-400 hover:shadow-sm 
      active:bg-primary-50 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2
      disabled:text-primary-300 disabled:border-primary-100 
      transition-all duration-200 ease-in-out 
      rounded-full
    `,

  delete: `
      bg-white text-red-600 border border-red-200 
      hover:bg-red-50 hover:border-red-300 
      active:bg-red-100 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2
      disabled:text-red-300 disabled:border-red-100 
      transition-all duration-200 ease-in-out 
      rounded-full
    `,

  hero: `
      bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 
      text-white border-2 border-primary-600 
      hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 
      hover:shadow-lg 
      active:scale-95 active:bg-primary-950 
      focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/60 focus-visible:ring-offset-2
      disabled:bg-primary-300 disabled:cursor-not-allowed 
      transition-all duration-300 ease-in-out 
      shadow-lg rounded-full
    `,
  sidebar: `
    bg-white text-primary-900 border border-primary-300 
    hover:border-primary-400 hover:bg-primary-50 
    active:bg-primary-100 flex justify-start
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2
    disabled:text-primary-300 disabled:border-primary-100 
    transition-all duration-200 ease-in-out 
  `,
};

const sizeStyles = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "px-4 py-1 gap-2",
  lg: "text-lg px-6 py-2.5 gap-2.5",
  hero: "text-4xl px-12 py-5 gap-2.5",
};

export function Button({
  variant,
  text,
  size,
  startIcon,
  endIcon,
  onClick,
  isLoading = false,
  fullWidth = false,
  disabled,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? "w-full" : ""
      }`}
      disabled={disabled || isLoading}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-10 h-10 border-4 border-t-accent-500 border-accent-300 rounded-full animate-spin"></span>
        </span>
      )}

      <span
        className={`flex items-center gap-2 ${isLoading ? "invisible" : ""}`}
      >
        {startIcon && <span>{startIcon}</span>}
        {text}
        {endIcon && <span>{endIcon}</span>}
      </span>
    </button>
  );
}
