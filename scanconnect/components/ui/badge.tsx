import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }: React.ComponentProps<"span"> & { variant?: "default" | "veg" | "outline" | "destructive" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "default" && "bg-primary/15 text-primary",
        variant === "veg" && "bg-green-100 text-green-800",
        variant === "outline" && "border border-border",
        variant === "destructive" && "bg-red-100 text-red-800",
        className
      )}
      {...props}
    />
  );
}
