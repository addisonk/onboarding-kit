"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getMaxWidthClass } from "./utils";
import type { MaxWidth } from "./types";

interface TextInputQuestionProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Rotating typewriter placeholders. */
  placeholders?: string[];
  label?: string;
  className?: string;
  type?: "text" | "email" | "number";
  onEnter?: () => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  maxWidth?: MaxWidth;
}

export function TextInputQuestion({
  id,
  value,
  onChange,
  placeholder = "Type your answer...",
  placeholders,
  label,
  className,
  type = "text",
  onEnter,
  disabled = false,
  min,
  max,
  maxWidth,
}: TextInputQuestionProps) {
  const hasValue = value.trim().length >= 2;
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cursorRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Typewriter placeholder animation
  useEffect(() => {
    if (value.length > 0 || !placeholders?.length) {
      if (placeholders?.length) setCurrentPlaceholder("");
      return;
    }

    const text = placeholders[placeholderIndex];
    let i = 0;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const typeChar = () => {
      if (i < text.length) {
        setCurrentPlaceholder(text.substring(0, i + 1));
        i++;
        timeoutRef.current = setTimeout(typeChar, 50);
      } else {
        timeoutRef.current = setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
          setCurrentPlaceholder("");
        }, 2000);
      }
    };

    typeChar();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [placeholderIndex, placeholders, value.length]);

  // Cursor blink
  useEffect(() => {
    if (value.length > 0 || !placeholders?.length) {
      setShowCursor(true);
      return;
    }
    cursorRef.current = setInterval(() => setShowCursor((p) => !p), 530);
    return () => {
      if (cursorRef.current) clearInterval(cursorRef.current);
    };
  }, [value.length, placeholders]);

  const displayPlaceholder =
    value.length === 0 && placeholders?.length
      ? `${currentPlaceholder}${showCursor ? "|" : " "}`
      : placeholder;

  return (
    <div className={cn("w-full", className, getMaxWidthClass(maxWidth))}>
      {label && (
        <label
          htmlFor={id}
          className="mb-3 block text-sm text-muted-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={displayPlaceholder}
          className={cn(
            "flex h-12 w-full rounded-lg border border-border bg-card px-3 py-2 text-lg text-foreground shadow-sm",
            "transition-[border-color,box-shadow]",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasValue && "pr-12",
            // Hide number spinners
            type === "number" &&
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnter && !disabled) {
              e.preventDefault();
              onEnter();
            }
          }}
          disabled={disabled}
          inputMode={type === "number" ? "numeric" : undefined}
          pattern={type === "number" ? "[0-9]*" : undefined}
          min={type === "number" && min !== undefined ? min : undefined}
          max={type === "number" && max !== undefined ? max : undefined}
          autoComplete="off"
        />
        <AnimatePresence initial={false}>
          {hasValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Button
                variant="default"
                size="icon-sm"
                type="button"
                onClick={() => onEnter && !disabled && hasValue && onEnter()}
                disabled={disabled}
                className="rounded-full"
                aria-label="Continue to next question"
              >
                <ArrowRight />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
