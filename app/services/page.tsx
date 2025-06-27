'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import Footer from '@/components/Footer';
import { ReduxProvider } from '@/store/Provider';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// TypeScript interfaces
interface MousePosition {
  x: number;
  y: number;
}

interface ComponentProps {
  isDark: boolean;
}

interface MagneticElementProps {
  children: React.ReactNode;
  strength?: number;
}

interface TypingAnimationProps {
  text: string;
  className?: string;
  delay?: number;
}

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
}

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
}

// Enhanced animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1],
      when: "beforeChildren",
      staggerChildren: 0.15
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

const heroVariants = {
  initial: { 
    y: 100, 
    opacity: 0,
    scale: 0.8
  },
  animate: { 
    y: 0, 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.23, 1, 0.32, 1],
      staggerChildren: 0.2
    }
  }
};

const titleVariants = {
  initial: { 
    y: 50, 
    opacity: 0,
    rotateX: -45
  },
  animate: { 
    y: 0, 
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 60,
    rotateY: -15,
    scale: 0.8
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1],
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }),
  hover: {
    y: -10,
    scale: 1.05,
    rotateY: 5,
    rotateX: 5,
    transition: {
      duration: 0.3,
      ease: [0.23, 1, 0.32, 1]
    }
  },
  tap: {
    scale: 0.95,
    rotateY: 0,
    rotateX: 0,
    transition: {
      duration: 0.2
    }
  }
};

const iconVariants = {
  rest: { 
    scale: 1, 
    rotate: 0,
    filter: 'brightness(1)'
  },
  hover: { 
    scale: 1.2, 
    rotate: [0, -10, 10, -5, 5, 0],
    filter: 'brightness(1.2)',
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

// Background floating elements with optimized effects
const FloatingElement = ({ delay = 0, duration = 20, size = 40, isDark = false }) => (
  <motion.div
    className={`absolute rounded-full ${isDark ? 'bg-purple-500/5' : 'bg-gradient-to-br from-purple-400/20 to-pink-400/20'} blur-xl`}
    style={{
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      x: [0, 50, -50, 0],
      y: [0, -50, 50, 0],
      scale: [1, 1.2, 1],
      opacity: [0.1, 0.3, 0.1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

// New: Magnetic Effect Component
const MagneticElement: React.FC<MagneticElementProps> = ({ children, strength = 0.3 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  );
};

// New: Sparkle Effect Component - Optimized
const SparkleEffect: React.FC<ComponentProps> = ({ isDark }) => {
  const sparkles = [...Array(8)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className={`absolute w-1 h-1 ${isDark ? 'bg-yellow-300' : 'bg-gradient-to-r from-yellow-400 to-orange-400'} rounded-full`}
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// New: Wave Effect Component
const WaveEffect: React.FC<ComponentProps> = ({ isDark }) => (
  <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
    <svg viewBox="0 0 1200 120" className="w-full h-32">
      <motion.path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        fill={isDark ? 'url(#waveGradientDark)' : 'url(#waveGradientLight)'}
        animate={{
          d: [
            "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
            "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z",
            "M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          ]
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut"
        }}
      />
      <defs>
        <linearGradient id="waveGradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(168, 85, 247, 0.1)" />
          <stop offset="50%" stopColor="rgba(236, 72, 153, 0.1)" />
          <stop offset="100%" stopColor="rgba(168, 85, 247, 0.1)" />
        </linearGradient>
        <linearGradient id="waveGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(147, 51, 234, 0.2)" />
          <stop offset="50%" stopColor="rgba(219, 39, 119, 0.2)" />
          <stop offset="100%" stopColor="rgba(147, 51, 234, 0.2)" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// New: Enhanced Particle System - Optimized
const ParticleSystem: React.FC<ComponentProps> = ({ isDark }) => {
  const particles = [...Array(15)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}          className={`absolute rounded-full ${
            isDark 
              ? 'bg-gradient-to-r from-purple-400/30 to-pink-400/30' 
              : 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30'
          }`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// New: Morphing Background Blobs - Optimized
const MorphingBlobs: React.FC<ComponentProps> = ({ isDark }) => {
  const blobs = [...Array(2)].map((_, i) => ({
    id: i,
    x: 20 + (i * 60),
    y: 20 + (i * 40),
    size: 250 + (i * 50),
    delay: i * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}          className={`absolute rounded-full blur-3xl ${
            isDark 
              ? 'bg-gradient-to-r from-purple-600/10 to-pink-600/10' 
              : 'bg-gradient-to-r from-indigo-400/25 to-purple-500/25'
          }`}
          style={{
            width: blob.size,
            height: blob.size,
            left: `${blob.x}%`,
            top: `${blob.y}%`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 15 + blob.delay,
            delay: blob.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// New: Typing Animation Component
const TypingAnimation: React.FC<TypingAnimationProps> = ({ text, className = "", delay = 0 }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 25 + delay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, delay]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  );
};

// New: Glitch Text Effect (unused - commented out)
/*
const GlitchText: React.FC<GlitchTextProps> = ({ children, className = "" }) => {
  return (
    <motion.div className={`relative ${className}`}>
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 text-red-500 mix-blend-multiply"
        animate={{
          x: [0, -2, 2, 0],
          y: [0, 1, -1, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-blue-500 mix-blend-multiply"
        animate={{
          x: [0, 2, -2, 0],
          y: [0, -1, 1, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
};
*/

// New: Holographic Card Effect
const HolographicCard: React.FC<HolographicCardProps> = ({ children, className = "" }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg)`,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${(mousePosition.x + 1) * 50}% ${(mousePosition.y + 1) * 50}%, rgba(168, 85, 247, 0.3) 0%, transparent 70%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

// New: Simple Grid Pattern (removed matrix animation)
const DynamicGridPattern: React.FC<ComponentProps> = ({ isDark }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern
            id="simpleGrid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"              stroke={isDark ? "#8B5CF6" : "#7C3AED"}
              strokeWidth="1"
              opacity="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#simpleGrid)" />
      </svg>
    </div>
  );
};

const staggerContainer = {
  hidden: { 
    opacity: 0 
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: [0.23, 1, 0.32, 1],
      duration: 0.8
    }
  }
};

const ServicesContent = () => {  const [mounted, setMounted] = React.useState(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const theme = useAppSelector((state: { theme: { theme: string } }) => state.theme.theme);
  const [isDark, setIsDark] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Enhanced scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };      const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setScrollProgress(Math.min(scrollPercent, 100));
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  React.useEffect(() => {
    setMounted(true);
    setIsDark(
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }, [theme]);

  if (!mounted) {
    return null;
  }

  const services = [
    {
      title: 'Word to PDF',
      description: 'Transform Word documents into professional PDFs in seconds. Perfect formatting, lightning-fast conversion.',
      icon: '/service_icons/wordtopdf.png',
      link: '/services/word-to-pdf',
      color: 'blue'
    },
    {
      title: 'Excel to PDF',
      description: 'Convert spreadsheets to pixel-perfect PDFs. Preserve all formulas, charts, and formatting with ease.',
      icon: '/service_icons/exceltopdf.png',
      link: '/services/excel-to-pdf',
      color: 'green'
    },
    {
      title: 'PPT to PDF',
      description: 'Turn presentations into stunning PDFs. Keep animations, transitions, and design elements intact.',
      icon: '/service_icons/ppttopdf.svg',
      link: '/services/ppt-to-pdf',
      color: 'orange'
    },
    {
      title: 'PDF to Word',
      description: 'Extract and edit PDF content effortlessly. Smart conversion preserves layouts, images, and formatting.',
      icon: '/service_icons/pdftoword.jpg',
      link: '/services/pdf-to-word',
      color: 'purple'
    },
    {
      title: 'PDF to Excel',
      description: 'Convert PDF tables into editable spreadsheets instantly. AI-powered accuracy for complex data.',
      icon: '/service_icons/pdftoexcel.png',
      link: '/services/pdf-to-excel',
      color: 'green'
    },
    {
      title: 'PDF to PPT',
      description: 'Transform PDFs into editable presentations. Maintain visual appeal with smart slide detection.',
      icon: '/service_icons/pdftoppt.jpg',
      link: '/services/pdf-to-ppt',
      color: 'orange'
    },
    {
      title: 'Merge PDFs',
      description: 'Combine multiple PDFs into one seamless document. Drag, drop, and done - it\'s that simple!',
      icon: '/service_icons/mergepdf.png',
      link: '/services/merge-pdf',
      color: 'red'
    },
    {
      title: 'Split PDF',
      description: 'Extract pages or create multiple PDFs from one file. Smart splitting with preview and custom ranges.',
      icon: '/service_icons/splitpdf.png',
      link: '/services/split-pdf',
      color: 'blue'
    },
    {
      title: 'Watermark',
      description: 'Protect your PDFs with custom watermarks. Add text, logos, or images with perfect placement and opacity.',
      icon: '/service_icons/watermark.png',
      link: '/services/watermark',
      color: 'purple'
    },
    {
      title: 'Word to JPG',
      description: 'Create high-quality JPG images from Word docs. Perfect for social media and web content sharing.',
      icon: '/service_icons/wordtojpg.jpg',
      link: '/services/word-to-jpg',
      color: 'purple'
    },
    {
      title: 'Word to PNG',
      description: 'Convert Word to transparent PNG images. Ideal for presentations and graphic design projects.',
      icon: '/service_icons/wordtopng.jpg',
      link: '/services/word-to-png',
      color: 'yellow'
    }  ];

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          ref={containerRef}
          key="services-page"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"          className={`min-h-screen pt-24 relative overflow-hidden ${
            isDark 
              ? 'bg-gray-900' 
              : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white'
          }`}>
          {/* Enhanced Animated Background */}
          <AnimatedBackground isDark={isDark} />
            {/* Enhanced Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating Elements - Reduced for Performance */}
            {[...Array(6)].map((_, i) => (
              <FloatingElement 
                key={i} 
                delay={i * 1} 
                duration={12 + i * 2} 
                size={15 + i * 5}
                isDark={isDark}
              />
            ))}
            
            {/* Morphing Blobs */}
            <MorphingBlobs isDark={isDark} />
              {/* Simple Grid Pattern */}
            <DynamicGridPattern isDark={isDark} />
            
            {/* Particle System */}
            <ParticleSystem isDark={isDark} />
            
            {/* Sparkle Effect */}
            <SparkleEffect isDark={isDark} />
            
            {/* Wave Effect */}
            <WaveEffect isDark={isDark} />          </div>          {/* Progress Ring */}
          <ProgressRing progress={scrollProgress} isDark={isDark} />

          {/* Floating Action Button */}
          <FloatingActionButton isDark={isDark} />

          {/* Enhanced Interactive Cursor Effect */}
          <motion.div
            className="fixed pointer-events-none z-30"
            style={{
              left: mousePosition.x - 20,
              top: mousePosition.y - 20,
            }}
          >
            <motion.div
              className={`w-10 h-10 rounded-full border-2 ${
                isDark ? 'border-purple-400/50' : 'border-purple-500/50'
              }`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <motion.div
              className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
                isDark ? 'bg-purple-400' : 'bg-purple-600'
              }`}
              animate={{
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
          </motion.div>          {/* Scroll Progress Indicator */}
          <motion.div
            className={`fixed top-0 left-0 right-0 h-1 z-40 ${              isDark 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                : 'bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400'
            }`}
            style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
          /><div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
            {/* Enhanced Hero Section with Parallax */}
            <motion.div 
              className="text-center mb-20 mt-8"
              variants={heroVariants}
              style={{ y }}
            >
              <motion.div
                variants={titleVariants}
                className="relative"
              >
                {/* Animated Background Text */}
                <motion.div
                  className={`absolute inset-0 text-5xl md:text-7xl font-black opacity-5 ${
                    isDark ? 'text-purple-500' : 'text-purple-300'
                  }`}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 1, -1, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  SERVICES
                </motion.div>                <motion.h1                  className={`relative text-5xl md:text-7xl font-black mb-8 leading-tight ${
                    isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
                  }`}                  style={{
                    textShadow: isDark ? '0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(168, 85, 247, 0.3)' : '0 0 40px rgba(147, 51, 234, 0.4), 0 0 80px rgba(147, 51, 234, 0.2)',
                    backgroundSize: '200% 100%'
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Our Services
                </motion.h1>
                  {/* Enhanced animated underline with shimmer effect */}
                <div className="flex justify-center">
                  <div className="relative">
                    <motion.div
                      className={`h-1.5 rounded-full ${
                        isDark 
                          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500' 
                          : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: '220px' }}
                      transition={{ delay: 0.5, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    />
                    <motion.div
                      className={`absolute top-0 h-1.5 rounded-full ${
                        isDark 
                          ? 'bg-gradient-to-r from-transparent via-white/50 to-transparent' 
                          : 'bg-gradient-to-r from-transparent via-white/70 to-transparent'
                      }`}
                      initial={{ width: 0, x: 0 }}
                      animate={{ 
                        width: ['0px', '80px', '0px'],
                        x: ['0px', '140px', '220px']
                      }}
                      transition={{ 
                        delay: 1.5, 
                        duration: 2.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </div>
                
                <motion.div
                  className={`h-0.5 mx-auto mt-2 rounded-full ${
                    isDark 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
                      : 'bg-gradient-to-r from-pink-600 to-purple-600'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: '140px' }}
                  transition={{ delay: 0.8, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                />
              </motion.div>              <motion.div                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${
                  isDark ? 'text-purple-200/90' : 'text-slate-700'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <TypingAnimation 
                  text="Transform your documents with our comprehensive suite of powerful conversion tools. Lightning-fast, secure, and professional results every time."
                  delay={1000}
                  className="block"
                />              </motion.div>

              {/* Enhanced floating stats with 3D effects */}
              <motion.div
                className="flex justify-center gap-8 mt-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                {[
                  { number: '1M+', label: 'Documents Processed', icon: '📄' },
                  { number: '99.9%', label: 'Uptime', icon: '⚡' },
                  { number: '11', label: 'Conversion Tools', icon: '🛠️' }
                ].map((stat, index) => (
                  <MagneticElement key={stat.label} strength={0.2}>
                    <motion.div
                      className={`text-center p-4 rounded-2xl ${
                        isDark                          ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20' 
                          : 'bg-gradient-to-br from-purple-100/50 to-pink-100/50 border border-purple-300/30'
                      } backdrop-blur-md`}
                      whileHover={{ 
                        scale: 1.1, 
                        y: -10,
                        rotateY: 10,
                        boxShadow: isDark 
                          ? '0 20px 40px rgba(168, 85, 247, 0.3)' 
                          : '0 20px 40px rgba(147, 51, 234, 0.2)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div className="text-3xl mb-2">
                        {stat.icon}
                      </motion.div>
                      <motion.div
                        className={`text-2xl md:text-3xl font-bold ${
                          isDark ? 'text-pink-400' : 'text-pink-600'
                        }`}
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        {stat.number}
                      </motion.div>
                      <div className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                        {stat.label}
                      </div>
                    </motion.div>
                  </MagneticElement>
                ))}
              </motion.div>
            </motion.div>            {/* Ultra-Enhanced Services Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >              {services.map((service, index) => (
                <MagneticElement key={service.title} strength={0.15}>
                  <HolographicCard className="h-full">
                    <motion.div
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      whileTap="tap"
                      onHoverStart={() => setActiveCard(index)}
                      onHoverEnd={() => setActiveCard(null)}
                      className="group perspective-1000 relative h-full"
                    >
                      <Link href={service.link} className="block h-full">                        <div className={`relative rounded-3xl p-8 backdrop-blur-lg transition-all duration-500 transform-gpu overflow-hidden h-full flex flex-col ${                            isDark 
                              ? 'bg-gradient-to-br from-gray-900/80 via-purple-900/20 to-gray-900/80 shadow-2xl border border-purple-500/20 hover:border-purple-400/50 hover:shadow-purple-500/25' 
                              : 'bg-gradient-to-br from-white/95 via-purple-50/80 to-pink-50/90 shadow-xl border border-purple-200/60 hover:border-purple-400/80 hover:shadow-purple-400/30'
                          } hover:shadow-2xl group-hover:bg-gradient-to-br ${
                            isDark 
                              ? 'group-hover:from-purple-900/50 group-hover:to-pink-900/30' 
                              : 'group-hover:from-indigo-100/90 group-hover:to-purple-100/80'
                          }`}>
                        
                        {/* Advanced animated background glow */}
                        <motion.div
                          className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                          animate={activeCard === index ? {
                            background: isDark 
                              ? [
                                  'radial-gradient(circle at 0% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                                  'radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
                                  'radial-gradient(circle at 0% 100%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                                  'radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)'
                                ]
                              : [
                                  'radial-gradient(circle at 0% 0%, rgba(147, 51, 234, 0.25) 0%, transparent 50%)',
                                  'radial-gradient(circle at 100% 100%, rgba(219, 39, 119, 0.25) 0%, transparent 50%)',
                                  'radial-gradient(circle at 0% 100%, rgba(147, 51, 234, 0.25) 0%, transparent 50%)',
                                  'radial-gradient(circle at 100% 0%, rgba(219, 39, 119, 0.25) 0%, transparent 50%)'
                                ]
                          } : {}}
                          transition={{ duration: 3, repeat: Infinity }}
                        />

                        {/* Shimmer effect on hover */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100"
                          animate={activeCard === index ? {
                            background: [
                              'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                              'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 60%, transparent 80%)',
                              'linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.1) 70%, transparent 90%)'
                            ],
                            x: [-100, 100, 300]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        />

                        <div className="relative z-10 flex items-start space-x-6">
                          <motion.div 
                            className="flex-shrink-0 relative"
                            variants={iconVariants}
                            initial="rest"
                            whileHover="hover"
                          >                            {/* Enhanced icon background effects with multiple layers */}
                            <motion.div
                              className={`absolute inset-0 rounded-2xl ${
                                isDark ? 'bg-purple-500/15' : 'bg-gradient-to-br from-purple-400/20 to-pink-500/25'
                              } blur-xl`}
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.4, 0.8, 0.4],
                                rotate: [0, 180, 360],
                              }}
                              transition={{
                                duration: 6,
                                repeat: Infinity,
                                delay: index * 0.4
                              }}
                            />
                            
                            {/* Secondary glow layer */}
                            <motion.div
                              className={`absolute inset-0 rounded-2xl ${
                                isDark ? 'bg-pink-500/10' : 'bg-gradient-to-br from-pink-400/15 to-purple-400/20'
                              } blur-lg`}
                              animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.3, 0.6, 0.3],
                                rotate: [360, 180, 0],
                              }}
                              transition={{
                                duration: 8,
                                repeat: Infinity,
                                delay: index * 0.2
                              }}
                            />
                              {/* Enhanced pulsing ring effect */}
                            <motion.div
                              className={`absolute inset-0 rounded-2xl border-2 ${
                                isDark ? 'border-purple-400/40' : 'border-indigo-500/50'
                              }`}
                              animate={{
                                scale: [1, 1.3, 1.6],
                                opacity: [0.7, 0.3, 0],
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: index * 0.3
                              }}
                            />
                            
                            <motion.div
                              className="relative z-10 p-3 rounded-2xl backdrop-blur-md bg-white/10"
                              whileHover={{
                                scale: 1.1,
                                rotate: [0, -5, 5, 0],
                                transition: { duration: 0.5 }
                              }}
                            >
                              <Image
                                src={service.icon}
                                alt={service.title}
                                width={64}
                                height={64}
                                className="rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                              />
                            </motion.div>
                          </motion.div>
                          
                          <div className="flex-1">
                            <motion.h3                              className={`text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 ${
                                isDark 
                                  ? 'text-white group-hover:text-purple-300' 
                                  : 'text-slate-800 group-hover:text-indigo-700'
                              }`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              {service.title}
                              
                              {/* Animated underline for titles */}
                              <motion.div
                                className={`h-0.5 mt-1 rounded-full ${
                                  isDark ? 'bg-purple-400' : 'bg-purple-600'
                                }`}
                                initial={{ width: 0 }}
                                whileHover={{ width: '100%' }}
                                transition={{ duration: 0.3 }}
                              />
                            </motion.h3>
                            
                            <motion.p                              className={`leading-relaxed transition-colors duration-300 mb-4 ${
                                isDark 
                                  ? 'text-gray-300 group-hover:text-gray-200' 
                                  : 'text-slate-600 group-hover:text-slate-700'
                              }`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.2 }}
                            >
                              {service.description}
                            </motion.p>

                            {/* Enhanced animated CTA */}
                            <motion.div                              className={`flex items-center text-sm font-medium group ${
                                isDark ? 'text-purple-400' : 'text-indigo-600'
                              }`}
                              initial={{ x: 0 }}
                              whileHover={{ x: 8 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="mr-2">Try now</span>
                              <motion.div
                                className="flex items-center"
                                animate={activeCard === index ? { x: [0, 5, 0] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <motion.span
                                  className="text-lg"
                                  animate={{ rotate: activeCard === index ? 360 : 0 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  →
                                </motion.span>
                              </motion.div>
                            </motion.div>
                          </div>
                        </div>
                        
                        {/* Corner decoration */}
                        <motion.div
                          className={`absolute top-4 right-4 w-2 h-2 rounded-full ${
                            isDark ? 'bg-purple-400' : 'bg-purple-600'
                          }`}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.1
                          }}
                        />                      </div>
                    </Link>
                  </motion.div>
                  </HolographicCard>
                </MagneticElement>
              ))}
            </motion.div>            {/* Enhanced Call to Action Section */}
            <motion.div
              className="text-center mt-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              {/* Animated title */}
              <motion.h3                className={`text-3xl md:text-4xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.7, duration: 0.6 }}
              >
                Ready to Transform Your Documents?
              </motion.h3>
              
              {/* Enhanced CTA button with multiple effects */}
              <MagneticElement strength={0.2}>
                <motion.div                  className={`inline-block relative px-12 py-6 rounded-full ${
                    isDark 
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600' 
                      : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                  } text-white font-bold text-xl shadow-2xl cursor-pointer overflow-hidden group`}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: isDark 
                      ? '0 25px 50px rgba(168, 85, 247, 0.4)' 
                      : '0 25px 50px rgba(147, 51, 234, 0.4)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    y: [0, -8, 0],
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    backgroundPosition: { duration: 4, repeat: Infinity, ease: "linear" }
                  }}
                  style={{
                    backgroundSize: '200% 100%',
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: [-100, 300],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  
                  {/* Button content */}
                  <span className="relative z-10 flex items-center justify-center space-x-3">
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      🚀
                    </motion.span>
                    <span>Start Converting Your Files Today!</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                  
                  {/* Ripple effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ 
                      scale: 1.1, 
                      opacity: 0.3,
                      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              </MagneticElement>
              
              {/* Additional CTA text */}
              <motion.p                className={`mt-6 text-lg ${
                  isDark ? 'text-purple-200' : 'text-slate-600'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
              >
                Join thousands of users who trust our conversion tools
              </motion.p>
            </motion.div>
          </div>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  );
};

const ServicesPage = () => (
  <ReduxProvider>
    <ServicesContent />
  </ReduxProvider>
);

export default ServicesPage;
// New: Floating Action Button Component
const FloatingActionButton: React.FC<ComponentProps> = ({ isDark }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}          className={`fixed bottom-8 right-8 z-30 p-4 rounded-full shadow-lg ${
            isDark 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500' 
              : 'bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 hover:from-pink-300 hover:to-orange-300'
          } text-white transition-all duration-300 hover:scale-110 hover:shadow-xl`}
          whileHover={{ 
            rotate: 360,
            boxShadow: isDark ? '0 0 30px rgba(168, 85, 247, 0.6)' : '0 0 30px rgba(147, 51, 234, 0.6)'
          }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// New: Progress Ring Component
const ProgressRing: React.FC<{ progress: number; isDark: boolean }> = ({ progress, isDark }) => {
  const circumference = 2 * Math.PI * 20;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return (
    <div className="fixed top-4 right-4 z-30">
      <svg className="w-16 h-16 transform -rotate-90" width="64" height="64">
        <circle
          cx="32"
          cy="32"
          r="20"
          stroke={isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(147, 51, 234, 0.2)'}
          strokeWidth="4"
          fill="transparent"
        />
        <motion.circle
          cx="32"
          cy="32"
          r="20"
          stroke={isDark ? '#a855f7' : '#7c3aed'}
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.3 }}
          strokeLinecap="round"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${
        isDark ? 'text-purple-400' : 'text-purple-600'
      }`}>
        {Math.round(progress)}%
      </div>
    </div>
  );
};

// Enhanced Background with animated gradients - Optimized
const AnimatedBackground: React.FC<ComponentProps> = ({ isDark }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Simplified animated gradient orbs */}
      <motion.div        className={`absolute -top-40 -right-40 w-60 h-60 rounded-full blur-3xl ${
          isDark ? 'bg-purple-600/15' : 'bg-gradient-to-br from-indigo-400/30 to-purple-500/30'
        }`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div        className={`absolute -bottom-40 -left-40 w-60 h-60 rounded-full blur-3xl ${
          isDark ? 'bg-pink-600/15' : 'bg-gradient-to-br from-pink-400/30 to-rose-500/30'
        }`}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};