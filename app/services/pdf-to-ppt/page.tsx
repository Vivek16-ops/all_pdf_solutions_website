'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ComingSoon from '@/components/ComingSoon';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import { usePdfToPpt } from '@/hooks/usePdfToPpt';
import { BsFillFileEarmarkPdfFill } from 'react-icons/bs';
import { FaFileImage, FaClock, FaDownload } from 'react-icons/fa';
import { ServiceSections } from '@/components/service-components';

const PDFtoPPTPage = () => {  const { isSignedIn } = useAuth();
  const { isDark, mounted } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const { isConverting, pptFile, convertPdfToPpt, downloadPpt } = usePdfToPpt();  // State management
  const [conversionProgress, setConversionProgress] = useState(0);
  const [fileInfo, setFileInfo] = useState<{ size: string, estimatedTime?: string } | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Show helpful tooltips
  useEffect(() => {
    const tips = [
      "For best results, use PDFs with clear text and formatting!",
      "Our converter preserves layouts, images, and styling automatically.",
      "Files are securely processed and deleted after conversion.",
      "Try uploading PDFs with complex layouts - they convert beautifully!",
      "Pro tip: Each PDF page becomes a PowerPoint slide!"
    ];

    const showRandomTip = () => {
      if (!showTooltip && !isConverting) {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        setShowTooltip(randomTip);
        setTimeout(() => setShowTooltip(null), 5000);
      }
    };

    const interval = setInterval(showRandomTip, 15000);
    return () => clearInterval(interval);
  }, [showTooltip, isConverting]);

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Estimate conversion time based on file size
  const estimateConversionTime = (fileSize: number): string => {
    const sizeInMB = fileSize / (1024 * 1024);
    if (sizeInMB < 1) return '30-45 seconds';
    if (sizeInMB < 5) return '45-90 seconds';
    if (sizeInMB < 10) return '1-3 minutes';
    return '3-5 minutes';
  };

  // Enhanced file drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!isSignedIn) {
      toast.error('Please login to upload files');
      return;
    }
    if (acceptedFiles?.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);

      // Set file info
      const sizeFormatted = formatFileSize(selectedFile.size);
      const estimatedTime = estimateConversionTime(selectedFile.size);
      setFileInfo({
        size: sizeFormatted,        estimatedTime: estimatedTime
      });

      toast.success('📄 PDF file added successfully! ✨', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });
    }
  }, [isSignedIn, isDark]);

  // Enhanced remove file handler
  const handleRemoveFile = useCallback((e: React.MouseEvent) => {    e.stopPropagation();
    setFile(null);
    setFileInfo(null);
    setConversionProgress(0);
    toast.success('🗑️ File removed successfully!');
  }, []);
  // Conversion logic with progress simulation
  const handleConvert = useCallback(async () => {
    if (!isSignedIn) {
      toast.error('Please login to convert files');
      return;
    }
    if (!file) return;

    setConversionProgress(0);

    // Simulate progress updates for better UX
    const progressInterval = setInterval(() => {
      setConversionProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15 + 5;
      });
    }, 500);

    try {
      toast.success('🚀 Starting PDF to PowerPoint conversion...', {
        icon: '✨',
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });

      await convertPdfToPpt(file);

      clearInterval(progressInterval);
      setConversionProgress(100);

      toast.success('🎉 PDF converted to PowerPoint successfully! ✨', {
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',        },
      });

    } catch (error) {
      console.error('Error converting file:', error);
      clearInterval(progressInterval);
      toast.error('⚠️ Error converting file. Please try again.', {
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });
    } finally {
      setTimeout(() => setConversionProgress(0), 2000);
    }
  }, [file, isSignedIn, convertPdfToPpt, isDark]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });
  if (!mounted) {
    return (
      <>
        <Navbar />        <main className="min-h-screen pt-20 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
          <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6 text-purple-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block mr-3"
                >
                  📄
                </motion.span>
                PDF to PowerPoint Converter
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  className="inline-block ml-3"
                >
                  📊
                </motion.span>
              </motion.h1>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  return (
    <>
      <Navbar />      <motion.main
        className={`min-h-screen pt-20 transition-colors duration-500 relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-br from-black via-purple-950 to-black'
            : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Enhanced Background Animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Background Elements */}
          <motion.div
            className={`absolute top-20 left-10 text-6xl ${isDark ? 'text-red-800/20' : 'text-red-200/30'}`}
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            📄
          </motion.div>
          <motion.div
            className={`absolute top-40 right-20 text-5xl ${isDark ? 'text-orange-800/20' : 'text-orange-200/30'}`}
            animate={{ 
              y: [0, 15, 0],
              x: [0, -10, 0],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            📊
          </motion.div>
          <motion.div
            className={`absolute bottom-40 left-20 text-4xl ${isDark ? 'text-blue-800/20' : 'text-blue-200/30'}`}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          >
            ✨
          </motion.div>

          {/* Animated Gradient Overlay */}
          <motion.div
            className={`absolute inset-0 ${
              isDark
                ? 'bg-gradient-to-br from-purple-900/20 via-transparent to-purple-800/10'
                : 'bg-gradient-to-br from-purple-100/30 via-transparent to-pink-100/20'
            }`}
            animate={{
              background: isDark
                ? [
                    'radial-gradient(ellipse at 0% 0%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 100%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 0% 100%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 0%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
                  ]
                : [
                    'radial-gradient(ellipse at 0% 0%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 100%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 0% 100%, rgba(147, 51, 234, 0.12) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 0%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
                  ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Floating PowerPoint Icons */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute ${
                isDark ? 'text-orange-300/10' : 'text-orange-200/30'
              }`}
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 50 - 25, 0],
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${20 + Math.random() * 20}px`,
              }}
            >
              📊
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">{/* Header Section */}
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                PDF to PowerPoint
              </span>
              <br />
              <span className="text-gray-800 dark:text-gray-200">
                Converter
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              Transform your PDF documents into dynamic PowerPoint presentations with
              <span className="font-semibold text-purple-600 dark:text-purple-400"> perfect formatting</span> and
              <span className="font-semibold text-blue-600 dark:text-blue-400"> layout preservation</span>.
            </p>
          </motion.div>          {/* Coming Soon Component */}
          <motion.div
            className="mb-16 sm:mb-20 max-w-4xl mx-auto px-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ComingSoon
              title="PDF to PPT Converter"
              subtitle="Advanced AI-Powered Conversion Technology"
              description="We're developing a revolutionary PDF to PowerPoint converter that uses advanced AI to preserve your document's exact formatting, images, fonts, and layout. Experience conversion like never before - coming very soon!"
            />
          </motion.div>          {/* File Upload and Dropbox section - Hidden for now */}
          <div className="hidden max-w-4xl mx-auto px-4">
            <motion.div
              className={`rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm transition-all duration-300 relative overflow-hidden ${isDark
                ? 'bg-gradient-to-br from-gray-900/80 to-purple-900/50 shadow-2xl shadow-purple-900/30 border border-gray-700/50'
                : 'bg-gradient-to-br from-white/90 to-purple-50/80 shadow-2xl shadow-purple-500/20 border border-white/50'
                }`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              {/* File Upload Area */}
              <div {...getRootProps()} className="relative z-10">
                <input {...getInputProps()} />

                <motion.div
                  className={`relative border-2 border-dashed rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-12 text-center transition-all duration-300 ${!isSignedIn
                    ? isDark ? 'border-gray-700 bg-gray-800/30 cursor-not-allowed' : 'border-gray-300 bg-gray-100/30 cursor-not-allowed'
                    : isDragActive
                      ? isDark ? 'border-purple-400 bg-purple-950/50 shadow-lg shadow-purple-500/30' : 'border-purple-400 bg-purple-50/70 shadow-lg shadow-purple-500/30'
                      : isDark ? 'border-gray-600 hover:border-purple-400 hover:bg-gray-800/50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                    }`}
                  whileHover={isSignedIn ? {
                    scale: 1.02,
                    borderColor: isDark ? "#a855f7" : "#8b5cf6"
                  } : {}}
                  whileTap={isSignedIn ? { scale: 0.98 } : {}}
                >
                  {/* Remove File Button */}
                  <AnimatePresence>
                    {file && isSignedIn && (
                      <motion.button
                        onClick={handleRemoveFile}
                        className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-200 ${isDark
                          ? 'bg-gray-800 hover:bg-red-800 text-gray-400 hover:text-red-300 shadow-lg shadow-red-900/20'
                          : 'bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 shadow-md shadow-red-500/20'
                          }`}
                        aria-label="Remove file"
                        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IoMdClose size={24} />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Content based on state */}
                  <motion.div
                    className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {!isSignedIn ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="px-2"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity, type: "tween" }}
                          className="mb-4 md:mb-6 text-4xl sm:text-5xl md:text-6xl"
                        >
                          🔒
                        </motion.div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3">Login Required</h3>
                        <p className="text-sm sm:text-base md:text-lg">Please login to upload and convert files</p>
                      </motion.div>
                    ) : file ? (
                      <motion.div
                        className="relative px-2"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          animate={{
                            y: [0, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ duration: 2.5, repeat: Infinity, type: "tween" }}
                          className="mb-4 md:mb-6"
                        >
                          <BsFillFileEarmarkPdfFill className={`text-4xl sm:text-5xl md:text-6xl mx-auto ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                        </motion.div>

                        {/* File Info Card */}
                        {fileInfo && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className={`mb-4 p-4 rounded-lg ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                              }`}
                          >
                            <div className="flex items-center justify-between text-sm mb-2">
                              <div className="flex items-center gap-2">
                                <FaFileImage className={`${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  File Size: {fileInfo.size}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaClock className={`${isDark ? 'text-green-400' : 'text-green-500'}`} />
                                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                  Est. Time: {fileInfo.estimatedTime}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3 flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                          <motion.span
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="text-lg sm:text-xl md:text-2xl"
                          >
                            📄
                          </motion.span>
                          <span className="text-center">Selected File</span>
                          <motion.span
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, type: "tween" }}
                            className="text-lg sm:text-xl md:text-2xl"
                          >
                            ✅
                          </motion.span>
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg font-medium text-purple-600 dark:text-purple-400 mb-2 md:mb-3 break-all px-2">
                          {file.name}
                        </p>
                        <motion.p
                          className="text-xs sm:text-sm opacity-75"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, type: "tween" }}
                        >
                          🔄 Click or drag to change file
                        </motion.p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="px-2"
                      >
                        <motion.div
                          animate={{
                            y: [0, -15, 0],
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            type: "tween"
                          }}
                          className="mb-4 md:mb-6 text-4xl sm:text-5xl md:text-6xl"
                        >
                          📁
                        </motion.div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3">
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1, type: "tween" }}
                            className="inline-block mr-2 text-lg sm:text-xl md:text-2xl"
                          >
                            📄
                          </motion.span>
                          <span className="break-words">Drag and drop your PDF file here</span>
                        </h3>
                        <motion.p
                          className="text-sm sm:text-base md:text-lg"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5, type: "tween" }}
                        >
                          or click to select file ✨
                        </motion.p>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              </div>

              {/* Convert Button */}
              <motion.button
                onClick={handleConvert}
                disabled={!isSignedIn || !file || isConverting}
                className={`mt-6 md:mt-8 w-full py-4 md:py-5 px-6 md:px-8 rounded-xl md:rounded-2xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 relative overflow-hidden ${!isSignedIn || !file || isConverting
                  ? isDark
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400 cursor-not-allowed border border-gray-600'
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
                  : isDark
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-500 hover:via-pink-500 hover:to-purple-600 text-white shadow-xl shadow-purple-900/40 hover:shadow-purple-800/60'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-400 hover:via-pink-400 hover:to-purple-500 text-white shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60'
                  }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={!isSignedIn || !file || isConverting ? {} : {
                  scale: 1.03,
                  boxShadow: isDark ? "0 25px 50px -12px rgba(168, 85, 247, 0.6)" : "0 25px 50px -12px rgba(139, 92, 246, 0.6)"
                }}
                whileTap={!isSignedIn || !file || isConverting ? {} : { scale: 0.97 }}
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 relative z-10 flex-wrap">
                  {!isSignedIn ? (
                    <>
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-lg sm:text-xl md:text-2xl"
                      >
                        🔐
                      </motion.span>
                      <span>Login Required</span>
                    </>
                  ) : isConverting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="text-lg sm:text-xl md:text-2xl"
                      >
                        ⚙️
                      </motion.span>
                      <span className="text-center">Converting to PowerPoint...</span>
                      <motion.span
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 1, repeat: Infinity, type: "tween" }}
                        className="text-lg sm:text-xl md:text-2xl"
                      >
                        ✨
                      </motion.span>
                    </>
                  ) : (
                    <>
                      <motion.span
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                          type: "tween"
                        }}
                        className="text-lg sm:text-xl md:text-2xl"
                      >
                        🎭
                      </motion.span>
                      <span className="text-center">Convert to PowerPoint</span>
                      <motion.span
                        animate={{
                          y: [0, -5, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5, type: "tween" }}
                        className="text-lg sm:text-xl md:text-2xl"
                      >
                        🚀
                      </motion.span>
                    </>
                  )}
                </div>
              </motion.button>

              {/* Progress Bar */}
              <AnimatePresence>
                {isConverting && conversionProgress > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50/50 border border-gray-200'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Conversion Progress
                      </span>
                      <motion.span
                        className={`text-sm font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity, type: "tween" }}
                      >
                        {Math.round(conversionProgress)}%
                      </motion.span>
                    </div>

                    <div className={`w-full bg-gray-200 rounded-full h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-3 rounded-full relative overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: `${conversionProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: [-100, 300] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </motion.div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-3">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="text-lg"
                      >
                        ⚙️
                      </motion.span>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Converting your PDF to PowerPoint...
                      </span>
                      <motion.span
                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity, type: "tween" }}
                        className="text-lg"
                      >
                        ✨
                      </motion.span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Section */}
              <AnimatePresence>
                {pptFile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -30 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                    className={`mt-6 md:mt-8 p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl md:rounded-2xl relative overflow-hidden mx-2 sm:mx-0 ${isDark
                      ? 'bg-gradient-to-r from-green-900/40 to-blue-900/40 border border-green-800/50 shadow-xl shadow-green-900/20'
                      : 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 shadow-xl shadow-green-500/20'
                      }`}
                  >
                    <motion.div className="text-center relative z-10">
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.4, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 2,
                          type: "tween"
                        }}
                        className="mb-3 text-4xl md:text-5xl"
                      >
                        🎉
                      </motion.div>

                      <h3 className={`text-xl md:text-2xl font-bold mb-3 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        <motion.span
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="inline-block mr-2"
                        >
                          ✨
                        </motion.span>
                        Conversion Completed Successfully!
                        <motion.span
                          animate={{ rotate: [0, -15, 15, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                          className="inline-block ml-2"
                        >
                          ✨
                        </motion.span>
                      </h3>

                      <motion.p
                        className={`text-lg mb-4 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, type: "tween" }}
                      >
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, type: "tween" }}
                          className="inline-block mr-2"
                        >
                          📊
                        </motion.span>
                        Your PowerPoint presentation is ready!
                      </motion.p>

                      <motion.button
                        onClick={downloadPpt}
                        className={`px-6 py-3 rounded-xl font-bold text-lg transition-all relative overflow-hidden ${isDark
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-900/30'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white shadow-lg shadow-blue-500/30'
                          }`}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: isDark ? "0 20px 40px -12px rgba(59, 130, 246, 0.5)" : "0 20px 40px -12px rgba(59, 130, 246, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex items-center justify-center gap-3 relative z-10">
                          <motion.span
                            animate={{
                              y: [0, -3, 0],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity, type: "tween" }}
                            className="text-2xl"
                          >
                            📥
                          </motion.span>
                          <span>Download PowerPoint</span>
                          <motion.span
                            animate={{
                              rotate: [0, 360],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5, type: "tween" }}
                          >
                            <FaDownload />
                          </motion.span>
                        </div>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Service Sections Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <ServiceSections
              serviceName="PDF to PowerPoint"
            />
          </motion.div>          {/* Call to Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-16 sm:mt-20 text-center max-w-4xl mx-auto"
          >
            <div className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 transition-colors duration-200 ${
              isDark 
                ? 'bg-gradient-to-r from-purple-900/80 to-pink-900/80 border border-purple-800/50' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600'
            } text-white`}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Ready to Transform Your PDFs?
              </h2>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Join thousands of users who will soon experience the most advanced PDF to PowerPoint conversion technology.
              </p>
              <motion.button
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 shadow-lg ${
                  isDark
                    ? 'bg-white/90 text-purple-900 hover:bg-white hover:shadow-xl'
                    : 'bg-white text-purple-600 hover:bg-gray-100 hover:shadow-xl'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Notified When Available
              </motion.button>
            </div>
          </motion.div>        </div>
      </motion.main>
      <Footer />
    </>
  );
};

export default PDFtoPPTPage;