'use client';
import React from 'react';
import { useAppSelector } from '@/store/hooks';
import Footer from '@/components/Footer';
import { ReduxProvider } from '@/store/Provider';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
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

const fadeInUp = {
  initial: { 
    y: 20, 
    opacity: 0 
  },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    }
  }
};

const staggerContainer = {
  hidden: { 
    opacity: 0 
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: [0.25, 0.1, 0.25, 1],
      duration: 0.6
    }
  }
};

const ServicesContent = () => {
  const [mounted, setMounted] = React.useState(false);
  const theme = useAppSelector((state: any) => state.theme.theme);
  const [isDark, setIsDark] = React.useState(false);

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
    }
  ];

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key="services-page"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`min-h-screen pt-6 ${isDark ? 'bg-gradient-to-br from-black via-purple-950 to-black' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white'}`}
        >
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              variants={fadeInUp}
            >
              <motion.h1 
                className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}
                variants={fadeInUp}
              >
                Our Services
              </motion.h1>
              <motion.p 
                className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-purple-300/90' : 'text-purple-700/90'}`}
                variants={fadeInUp}
              >
                Transform your documents with our comprehensive suite of PDF tools.
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={service.link}>
                    <div className={`rounded-2xl p-6 backdrop-blur-sm transition-colors ${
                      isDark 
                        ? 'bg-gray-900/50 shadow-xl border border-gray-800 hover:border-purple-500' 
                        : 'bg-white/80 shadow-lg border border-gray-100 hover:border-purple-300'
                    }`}>
                      <div className="flex items-start space-x-4">
                        <motion.div 
                          className="flex-shrink-0"
                          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >                        <Image
                          src={service.icon}
                          alt={service.title}
                          width={48}
                          height={48}
                          className="opacity-100"
                        />
                        </motion.div>
                        <div>                        <motion.h3 
                            className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-purple-700'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {service.title}
                          </motion.h3>
                          <motion.p 
                            className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          >
                            {service.description}
                          </motion.p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
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