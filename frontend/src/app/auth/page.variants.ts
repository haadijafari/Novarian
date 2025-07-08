import { Variants } from "motion/react";
export const formVarants: Variants = {
  "initial": {
    y: "var(--y-initial, 0)",
  },
  "animate": {
    y: "var(--y-animate, 0)",
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  "exit": {
    x: "var(--x-initial, 0)",
    y: "var(--y-initial, 0)",
    transition: { duration: 0.6, ease: "easeInOut" },
  },
}

export const capsuleVariants: Variants = {
  login: {
    x: "var(--x-login, 0)",
    y: "var(--y-login, 0)",
    transition: { duration: 1.2, ease: "easeInOut" }
  },
  otp: {
    x: "var(--x-otp, 0)",
    y: "var(--y-otp, 0)",
    transition: { duration: 1.2, ease: "easeInOut" }
  },
}



