'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface Feature {
  icon: string;
  title: string;
  desc: string;
  color: string;
  bgColor: string;
}

interface MainFeaturesGridProps {
  features?: Feature[];
}

const MainFeaturesGrid: React.FC<MainFeaturesGridProps> = ({ features }) => {
  const { isDark } = useTheme();

  const defaultFeatures: Feature[] = [
    { 
      icon: "⚡", 
      title: "Lightning Fast", 
      desc: "Convert in seconds with our AI-powered engine",
      color: "from-yellow-400 to-orange-500",
      bgColor: isDark ? "from-yellow-900/20 to-orange-900/20" : "from-yellow-50 to-orange-50"
    },
    { 
      icon: "🔒", 
      title: "100% Secure", 
      desc: "Bank-level security with auto-deletion after 24hrs",
      color: "from-green-400 to-emerald-500",
      bgColor: isDark ? "from-green-900/20 to-emerald-900/20" : "from-green-50 to-emerald-50"
    },
    { 
      icon: "✨", 
      title: "Perfect Quality", 
      desc: "Preserve all formatting, fonts, and layouts",
      color: "from-purple-400 to-pink-500",
      bgColor: isDark ? "from-purple-900/20 to-pink-900/20" : "from-purple-50 to-pink-50"
    },
    { 
      icon: "🎯", 
      title: "Smart AI", 
      desc: "Intelligent content recognition and optimization",
      color: "from-blue-400 to-cyan-500",
      bgColor: isDark ? "from-blue-900/20 to-cyan-900/20" : "from-blue-50 to-cyan-50"
    }
  ];

  const featuresToRender = features || defaultFeatures;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuresToRender.map((feature, index) => (
        <motion.div
          key={index}
          className={`relative p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
            isDark 
              ? 'bg-gradient-to-br border-gray-700/50 hover:border-gray-600' 
              : 'bg-gradient-to-br border-gray-200/50 hover:border-gray-300'
          } ${feature.bgColor}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 + index * 0.1 }}
          whileHover={{ 
            scale: 1.05,
            y: -5,
            transition: { duration: 0.2 }
          }}
        >
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 rounded-2xl`} />
          
          <motion.div
            className="text-5xl mb-4 relative z-10"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: index === 1 ? [0, 10, -10, 0] : [0, 0, 0, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
          >
            {feature.icon}
          </motion.div>
          <h4 className={`text-lg font-bold mb-2 relative z-10 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {feature.title}
          </h4>
          <p className={`text-sm relative z-10 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {feature.desc}
          </p>
          
          {/* Animated border */}
          <motion.div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 -z-10`}
            whileHover={{ opacity: 0.1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default MainFeaturesGrid;
