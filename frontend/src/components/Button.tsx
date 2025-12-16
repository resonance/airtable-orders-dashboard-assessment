import { ReactNode, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "default" | "small" | "icon";
  loading?: boolean;
  children: ReactNode;
}

function Button({
  variant = "primary",
  size = "default",
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles =
    variant === "primary"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50";

  const sizeStyles =
    size === "small"
      ? "px-3 py-1.5 text-sm"
      : size === "icon"
      ? "p-2"
      : "px-4 py-2";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
  );
}

export default Button;
