import { motion, Variants, Transition } from "framer-motion";
import React, { useState } from "react";

interface AnimateOnClickProps {
  children: React.ReactNode;
  variants: Variants;
  transition?: Transition;
}

const AnimateOnClick: React.FC<AnimateOnClickProps> = ({
  children,
  variants,
  transition,
}) => {
  const [trigger, setTrigger] = useState(0); // key to restart animation

  const handleClick = () => {
    setTrigger(prev => prev + 1); // change key to retrigger animation
  };

  return (
    <motion.div
      key={trigger}
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={transition}
      onClick={handleClick}
      style={{ cursor: "pointer",flex:"1" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimateOnClick;


