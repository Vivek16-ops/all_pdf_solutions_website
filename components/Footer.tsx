'use client'
import React from 'react';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { motion } from 'framer-motion';

const paymentLogos = [
  { src: '/visa.png', alt: 'Visa' },
  { src: '/rupay.png', alt: 'RuPay' },
  { src: '/mastercard.png', alt: 'Mastercard' },
  { src: '/american_express.png', alt: 'American Express' },
];

const Footer = () => {
  const theme = useAppSelector((state: any) => state.theme.theme);
  const [mounted, setMounted] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(
      theme === 'dark' || 
      (theme === 'system' && darkModeMediaQuery.matches)
    );
    setMounted(true);

    const updateTheme = () => {
      setIsDark(
        theme === 'dark' || 
        (theme === 'system' && darkModeMediaQuery.matches)
      );
    };

    darkModeMediaQuery.addEventListener('change', updateTheme);
    return () => darkModeMediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  // Return a light theme version for server-side rendering and initial mount
  if (!mounted) {
    return (
      <footer className="w-full transition-colors duration-300 bg-gradient-to-br from-purple-50 via-pink-50 to-white border-t border-purple-200 py-12 px-4">
        <div className="max-w-7xl mx-auto h-40 animate-pulse" />
      </footer>
    );
  }
  const footerClass = `w-full relative overflow-hidden transition-colors duration-300 ${
    isDark
      ? 'bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-900 text-gray-200 border-t border-purple-800/40'
      : 'bg-gradient-to-br from-white via-purple-50/50 to-pink-50 text-gray-800 border-t border-purple-200/50'
  } py-12 px-4`;

  return (
    <footer className={footerClass}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className={`absolute w-64 h-64 rounded-full blur-3xl opacity-5 ${
            isDark ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-purple-300 to-pink-300'
          }`}
          style={{ top: '10%', left: '10%' }}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className={`absolute w-48 h-48 rounded-full blur-3xl opacity-5 ${
            isDark ? 'bg-gradient-to-br from-blue-600 to-cyan-600' : 'bg-gradient-to-br from-blue-300 to-cyan-300'
          }`}
          style={{ bottom: '10%', right: '10%' }}
          animate={{
            x: [0, -20, 0],
            y: [0, -15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Left: Navigation and Info */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 w-full md:w-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.h2 
                className={`text-2xl font-bold mb-6 ${
                  isDark ? 'text-transparent' : 'text-transparent'
                }`}                style={{
                  backgroundImage: isDark
                    ? 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #06b6d4 100%)'
                    : 'linear-gradient(135deg, #9333ea 0%, #db2777 50%, #0891b2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                VI-Pdf-Merger
              </motion.h2>
              <motion.ul 
                className="space-y-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {[
                  { href: '/about', text: 'About' },
                  { href: '/services', text: 'Services' },
                  { href: '/contact', text: 'Contact' },
                  { href: '#', text: 'Privacy Policy' }
                ].map((link, index) => (
                  <motion.li 
                    key={link.text}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <Link 
                      href={link.href} 
                      className={`text-base transition-all duration-300 hover:translate-x-2 inline-block ${
                        isDark 
                          ? 'text-purple-300/80 hover:text-purple-200 hover:text-shadow-lg' 
                          : 'text-purple-700/80 hover:text-purple-600'
                      }`}
                    >
                      {link.text}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Vertical divider */}
            <motion.div 
              className={`hidden md:block w-px h-32 ${
                isDark ? 'bg-gradient-to-b from-transparent via-purple-600/30 to-transparent' : 'bg-gradient-to-b from-transparent via-purple-300/50 to-transparent'
              }`}
              initial={{ opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />

            <motion.div 
              className={`flex flex-col gap-3 ${
                isDark ? 'text-purple-200/70' : 'text-purple-700/70'
              }`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.span 
                className="text-base font-medium"
                whileHover={{ scale: 1.02 }}
              >
                &copy; {new Date().getFullYear()} VI-Pdf-Merger. All rights reserved.
              </motion.span>
              <motion.span 
                className="text-base italic"
                whileHover={{ scale: 1.02 }}
              >
                Empowering your documents, securely and instantly.
              </motion.span>
            </motion.div>
          </div>

          {/* Right: Payment Methods */}
          <motion.div 
            className="flex flex-col items-center md:items-end gap-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.span 
              className={`text-base font-semibold ${
                isDark ? 'text-purple-300' : 'text-purple-700'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              We accept all major payment methods
            </motion.span>
            <motion.div 
              className="flex gap-4 flex-wrap justify-center md:justify-end"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {paymentLogos.map((logo, index) => (
                <motion.img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  className={`h-10 w-auto rounded-lg shadow-lg transition-all duration-300 ${
                    isDark 
                      ? 'bg-white/10 backdrop-blur-sm border border-gray-600/50 hover:bg-white/20 hover:border-purple-500/50' 
                      : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white hover:border-purple-300/50'
                  } p-2 hover:scale-110 hover:shadow-xl`}
                  style={{ minWidth: 50 }}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.6 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    y: -2,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom separator line with animation */}
        <motion.div
          className={`mt-12 pt-8 border-t ${
            isDark ? 'border-purple-800/30' : 'border-purple-200/50'
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div 
            className={`text-center text-sm ${
              isDark ? 'text-purple-400/60' : 'text-purple-600/60'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            Made with ❤️ for seamless document processing
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
