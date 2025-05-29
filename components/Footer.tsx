'use client'
import React from 'react';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';

const paymentLogos = [
  { src: '/visa.png', alt: 'Visa' },
  { src: '/rupay.png', alt: 'RuPay' },
  { src: '/mastercard.png', alt: 'Mastercard' },
  { src: '/american_express.png', alt: 'American EExpress' },
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
      <footer className="w-full transition-colors duration-300 bg-gradient-to-br from-purple-50 via-pink-50 to-white border-t border-purple-200 py-10 px-4">
        <div className="max-w-7xl mx-auto h-40" />
      </footer>
    );
  }

  const footerClass = `w-full transition-colors duration-300 ${
    isDark
      ? 'bg-gradient-to-br from-black via-purple-950 to-black text-gray-200 border-t border-purple-800/40'
      : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white text-gray-800 border-t border-purple-200'
  } py-10 px-4`;

  const navLinkClass = isDark
    ? 'hover:text-purple-400 transition-colors'
    : 'hover:text-purple-600 transition-colors';

  const dividerClass = isDark
    ? 'hidden md:block border-l border-purple-800/40 h-24 mx-4'
    : 'hidden md:block border-l border-purple-200 h-24 mx-4';

  const infoTextClass = isDark
    ? 'text-sm text-gray-400 flex flex-col gap-2'
    : 'text-sm text-gray-500 flex flex-col gap-2';

  const paymentTitleClass = isDark
    ? 'font-semibold text-purple-300 mb-1'
    : 'font-semibold text-purple-700 mb-1';

  const paymentLogoClass = isDark
    ? 'h-8 w-auto bg-white/10 rounded shadow-md p-1'
    : 'h-8 w-auto bg-white/40 rounded shadow-md p-1';

  return (
    <footer className={footerClass}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
        {/* Left: Navigation and Info */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full md:w-auto">
          <div>
            <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">VI-Pdf-Merger</h2>
            <ul className="space-y-2">
              <li><Link href="/about" className={navLinkClass}>About</Link></li>
              <li><Link href="/services" className={navLinkClass}>Services</Link></li>
              <li><Link href="/contact" className={navLinkClass}>Contact</Link></li>
              <li><Link href="#" className={navLinkClass}>Privacy Policy</Link></li>
            </ul>
          </div>
          <div className={dividerClass}></div>
          <div className={infoTextClass}>
            <span>&copy; {new Date().getFullYear()} VI-Pdf-Merger. All rights reserved.</span>
            <span>Empowering your documents, securely and instantly.</span>
          </div>
        </div>

        {/* Right: Payment Methods */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <span className={paymentTitleClass}>We accept all major payment methods</span>
          <div className="flex gap-3 flex-wrap">
            {paymentLogos.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className={paymentLogoClass}
                style={{ minWidth: 40 }}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
