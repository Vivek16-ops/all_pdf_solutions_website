'use client';
import Herosection from "@/components/Herosection";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import ServiceShowcase from "@/components/ServiceShowcase";
import { motion, AnimatePresence } from 'framer-motion';

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

export default function Home() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home-page"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Herosection
          typewriterTexts={["Merge PDFs", "Combine Documents", "Fast & Secure"]}
          subtitle="Easily merge your PDF files online"
          description="Upload your PDF documents and combine them into a single file in seconds. No registration required."
        />
        <ServiceShowcase />
        <Features />
        <Pricing />
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}
