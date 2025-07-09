import { Variants } from "motion/react";

export const shakeVariants: Variants = {
  initial: { x: 0 },
  shake: {
    x: [0, -6, 6, -6, 6, 0], // Shake horizontally
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      // When using 'animate' prop, Framer Motion handles cleanup
    },
  },
};

export const popupVariants: Variants = {
  hidden: {
    scale: 0.2,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 20,
    },
  },
  exit: {
    scale: 0.2,
    opacity: 0,
    transition: {
      duration: 0.2 // A quick exit transition
    }
  },
}

export const loadingVariants: Variants = {
  idle: {
    opacity: 1,
    borderColor: "#d1d5db", // gray-300
  },
  pulse: {
    opacity: 0.7,
    borderColor: ["#d1d5db", "#60a5fa", "#d1d5db"], // gray-300 to blue-400
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
