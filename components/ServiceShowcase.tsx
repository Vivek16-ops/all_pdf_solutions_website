'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Merge PDF',
    icon: '/service_icons/mergepdf.png',
    href: '/services/merge-pdf',
    color: 'purple'
  },
  {
    title: 'Excel to PDF',
    icon: '/service_icons/exceltopdf.png',
    href: '/services/excel-to-pdf',
    color: 'green'
  },
  {
    title: 'Word to PDF',
    icon: '/service_icons/wordtopdf.png',
    href: '/services/word-to-pdf',
    color: 'blue'
  },
  {
    title: 'PDF to Word',
    icon: '/service_icons/pdftoword.jpg',
    href: '/services/pdf-to-word',
    color: 'indigo'
  },
  {
    title: 'PDF to Excel',
    icon: '/service_icons/pdftoexcel.png',
    href: '/services/pdf-to-excel',
    color: 'emerald'
  },
  {
    title: 'PDF to PPT',
    icon: '/service_icons/pdftoppt.jpg',
    href: '/services/pdf-to-ppt',
    color: 'orange'
  },
  {
    title: 'Word to PNG',
    icon: '/service_icons/wordtopng.jpg',
    href: '/services/word-to-png',
    color: 'pink'
  },
  {
    title: 'Word to JPG',
    icon: '/service_icons/wordtojpg.jpg',
    href: '/services/word-to-jpg',
    color: 'red'
  },
  {
    title: 'PPT to PDF',
    icon: '/service_icons/ppttopdf.svg',
    href: '/services/ppt-to-pdf',
    color: 'cyan'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0, scale: 0.9 },
  show: { y: 0, opacity: 1, scale: 1 }
};

const ServiceShowcase = () => {
  const { isDark } = useTheme();

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, {
      bg: string;
      glow: string;
      hover: string;
    }> = {
      purple: {
        bg: isDark ? 'from-purple-600/20 to-purple-800/20' : 'from-purple-100 to-purple-200',
        glow: isDark ? 'shadow-purple-500/20' : 'shadow-purple-300/30',
        hover: isDark ? 'from-purple-500/30 to-purple-700/30' : 'from-purple-200 to-purple-300'
      },
      green: {
        bg: isDark ? 'from-green-600/20 to-green-800/20' : 'from-green-100 to-green-200',
        glow: isDark ? 'shadow-green-500/20' : 'shadow-green-300/30',
        hover: isDark ? 'from-green-500/30 to-green-700/30' : 'from-green-200 to-green-300'
      },
      blue: {
        bg: isDark ? 'from-blue-600/20 to-blue-800/20' : 'from-blue-100 to-blue-200',
        glow: isDark ? 'shadow-blue-500/20' : 'shadow-blue-300/30',
        hover: isDark ? 'from-blue-500/30 to-blue-700/30' : 'from-blue-200 to-blue-300'
      },
      indigo: {
        bg: isDark ? 'from-indigo-600/20 to-indigo-800/20' : 'from-indigo-100 to-indigo-200',
        glow: isDark ? 'shadow-indigo-500/20' : 'shadow-indigo-300/30',
        hover: isDark ? 'from-indigo-500/30 to-indigo-700/30' : 'from-indigo-200 to-indigo-300'
      },
      emerald: {
        bg: isDark ? 'from-emerald-600/20 to-emerald-800/20' : 'from-emerald-100 to-emerald-200',
        glow: isDark ? 'shadow-emerald-500/20' : 'shadow-emerald-300/30',
        hover: isDark ? 'from-emerald-500/30 to-emerald-700/30' : 'from-emerald-200 to-emerald-300'
      },
      orange: {
        bg: isDark ? 'from-orange-600/20 to-orange-800/20' : 'from-orange-100 to-orange-200',
        glow: isDark ? 'shadow-orange-500/20' : 'shadow-orange-300/30',
        hover: isDark ? 'from-orange-500/30 to-orange-700/30' : 'from-orange-200 to-orange-300'
      },
      pink: {
        bg: isDark ? 'from-pink-600/20 to-pink-800/20' : 'from-pink-100 to-pink-200',
        glow: isDark ? 'shadow-pink-500/20' : 'shadow-pink-300/30',
        hover: isDark ? 'from-pink-500/30 to-pink-700/30' : 'from-pink-200 to-pink-300'
      },
      red: {
        bg: isDark ? 'from-red-600/20 to-red-800/20' : 'from-red-100 to-red-200',
        glow: isDark ? 'shadow-red-500/20' : 'shadow-red-300/30',
        hover: isDark ? 'from-red-500/30 to-red-700/30' : 'from-red-200 to-red-300'
      },
      cyan: {
        bg: isDark ? 'from-cyan-600/20 to-cyan-800/20' : 'from-cyan-100 to-cyan-200',
        glow: isDark ? 'shadow-cyan-500/20' : 'shadow-cyan-300/30',
        hover: isDark ? 'from-cyan-500/30 to-cyan-700/30' : 'from-cyan-200 to-cyan-300'
      }
    };
    return colorMap[color] || colorMap.purple;
  };

  return (
    <section className={`py-20 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-b from-gray-950 via-purple-950/50 to-gray-950' 
        : 'bg-gradient-to-b from-purple-50 via-pink-50 to-white'
    }`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-10 ${
            isDark ? 'bg-purple-600' : 'bg-purple-300'
          }`}
          style={{ top: '10%', right: '10%' }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className={`absolute w-80 h-80 rounded-full blur-3xl opacity-10 ${
            isDark ? 'bg-blue-600' : 'bg-blue-300'
          }`}
          style={{ bottom: '10%', left: '10%' }}
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDark 
              ? 'text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text' 
              : 'text-transparent bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 bg-clip-text'
          }`}>
            Our Services
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDark ? 'text-purple-300/90' : 'text-purple-700/90'
          }`}>
            Transform your documents with our comprehensive suite of conversion tools
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => {
            const colors = getColorClasses(service.color);
            return (
              <motion.div key={service.href} variants={item}>
                <Link href={service.href}>
                  <motion.div
                    className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm border ${
                      isDark
                        ? 'bg-gray-900/50 border-gray-800 hover:border-purple-500/50'
                        : 'bg-white/80 border-gray-100 hover:border-purple-300/50'
                    } hover:shadow-2xl`}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Animated background gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      initial={false}
                    />
                    
                    {/* Animated glow effect */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-all duration-300 ${colors.glow} shadow-2xl`}
                      initial={false}
                    />

                    <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                      {/* Icon container with enhanced styling */}
                      <motion.div 
                        className={`relative w-16 h-16 rounded-xl overflow-hidden ${
                          isDark ? 'bg-gray-800/80 shadow-inner' : 'bg-white/90 shadow-lg'
                        } group-hover:shadow-xl transition-all duration-300`}
                        whileHover={{ 
                          rotate: [0, -10, 10, -10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        {/* Icon background glow */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${colors.hover} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                        />
                        <Image
                          src={service.icon}
                          alt={service.title}
                          fill
                          className="object-cover p-2 relative z-10"
                        />
                      </motion.div>

                      {/* Title with enhanced styling */}
                      <h3 className={`text-lg font-semibold text-center transition-colors duration-300 ${
                        isDark 
                          ? 'text-purple-200 group-hover:text-white' 
                          : 'text-purple-800 group-hover:text-purple-900'
                      }`}>
                        {service.title}
                      </h3>
                    </div>

                    {/* Shimmer effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "linear"
                      }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceShowcase;
