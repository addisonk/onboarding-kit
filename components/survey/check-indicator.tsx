"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CheckIndicatorProps {
  selected: boolean;
  className?: string;
}

export function CheckIndicator({ selected, className }: CheckIndicatorProps) {
  return (
    <div
      className={cn(
        "flex size-5 items-center justify-center rounded-full border transition-colors",
        selected ? "border-primary bg-primary" : "border-border bg-muted/80",
        className
      )}
    >
      {selected ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          <Check strokeWidth={3} className="size-3 text-primary-foreground" />
        </motion.div>
      ) : (
        <Check
          strokeWidth={3}
          className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        />
      )}
    </div>
  );
}
