import { ReactElement } from "react";

interface ButtonProps {
  text?: string;
  variant: "primary" | "secondary" | "card" | "delete" | "sidebar";
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
}

const variantStyles = {
  primary:
    "rounded-full flex items-center justify-evenly border px-4 py-2 text-lg gap-0.5",
  secondary:
    "rounded-full flex items-center justify-evenly border px-4 py-2 text-lg gap-0.5",
  card: "rounded-full flex items-center justify-evenly border p-1",
  delete: "rounded-full flex items-center justify-evenly border p-1",
  sidebar:
    "px-4 py-2 rounded-none w-full flex justify-start gap-2 items-center",
};

export function Button({
  variant,
  text,
  startIcon,
  endIcon,
  onClick,
}: ButtonProps) {
  return (
    <button onClick={onClick} className={variantStyles[variant]}>
      <div>{startIcon}</div>
      <div>{endIcon}</div>
      <span>{text}</span>
    </button>
  );
}
