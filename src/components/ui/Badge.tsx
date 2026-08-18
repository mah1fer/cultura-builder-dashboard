import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "purple";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-rose-500/15 text-rose-400 border border-rose-500/30",
    outline: "text-foreground border border-border",
    success: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400 border font-medium",
    warning: "border-amber-500/30 bg-amber-500/15 text-amber-400 border font-medium",
    info: "border-sky-500/30 bg-sky-500/15 text-sky-400 border font-medium",
    purple: "border-violet-500/30 bg-violet-500/15 text-violet-400 border font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
