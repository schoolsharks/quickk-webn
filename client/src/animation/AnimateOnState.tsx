import { motion, Variants, Transition } from "framer-motion";
import React from "react";

interface AnimateOnStateProps {
  children: React.ReactNode;
  variants: Variants;
  transition?: Transition;
  animateKey?: string; // this will force animation replay
}

const AnimateOnState: React.FC<AnimateOnStateProps> = ({
  children,
  variants,
  transition,
  animateKey,
}) => {
  return (
    <motion.div
      key={animateKey}
      variants={variants}
      initial="initial"
      animate="vibrate"
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default AnimateOnState;
