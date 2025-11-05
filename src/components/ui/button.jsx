import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default:
        "bg-cyan-500 text-white hover:bg-cyan-600 focus:ring-cyan-500",
      outline:
        "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 focus:ring-gray-400",
      destructive:
        "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
      ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    };
    const sizes = {
      default: "h-10 px-4 text-sm",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-6 text-base",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
