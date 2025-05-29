'use client';
import React, { useState, useLayoutEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import Footer from '@/components/Footer';
import { toast } from 'react-hot-toast';
import { ReduxProvider } from '@/store/Provider';
import Navbar from '@/components/Navbar';

const ContactPageContent = () => {
  // All hooks at the top
  const theme = useAppSelector((state: any) => state.theme.theme);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useLayoutEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(
      theme === 'dark' || 
      (theme === 'system' && mediaQuery.matches)
    );

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-screen" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-black via-purple-950 to-black text-white' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white text-black'}`}>
      <Navbar />
      {/* Added pt-20 to prevent navbar overlap */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-8 sm:px-6 lg:px-8 relative">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute w-96 h-96 rounded-full blur-3xl -top-48 -left-48 opacity-20 
            ${isDark ? 'bg-purple-600' : 'bg-purple-300'}`}></div>
          <div className={`absolute w-96 h-96 rounded-full blur-3xl -bottom-48 -right-48 opacity-20 
            ${isDark ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
        </div>

        <div className="relative">
          {/* Header with gradient text */}
          <div className="text-center mb-12">
            <h1 className={`text-5xl font-bold mb-4 bg-gradient-to-r ${
              isDark 
                ? 'from-purple-400 via-fuchsia-500 to-pink-500'
                : 'from-purple-600 via-fuchsia-600 to-pink-600'
            } bg-clip-text text-transparent`}>
              Get in Touch
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We'd love to hear from you. Drop us a line and we'll get back to you as soon as possible.
            </p>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>
            <div className="space-y-8">
              {/* Contact Information Card */}
              <div className={`p-8 rounded-2xl backdrop-blur-sm ${
                isDark ? 'bg-gray-900/30 border border-gray-700' : 'bg-white/80 border border-purple-100'
              }`}>
                <h2 className={`text-2xl font-semibold mb-6 ${
                  isDark ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <svg className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p>contact@pdfmergerclerk.com</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <svg className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p>+1 (555) 123-4567</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <svg className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p>123 PDF Street, Document City</p>
                  </div>
                </div>
              </div>

              {/* Business Hours Card */}
              <div className={`p-8 rounded-2xl backdrop-blur-sm ${
                isDark ? 'bg-gray-900/30 border border-gray-700' : 'bg-white/80 border border-purple-100'
              }`}>
                <h2 className={`text-2xl font-semibold mb-6 ${
                  isDark ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  Business Hours
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <svg className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Monday - Friday</span>
                    </div>
                    <span className={isDark ? 'text-purple-300' : 'text-purple-700'}>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <svg className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Saturday</span>
                    </div>
                    <span className={isDark ? 'text-purple-300' : 'text-purple-700'}>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <svg className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Sunday</span>
                    </div>
                    <span className={`${isDark ? 'text-red-400' : 'text-red-600'}`}>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form section */}
            <form onSubmit={handleSubmit} className={`space-y-6 p-8 rounded-2xl backdrop-blur-sm ${
              isDark ? 'bg-gray-900/30 border border-gray-700' : 'bg-white/80 border border-purple-100'
            }`}>
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-gray-800/90 text-gray-100 focus:ring-purple-500 border border-gray-700 hover:border-purple-500 placeholder-gray-500'
                      : 'bg-white/90 text-gray-900 focus:ring-purple-500 border border-gray-300 hover:border-purple-400 placeholder-gray-400'
                  }`}
                  required
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-gray-800/90 text-gray-100 focus:ring-purple-500 border border-gray-700 hover:border-purple-500 placeholder-gray-500'
                      : 'bg-white/90 text-gray-900 focus:ring-purple-500 border border-gray-300 hover:border-purple-400 placeholder-gray-400'
                  }`}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-gray-800/90 text-gray-100 focus:ring-purple-500 border border-gray-700 hover:border-purple-500 placeholder-gray-500'
                      : 'bg-white/90 text-gray-900 focus:ring-purple-500 border border-gray-300 hover:border-purple-400 placeholder-gray-400'
                  }`}
                  required
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 
                  ${isDark 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }
                  transform hover:scale-[1.02] active:scale-[0.98]`}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const ContactPage = () => (
  <ReduxProvider>
    <ContactPageContent />
  </ReduxProvider>
);

export default ContactPage;
