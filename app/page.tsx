'use client';
import Herosection from "@/components/Herosection";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import ServiceShowcase from "@/components/ServiceShowcase";
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from "@/store/hooks";
import React from 'react';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.4
    }
  }
};

// Enhanced background elements for visual appeal
const BackgroundElements = ({ isDark }: { isDark: boolean }) => (
  <>
    {/* Floating orbs with improved performance */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary floating orb */}
      <motion.div
        className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isDark ? 'bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600' 
                 : 'bg-gradient-to-br from-pink-300 via-rose-300 to-pink-400'
        }`}
        style={{ top: '10%', left: '5%' }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Secondary floating orb */}
      <motion.div
        className={`absolute w-80 h-80 rounded-full blur-3xl opacity-15 ${
          isDark ? 'bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600' 
                 : 'bg-gradient-to-br from-rose-300 via-pink-300 to-rose-400'
        }`}
        style={{ top: '50%', right: '10%' }}
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Tertiary floating orb */}
      <motion.div
        className={`absolute w-64 h-64 rounded-full blur-3xl opacity-10 ${
          isDark ? 'bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600' 
                 : 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400'
        }`}
        style={{ bottom: '20%', left: '15%' }}
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
    
    {/* Animated particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${
            isDark ? 'bg-purple-400/30' : 'bg-purple-500/40'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
        />
      ))}
    </div>
    
    {/* Sparkle effects */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className={`absolute w-1 h-1 ${
            isDark ? 'bg-gradient-to-r from-cyan-400 to-purple-400' 
                   : 'bg-gradient-to-r from-cyan-500 to-purple-500'
          } rounded-full`}
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "linear"
          }}
        />
      ))}
    </div>
  </>
);

export default function Home() {
  const theme = useAppSelector((state: { theme: { theme: string } }) => state.theme.theme);
  const [isDark, setIsDark] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setIsDark(
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }, [theme]);

  if (!mounted) {
    return null; // Prevent flash of unstyled content
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home-page"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`relative min-h-screen ${
          isDark 
            ? 'bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950' 
            : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white'
        }`}
      >
        {/* Enhanced background elements */}
        <BackgroundElements isDark={isDark} />
        
        {/* Main content with improved styling */}
        <div className="relative z-10">
          <Herosection
            typewriterTexts={["Merge PDFs", "Combine Documents", "Fast & Secure"]}
            subtitle="Easily merge your PDF files online"
            description="Upload your PDF documents and combine them into a single file in seconds. No registration required."
          />
          <ServiceShowcase />
          <Features />
          <Pricing />
          <Footer />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
