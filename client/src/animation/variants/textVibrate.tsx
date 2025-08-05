export const textVibrateVariants = {
  initial: { x: 0 },
  vibrate: {
    x: [0, -4, 4, -4, 4, -2, 2, -1, 1, 0],
    transition: {
      duration: 0.4,
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.85, 0.95, 1],
      ease: "easeInOut",
    },
  },
};
