'use client';
import { useAppSelector } from "@/store/hooks";

import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const pricingPlans = [
  {
    title: "Basic",
    price: "Free",
    features: ["Merge up to 5 PDFs", "Basic support", "No sign-up required"],
    popular: false,
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
  },
];


const Pricing: React.FC = () => {
  const popularPrice = "$9/mo";
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

  // Return light theme version for SSR
  if (!mounted) {
    return (
      <section className="flex flex-col items-center py-12 px-4 bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0]">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 justify-center">
          {/* Simple loading state */}
          <div className="animate-pulse flex-1 h-96 bg-gray-100 rounded-xl" />
          <div className="animate-pulse flex-1 h-96 bg-gray-100 rounded-xl" />
          <div className="animate-pulse flex-1 h-96 bg-gray-100 rounded-xl" />
        </div>
      </section>
    );
  }

  const sectionClass = `flex flex-col items-center py-12 px-4 bg-gradient-to-b ${
    isDark ? 'from-black via-purple-950 to-black' : 'from-purple-50 via-pink-50 to-white'
  }`;

  const headingClass = isDark
    ? "text-3xl font-bold mb-8 text-purple-100"
    : "text-3xl font-bold mb-8 text-[#1e293b]";

  const cardClass = (popular: boolean) =>
    `flex-1 rounded-xl shadow-lg p-8 flex flex-col items-center border transition-all duration-300 cursor-pointer \
    ${isDark
      ? popular
        ? "bg-gradient-to-br from-purple-900 to-gray-900 border-purple-500 scale-105 z-10 hover:scale-110 hover:shadow-2xl hover:border-purple-400"
        : "bg-gray-900 border-gray-700 hover:scale-105 hover:shadow-xl hover:border-purple-700"
      : popular
      ? "bg-white border-[#6366f1] scale-105 z-10 hover:scale-110 hover:shadow-2xl hover:border-purple-400"
      : "bg-white border-gray-200 hover:scale-105 hover:shadow-xl hover:border-purple-400"}
    `;

  const titleClass = (popular: boolean) =>
    `mb-4 text-xl font-semibold ${
      isDark
        ? popular
          ? "text-purple-300"
          : "text-gray-200"
        : popular
        ? "text-[#6366f1]"
        : "text-[#334155]"
    }`;

  const priceClass = (popular: boolean) =>
    `text-3xl font-bold ${
      isDark
        ? popular
          ? "text-purple-200"
          : "text-gray-100"
        : popular
        ? "text-[#6366f1]"
        : "text-[#334155]"
    }`;

  const mostPopularClass = isDark
    ? "ml-2 px-2 py-1 text-xs bg-purple-700 text-white rounded-full font-medium"
    : "ml-2 px-2 py-1 text-xs bg-[#6366f1] text-white rounded-full font-medium";

  const featuresClass = isDark
    ? "mb-8 space-y-2 text-purple-200"
    : "mb-8 space-y-2 text-[#64748b]";

  const dotClass = isDark
    ? "inline-block w-2 h-2 bg-purple-400 rounded-full"
    : "inline-block w-2 h-2 bg-[#6366f1] rounded-full";

  const buttonClass = (popular: boolean) =>
    `w-full py-2 rounded-lg font-semibold transition-colors ${
      isDark
        ? popular
          ? "bg-purple-700 text-white hover:bg-purple-800"
          : "bg-gray-800 text-purple-100 hover:bg-gray-700"
        : popular
        ? "bg-[#6366f1] text-white hover:bg-[#4f46e5]"
        : "bg-[#e2e8f0] text-[#334155] hover:bg-[#cbd5e1]"
    }`;
  return (    <section className={sectionClass}>
      <motion.h2 
        className={headingClass}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Pricing Plans
      </motion.h2>
      <motion.div 
        className="w-full max-w-5xl flex flex-col md:flex-row gap-8 justify-center"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
      >
        {pricingPlans.map((plan, idx) => (
          <motion.div
            key={plan.title}
            className={cardClass(plan.popular)}
            variants={fadeInUp}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.98 }}
          >            <motion.div 
              className={titleClass(plan.popular)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              {plan.title}
            </motion.div>
            <motion.div 
              className="mb-6 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 + 0.1 }}
            >
              {plan.popular ? (
                <span className={priceClass(true)}>
                  {popularPrice}
                </span>
              ) : (
                <span className={priceClass(false)}>
                  {plan.price}
                </span>
              )}
              {plan.popular && (
                <motion.span 
                  className={mostPopularClass}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                >
                  Most Popular
                </motion.span>
              )}
            </motion.div>            <motion.ul 
              className={featuresClass}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
            >
              {plan.features.map((feature, featureIdx) => (
                <motion.li 
                  key={feature} 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + featureIdx * 0.1 + 0.4 }}
                >
                  <span className={dotClass}></span>
                  {feature}
                </motion.li>
              ))}
            </motion.ul>
            <motion.button
              className={buttonClass(plan.popular)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {plan.popular ? "Get Pro" : "Choose"}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Pricing;