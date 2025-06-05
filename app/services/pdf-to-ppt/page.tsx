'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';
import { usePdfToPpt } from '@/hooks/usePdfToPpt';
import { IoMdClose, IoMdInformationCircle, IoMdCheckmarkCircle, IoMdTime } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilePdf, FaFileAlt, FaDownload, FaMagic, FaStar, FaRocket, FaEye, FaClock, FaFileImage, FaSpinner, FaHeart, FaThumbsUp } from "react-icons/fa";
import { ServiceSections } from '@/components/service-components';

const PDFtoPPTPage = () => {
  const { isSignedIn } = useAuth();
  const { isDark, mounted } = useTheme();
  const { isConverting, pptFile, previewData, convertPdfToPpt, downloadPpt, resetConversion } = usePdfToPpt();
  
  const [file, setFile] = useState<File | null>(null);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{size: string, pages?: number, estimatedTime?: string} | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Show helpful tooltips
  useEffect(() => {
    const tips = [
      "For best results, use PDFs with clear text and good formatting!",
      "Our AI preserves your original layout and styling automatically.",
      "Files are automatically deleted after conversion for your privacy.",
      "Try uploading multi-page PDFs - each page becomes a slide!",
      "Pro tip: PDFs with images work great too!"
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
    if (sizeInMB < 5) return '1-2 minutes';
    if (sizeInMB < 10) return '2-3 minutes';
    return '3-5 minutes';
  };

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
        size: sizeFormatted,
        estimatedTime: estimatedTime
      });

      // Create file preview
      const fileURL = URL.createObjectURL(selectedFile);
      setFilePreview(fileURL);
      
      toast.success('📄 File added successfully! ✨', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });
    }
  }, [isSignedIn, isDark]);  const handleRemoveFile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setFilePreview(null);
    setFileInfo(null);
    setConversionProgress(0);
    resetConversion(); // Reset hook state
    toast.success('🗑️ File removed successfully!');
  }, [resetConversion]);  const handleConvert = useCallback(async () => {
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
      toast.success('🚀 Starting magical conversion...', {
        icon: '✨',
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });
      
      // Use the hook to convert
      await convertPdfToPpt(file);
      
      clearInterval(progressInterval);
      setConversionProgress(100);
      setShowCelebration(true);
      
      // Hide celebration after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
      
    } catch (error) {
      console.error('Error converting file:', error);
      clearInterval(progressInterval);
    } finally {
      setTimeout(() => setConversionProgress(0), 2000);
    }
  }, [file, isSignedIn, isDark, convertPdfToPpt]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-10 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
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
      <Navbar />
      <motion.main 
        className={`min-h-screen pt-10 transition-colors duration-500 ${
          isDark 
            ? 'bg-gradient-to-br from-black via-purple-950 to-black' 
            : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className={`absolute top-20 left-10 text-6xl ${isDark ? 'text-purple-800/20' : 'text-purple-200/30'}`}
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            📊
          </motion.div>
          <motion.div
            className={`absolute top-40 right-20 text-5xl ${isDark ? 'text-pink-800/20' : 'text-pink-200/30'}`}
            animate={{ 
              y: [0, 15, 0],
              x: [0, -10, 0],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            ✨
          </motion.div>
          <motion.div
            className={`absolute bottom-40 left-20 text-4xl ${isDark ? 'text-blue-800/20' : 'text-blue-200/30'}`}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          >
            🎭
          </motion.div>
        </div>

        <motion.div 
          className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12 px-2">
            <motion.h1 
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight ${isDark ? 'text-purple-200' : 'text-purple-800'}`}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.span
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="inline-block mr-2 md:mr-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl"
              >
                📄
              </motion.span>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent break-words">
                PDF to PowerPoint
              </span>
              <motion.span
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 4,
                  ease: "easeInOut"
                }}
                className="inline-block ml-2 md:ml-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl"
              >
                📊
              </motion.span>
            </motion.h1>            
            <motion.div
              className="flex items-center justify-center gap-1 sm:gap-2 mb-4 md:mb-6 flex-wrap"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <FaStar className={`text-lg sm:text-xl md:text-2xl ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
              </motion.span>
              <span className={`text-sm sm:text-lg md:text-xl font-semibold ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`}>
                Magic Converter
              </span>
              <motion.span
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
              >
                <FaStar className={`text-lg sm:text-xl md:text-2xl ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
              </motion.span>
            </motion.div>

            <motion.p 
              className={`text-sm sm:text-lg md:text-xl max-w-3xl mx-auto px-4 leading-relaxed ${isDark ? 'text-purple-300/90' : 'text-purple-700/90'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              ✨ Transform your PDF files into dynamic PowerPoint presentations with magical ease! 
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block mx-1"
              >
                🎭
              </motion.span>
              <span className="block sm:inline">Experience the future of document conversion! ✨</span>
            </motion.p>
              {!isSignedIn && (
              <motion.div 
                className={`mt-4 md:mt-6 p-3 md:p-4 rounded-xl backdrop-blur-sm mx-2 ${
                  isDark ? 'bg-purple-900/30 border border-purple-800/50' : 'bg-purple-100/50 border border-purple-200'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xl md:text-2xl inline-block mr-2"
                >
                  🔐
                </motion.span>
                <span className={`text-sm sm:text-lg md:text-lg font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                  Please login to upload and convert files
                </span>
              </motion.div>
            )}
          </div>          {/* Main Conversion Card */}
          <motion.div 
            className={`rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm transition-all duration-300 relative overflow-hidden mx-2 sm:mx-0 ${
              isDark 
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
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                background: [
                  'linear-gradient(45deg, #8b5cf6, #ec4899)',
                  'linear-gradient(45deg, #ec4899, #3b82f6)',
                  'linear-gradient(45deg, #3b82f6, #8b5cf6)'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* File Upload Area */}
            <div {...getRootProps()} className="relative z-10">
              <input {...getInputProps()} />              <motion.div 
                className={`relative border-2 border-dashed rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-12 text-center transition-all duration-300 ${
                  !isSignedIn
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
                      className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-200 ${
                        isDark
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
                >                  {!isSignedIn ? (
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
                        transition={{ duration: 3, repeat: Infinity }}
                        className="mb-4 md:mb-6 text-4xl sm:text-5xl md:text-6xl"
                      >
                        🔒
                      </motion.div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3">Login Required</h3>
                      <p className="text-sm sm:text-base md:text-lg">Please login to upload and convert files</p>
                    </motion.div>                  ) : file ? (
                    <motion.div 
                      className="relative px-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="mb-4 md:mb-6"
                      >
                        <FaFilePdf className={`text-4xl sm:text-5xl md:text-6xl mx-auto ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                      </motion.div>
                      
                      {/* File Info Card */}
                      {fileInfo && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className={`mb-4 p-4 rounded-lg ${
                            isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
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
                          
                          {/* Interactive Preview Button */}
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success('📄 File preview coming soon! ✨', {
                                icon: '👀',
                                style: {
                                  borderRadius: '10px',
                                  background: isDark ? '#333' : '#fff',
                                  color: isDark ? '#fff' : '#333',
                                },
                              });
                            }}
                            className={`w-full py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
                              isDark 
                                ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-600/30'
                                : 'bg-purple-100 hover:bg-purple-200 text-purple-600 border border-purple-200'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaEye />
                            <span className="text-sm font-medium">Preview File</span>
                          </motion.button>
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
                          transition={{ duration: 1.5, repeat: Infinity }}
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
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🔄 Click or drag to change file
                      </motion.p>
                    </motion.div>                  ) : (
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
                          ease: "easeInOut"
                        }}
                        className="mb-4 md:mb-6 text-4xl sm:text-5xl md:text-6xl"
                      >
                        📁
                      </motion.div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3">
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                          className="inline-block mr-2 text-lg sm:text-xl md:text-2xl"
                        >
                          📄
                        </motion.span>
                        <span className="break-words">Drag and drop your PDF file here</span>
                      </h3>
                      <motion.p 
                        className="text-sm sm:text-base md:text-lg"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        or click to select file ✨
                      </motion.p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>            {/* Convert Button */}
            <motion.button
              onClick={handleConvert}
              disabled={!isSignedIn || !file || isConverting}
              className={`mt-6 md:mt-8 w-full py-4 md:py-5 px-6 md:px-8 rounded-xl md:rounded-2xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 relative overflow-hidden ${
                !isSignedIn || !file || isConverting
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
              {/* Animated background for active button */}
              {isSignedIn && file && !isConverting && (
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    background: [
                      'linear-gradient(45deg, #8b5cf6, #ec4899)',
                      'linear-gradient(45deg, #ec4899, #3b82f6)',
                      'linear-gradient(45deg, #3b82f6, #8b5cf6)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              )}              
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
                    <span className="text-center">Converting Magic in Progress...</span>
                    <motion.span
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
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
                        repeatDelay: 1
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
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                      className="text-lg sm:text-xl md:text-2xl"
                    >
                      🚀
                    </motion.span>                  </>
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
                  className={`mt-6 p-4 rounded-xl ${
                    isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50/50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Conversion Progress
                    </span>
                    <motion.span 
                      className={`text-sm font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
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
                      {/* Animated shimmer effect */}
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
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-lg"
                    >
                      ✨
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>            {/* Success Section */}
            <AnimatePresence>
              {pptFile && (<motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -30 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                  className={`mt-6 md:mt-8 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl relative overflow-hidden mx-2 sm:mx-0 ${
                    isDark 
                      ? 'bg-gradient-to-r from-green-900/40 to-blue-900/40 border border-green-800/50 shadow-xl shadow-green-900/20' 
                      : 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 shadow-xl shadow-green-500/20'
                  }`}
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 opacity-10"
                    animate={{
                      background: [
                        'linear-gradient(45deg, #10b981, #3b82f6)',
                        'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                        'linear-gradient(45deg, #8b5cf6, #10b981)'
                      ]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  <motion.div 
                    className="text-center relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.4, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                      className="mb-6 text-6xl"
                    >
                      🎉
                    </motion.div>
                    
                    <motion.h3 
                      className={`text-3xl font-bold mb-4 ${isDark ? 'text-green-300' : 'text-green-700'}`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
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
                    </motion.h3>
                    
                    <motion.p 
                      className={`text-xl mb-6 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="inline-block mr-2"
                      >
                        📊
                      </motion.span>                      Your PowerPoint presentation is ready: 
                      <br />
                      <strong className="text-purple-600 dark:text-purple-400">
                        {previewData?.fileName || (file ? file.name.replace('.pdf', '.pptx') : 'converted.pptx')}
                      </strong>
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="inline-block ml-2"
                      >
                        🎭
                      </motion.span>
                    </motion.p>
                    
                    <motion.button
                      onClick={downloadPpt}
                      className={`px-8 py-4 rounded-xl font-bold text-lg transition-all relative overflow-hidden ${
                        isDark
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-900/30'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white shadow-lg shadow-blue-500/30'
                      }`}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: isDark ? "0 20px 40px -12px rgba(59, 130, 246, 0.5)" : "0 20px 40px -12px rgba(59, 130, 246, 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        animate={{
                          background: [
                            'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                            'linear-gradient(45deg, #8b5cf6, #06b6d4)',
                            'linear-gradient(45deg, #06b6d4, #3b82f6)'
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      
                      <div className="flex items-center gap-3 relative z-10">
                        <motion.span
                          animate={{ 
                            y: [0, -3, 0],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
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
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                          <FaDownload />
                        </motion.span>
                      </div>
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>          {/* Enhanced Features Section */}
          <ServiceSections 
            serviceName="PDF to PPT Converter"
            steps={[
              { 
                step: "1", 
                title: "Upload PDF", 
                desc: "Drag & drop or click to select your PDF file",
                icon: "📄",
                color: "from-blue-500 to-cyan-500"
              },
              { 
                step: "2", 
                title: "AI Magic", 
                desc: "Our AI analyzes and converts with perfect formatting",
                icon: "🤖",
                color: "from-purple-500 to-pink-500"
              },
              { 
                step: "3", 
                title: "Download PPT", 
                desc: "Get your professional PowerPoint presentation instantly",
                icon: "📊",
                color: "from-green-500 to-emerald-500"
              }
            ]}
            testimonials={[
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
                text: "Perfect for converting my lesson PDFs to interactive presentations. Students love it!",
                rating: 5,
                avatar: "👨‍🏫"
              },
              {
                name: "Lisa Wang",
                role: "Consultant",
                text: "Fast, secure, and reliable. I use it daily for client presentations. Highly recommended!",
                rating: 5,
                avatar: "👩‍💻"
              }
            ]}
            callToActionMessage="Ready to convert your PDF to PowerPoint? Start now!"
          />
        </motion.div>

        {/* Floating Celebration Effects */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="fixed inset-0 pointer-events-none z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Confetti Effect */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ 
                    scale: 0,
                    rotate: 0,
                    y: -100
                  }}
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: [0, 360, 720],
                    y: [0, 100, 200],
                    x: [0, Math.random() * 200 - 100, Math.random() * 400 - 200]
                  }}
                  transition={{ 
                    duration: 3,
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                />
              ))}
              
              {/* Success Messages */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.6 }}
              >
                <div className={`text-6xl md:text-8xl font-bold text-center ${
                  isDark ? 'text-yellow-400' : 'text-yellow-500'
                }`}>
                  🎉
                </div>
                <motion.div
                  className={`text-2xl md:text-4xl font-bold text-center mt-4 ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 5 }}
                >
                  Success!
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Tooltips */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className={`fixed top-4 right-4 p-4 rounded-xl backdrop-blur-sm border z-40 max-w-sm ${
                isDark 
                  ? 'bg-gray-800/90 border-gray-700 text-white' 
                  : 'bg-white/90 border-gray-200 text-gray-800'
              }`}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <div className="flex items-start gap-3">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-2xl"
                >
                  💡
                </motion.span>
                <div>
                  <h4 className="font-bold mb-1">Pro Tip!</h4>
                  <p className="text-sm">{showTooltip}</p>
                </div>
                <button
                  onClick={() => setShowTooltip(null)}
                  className={`ml-auto text-lg hover:scale-110 transition-transform ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Rating System */}
        <AnimatePresence>
          {pptFile && userRating === 0 && (
            <motion.div
              className={`fixed bottom-4 left-4 p-4 rounded-xl backdrop-blur-sm border z-40 ${
                isDark 
                  ? 'bg-gray-800/90 border-gray-700' 
                  : 'bg-white/90 border-gray-200'
              }`}
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
              transition={{ delay: 2, type: "spring", bounce: 0.3 }}
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl mb-2"
                >
                  😊
                </motion.div>
                <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  How was your experience?
                </p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      onClick={() => {
                        setUserRating(star);
                        toast.success(`Thanks for the ${star} star${star > 1 ? 's' : ''}! 🌟`);
                        setTimeout(() => setUserRating(0), 3000);
                      }}
                      className="text-2xl hover:scale-125 transition-transform"
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.span
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: star * 0.1 
                        }}
                      >
                        ⭐
                      </motion.span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
      <Footer />
    </>
  );
};

export default PDFtoPPTPage;
