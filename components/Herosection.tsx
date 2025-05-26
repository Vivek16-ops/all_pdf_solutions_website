"use client"
import React from "react";
import { useAppSelector } from "@/store/hooks";


const Herosection: React.FC = () => {
  const theme = useAppSelector((state: any) => state.theme.theme);

  // Define color classes based on theme
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const sectionClass = isDark
    ? "bg-gradient-to-br from-black via-purple-950 to-black py-16 px-4 md:px-8 flex flex-col items-center text-center"
    : "bg-gradient-to-br from-purple-100 via-pink-50 to-white py-16 px-4 md:px-8 flex flex-col items-center text-center";

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
    <section className={sectionClass}>
      <h1 className={h1Class}>
        Merge PDFs Effortlessly
      </h1>
      <h2 className={h2Class}>
        Your All-in-One PDF Solution
      </h2>
      <p className={pClass}>
        Combine, organize, and manage your PDF files in seconds. No downloads, no hassle—just fast, secure, and easy PDF merging right in your browser.
      </p>
    </section>
  );
};

export default Herosection;