import { motion, Transition } from "framer-motion";
import React, { useEffect, useState } from "react";

interface AnimateNumberProps {
  target: number;
  duration?: number; // in seconds
  formatFn?: (val: number) => string; // optional formatting function
  transition?: Transition;
}

const AnimateNumber: React.FC<AnimateNumberProps> = ({
  target,
  duration = 1,
  formatFn,
  transition,
}) => {
  const [displayedNumber, setDisplayedNumber] = useState(0);

  useEffect(() => {
    const frameRate = 1000 / 60; // 60 fps
    const totalFrames = Math.round((duration * 1000) / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      const currentNumber = Math.round(progress * target);
      setDisplayedNumber(currentNumber);

      if (progress === 1) clearInterval(counter);
    }, frameRate);

    return () => clearInterval(counter);
  }, [target, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      {formatFn ? formatFn(displayedNumber) : displayedNumber}
    </motion.div>
  );
};

export default AnimateNumber;
