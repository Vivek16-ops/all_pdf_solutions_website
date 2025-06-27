'use client';
import React from 'react';
import MainFeaturesGrid from './MainFeaturesGrid';
import WhyChooseUs from './WhyChooseUs';
import HowItWorks from './HowItWorks';
import CustomerReviews from './CustomerReviews';
import CallToAction from './CallToAction';
import { motion } from 'framer-motion';

interface ServiceSectionsProps {
  serviceName?: string;
  features?: Array<{
    icon: string;
    title: string;
    desc: string;
    color: string;
    bgColor: string;
  }>;
  steps?: Array<{
    step: string;
    title: string;
    desc: string;
    icon: string;
    color: string;
  }>;
  testimonials?: Array<{
    name: string;
    role: string;
    text: string;
    rating: number;
    avatar: string;
  }>;
  whyChooseUsTitle?: string;
  howItWorksTitle?: string;
  callToActionMessage?: string;
}

const ServiceSections: React.FC<ServiceSectionsProps> = ({
  serviceName = "File Converter",
  features,
  steps,
  testimonials,
  whyChooseUsTitle,
  howItWorksTitle,
  callToActionMessage
}) => {
  
  return (<motion.div
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 sm:pt-6 sm:pb-8 lg:pt-8 lg:pb-10 space-y-8 sm:space-y-10 lg:space-y-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Main Features Grid */}
      <MainFeaturesGrid features={features} />

      {/* Why Choose Us Section */}
      <WhyChooseUs 
        title={whyChooseUsTitle || `Why 2M+ Users Trust Our ${serviceName}`}
      />

      {/* How It Works Section */}
      <HowItWorks 
        title={howItWorksTitle}
        steps={steps}
      />

      {/* Customer Testimonials */}
      <CustomerReviews testimonials={testimonials} />

      {/* Call to Action */}
      <CallToAction message={callToActionMessage} />
    </motion.div>
  );
};

export default ServiceSections;
