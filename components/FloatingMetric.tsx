
import React from 'react';
import { motion } from 'framer-motion';

interface FloatingMetricProps {
  value: number;
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

const FloatingMetric: React.FC<FloatingMetricProps> = ({ value, x, y, color, onComplete }) => {
  const isPositive = value >= 0;
  const displayValue = isPositive ? `+${Math.round(value)}` : Math.round(value);

  return (
    <motion.div
      initial={{ opacity: 1, x: x - 20, y: y - 20, scale: 0.8 }}
      animate={{ 
        opacity: [1, 1, 0],
        x: window.innerWidth / 2 - 20, // Travel towards center (Orb)
        y: window.innerHeight / 2 - 100, 
        scale: [0.8, 1.2, 0.5]
      }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className="fixed pointer-events-none z-[200] font-display font-black text-2xl drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
      style={{ color }}
    >
      {displayValue}
    </motion.div>
  );
};

export default FloatingMetric;
