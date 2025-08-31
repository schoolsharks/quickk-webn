
// Response Submitted Animation (e.g., a checkmark or highlight)
export const responseSubmitted = {
  hidden: { scale: 1, opacity: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
  visible: {
    scale: [1, 1.03, 1],
    opacity: 1,
    boxShadow: [
      "0px 0px 0px rgba(0,0,0,0)",
      "0px 0px 15px rgba(230, 189, 255, 0.6)", // #E6BDFF in rgba
      "0px 0px 0px rgba(0,0,0,0)",
    ],
    transition: {
      duration: 1,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};



