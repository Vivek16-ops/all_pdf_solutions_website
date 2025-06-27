'use client';
import { useAppSelector } from "@/store/hooks";
import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { y: 40, opacity: 0, scale: 0.95 },
  animate: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6,
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const pricingPlans = [
  {
    title: "Basic",
    price: "Free",
    features: ["Merge up to 5 PDFs", "Basic support", "No sign-up required"],
    popular: false,
    gradient: "from-gray-600 to-gray-800",
    hoverGradient: "from-gray-500 to-gray-700"
  },
  {
    title: "Pro",
    priceKey: "popularPrice",
    features: [
      "Merge unlimited PDFs",
      "Priority support",
      "No ads",
      "Access to all features",
    ],
    popular: true,
    gradient: "from-purple-600 to-pink-600",
    hoverGradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Enterprise",
    price: "$29/mo",
    features: [
      "Team management",
      "Custom integrations",
      "Dedicated support",
      "Advanced analytics",
    ],
    popular: false,
    gradient: "from-blue-600 to-cyan-600",
    hoverGradient: "from-blue-500 to-cyan-500"
  },
];

const Pricing: React.FC = () => {
  const popularPrice = "$9/mo";
  const theme = useAppSelector((state: { theme: { theme: string } }) => state.theme.theme);
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

  // Return light theme version for SSR
  if (!mounted) {
    return (
      <section className="flex flex-col items-center py-20 px-4 bg-gradient-to-b from-purple-50 to-pink-50">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 justify-center">
          {/* Simple loading state */}
          <div className="animate-pulse flex-1 h-96 bg-gray-100 rounded-3xl" />
          <div className="animate-pulse flex-1 h-96 bg-gray-100 rounded-3xl" />
          <div className="animate-pulse flex-1 h-96 bg-gray-100 rounded-3xl" />
        </div>
      </section>
    );
  }

  return (    <section className={`relative flex flex-col items-center py-24 px-4 overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-b from-gray-950 via-purple-950/50 to-gray-900' 
        : 'bg-gradient-to-b from-white via-purple-50/50 to-pink-50'
    }`}>
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-10 ${
            isDark ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-purple-300 to-pink-300'
          }`}
          style={{ top: '10%', left: '10%' }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className={`absolute w-80 h-80 rounded-full blur-3xl opacity-8 ${
            isDark ? 'bg-gradient-to-br from-blue-600 to-cyan-600' : 'bg-gradient-to-br from-blue-300 to-cyan-300'
          }`}
          style={{ bottom: '10%', right: '10%' }}
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl">
        {/* Enhanced header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.h2 
            className={`text-4xl md:text-6xl font-bold mb-8 relative ${
              isDark ? 'text-transparent' : 'text-transparent'
            }`}            style={{
              backgroundImage: isDark
                ? 'linear-gradient(135deg, #a855f7 0%, #ec4899 25%, #06b6d4 50%, #8b5cf6 75%, #a855f7 100%)'
                : 'linear-gradient(135deg, #9333ea 0%, #db2777 25%, #0891b2 50%, #9333ea 75%, #db2777 100%)',
              backgroundSize: '300% 300%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Pricing Plans
            
            {/* Animated underline */}
            <motion.div
              className={`absolute bottom-0 left-1/2 h-1 ${
                isDark 
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500' 
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600'
              } rounded-full`}
              style={{ backgroundSize: '200% 100%' }}
              initial={{ width: 0, x: '-50%' }}
              whileInView={{ width: '50%' }}
              animate={{
                backgroundPosition: ['0% 50%', '200% 50%', '0% 50%']
              }}
              transition={{ 
                width: { duration: 1, delay: 0.5 },
                backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
              viewport={{ once: true }}
            />
          </motion.h2>
          
          <motion.p 
            className={`text-xl md:text-2xl max-w-3xl mx-auto ${
              isDark ? 'text-purple-300/90' : 'text-purple-700/90'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Choose the perfect plan for your document processing needs
          </motion.p>
        </motion.div>

        {/* Enhanced pricing cards */}
        <motion.div 
          className="w-full flex flex-col lg:flex-row gap-8 justify-center items-stretch"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={plan.title}
              className={`flex-1 max-w-sm mx-auto relative group ${
                plan.popular ? 'lg:scale-110 lg:-translate-y-4' : ''
              }`}
              variants={fadeInUp}
              whileHover={{ 
                y: -12, 
                scale: plan.popular ? 1.02 : 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <motion.div 
                  className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 text-sm font-bold rounded-full z-20 ${
                    isDark 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  } shadow-lg`}
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Most Popular
                </motion.div>
              )}

              {/* Card container */}
              <div className={`relative overflow-hidden rounded-3xl p-8 h-full backdrop-blur-sm border transition-all duration-500 ${
                isDark
                  ? plan.popular
                    ? 'bg-gray-900/60 border-purple-500/50 shadow-2xl shadow-purple-500/20'
                    : 'bg-gray-900/50 border-gray-700/50 hover:border-purple-500/30'
                  : plan.popular
                  ? 'bg-white/90 border-purple-300/50 shadow-2xl shadow-purple-300/20'
                  : 'bg-white/80 border-gray-200/50 hover:border-purple-300/50'
              } hover:shadow-2xl group-hover:border-opacity-100`}>
                
                {/* Animated background gradient */}
                <motion.div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${plan.gradient}`}
                />
                
                {/* Multi-layered glow effect for popular plan */}
                {plan.popular && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-3xl blur-xl opacity-30 bg-gradient-to-br from-purple-600/30 to-pink-600/30"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-3xl blur-2xl opacity-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 1
                      }}
                    />
                  </>
                )}

                <div className="relative z-10 flex flex-col h-full">
                  {/* Plan title */}
                  <motion.h3 
                    className={`text-2xl font-bold mb-4 ${
                      isDark
                        ? plan.popular ? 'text-purple-200' : 'text-gray-200'
                        : plan.popular ? 'text-purple-700' : 'text-gray-700'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {plan.title}
                  </motion.h3>

                  {/* Price */}
                  <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 + 0.1 }}
                  >
                    <span className={`text-4xl md:text-5xl font-bold ${
                      isDark
                        ? plan.popular ? 'text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text' : 'text-gray-100'
                        : plan.popular ? 'text-transparent bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text' : 'text-gray-800'
                    }`}>
                      {plan.popular ? popularPrice : plan.price}
                    </span>
                  </motion.div>

                  {/* Features */}
                  <motion.ul 
                    className={`mb-8 space-y-3 flex-grow ${
                      isDark ? 'text-purple-200' : 'text-gray-600'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                  >
                    {plan.features.map((feature, featureIdx) => (
                      <motion.li 
                        key={feature} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 + featureIdx * 0.1 + 0.4 }}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          isDark 
                            ? plan.popular ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-400'
                            : plan.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-base">{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>

                  {/* CTA Button */}
                  <motion.button                    className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group/btn ${
                      isDark
                        ? plan.popular
                          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white hover:from-purple-400 hover:to-cyan-400'
                          : 'bg-gray-800 text-purple-100 hover:bg-gray-700 border border-gray-600 hover:border-purple-500'
                        : plan.popular
                        ? 'bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 text-white hover:from-pink-300 hover:to-orange-300'
                        : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 border border-purple-200 hover:border-purple-300'
                    } shadow-lg hover:shadow-xl transform hover:scale-105`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 + 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "linear"
                      }}
                    />
                    <span className="relative z-10">
                      {plan.popular ? "Get Pro" : "Choose Plan"}
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;