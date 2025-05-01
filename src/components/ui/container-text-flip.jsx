import React, { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function ContainerTextFlip({
  words = ["better", "modern", "beautiful", "awesome"],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700,
}) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [words, interval]);

  return (
    <motion.span
      className={cn("inline", className)} // Changed to inline for better alignment
      key={words[currentWordIndex]}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: animationDuration / 1000,
        ease: "easeInOut",
      }}
    >
      {words[currentWordIndex].split("").map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`} // Added unique key for each letter
          className={cn("inline", textClassName)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.05,
            duration: animationDuration / 1000,
            ease: "easeInOut",
          }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}