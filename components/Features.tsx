'use client'
import React from "react";
import { useAppSelector } from "@/store/hooks";
import { motion } from "framer-motion";
import { AiFillFilePdf, AiFillFileWord, AiFillFileExcel, AiFillFilePpt } from "react-icons/ai";
import { BsFillFileEarmarkPdfFill, BsFileImage, BsImages } from "react-icons/bs";
import { FaFileImport, FaFileExport } from "react-icons/fa";
import { MdOutlineSplitscreen, MdBrandingWatermark, MdSecurity } from "react-icons/md";

const features = [
  {
    icon: <MdSecurity className="w-full h-full" />,
    title: "100% Secure",
    desc: "All processing happens in your browser. Your files stay private and are never uploaded to any server.",
    color: "pink",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: <AiFillFilePdf className="w-full h-full" />,
    title: "Lightning Fast",
    desc: "Experience instant conversions with our optimized processing engine. No waiting, no delays.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <BsFileImage className="w-full h-full" />,
    title: "Easy to Use",
    desc: "Simple drag & drop interface with instant previews. No technical knowledge required.",
    color: "purple",
    gradient: "from-purple-500 to-indigo-500"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { y: 40, opacity: 0, scale: 0.9 },
  show: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const Features: React.FC = () => {
  const theme = useAppSelector((state: any) => state.theme.theme);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }, [theme]);

  return (
    <section className={`      w-full py-24 px-4 relative overflow-hidden
      ${isDark 
        ? "bg-gradient-to-b from-gray-950 via-purple-950/50 to-gray-900" 
        : "bg-gradient-to-b from-white via-purple-50/50 to-pink-50"}
    `}>
      {/* Enhanced Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating element */}
        <motion.div 
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-15 ${
            isDark ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-purple-300 to-pink-300'
          }`}
          style={{ top: '-10%', left: '-10%' }}
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
        {/* Secondary floating element */}
        <motion.div 
          className={`absolute w-80 h-80 rounded-full blur-3xl opacity-10 ${
            isDark ? 'bg-gradient-to-br from-blue-600 to-cyan-600' : 'bg-gradient-to-br from-blue-300 to-cyan-300'
          }`}
          style={{ bottom: '-10%', right: '-10%' }}
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Tertiary floating element */}
        <motion.div 
          className={`absolute w-64 h-64 rounded-full blur-3xl opacity-8 ${
            isDark ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-indigo-300 to-purple-300'
          }`}
          style={{ top: '50%', left: '80%' }}
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced header section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.h2 
            className={`text-4xl md:text-6xl font-bold mb-8 relative ${
              isDark ? 'text-transparent' : 'text-transparent'
            }`}            style={{
              backgroundImage: isDark
                ? 'linear-gradient(135deg, #a855f7 0%, #ec4899 25%, #06b6d4 50%, #8b5cf6 75%, #a855f7 100%)'
                : 'linear-gradient(135deg, #9333ea 0%, #db2777 25%, #0891b2 50%, #9333ea 75%, #db2777 100%)',
              backgroundSize: '300% 300%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Why Choose Us?
            
            {/* Animated underline */}
            <motion.div
              className={`absolute bottom-0 left-1/2 h-1 ${
                isDark 
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500' 
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600'
              } rounded-full`}
              style={{ backgroundSize: '200% 100%' }}
              initial={{ width: 0, x: '-50%' }}
              whileInView={{ width: '60%' }}
              animate={{
                backgroundPosition: ['0% 50%', '200% 50%', '0% 50%']
              }}
              transition={{ 
                width: { duration: 1, delay: 0.5 },
                backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
              viewport={{ once: true }}
            />
          </motion.h2>
          
          <motion.p 
            className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${
              isDark ? 'text-purple-300/90' : 'text-purple-700/90'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Experience the most reliable, secure, and user-friendly document conversion platform
          </motion.p>
        </motion.div>

        {/* Enhanced features grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              whileTap={{ scale: 0.98 }}
              className={`
                group relative overflow-hidden rounded-3xl p-8 backdrop-blur-sm 
                transition-all duration-300 cursor-pointer
                ${isDark 
                  ? 'bg-gray-900/50 hover:bg-gray-800/60 border border-gray-800 hover:border-purple-500/50' 
                  : 'bg-white/80 hover:bg-white/95 border border-gray-100 hover:border-purple-300/50'}
                shadow-xl hover:shadow-2xl
              `}
            >
              {/* Animated background gradient */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${
                  isDark 
                    ? `from-${feature.color}-600/10 to-${feature.color}-800/10` 
                    : `from-${feature.color}-100/50 to-${feature.color}-200/50`
                } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              
              {/* Multi-layered glow effect */}
              <motion.div
                className={`absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500 shadow-2xl`}
                style={{
                  background: isDark 
                    ? `linear-gradient(135deg, ${feature.gradient.replace('from-', '').replace('to-', ', ')})` 
                    : `linear-gradient(135deg, ${feature.gradient.replace('from-', '').replace('to-', ', ')})`
                }}
              />

              <div className="relative z-10">
                {/* Enhanced icon container */}
                <motion.div 
                  className={`
                    flex-shrink-0 w-16 h-16 mb-6 relative
                    ${isDark 
                      ? `text-${feature.color}-400 group-hover:text-${feature.color}-300`
                      : `text-${feature.color}-600 group-hover:text-${feature.color}-700`}
                    transition-all duration-300
                  `}
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.15,
                    transition: { duration: 0.5 }
                  }}
                >
                  {/* Icon background glow */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                    style={{
                      background: `linear-gradient(135deg, ${feature.gradient.replace('from-', '').replace('to-', ', ')})`
                    }}
                  />
                  <div className="relative z-10">
                    {feature.icon}
                  </div>
                </motion.div>

                {/* Enhanced content */}
                <div>
                  <h3 className={`
                    text-2xl font-bold mb-4 transition-colors duration-300
                    ${isDark ? "text-white group-hover:text-purple-100" : "text-gray-900 group-hover:text-purple-900"}
                  `}>
                    {feature.title}
                  </h3>
                  <p className={`
                    leading-relaxed text-lg
                    ${isDark 
                      ? "text-gray-400 group-hover:text-gray-300" 
                      : "text-gray-600 group-hover:text-gray-700"}
                    transition-colors duration-300
                  `}>
                    {feature.desc}
                  </p>
                </div>
              </div>

              {/* Shimmer effect */}
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
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
