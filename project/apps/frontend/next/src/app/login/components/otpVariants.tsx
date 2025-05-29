// Framer Motion Variants for animations
export const shakeVariants = {
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
export const loadingVariants = {
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

export const typingVariant = {
  initial: {
    opacity: 1,
    scale: 1
  },
  type: {
    opacity: [1, 1.1, 1],
    scale: [1, 0.7, 1],
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
}
export const errorMessageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const digitVariants = {
  initial: { y: 100, scale: 0.8 },
  animate: {
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  },
  exit: {
    scale: 0.8,
    y: -100,
    transition: { duration: 0.15 },
  },
};
