"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowLeft, Check, Loader2, XIcon } from "lucide-react";

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

type State = "default" | "loading" | "success" | "error";

interface ArrowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  state?: State;
  className?: string;
}

const circleVariant: Variants = {
  expanded: {
    clipPath: "circle(150% at 10% 50%)",
    transition: { duration: 1.3, ease: "linear" },
  },
  expandedFromLoading: {
    clipPath: "circle(150% at 10% 50%)",
    transition: { duration: 0.9, ease: "linear", delay: 0.4 },
  },
  shrinked: {
    clipPath: "circle(0% at 10% 50%)",
    transition: { duration: 1.3, ease: "linear" },
  },
  loadingExpanded: {
    clipPath: "circle(150% at 50% 50%)",
    transition: { duration: 0.9, ease: "linear", delay: 0.4 },
  },
  loadingShrinked: {
    clipPath: "circle(0% at 50% 50%)",
  },
  exit: {
    x: 1,
    transition: { duration: 1.3 },
  },
};

const stateConfig = {
  default: {
    Icon: ArrowLeft,
    bgColor: "bg-surface-accent",
    hoverBgColor: "group-hover:bg-surface-accent/90",
    iconClassName: "text-surface-accent/80",
  },
  loading: {
    text: "",
    Icon: Loader2,
    bgColor: "bg-sky-500 text-white",
    hoverBgColor: "group-hover:text-sky-500/90",
    iconClassName: "text-sky-500/80 animate-spin",
  },
  success: {
    text: "موفق",
    Icon: Check,
    bgColor: "bg-surface-success text-white",
    hoverBgColor: "group-hover:bg-surface-success/90",
    iconClassName: "text-surface-success/80",
  },
  error: {
    text: "خطا",
    Icon: XIcon,
    bgColor: "bg-surface-warning text-white",
    hoverBgColor: "group-hover:bg-surface-warning/90",
    iconClassName: "text-surface-warning/80",
  },
};

export default function StatefullButton({
  text = "تایید",
  state = "default",
  className,
  ...rest
}: ArrowButtonProps) {
  const prevState = usePrevious(state);
  const currentConfig = stateConfig[state];

  //WARNING: there is some logic errors for success pr error to default state

  const getAnimateVariant = () => {
    if (state === "loading") return "loadingExpanded";
    if (prevState === "loading") return "expandedFromLoading";
    return "expanded";
  };

  return (
    <button
      {...rest}
      className={cn(
        "group relative h-full w-full inline-flex items-center justify-center overflow-hidden rounded-3xl px-6 py-3 font-medium shadow-md",
        className
      )}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={state}
          variants={circleVariant}
          initial={state === "loading" ? "loadingShrinked" : "shrinked"}
          animate={getAnimateVariant()}
          exit="exit"
          className={cn(
            "absolute inset-0 flex h-full w-full items-center justify-center font-bold",
            currentConfig.bgColor,
            currentConfig.hoverBgColor
          )}
        >
          {'text' in currentConfig ? currentConfig.text : text}
        </motion.span>
      </AnimatePresence>

      <motion.span
        className="z-10 bg-surface-muted absolute rounded-full h-3/4 aspect-square justify-center flex items-center translate-x-1/6"
        initial={false}
        animate={
          state === "loading" ? { right: "50%", x: "50%" } : { right: "100%", x: "100%" }
        }
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <currentConfig.Icon
              className={cn(
                currentConfig.iconClassName,
                "w-full h-full"
              )}
            />
          </motion.div>
        </AnimatePresence>
      </motion.span>

      <span className="invisible relative">{text}</span>
    </button>
  );
}
