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
    color: "pink"
  },
  {
    icon: <AiFillFilePdf className="w-full h-full" />,
    title: "Lightning Fast",
    desc: "Experience instant conversions with our optimized processing engine. No waiting, no delays.",
    color: "red"
  },
  {
    icon: <BsFileImage className="w-full h-full" />,
    title: "Easy to Use",
    desc: "Simple drag & drop interface with instant previews. No technical knowledge required.",
    color: "purple"
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
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
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
    <section className={`
      w-full py-20 px-4 relative overflow-hidden
      ${isDark 
        ? "bg-gradient-to-b from-gray-950 via-purple-950 to-gray-900" 
        : "bg-gradient-to-b from-purple-50 via-pink-50 to-white"}
    `}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute w-96 h-96 rounded-full blur-3xl -top-48 -left-48 opacity-20 
          ${isDark ? 'bg-purple-600' : 'bg-purple-300'}`}></div>
        <div className={`absolute w-96 h-96 rounded-full blur-3xl -bottom-48 -right-48 opacity-20 
          ${isDark ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
      </div>      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className={`
            text-4xl md:text-5xl font-bold mb-6
            ${isDark ? "text-purple-200" : "text-purple-800"}
          `}>
            Why Choose Us?
          </h2>
          <p className={`
            text-xl max-w-3xl mx-auto
            ${isDark ? "text-purple-300/90" : "text-purple-700/90"}
          `}>
            Experience the most reliable, secure, and user-friendly document conversion platform
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ scale: 1.02, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`
                group relative overflow-hidden rounded-2xl p-6 backdrop-blur-sm 
                transition-all duration-300 cursor-pointer
                ${isDark 
                  ? 'bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-purple-500' 
                  : 'bg-white/80 hover:bg-white/90 border border-gray-100 hover:border-purple-300'}
                shadow-lg hover:shadow-xl
              `}
            >
              <div className="flex items-start space-x-4">                <motion.div 
                  className={`
                    flex-shrink-0 w-12 h-12 
                    ${isDark 
                      ? "text-" + feature.color + "-400 group-hover:text-" + feature.color + "-300"
                      : "text-" + feature.color + "-500 group-hover:text-" + feature.color + "-600"}
                    transition-colors duration-200
                  `}
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1,
                    transition: { duration: 0.3 }
                  }}
                >
                  {feature.icon}
                </motion.div>
                <div>                  <h3 className={`
                    text-xl font-bold mb-2
                    ${isDark ? "text-white" : "text-gray-900"}
                    transition-colors duration-200
                  `}>
                    {feature.title}
                  </h3>
                  <p className={`
                    ${isDark ? "text-gray-400" : "text-gray-600"}
                    group-hover:text-${isDark ? 'gray-300' : 'gray-700'}
                  `}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
