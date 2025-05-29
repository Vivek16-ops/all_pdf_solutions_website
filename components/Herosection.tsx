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
    ? "bg-gradient-to-br from-black via-purple-950 to-black pt-32 pb-16 px-4 md:px-8 flex flex-col items-center text-center"
    : "bg-gradient-to-br from-purple-100 via-pink-50 to-white pt-32 pb-16 px-4 md:px-8 flex flex-col items-center text-center";

  const h1Class = isDark
    ? "text-4xl md:text-6xl font-extrabold text-purple-100 drop-shadow-lg mb-4"
    : "text-4xl md:text-6xl font-extrabold text-purple-700 drop-shadow-lg mb-4";

  const h2Class = isDark
    ? "text-xl md:text-2xl font-semibold text-purple-200 mb-3"
    : "text-xl md:text-2xl font-semibold text-purple-700/90 mb-3";

  const pClass = isDark
    ? "max-w-xl text-purple-200/80 text-base md:text-lg"
    : "max-w-xl text-purple-900/80 text-base md:text-lg";
  return (
    <motion.section 
      className={sectionClass}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1 
        className={h1Class}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <TypewriterText texts={props.typewriterTexts} />
      </motion.h1>
      <motion.h2 
        className={h2Class}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {props.subtitle}
      </motion.h2>
      <motion.p 
        className={pClass}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {props.description}
      </motion.p>
    </motion.section>
  );
};

// TypewriterText functionality
function TypewriterText({ texts, speed = 70, pause = 1200 }: { texts: string[]; speed?: number; pause?: number }) {
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
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default Herosection;