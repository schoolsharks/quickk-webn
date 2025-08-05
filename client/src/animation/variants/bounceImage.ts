export const bounceImageVariants = {
  hidden: {
    opacity: 0,
    y: -100, // Start off-screen above
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: [1, 1.2, 0.95, 1.05, 1], // Bounce effect
    transition: {
      duration: 1.2,
      delay: 0.2,
      times: [0, 0.2, 0.5, 0.8, 1],
      ease: "easeInOut"
    }
  }
};
