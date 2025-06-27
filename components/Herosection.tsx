"use client"
import React from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/store/hooks";

interface HerosectionProps {
  typewriterTexts: string[];
  subtitle: string;
  description: string;
}

const Herosection: React.FC<HerosectionProps> = (props) => {
  const theme = useAppSelector((state: any) => state.theme.theme);
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

  const sectionClass = isDark
    ? "relative pt-32 pb-20 px-4 md:px-8 flex flex-col items-center text-center overflow-hidden"
    : "relative pt-32 pb-20 px-4 md:px-8 flex flex-col items-center text-center overflow-hidden";

  return (
    <motion.section 
      className={sectionClass}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Enhanced background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className={`text-[20vw] font-black opacity-5 select-none ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.05 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          PDF
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto">        {/* Enhanced main title with purple gradient (no glow animations) */}
        <motion.div className="relative mb-6 perspective-1000">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-black relative text-transparent z-20"
            style={{
              backgroundImage: isDark
                ? 'linear-gradient(135deg, #a855f7 0%, #d946ef 30%, #ec4899 60%, #be185d 90%, #a855f7 100%)'
                : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 25%, #d946ef 50%, #ec4899 75%, #be185d 100%)',
              backgroundSize: '200% 200%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
              transform: 'perspective(1500px) rotateX(8deg) translateZ(50px)',
              transformStyle: 'preserve-3d'
            }}
            initial={{ y: 50, opacity: 0, rotateX: 25, scale: 0.8 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              rotateX: 8,
              scale: 1,
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              y: { duration: 1, delay: 0.2, ease: "easeOut" },
              opacity: { duration: 1, delay: 0.2 },
              rotateX: { duration: 1, delay: 0.2, ease: "easeOut" },
              scale: { duration: 1, delay: 0.2, ease: "easeOut" },
              backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" }
            }}
            whileHover={{
              scale: 1.05,
              rotateX: 2,
              y: -8,
              transition: { duration: 0.4, ease: "easeOut" }            }}
          >
            <TypewriterText texts={props.typewriterTexts} />
          </motion.h1>
        </motion.div>        {/* Purple-themed 3D subtitle (no glow animations) */}
        <motion.h2
          className="text-xl md:text-3xl lg:text-4xl font-bold mb-8 text-transparent relative z-10"
          style={{
            backgroundImage: isDark 
              ? 'linear-gradient(135deg, #c4b5fd 0%, #ddd6fe 25%, #e0e7ff 50%, #c4b5fd 75%, #ddd6fe 100%)' 
              : 'linear-gradient(135deg, #6b21a8 0%, #7c3aed 25%, #a855f7 50%, #d946ef 75%, #6b21a8 100%)',
            backgroundSize: '200% 200%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
            transform: 'perspective(1200px) rotateX(5deg) translateZ(25px)',
            transformStyle: 'preserve-3d'
          }}
          initial={{ y: 30, opacity: 0, rotateX: 15, scale: 0.9 }}
          animate={{ 
            y: 0, 
            opacity: 1, 
            rotateX: 5, 
            scale: 1,
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ 
            y: { duration: 1, delay: 0.5, ease: "easeOut" },
            opacity: { duration: 1, delay: 0.5 },
            rotateX: { duration: 1, delay: 0.5, ease: "easeOut" },
            scale: { duration: 1, delay: 0.5, ease: "easeOut" },
            backgroundPosition: { duration: 10, repeat: Infinity, ease: "linear" }
          }}
          whileHover={{
            scale: 1.03,
            rotateX: 0,
            y: -4,
            transition: { duration: 0.4, ease: "easeOut" }
          }}
        >
          {props.subtitle}
        </motion.h2>        {/* Purple-themed 3D description (no glow animations) */}
        <motion.p 
          className={`max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl leading-relaxed font-medium relative z-10 ${
            isDark ? 'text-purple-200' : 'text-purple-800'
          }`}
          style={{
            filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))',
            transform: 'perspective(1000px) rotateX(3deg) translateZ(15px)',
            transformStyle: 'preserve-3d'
          }}
          initial={{ y: 30, opacity: 0, rotateX: 12, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, rotateX: 3, scale: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          whileHover={{
            scale: 1.02,
            rotateX: 0,
            y: -3,
            transition: { duration: 0.4, ease: "easeOut" }
          }}
        >
          {props.description}
        </motion.p>        {/* Purple-themed call-to-action button (simplified) */}
        <motion.div
          className="mt-16"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center px-10 py-5 rounded-2xl font-bold text-xl cursor-pointer relative overflow-hidden group text-white"            style={{
              backgroundImage: isDark
                ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 25%, #d946ef 50%, #ec4899 75%, #be185d 100%)'
                : 'linear-gradient(135deg, #6b21a8 0%, #7c3aed 25%, #a855f7 50%, #d946ef 75%, #ec4899 100%)',
              backgroundSize: '200% 200%',
              boxShadow: isDark
                ? '0 8px 25px rgba(168, 85, 247, 0.3), 0 4px 12px rgba(217, 70, 239, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 8px 25px rgba(124, 58, 237, 0.3), 0 4px 12px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              transform: 'perspective(1500px) rotateX(-5deg) translateZ(40px)',
              transformStyle: 'preserve-3d'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" }
            }}
            whileHover={{ 
              scale: 1.08,
              rotateX: 0,
              y: -12,
              boxShadow: isDark 
                ? '0 20px 40px rgba(168, 85, 247, 0.4), 0 8px 20px rgba(217, 70, 239, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                : '0 20px 40px rgba(124, 58, 237, 0.4), 0 8px 20px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              transition: { duration: 0.4, ease: "easeOut" }
            }}
            whileTap={{ 
              scale: 1.02,
              rotateX: -8,
              y: 0,
              transition: { duration: 0.15 }
            }}
          >
            {/* Simplified shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              style={{
                transform: 'skewX(-20deg)'
              }}
              animate={{
                x: ['-200%', '200%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut"
              }}
            />
            
            <span className="relative z-20 font-black">Get Started - It's Free!</span>
          </motion.div>
        </motion.div>        {/* Purple-themed trust indicators (no glow animations) */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <motion.div 
            className={`text-sm md:text-base font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
          >
            ✓ No Registration Required
          </motion.div>
          <motion.div 
            className={`text-sm md:text-base font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
          >
            ✓ 100% Secure & Private
          </motion.div>
          <motion.div 
            className={`text-sm md:text-base font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
          >
            ✓ Lightning Fast
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Enhanced TypewriterText with purple cursor (no glow)
function TypewriterText({ texts, speed = 25, pause = 1200 }: { texts: string[]; speed?: number; pause?: number }) {
  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    if (subIndex === texts[index].length + 1 && !deleting) {
      const timeout = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(timeout);
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) =>
        deleting ? prev - 1 : prev + 1
      );
    }, deleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, texts, index, speed, pause]);

  return (
    <span>
      {texts[index].substring(0, subIndex)}
      <motion.span 
        className="text-purple-500"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        |
      </motion.span>
    </span>
  );
}

export default Herosection;