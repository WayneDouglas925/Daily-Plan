
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Loader2 } from 'lucide-react';

interface InitializationModalProps {
  onInit: () => void;
  isBooting: boolean;
}

const InitializationModal: React.FC<InitializationModalProps> = ({ onInit, isBooting }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-2xl"
    >
      <div className="max-w-md w-full glass rounded-[2.5rem] p-10 text-center border border-white/10 relative overflow-hidden">
        {/* Tech decorative patterns */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
        
        <motion.div
          animate={isBooting ? { scale: [1, 1.1, 1], opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className="mx-auto w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 border border-indigo-500/20"
        >
          <Cpu className="text-indigo-400" size={32} />
        </motion.div>

        <h2 className="font-display text-3xl font-bold text-white mb-4 tracking-tight leading-tight">
          Commence Identity Protocol 2026
        </h2>
        
        <p className="text-white/50 text-sm mb-10 leading-relaxed uppercase tracking-widest font-medium">
          Re-calibration of biological and metabolic windows is required.
        </p>

        <button
          disabled={isBooting}
          onClick={onInit}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          {isBooting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span className="tracking-widest uppercase text-xs">Loading Protocol...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={20} />
              <span>Begin 90-Day Build</span>
            </>
          )}
          
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
        </button>

        <div className="mt-8 flex justify-center gap-2">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-1 h-1 bg-indigo-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default InitializationModal;
