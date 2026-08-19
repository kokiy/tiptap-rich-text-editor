import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ToolbarButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

export const ToolbarButton = forwardRef<
  HTMLButtonElement,
  ToolbarButtonProps
>(({ className, isActive, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-md h-8 w-8 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive && "bg-accent text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
});

ToolbarButton.displayName = "ToolbarButton";
