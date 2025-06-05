'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface CallToActionProps {
  message?: string;
  icon1?: string;
  icon2?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ 
  message = "Ready to convert your files? Start now!",
  icon1 = "🎉",
  icon2 = "✨"
}) => {
  const { isDark } = useTheme();
  return (
    <motion.div
      className="text-center w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.0 }}
    >
      <motion.div
        className={`inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full backdrop-blur-sm border transition-all duration-300 ${
          isDark 
            ? 'bg-black/20 border-purple-700/30 shadow-xl shadow-purple-900/20' 
            : 'bg-white/30 border-purple-200/40 shadow-xl shadow-purple-500/10'
        }`}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.span
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-xl sm:text-2xl"
        >
          {icon1}
        </motion.span>
        <span className={`text-sm sm:text-lg font-medium ${isDark ? 'text-purple-200' : 'text-purple-800'}`}>
          {message}
        </span>
        <motion.span
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xl sm:text-2xl"
        >
          {icon2}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default CallToAction;
