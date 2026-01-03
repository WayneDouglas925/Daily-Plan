
import React from 'react';
import { motion } from 'framer-motion';

interface IdentityOrbProps {
  debt: number;
  equity: number;
  isBooting?: boolean;
  isRecovering?: boolean;
}

const IdentityOrb: React.FC<IdentityOrbProps> = ({ debt, equity, isBooting, isRecovering }) => {
  const isHealthy = debt === 0;
  
  // Color logic
  let glowColor = isHealthy ? 'rgba(34, 197, 94, 0.6)' : 'rgba(245, 158, 11, 0.6)';
  let innerColor = isHealthy ? 'rgb(34, 197, 94)' : 'rgb(245, 158, 11)';
  let secondaryColor = isHealthy ? 'rgb(21, 128, 61)' : 'rgb(180, 83, 9)';

  if (isRecovering) {
    glowColor = 'rgba(59, 130, 246, 0.8)';
    innerColor = 'rgb(59, 130, 246)';
    secondaryColor = 'rgb(29, 78, 216)';
  }

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      {/* Background Pulse Layer */}
      <motion.div
        animate={{
          scale: isBooting || isRecovering ? [1, 2.5, 0.5, 1] : (isHealthy ? [1, 1.2, 1] : [1, 1.3, 1]),
          opacity: isBooting || isRecovering ? [0, 1, 0, 0.3] : (isHealthy ? [0.3, 0.1, 0.3] : [0.4, 0.2, 0.4]),
        }}
        transition={{
          duration: isBooting || isRecovering ? 1.5 : (isHealthy ? 4 : 2),
          repeat: isBooting || isRecovering ? 0 : Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ backgroundColor: glowColor }}
      />

      {/* Main 3D Sphere */}
      <motion.div
        animate={{
          scale: isBooting || isRecovering ? [0, 1.4, 1] : (isHealthy ? [1, 1.05, 1] : [1, 1.08, 1]),
        }}
        transition={{
          duration: isBooting || isRecovering ? 1.2 : (isHealthy ? 6 : 3),
          repeat: isBooting || isRecovering ? 0 : Infinity,
          ease: isBooting || isRecovering ? "backOut" : "easeInOut"
        }}
        className="relative z-10 w-full h-full rounded-full flex items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${innerColor} 0%, ${secondaryColor} 100%)`,
          boxShadow: `0 0 60px ${glowColor}, inset -20px -20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Shimmer Effect for Debt State */}
        {!isHealthy && !isBooting && !isRecovering && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              transform: 'skewX(-20deg)',
            }}
          />
        )}

        {/* Flicker Effect for Debt */}
        {!isHealthy && !isBooting && !isRecovering && (
          <motion.div
            animate={{
              opacity: [1, 0.6, 1, 0.8, 1],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: Math.random() * 3
            }}
            className="absolute inset-0 bg-amber-400/20 z-0"
          />
        )}

        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full z-0" />

        {/* Equity Text */}
        <div className="relative z-20 text-center">
          <motion.div 
            key={equity}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-white font-display text-5xl md:text-6xl font-bold tracking-tighter"
          >
            {Math.round(equity)}
          </motion.div>
          <div className="text-white/60 font-display text-sm uppercase tracking-widest mt-1">
            Identity Equity
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IdentityOrb;
