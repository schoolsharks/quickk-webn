import { motion, useInView, Variants, Transition } from "framer-motion";
import { useRef } from "react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  variants: Variants;
  transition?: Transition;
  amount?:number;
}

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({ children, variants, transition,amount=0.6 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: amount });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default AnimateOnScroll;
