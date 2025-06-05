'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface WhyChooseUsProps {
  title?: string;
  subtitle?: string;
  stats?: Array<{
    number: string;
    label: string;
    icon: string;
  }>;
}

const defaultStats = [
  { number: "2M+", label: "Happy Users", icon: "👥" },
  { number: "99.9%", label: "Uptime", icon: "⚡" },
  { number: "<30sec", label: "Avg Convert Time", icon: "⏱️" },
  { number: "4.9★", label: "User Rating", icon: "⭐" }
];

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ 
  title = "Why 2M+ Users Trust Our Converter",
  subtitle,
  stats = defaultStats 
}) => {
  const { isDark } = useTheme();
  return (
    <motion.div
      className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 backdrop-blur-sm border relative overflow-hidden ${
        isDark 
          ? 'bg-black/20 border-purple-800/30 shadow-2xl shadow-purple-900/20' 
          : 'bg-white/30 border-purple-200/30 shadow-2xl shadow-purple-500/10'
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 text-center">        <motion.h3 
          className={`text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="inline-block mr-3"
          >
            🌟
          </motion.span>
          {title}
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block ml-3"
          >
            🚀
          </motion.span>
        </motion.h3>
        
        {subtitle && (
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {subtitle}
          </p>
        )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <motion.div
                className="text-3xl mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {stat.icon}
              </motion.div>
              <motion.div 
                className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              >
                {stat.number}
              </motion.div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WhyChooseUs;
