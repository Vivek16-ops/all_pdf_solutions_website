import { type Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import { ReduxProvider } from '@/store/Provider';
import { Toaster } from 'react-hot-toast';

// Theme detection script that will run on the client side
const themeScript = `
  (function() {
    try {
      let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      let theme = localStorage.getItem('theme') || 'system';
      if (theme === 'dark' || (theme === 'system' && isDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    } catch (e) {}
  })()
`;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Vi-Pdf-Merge',
  keywords: ['pdf', 'merge', 'vi-pdf-merge', 'nextjs', 'react', 'redux'],
  authors: [{ name: 'Vivek Raj' }],
  description: 'A simple and efficient PDF merging tool built with Next.js and Redux',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: themeScript
            }}
          />
        </head>
        <body suppressHydrationWarning className={`min-h-screen antialiased`}>
          <ReduxProvider>
            <div className="min-h-screen transition-colors duration-300">
              <Navbar />
              {children}
              <Toaster position="top-center" />
            </div>
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}