'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface Step {
  step: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
}

interface HowItWorksProps {
  title?: string;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  { 
    step: "1", 
    title: "Upload File", 
    desc: "Drag & drop or click to select your file",
    icon: "📄",
    color: "from-blue-500 to-cyan-500"
  },
  { 
    step: "2", 
    title: "AI Processing", 
    desc: "Our AI analyzes and converts with perfect formatting",
    icon: "🤖",
    color: "from-purple-500 to-pink-500"
  },
  { 
    step: "3", 
    title: "Download Result", 
    desc: "Get your converted file instantly",
    icon: "📊",
    color: "from-green-500 to-emerald-500"
  }
];

const HowItWorks: React.FC<HowItWorksProps> = ({ 
  title = "How It Works - Simple as 1, 2, 3!",
  steps = defaultSteps 
}) => {
  const { isDark } = useTheme();
  return (
    <motion.div
      className="text-center w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <motion.h3 
        className={`text-xl sm:text-2xl md:text-3xl font-bold mb-8 sm:mb-12 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <motion.span
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="inline-block mr-3"
        >
          🎯
        </motion.span>
        {title}
      </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, x: index === 0 ? -50 : index === 2 ? 50 : 0, y: index === 1 ? -50 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.6 + index * 0.2, type: "spring", bounce: 0.4 }}
          >            {/* Connection line */}
            {index < steps.length - 1 && (
              <motion.div
                className={`hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 ${
                  isDark ? 'bg-purple-600/50' : 'bg-purple-300/50'
                }`}
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ delay: 0.8 + index * 0.2 }}
              />
            )}
            
            <motion.div
              className={`relative p-6 sm:p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                isDark 
                  ? 'bg-black/20 border-purple-800/30 shadow-xl shadow-purple-900/20' 
                  : 'bg-white/30 border-purple-200/30 shadow-xl shadow-purple-500/10'
              }`}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { duration: 0.2 }
              }}
            >
              {/* Step number */}
              <motion.div
                className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r ${step.color} text-white text-sm font-bold flex items-center justify-center`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {step.step}
              </motion.div>
                <motion.div
                className="text-4xl sm:text-5xl md:text-6xl mb-4"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
              >
                {step.icon}
              </motion.div>
              
              <h4 className={`text-lg sm:text-xl font-bold mb-3 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}>
                {step.title}
              </h4>
              <p className={`text-sm sm:text-base ${isDark ? 'text-purple-300/80' : 'text-purple-700/80'}`}>
                {step.desc}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HowItWorks;
