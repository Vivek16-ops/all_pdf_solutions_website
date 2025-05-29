'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';

const services = [
  {
    title: 'Merge PDF',
    icon: '/service_icons/mergepdf.png',
    href: '/services/merge-pdf'
  },
  {
    title: 'Excel to PDF',
    icon: '/service_icons/exceltopdf.png',
    href: '/services/excel-to-pdf'
  },
  {
    title: 'Word to PDF',
    icon: '/service_icons/wordtopdf.png',
    href: '/services/word-to-pdf'
  },
  {
    title: 'PDF to Word',
    icon: '/service_icons/pdftoword.jpg',
    href: '/services/pdf-to-word'
  },
  {
    title: 'PDF to Excel',
    icon: '/service_icons/pdftoexcel.png',
    href: '/services/pdf-to-excel'
  },
  {
    title: 'PDF to PPT',
    icon: '/service_icons/pdftoppt.jpg',
    href: '/services/pdf-to-ppt'
  },
  {
    title: 'Word to PNG',
    icon: '/service_icons/wordtopng.jpg',
    href: '/services/word-to-png'
  },
  {
    title: 'Word to JPG',
    icon: '/service_icons/wordtojpg.jpg',
    href: '/services/word-to-jpg'
  },
  {
    title: 'PPT to PDF',
    icon: '/service_icons/ppttopdf.svg',
    href: '/services/ppt-to-pdf'
  }
];

const ServiceShowcase = () => {
  const { isDark } = useTheme();  return (
    <div className={`py-16 ${isDark ? 'bg-gradient-to-br from-black via-purple-950 to-black' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link 
              key={service.href}
              href={service.href}
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 ${
                isDark
                  ? 'bg-gray-900/50 shadow-xl border border-gray-800 hover:bg-gray-800/50'
                  : 'bg-white/80 shadow-lg border border-gray-100 hover:bg-white/90'
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-4">              <div className={`relative w-16 h-16 rounded-xl overflow-hidden ${
                  isDark ? 'bg-gray-800 shadow-inner' : 'bg-white/80'
                }`}>
                  <Image
                    src={service.icon}
                    alt={service.title}
                    fill
                    className="object-cover p-2"
                  />
                </div>
                <h3 className={`text-lg font-semibold text-center ${
                  isDark ? 'text-purple-200' : 'text-purple-800'
                }`}>
                  {service.title}
                </h3>
              </div>              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-purple-600/20 to-purple-800/20'
                  : 'bg-gradient-to-r from-purple-500/10 to-purple-600/10'
              }`} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceShowcase;
