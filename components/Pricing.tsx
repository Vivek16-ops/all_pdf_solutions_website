'use client';
import { useAppSelector } from "@/store/hooks";

import React from "react";

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
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const sectionClass = isDark
    ? "flex flex-col items-center py-12 px-4 bg-gradient-to-b from-gray-900/90 via-purple-950/80 to-gray-800/90"
    : "flex flex-col items-center py-12 px-4 bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0]";

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

  return (
    <section className={sectionClass}>
      <h2 className={headingClass}>Pricing Plans</h2>
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 justify-center">
        {pricingPlans.map((plan, idx) => (
          <div
            key={plan.title}
            className={cardClass(plan.popular)}
          >
            <div className={titleClass(plan.popular)}>
              {plan.title}
            </div>
            <div className="mb-6 flex items-center">
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
                <span className={mostPopularClass}>
                  Most Popular
                </span>
              )}
            </div>
            <ul className={featuresClass}>
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className={dotClass}></span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={buttonClass(plan.popular)}
            >
              {plan.popular ? "Get Pro" : "Choose"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;