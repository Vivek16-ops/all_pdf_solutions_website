'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaRocket, FaStar, FaBolt } from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export default function ComingSoon({ 
  title = "Coming Soon", 
  subtitle = "We're working on something amazing!",
  description = "This feature is currently under development. Stay tuned for updates!"
}: ComingSoonProps) {
  const { isDark } = useTheme();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const floatingIcons = [
    { Icon: FaRocket, delay: 0, duration: 3 },
    { Icon: FaStar, delay: 1, duration: 4 },
    { Icon: FaBolt, delay: 2, duration: 3.5 },
  ];
  return (
    <div className={`min-h-[600px] flex items-center justify-center relative overflow-hidden rounded-3xl transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900/50 border border-gray-700/50' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-gray-200'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {floatingIcons.map(({ Icon, delay, duration }, index) => (
          <motion.div
            key={index}
            className={`absolute opacity-20 ${
              isDark ? 'text-blue-400' : 'text-blue-300'
            }`}
            initial={{ x: -100, y: Math.random() * 400, rotate: 0 }}
            animate={{
              x: typeof window !== 'undefined' ? window.innerWidth + 100 : 1200,
              y: Math.random() * 400,
              rotate: 360,
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: Math.random() * -200,
              top: Math.random() * 400,
            }}
          >
            <Icon size={32} />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="text-center z-10 max-w-2xl mx-auto px-6">        {/* Animated Clock Icon */}
        <motion.div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 shadow-lg transition-all duration-300 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-600 to-purple-700 shadow-purple-900/40' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-purple-500/30'
          }`}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaClock className="w-12 h-12 text-white" />
        </motion.div>        {/* Title */}
        <motion.h1
          className={`text-5xl md:text-6xl font-bold mb-4 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
          }`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {subtitle}
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {description}
        </motion.p>        {/* Animated Progress Bar */}
        <motion.div
          className={`w-full rounded-full h-3 mb-6 overflow-hidden transition-colors duration-300 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            className={`h-full rounded-full ${
              isDark 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}
            initial={{ width: "0%" }}
            animate={{ width: "75%" }}
            transition={{ duration: 2, delay: 1, ease: "easeOut" }}
          />
        </motion.div>

        {/* Progress Text */}
        <motion.div
          className="text-sm text-gray-500 dark:text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Development Progress: 75%
        </motion.div>        {/* Pulsing CTA Button */}
        <motion.button
          className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
            isDark 
              ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg shadow-purple-900/40 hover:shadow-xl hover:shadow-purple-800/60' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <span className="relative z-10">Notify Me When Ready</span>
          <motion.div
            className="absolute inset-0 bg-white opacity-20"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.button>        {/* Live Counter */}
        <motion.div
          className={`mt-8 text-sm transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          You've been waiting for: {Math.floor(countdown / 60)}m {countdown % 60}s
        </motion.div>
      </div>

      {/* Decorative Gradient Orbs */}
      <div className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full filter blur-xl opacity-20 animate-pulse ${
        isDark 
          ? 'bg-blue-500 mix-blend-screen' 
          : 'bg-blue-300 mix-blend-multiply'
      }`}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full filter blur-xl opacity-20 animate-pulse animation-delay-2000 ${
        isDark 
          ? 'bg-purple-500 mix-blend-screen' 
          : 'bg-purple-300 mix-blend-multiply'
      }`}></div>
    </div>
  );
}
