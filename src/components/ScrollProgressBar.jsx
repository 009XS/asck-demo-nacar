import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-nacar-jade via-nacar-jade-claro to-nacar-oro origin-left z-[100] pointer-events-none shadow-[0_0_8px_rgba(46,107,96,0.5)]"
    />
  );
}
