'use client';
import React from 'react';
import { useAppSelector } from '@/store/hooks';
import Footer from '@/components/Footer';
import ReduxProvider from '@/store/Provider';
import Navbar from '@/components/Navbar';
import { motion, Variants } from 'framer-motion';

interface CorePrinciple {
  title: string;
  description: string;
  icon: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

const fadeInUp: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 }
};

const staggerChildren: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const principles: CorePrinciple[] = [
  {
    title: 'Security First',
    description: 'Your documents never leave your device. All processing is done locally in your browser.',
    icon: '🔒'
  },
  {
    title: 'Simplicity',
    description: 'Intuitive interface designed for users of all technical levels.',
    icon: '✨'
  },
  {
    title: 'Reliability',
    description: 'High-quality PDF processing you can count on, every time.',
    icon: '⚡'
  }
];

const teamMembers: TeamMember[] = [
  {
    name: 'Vivek Raj',
    role: 'Founder & Lead Developer',
    image: 'https://api.dicebear.com/7.x/initials/svg?seed=VR&backgroundColor=purple',
    description: 'Full-stack developer with a passion for creating intuitive user experiences.'
  },
  {
    name: 'Sarah Chen',
    role: 'UI/UX Designer',
    image: 'https://api.dicebear.com/7.x/initials/svg?seed=SC&backgroundColor=pink',
    description: 'Expert in creating beautiful and functional user interfaces.'
  },
  {
    name: 'Michael Patel',
    role: 'Security Specialist',
    image: 'https://api.dicebear.com/7.x/initials/svg?seed=MP&backgroundColor=indigo',
    description: 'Ensures the highest standards of security in all our operations.'
  }
];

const AboutPageContent = () => {
  const theme = useAppSelector((state: { theme: { theme: string } }) => state.theme.theme);
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
    return null;
  }

  return (
    <>
      <Navbar />
      <main className={`min-h-screen pt-12 ${isDark ? 'bg-gradient-to-br from-black via-purple-950 to-black' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white'}`}>
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              About VI-Pdf-Solutions
            </motion.h1>
            <motion.p 
              className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-purple-300/90' : 'text-purple-700/90'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Empowering users with secure, efficient, and intuitive PDF management solutions.
            </motion.p>
          </motion.div>

          {/* Mission Section */}
          <motion.div 
            className={`rounded-2xl p-8 mb-12 ${isDark ? 'bg-gray-900/50 shadow-xl border border-gray-800' : 'bg-white/80 shadow-lg border border-gray-100'}`}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.h2 
              className={`text-3xl font-bold mb-6 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}
              variants={fadeInUp}
            >
              Our Mission
            </motion.h2>
            <motion.p 
              className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              variants={fadeInUp}
            >
              At VI-Pdf-Solutions, we&apos;re dedicated to simplifying document management while maintaining the highest standards of security and privacy. Our platform is built on three core principles:
            </motion.p>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerChildren}
            >
              {principles.map((principle) => (
                <motion.div
                  key={principle.title}
                  className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-purple-50'}`}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div className="text-4xl mb-4">{principle.icon}</motion.div>
                  <motion.h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
                    {principle.title}
                  </motion.h3>
                  <motion.p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {principle.description}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Team Section */}
          <motion.div 
            className={`rounded-2xl p-8 ${isDark ? 'bg-gray-900/50 shadow-xl border border-gray-800' : 'bg-white/80 shadow-lg border border-gray-100'}`}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.h2 
              className={`text-3xl font-bold mb-6 text-center ${isDark ? 'text-purple-300' : 'text-purple-700'}`}
              variants={fadeInUp}
            >
              Meet Our Team
            </motion.h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerChildren}
            >
              {teamMembers.map((member) => (
                <motion.div
                  key={member.name}
                  className={`flex flex-col items-center p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-purple-50'}`}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mb-4 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
                    {member.name}
                  </motion.h3>
                  <motion.p className={`text-sm font-medium mb-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    {member.role}
                  </motion.p>
                  <motion.p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {member.description}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

const AboutPage = () => (
  <ReduxProvider>
    <AboutPageContent />
  </ReduxProvider>
);

export default AboutPage;
