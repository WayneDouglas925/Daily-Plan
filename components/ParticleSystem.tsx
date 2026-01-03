
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const ParticleSystem: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50, // Range -50% to 50%
      y: Math.random() * 100 - 50,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            opacity: 0, 
            x: `${50 + p.x}%`, 
            y: `${50 + p.y}%` 
          }}
          animate={{
            opacity: [0, 0.6, 0],
            x: [
              `${50 + p.x}%`, 
              `${50 + p.x + (Math.random() * 20 - 10)}%`, 
              `${50 + p.x}%`
            ],
            y: [
              `${50 + p.y}%`, 
              `${50 + p.y + (Math.random() * 20 - 10)}%`, 
              `${50 + p.y}%`
            ],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          className="absolute bg-white rounded-full blur-[1px]"
          style={{
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleSystem;
