'use client';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme } from '@/store/themeSlice';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state: { theme: { theme: string } }) => state.theme.theme);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Single useEffect to handle all initialization
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = () => {
      const isSystemDark = mediaQuery.matches;
      const shouldBeDark = theme === 'dark' || (theme === 'system' && isSystemDark);
      
      setIsDark(shouldBeDark);
      if (shouldBeDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    // Initial setup
    handleThemeChange();
    setMounted(true);

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    dispatch(setTheme(newTheme));
    localStorage.setItem('theme', newTheme);
  };

  // Icons
  const moonIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
    </svg>
  );
  
  const sunIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 6.66l-.71-.71M4.05 4.93l-.71-.71" />
    </svg>
  );
  
  const systemIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6v6H9z" />
    </svg>
  );

  // Use systemIcon for initial render to avoid hydration mismatch
  const showIcon = !mounted ? systemIcon : theme === 'system' ? systemIcon : isDark ? moonIcon : sunIcon;
  const buttonTitle = !mounted ? 'Theme' : theme === 'system' ? 'System' : `${theme.charAt(0).toUpperCase()}${theme.slice(1)} mode`;

  return (
    <>
      {/* Color scheme definitions for dark and light mode */}
      <style jsx global>{`
        :root {
          --navbar-bg: #ffffff;
          --navbar-text: #1a1a1a;
          --navbar-border: #e5e7eb;
          --navbar-link-hover: #f3e8ff;
          --navbar-brand-gradient: linear-gradient(90deg, #a78bfa, #f472b6, #ef4444);
        }
        .dark {
          --navbar-bg: #09090b;
          --navbar-text: #f3f4f6;
          --navbar-border: #a78bfa66;
          --navbar-link-hover: #a78bfa33;
          --navbar-brand-gradient: linear-gradient(90deg, #a78bfa, #f472b6, #ef4444);
        }
        header {
          background: var(--navbar-bg) !important;
          color: var(--navbar-text) !important;
          border-bottom-color: var(--navbar-border) !important;
        }
        header nav a {
          color: var(--navbar-text);
        }
        header nav a:hover {
          background: var(--navbar-link-hover);
        }
        .animate-softGlow span {
          background: var(--navbar-brand-gradient) !important;
        }
      `}</style>

      <header className={`fixed top-0 left-0 w-full flex flex-row items-center justify-between px-4 md:px-5 py-3 h-16 text-white shadow-lg z-50 border-b border-purple-700/40 backdrop-blur-md ${mounted ? 'bg-black' : ''}`}>
        {/* Left-side navigation links - Responsive */}
        <nav className="hidden md:flex gap-3 text-lg font-semibold">
          <Link href="/" className="transform transition-transform duration-300 hover:scale-105 font-semibold">Home</Link>
          <Link href="/about" className="transform transition-transform duration-300 hover:scale-105 font-semibold">About</Link>
          <Link href="/services" className="transform transition-transform duration-300 hover:scale-105 font-semibold">Services</Link>
          <Link href="/contact" className="transform transition-transform duration-300 hover:scale-105 font-semibold">Contact</Link>
        </nav>        {/* Mobile menu button */}
        <button          className="block md:hidden text-3xl p-2 rounded-lg hover:bg-purple-800/30 transition-all duration-200" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            className="w-8 h-8 transition-colors duration-200"
            stroke="url(#menuIconGradient)"
            strokeWidth={2}
          >
            <defs>
              <linearGradient id="menuIconGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#a78bfa' }} />
                <stop offset="50%" style={{ stopColor: '#f472b6' }} />
                <stop offset="100%" style={{ stopColor: '#ef4444' }} />
              </linearGradient>
            </defs>
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"}
            />
          </svg>
        </button>

        {/* Center branding with glow animation - improved for visibility */}
        <div className="flex-grow flex items-center justify-center px-2 md:px-4">
          <h1 className="text-lg md:text-2xl lg:text-3xl font-extrabold tracking-wide select-none whitespace-nowrap">
            <span
              className="font-extrabold bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent"
            >
              VI-Pdf-Solutions
            </span>
          </h1>
        </div>

        {/* Right-side user buttons and theme toggle */}
        <div className="flex gap-2 md:gap-4 items-center">
          <SignedOut>
        <div className="px-2 md:px-4 py-1 md:text-lg text-sm font-bold text-white bg-purple-700/90 rounded-lg shadow-lg hover:scale-105 hover:bg-purple-800/90 transition-all duration-300 cursor-pointer">
          <SignInButton />
        </div>
        <div className="px-2 md:px-4 py-1 md:text-lg text-sm font-bold text-white bg-pink-600/90 rounded-lg shadow-lg hover:scale-105 hover:bg-pink-700/90 transition-all duration-300 cursor-pointer">
          <SignUpButton />
        </div>
          </SignedOut>
          <SignedIn>
        <UserButton appearance={{ elements: { userButtonAvatarBox: 'ring-2 ring-purple-500' } }} />
          </SignedIn>
          {/* Theme toggle button */}          <button
            className="ml-2 p-2 rounded-lg hover:bg-purple-800/30 transition-colors duration-200 border border-transparent hover:border-purple-400"
            onClick={toggleTheme}
            title={buttonTitle}
            aria-label="Toggle theme"
            type="button"
          >
            {showIcon}
          </button>
        </div>
      </header>      {/* Mobile Navigation Menu */}
      <nav 
        className={`md:hidden fixed top-16 left-0 w-full flex-col space-y-4 p-6 shadow-2xl z-40 rounded-b-2xl backdrop-blur-md transform transition-all duration-300 ${
          isDark 
            ? 'bg-gradient-to-b from-black via-purple-950 to-black/90 border-t border-purple-700/40' 
            : 'bg-gradient-to-b from-white via-purple-50 to-white/90 border-t border-purple-200'
        } ${
          isMobileMenuOpen ? 'flex opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <Link 
          href="/" 
          className={`block font-bold text-lg rounded-lg px-3 py-2 transition-all duration-200 ${
            isDark 
              ? 'text-white hover:bg-purple-800/30' 
              : 'text-purple-900 hover:bg-purple-100'
          } hover:scale-105`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className={`block font-bold text-lg rounded-lg px-3 py-2 transition-all duration-200 ${
            isDark 
              ? 'text-white hover:bg-purple-800/30' 
              : 'text-purple-900 hover:bg-purple-100'
          } hover:scale-105`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          About
        </Link>
        <Link 
          href="/services" 
          className={`block font-bold text-lg rounded-lg px-3 py-2 transition-all duration-200 ${
            isDark 
              ? 'text-white hover:bg-purple-800/30' 
              : 'text-purple-900 hover:bg-purple-100'
          } hover:scale-105`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Services
        </Link>
        <Link 
          href="/contact" 
          className={`block font-bold text-lg rounded-lg px-3 py-2 transition-all duration-200 ${
            isDark 
              ? 'text-white hover:bg-purple-800/30' 
              : 'text-purple-900 hover:bg-purple-100'
          } hover:scale-105`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Contact
        </Link>
      {/* Spacer to prevent content from being hidden behind navbar */}
      <div className="h-16 w-full" style={{ background: 'transparent' }} aria-hidden="true"></div>
      </nav>
    </>
  );
};

export default Navbar;
