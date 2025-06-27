'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

interface CustomerReviewsProps {
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Marketing Manager",
    text: "This tool saved me hours! The conversion quality is amazing and my presentations look professional.",
    rating: 5,
    avatar: "👩‍💼"
  },
  {
    name: "Mike Johnson",
    role: "Teacher",
    text: "Perfect for converting my lesson files to different formats. Students love the quality!",
    rating: 5,
    avatar: "👨‍🏫"
  },
  {
    name: "Lisa Wang",
    role: "Consultant",
    text: "Fast, secure, and reliable. I use it daily for client work. Highly recommended!",
    rating: 5,
    avatar: "👩‍💻"
  }
];

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ 
  testimonials = defaultTestimonials 
}) => {
  const { isDark } = useTheme();
  return (
    <motion.div
      className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 backdrop-blur-sm border relative overflow-hidden ${
        isDark 
          ? 'bg-black/20 border-purple-800/30 shadow-2xl shadow-purple-900/20' 
          : 'bg-white/30 border-purple-200/30 shadow-2xl shadow-purple-500/10'
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >      <div className="text-center mb-6 sm:mb-8">
        <motion.h3 
          className={`text-xl sm:text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="inline-block mr-3"
          >
            💬
          </motion.span>
          What Our Users Say
        </motion.h3>      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className={`p-4 sm:p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
              isDark 
                ? 'bg-black/20 border-purple-700/30 shadow-lg shadow-purple-900/10'
                : 'bg-white/40 border-purple-200/40 shadow-lg shadow-purple-500/5'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center mb-4">
              <motion.div
                className="text-2xl sm:text-3xl mr-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {testimonial.avatar}
              </motion.div>
              <div>
                <h5 className={`font-bold text-sm sm:text-base ${isDark ? 'text-purple-200' : 'text-purple-800'}`}>
                  {testimonial.name}
                </h5>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-purple-300/70' : 'text-purple-600/70'}`}>
                  {testimonial.role}
                </p>
              </div>
            </div>
            
            <div className="flex mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                  className="text-yellow-400 text-sm"
                >
                  ⭐
                </motion.span>
              ))}
            </div>
              <p className={`text-xs sm:text-sm italic leading-relaxed ${isDark ? 'text-purple-300/80' : 'text-purple-700/80'}`}>
              &quot;{testimonial.text}&quot;
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CustomerReviews;
