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
  const theme = useAppSelector((state: any) => state.theme.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    if (theme === 'light') dispatch(setTheme('dark'));
    else if (theme === 'dark') dispatch(setTheme('system'));
    else dispatch(setTheme('light'));
  };

  const themeIcon = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
    )
    : (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 6.66l-.71-.71M4.05 4.93l-.71-.71" /></svg>
    );
  const systemIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /></svg>
  );
  const showIcon = theme === 'system' ? systemIcon : themeIcon;

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

      <header className="fixed top-0 left-0 w-full flex flex-row items-center justify-between px-4 md:px-5 py-3 h-16 text-white shadow-lg z-50 border-b border-purple-700/40 backdrop-blur-md bg-black ">
        {/* Left-side navigation links - Responsive */}
        <nav className="hidden md:flex gap-3 text-lg font-semibold">
          <Link href="/" className="transform transition-transform duration-300 hover:scale-105 font-semibold">Home</Link>
          <Link href="/about" className="transform transition-transform duration-300 hover:scale-105 font-semibold">About</Link>
          <Link href="/services" className="transform transition-transform duration-300 hover:scale-105 font-semibold">Services</Link>
          <Link href="/contact" className="transform transition-transform duration-300 hover:scale-105 font-semibold">Contact</Link>
        </nav>

        {/* Mobile menu button */}
        <button className="block md:hidden text-white text-3xl p-2 rounded-lg hover:bg-purple-800/30 transition-colors duration-200" id="menu-toggle" aria-label="Open menu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Center branding with glow animation - improved for visibility */}
        <div className="flex-grow flex items-center justify-center px-2 md:px-4">
          <h1 className="text-lg md:text-2xl lg:text-3xl font-extrabold tracking-wide select-none whitespace-nowrap">
            <span
              className="font-extrabold bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent"
            >
              VI-Pdf-Merger
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
          {/* Theme toggle button */}
          <button
        className="ml-2 p-2 rounded-lg hover:bg-purple-800/30 transition-colors duration-200 border border-transparent hover:border-purple-400"
        onClick={toggleTheme}
        title={theme === 'system' ? 'System' : theme.charAt(0).toUpperCase() + theme.slice(1) + ' mode'}
        aria-label="Toggle theme"
        type="button"
          >
        {showIcon}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <nav className="md:hidden fixed top-16 left-0 w-full bg-gradient-to-b from-black via-purple-950 to-black/90 text-white hidden flex-col space-y-4 p-6 shadow-2xl z-40 rounded-b-2xl border-t border-purple-700/40 backdrop-blur-md" id="mobile-menu">
        <Link href="/" className="block font-bold text-lg rounded-lg px-3 py-2 hover:bg-purple-800/30 hover:scale-105 transition-all duration-200">Home</Link>
        <Link href="/about" className="block font-bold text-lg rounded-lg px-3 py-2 hover:bg-purple-800/30 hover:scale-105 transition-all duration-200">About</Link>
        <Link href="/services" className="block font-bold text-lg rounded-lg px-3 py-2 hover:bg-purple-800/30 hover:scale-105 transition-all duration-200">Services</Link>
        <Link href="/contact" className="block font-bold text-lg rounded-lg px-3 py-2 hover:bg-purple-800/30 hover:scale-105 transition-all duration-200">Contact</Link>
      </nav>

      {/* Mobile Menu Toggle Script */}
      <script>
        {`
          document.getElementById("menu-toggle").addEventListener("click", function() {
            const menu = document.getElementById("mobile-menu");
            menu.classList.toggle("hidden");
          });
        `}
      </script>
      {/* Spacer to prevent content from being hidden behind navbar */}
      <div className="h-16 w-full bg-transparent" aria-hidden="true"></div>
    </>
  );
};

export default Navbar
