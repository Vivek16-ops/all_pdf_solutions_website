'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ServiceSections } from '@/components/service-components';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';
import { IoMdClose, IoMdInformationCircle } from "react-icons/io";
import { FaDownload, FaExternalLinkAlt, FaFilePdf, FaPlus, FaFolderOpen, FaStar, FaMagic, FaRocket, FaClock, FaFileImage, FaSpinner, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { BsFillFileEarmarkPdfFill } from 'react-icons/bs';
import { useMergePdf } from '@/hooks/useMergePdf';
import { motion, AnimatePresence } from 'framer-motion';

const MergePDFPage = () => {
  const { isSignedIn } = useAuth();
  const { isDark, mounted } = useTheme();
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  // Enhanced state management
  const [mergingProgress, setMergingProgress] = useState(0);
  const [fileInfo, setFileInfo] = useState<{totalSize: string, estimatedTime?: string, count: number} | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Show helpful tooltips
  useEffect(() => {
    const tips = [
      "Drag files to reorder them in your merged PDF!",
      "Our merger preserves all PDF content and formatting.",
      "Files are securely processed and deleted after merging.",
      "Try merging documents with bookmarks - they'll be preserved!",
      "Pro tip: The order you upload files determines the final order!"
    ];
    
    const showRandomTip = () => {
      if (!showTooltip && !isMerging) {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        setShowTooltip(randomTip);
        setTimeout(() => setShowTooltip(null), 5000);
      }
    };

    if (files.length === 0) {
      const interval = setInterval(showRandomTip, 8000);
      return () => clearInterval(interval);
    }
  }, [files.length, showTooltip, isMerging]);

  // Enhanced file size formatter
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Estimate merging time based on total file size
  const estimateMergingTime = useCallback((totalBytes: number): string => {
    if (totalBytes < 1024 * 1024) return '< 10 seconds'; // < 1MB
    if (totalBytes < 10 * 1024 * 1024) return '10-30 seconds'; // < 10MB
    if (totalBytes < 50 * 1024 * 1024) return '30-60 seconds'; // < 50MB
    return '1-2 minutes'; // > 50MB
  }, []);

  // Update file info when files change
  useEffect(() => {
    if (files.length > 0) {
      const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
      const totalSize = formatFileSize(totalBytes);
      const estimatedTime = estimateMergingTime(totalBytes);
      setFileInfo({
        totalSize,
        estimatedTime,
        count: files.length
      });
    } else {
      setFileInfo(null);
    }
  }, [files, formatFileSize, estimateMergingTime]);  // Enhanced file drop handler with validation
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!isSignedIn) {
      toast.error('Please login to upload files');
      return;
    }
    
    if (acceptedFiles?.length > 0) {
      // Filter out non-PDF files and validate
      const validPdfFiles = acceptedFiles.filter(file => {
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        if (!isPdf) {
          toast.error(`❌ "${file.name}" is not a PDF file. Only PDF files are allowed.`, {
            style: {
              borderRadius: '10px',
              background: isDark ? '#333' : '#fff',
              color: isDark ? '#fff' : '#333',
            },
          });
        }
        return isPdf;
      });

      // Check for duplicates
      const existingFileNames = files.map(f => f.name);
      const newFiles = validPdfFiles.filter(file => {
        const isDuplicate = existingFileNames.includes(file.name);
        if (isDuplicate) {
          toast.error(`📋 "${file.name}" is already added. Skipping duplicate.`, {
            style: {
              borderRadius: '10px',
              background: isDark ? '#333' : '#fff',
              color: isDark ? '#fff' : '#333',
            },
          });
        }
        return !isDuplicate;
      });
      
      if (newFiles.length > 0) {
        setFiles(prev => [...prev, ...newFiles]);
        
        const message = newFiles.length === 1 
          ? `📁 "${newFiles[0].name}" added successfully! ✨`
          : `📁 ${newFiles.length} PDF files added successfully! ✨`;
          
        toast.success(message, {
          icon: '🎉',
          style: {
            borderRadius: '10px',
            background: isDark ? '#333' : '#fff',
            color: isDark ? '#fff' : '#333',
          },
        });
      }
    }
  }, [isSignedIn, isDark, files]);

  // Enhanced remove file handler
  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('🗑️ File removed successfully!', {
      style: {
        borderRadius: '10px',
        background: isDark ? '#333' : '#fff',
        color: isDark ? '#fff' : '#333',
      },
    });
  }, [isDark]);

  // Move file up in order
  const moveFileUp = useCallback((index: number) => {
    if (index > 0) {
      setFiles(prev => {
        const newFiles = [...prev];
        [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
        return newFiles;
      });
      toast.success('📄 File moved up!');
    }
  }, []);

  // Move file down in order
  const moveFileDown = useCallback((index: number) => {
    setFiles(prev => {
      if (index < prev.length - 1) {
        const newFiles = [...prev];
        [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
        return newFiles;
      }
      return prev;
    });
    if (files.length > 0 && index < files.length - 1) {
      toast.success('📄 File moved down!');
    }
  }, [files.length]);
  const { pdfBlobUrl, mergePdfs, downloadMergedPdf } = useMergePdf();
  // Enhanced merging logic with progress simulation
  const handleMerge = useCallback(async () => {
    if (!isSignedIn) {
      toast.error('Please login to merge files');
      return;
    }
    if (files.length < 2) {
      toast.error('Please add at least 2 files to merge');
      return;
    }
    
    setMergingProgress(0);
    setIsMerging(true);
    
    // Simulate progress updates for better UX
    const progressInterval = setInterval(() => {
      setMergingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15 + 5;
      });
    }, 500);

    try {
      toast.success('🚀 Starting PDF merge process...', {
        icon: '✨',
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });

      await mergePdfs(files);
      
      clearInterval(progressInterval);
      setMergingProgress(100);
      
      toast.success('🎉 PDFs merged successfully! ✨', {
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });

      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
      
    } catch (error) {
      console.error('Error merging files:', error);
      clearInterval(progressInterval);
      toast.error('⚠️ Error merging files. Please try again.', {
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });
    } finally {
      setIsMerging(false);
      setTimeout(() => setMergingProgress(0), 2000);
    }
  }, [files, isSignedIn, mergePdfs, isDark]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  // Keyboard shortcut support for adding more files
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + O to open file selector
      if ((event.ctrlKey || event.metaKey) && event.key === 'o' && files.length > 0 && isSignedIn) {
        event.preventDefault();
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
          fileInput.click();
          
          toast.success('⌨️ Keyboard shortcut: Ctrl+O to add more files!', {
            duration: 2500,
            icon: '📄',
            style: {
              borderRadius: '10px',
              background: isDark ? '#333' : '#fff',
              color: isDark ? '#fff' : '#333',
            },
          });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [files.length, isSignedIn, isDark]);

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-10 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
          <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-purple-800">
                Merge PDF Files
              </h1>
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
        className={`min-h-screen pt-10 transition-colors duration-500 relative overflow-hidden ${
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
            className={`absolute top-20 left-10 text-6xl ${isDark ? 'text-purple-800/20' : 'text-purple-200/30'}`}
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
            className={`absolute top-40 right-20 text-5xl ${isDark ? 'text-red-800/20' : 'text-red-200/30'}`}
            animate={{ 
              y: [0, 15, 0],
              x: [0, -10, 0],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            📁
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
                    'radial-gradient(ellipse at 0% 0%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 100%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 0% 100%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 0%, rgba(239, 68, 68, 0.2) 0%, transparent 50%)',
                  ]
                : [
                    'radial-gradient(ellipse at 0% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 100%, rgba(239, 68, 68, 0.08) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 0% 100%, rgba(168, 85, 247, 0.12) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 0%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
                  ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Floating PDF Icons */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute ${
                isDark ? 'text-purple-300/10' : 'text-purple-200/30'
              }`}
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                opacity: 0
              }}
              animate={{
                x: [
                  Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                  Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                  Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)
                ],
                y: [
                  Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
                ],
                opacity: [0, 1, 0],
                rotate: [0, 360, 720]
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2
              }}
            >
              {i % 2 === 0 ? (
                <FaFilePdf className="w-12 h-12" />
              ) : (
                <FaFolderOpen className="w-10 h-10" />
              )}
            </motion.div>            ))}

          {/* Celebration Effects */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-4xl"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: 0
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 800,
                      y: (Math.random() - 0.5) * 600,
                      opacity: 0,
                      scale: [0, 1.5, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    {['🎉', '✨', '🎊', '⭐', '💫'][i % 5]}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.div 
          className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Tooltip Display */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-sm mx-auto p-4 rounded-lg shadow-lg ${
                  isDark ? 'bg-purple-900/90 text-purple-100 border border-purple-700' : 'bg-white/90 text-purple-800 border border-purple-200'
                } backdrop-blur-sm`}
              >                <div className="flex items-start gap-3">
                  <IoMdInformationCircle className={`text-xl flex-shrink-0 mt-0.5 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
                  <p className="text-sm leading-relaxed">{showTooltip}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Header Section */}
          <div className="text-center mb-8 md:mb-12 px-2">
            <motion.h1 
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight ${isDark ? 'text-purple-200' : 'text-purple-800'}`}
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
                className="inline-block mr-2 md:mr-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              >
                📁
              </motion.span>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent break-words">
                Merge PDF Files
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
                className="inline-block ml-2 md:ml-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              >
                📄
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
                Professional PDF Merger
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
              ✨ Combine multiple PDF files into a single document quickly and easily! 
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block"
              >
                🚀
              </motion.span>
            </motion.p>

            {!isSignedIn && (
              <motion.p 
                className={`mt-4 text-sm ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >                Please login to merge files
              </motion.p>
            )}
          </div>
          
          <motion.div
            className={`rounded-2xl p-6 md:p-8 backdrop-blur-sm ${
              isDark 
                ? 'bg-gray-900/50 shadow-xl border border-gray-800' 
                : 'bg-white/80 shadow-lg border border-gray-100'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {/* Enhanced Drop Zone Container */}
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-all duration-300 transform group ${
                !isSignedIn
                  ? isDark 
                    ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed opacity-75' 
                    : 'border-gray-300 bg-gray-100/50 cursor-not-allowed opacity-75'
                  : isDragActive
                    ? isDark 
                      ? 'border-purple-400/80 bg-purple-900/30 scale-[1.02] shadow-2xl shadow-purple-900/30 ring-4 ring-purple-500/20' 
                      : 'border-purple-400/80 bg-purple-50 scale-[1.02] shadow-2xl shadow-purple-500/20 ring-4 ring-purple-400/20'
                    : isDark 
                      ? 'border-gray-700 hover:border-purple-500/70 hover:bg-purple-950/20 hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-900/20 group-hover:ring-2 group-hover:ring-purple-500/20' 
                      : 'border-gray-300/90 hover:border-purple-300 hover:bg-purple-50/70 hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-500/10 group-hover:ring-2 group-hover:ring-purple-300/50'
              }`}
            >
              <input {...getInputProps()} />
              
              <div className={`space-y-4 md:space-y-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
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
                      transition={{ duration: 3, repeat: Infinity }}
                      className="mb-4 md:mb-6 text-4xl sm:text-5xl md:text-6xl"
                    >
                      🔒
                    </motion.div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3">Login Required</h3>
                    <p className="text-sm sm:text-base md:text-lg">Please login to upload and merge files</p>
                  </motion.div>
                ) : files.length > 0 ? (
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
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="mb-4 md:mb-6"
                    >
                      <FaFilePdf className={`text-4xl sm:text-5xl md:text-6xl mx-auto ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                    </motion.div>
                      {/* Enhanced File Info Card */}
                    {fileInfo && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className={`mb-4 p-4 rounded-lg ${
                          isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <FaFileImage className={`${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                            <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Total Size: {fileInfo.totalSize}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaClock className={`${isDark ? 'text-green-400' : 'text-green-500'}`} />
                            <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Est. Time: {fileInfo.estimatedTime}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <motion.span
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="text-lg"
                            >
                              📁
                            </motion.span>
                            <span className={`font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                              {fileInfo.count} file{fileInfo.count > 1 ? 's' : ''} selected
                            </span>
                          </div>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Trigger file input programmatically
                              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                              if (fileInput) fileInput.click();
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isDark 
                                ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-600/30'
                                : 'bg-purple-100 hover:bg-purple-200 text-purple-600 border border-purple-200'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaPlus className="text-xs" />
                            Add More Files
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                    
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3 flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="text-lg sm:text-xl md:text-2xl"
                      >
                        📁
                      </motion.span>
                      <span className="text-center">{files.length} PDF file{files.length > 1 ? 's' : ''} selected</span>
                      <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-lg sm:text-xl md:text-2xl"
                      >
                        ✨
                      </motion.span>
                    </h3>
                      <p className="text-sm sm:text-base opacity-90 mb-4">
                      Drag and drop to add more files or reorder them
                    </p>
                    
                    {/* Enhanced Visual Indicator for Adding More Files */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${
                        isDark 
                          ? 'bg-green-900/30 text-green-300 border border-green-700/50' 
                          : 'bg-green-50 text-green-600 border border-green-200/80'
                      }`}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        👆
                      </motion.span>
                      <span>Click the button above or drop more files here</span>
                      <motion.span
                        animate={{ 
                          x: [0, 3, 0],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ↗️
                      </motion.span>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="px-2"
                  >
                    {/* Animated Icon Container */}
                    <motion.div
                      className={`w-24 h-24 mx-auto rounded-xl border-2 transition-all duration-300 transform group-hover:scale-110 relative overflow-hidden mb-6 ${
                        isDragActive
                          ? isDark 
                            ? 'border-purple-400/80 text-purple-300 bg-purple-900/20' 
                            : 'border-purple-400/80 text-purple-500 bg-purple-50/80'
                          : isDark
                            ? 'border-gray-700 text-gray-400 group-hover:border-purple-500/70 group-hover:text-purple-400' 
                            : 'border-gray-300/90 text-gray-500 group-hover:border-purple-300 group-hover:text-purple-500'
                      }`}
                      whileHover={{ 
                        scale: 1.05,
                        rotate: [0, 5, -5, 0],
                        transition: { duration: 0.3 }
                      }}
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <motion.div
                          animate={{ 
                            scale: isDragActive ? [1, 1.2, 1] : [1, 1.1, 1],
                            rotate: isDragActive ? [0, 180, 360] : [0, 10, -10, 0]
                          }}
                          transition={{ 
                            duration: isDragActive ? 1 : 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          {isDragActive ? (
                            <FaPlus className="w-12 h-12" />
                          ) : (
                            <BsFillFileEarmarkPdfFill className="w-12 h-12" />
                          )}
                        </motion.div>
                        {isDragActive && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="absolute w-full h-full">
                              <div className={`absolute inset-0 ${
                                isDark ? 'bg-purple-500/10' : 'bg-purple-100/50'
                              } animate-pulse rounded-lg`} />
                              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${
                                isDark ? 'bg-purple-400/50' : 'bg-purple-500/30'
                              } animate-ping`} />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                    
                    <motion.h3 
                      className="text-lg sm:text-xl md:text-2xl font-bold mb-3 flex items-center justify-center gap-3 flex-wrap"
                      animate={isDragActive ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.3, repeat: isDragActive ? Infinity : 0 }}
                    >
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      >
                        📁
                      </motion.span>
                      <span className={isDragActive ? (isDark ? 'text-purple-300' : 'text-purple-600') : ''}>
                        {isDragActive ? 'Drop your PDF files here!' : 'Drag & Drop PDF Files'}
                      </span>
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      >
                        ✨
                      </motion.span>
                    </motion.h3>
                    
                    <p className="text-sm sm:text-base md:text-lg opacity-90 mb-3">
                      or click to select files
                    </p>
                    
                    <motion.p 
                      className={`text-xs sm:text-sm opacity-75 ${
                        isDark ? 'text-purple-400' : 'text-purple-600'
                      }`}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Supported format: <span className="font-bold">.pdf</span> • Need at least 2 files
                    </motion.p>
                  </motion.div>
                )}
              </div>
            </div>
            {/* Status Message */}
            <AnimatePresence>
              {files.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`mb-6 p-4 rounded-xl text-center ${
                    isDark ? 'bg-purple-900/30 border border-purple-800' : 'bg-purple-50 border border-purple-200'
                  }`}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    className="inline-block text-2xl mb-2"
                  >
                    📁
                  </motion.div>
                  <p className={`font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                    Add at least 2 PDF files to merge
                  </p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    Upload your first PDF to get started
                  </p>
                </motion.div>
              )}
              
              {files.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`mb-6 p-4 rounded-xl text-center ${
                    isDark ? 'bg-amber-900/30 border border-amber-800' : 'bg-amber-50 border border-amber-200'
                  }`}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block text-2xl mb-2"
                  >
                    📄
                  </motion.div>
                  <p className={`font-medium ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                    One more PDF needed!
                  </p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                    Add at least one more PDF file to enable merging
                  </p>
                </motion.div>
              )}
              
              {files.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`mb-6 p-4 rounded-xl text-center ${
                    isDark ? 'bg-green-900/30 border border-green-800' : 'bg-green-50 border border-green-200'
                  }`}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                    className="inline-block text-2xl mb-2"
                  >
                    ✨
                  </motion.div>
                  <p className={`font-medium ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                    Ready to merge {files.length} PDF files!
                  </p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    Click the merge button to combine your files
                  </p>                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div 
                  className="mt-6 space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >                  <motion.div
                    className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
                      isDark ? 'bg-gray-800/50' : 'bg-purple-50'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.span 
                      className="text-xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      📊
                    </motion.span>
                    <span className={`font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                      {files.length} PDF file{files.length > 1 ? 's' : ''} ready to merge
                    </span>
                  </motion.div>                  {/* Enhanced Prominent Add More Files Section */}
                  <motion.div
                    className="flex flex-col items-center mb-6 space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Helpful Tip Above Button */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className={`text-center px-4 py-2 rounded-lg ${
                        isDark ? 'bg-blue-900/20 text-blue-300 border border-blue-700/30' : 'bg-blue-50 text-blue-600 border border-blue-200/50'
                      }`}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block mr-2"
                      >
                        💡
                      </motion.span>
                      <span className="text-sm font-medium">
                        Want to merge more documents? Add them here!
                      </span>
                    </motion.div>                    {/* Enhanced Add More Files Button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        
                        if (!isSignedIn) {
                          toast.error('Please login to add more files');
                          return;
                        }
                        
                        // Trigger file input programmatically
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                        if (fileInput) {
                          // Clear previous selection to allow re-selecting the same files
                          fileInput.value = '';
                          fileInput.click();
                          
                          // Show helpful toast
                          toast.success('📂 Select additional PDF files to merge!', {
                            duration: 3000,
                            icon: '📄',
                            style: {
                              borderRadius: '10px',
                              background: isDark ? '#333' : '#fff',
                              color: isDark ? '#fff' : '#333',
                            },
                          });
                        } else {
                          toast.error('Unable to open file selector. Please try again.');
                        }
                      }}
                      className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-2xl relative overflow-hidden group transform hover:scale-[1.02] ${
                        !isSignedIn 
                          ? isDark 
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-2 border-gray-700'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300'
                          : isDark 
                            ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white border-2 border-purple-400/50 hover:border-purple-300/70'
                            : 'bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white border-2 border-purple-300/50 hover:border-purple-200/70'
                      }`}
                      disabled={!isSignedIn}
                      whileHover={isSignedIn ? { 
                        scale: 1.05, 
                        y: -3,
                        boxShadow: isDark 
                          ? "0 20px 40px rgba(147, 51, 234, 0.3)" 
                          : "0 20px 40px rgba(147, 51, 234, 0.2)"
                      } : {}}
                      whileTap={isSignedIn ? { scale: 0.98 } : {}}
                    >
                      {/* Animated Background Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent"
                        animate={{
                          x: [-120, 120],
                          opacity: [0, 0.4, 0]
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Pulsing Border Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-white/20"
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Animated Plus Icon */}
                      <motion.div
                        animate={{ 
                          rotate: [0, 180, 360],
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="relative z-10"
                      >
                        <FaPlus className="text-xl" />
                      </motion.div>
                      
                      <span className="relative z-10 font-bold">Add More PDF Files</span>
                      
                      {/* Multiple Sparkle Effects */}
                      <motion.div
                        animate={{ 
                          scale: [0, 1.5, 0],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          delay: 0.3
                        }}
                        className="text-yellow-300 relative z-10"
                      >
                        ✨
                      </motion.div>
                      
                      {/* Additional Floating Icon */}
                      <motion.div
                        animate={{ 
                          y: [0, -8, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          delay: 1
                        }}
                        className="text-blue-300 relative z-10"
                      >
                        📄
                      </motion.div>
                    </motion.button>

                    {/* File Count and Size Indicator */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className={`flex items-center gap-4 text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                        >
                          📊
                        </motion.span>
                        <span>Current: {files.length} files</span>
                      </div>
                      <div className="w-1 h-1 bg-current rounded-full opacity-50"></div>
                      <div className="flex items-center gap-1">
                        <motion.span
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          💾
                        </motion.span>                        <span>
                          Total: {fileInfo ? fileInfo.totalSize : '0 MB'}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* File List */}
                  {files.map((file, index) => (
                    <motion.div 
                      key={`${file.name}-${index}`}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all transform hover:scale-[1.01] ${
                        isDark 
                          ? 'bg-gray-800/80 shadow-lg shadow-purple-900/10 border border-gray-700' 
                          : 'bg-white/80 shadow-lg shadow-purple-500/10 border border-purple-100'
                      }`}
                      initial={{ opacity: 0, x: -50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 50, scale: 0.9 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                      layout
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <motion.div 
                          className={`p-2 rounded-lg ${
                            isDark ? 'bg-gray-900/50' : 'bg-purple-50'
                          }`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <FaFilePdf className={`text-xl ${
                            isDark ? 'text-purple-400' : 'text-purple-500'
                          }`} />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${
                            isDark ? 'text-purple-300' : 'text-purple-700'
                          }`}>
                            {file.name}
                          </p>
                          <p className={`text-xs mt-0.5 flex items-center gap-1 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <span>PDF Document</span>
                            <span>•</span>
                            <span>Position {index + 1}</span>
                            <span>•</span>
                            <span>{formatFileSize(file.size)}</span>
                          </p>
                        </div>
                      </div>

                      {/* Reordering Controls */}
                      {files.length > 1 && (
                        <div className="flex items-center gap-1 mr-2">
                          <motion.button
                            onClick={() => moveFileUp(index)}
                            disabled={index === 0}
                            className={`p-1.5 rounded-lg transition-all ${
                              index === 0
                                ? isDark
                                  ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : isDark
                                  ? 'bg-gray-700/50 hover:bg-purple-900/50 text-gray-300 hover:text-purple-300'
                                  : 'bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700'
                            }`}
                            whileHover={index !== 0 ? { scale: 1.1 } : {}}
                            whileTap={index !== 0 ? { scale: 0.9 } : {}}
                            title="Move up"
                          >
                            <FaArrowUp size={12} />
                          </motion.button>
                          <motion.button
                            onClick={() => moveFileDown(index)}
                            disabled={index === files.length - 1}
                            className={`p-1.5 rounded-lg transition-all ${
                              index === files.length - 1
                                ? isDark
                                  ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : isDark
                                  ? 'bg-gray-700/50 hover:bg-purple-900/50 text-gray-300 hover:text-purple-300'
                                  : 'bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700'
                            }`}
                            whileHover={index !== files.length - 1 ? { scale: 1.1 } : {}}
                            whileTap={index !== files.length - 1 ? { scale: 0.9 } : {}}
                            title="Move down"
                          >
                            <FaArrowDown size={12} />
                          </motion.button>
                        </div>
                      )}

                      <motion.button
                        onClick={() => removeFile(index)}
                        className={`p-2 rounded-lg transition-all transform ${
                          isDark
                            ? 'bg-gray-900/50 hover:bg-red-900/50 text-gray-400 hover:text-red-300'
                            : 'bg-purple-50 hover:bg-red-50 text-gray-500 hover:text-red-500'
                        }`}                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        aria-label="Remove file"
                      >
                        <IoMdClose size={18} />
                      </motion.button>
                    </motion.div>                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Merge Button */}
            <motion.button
              onClick={handleMerge}
              disabled={!isSignedIn || files.length < 2 || isMerging}
              className={`mt-6 w-full py-4 px-6 rounded-xl font-semibold text-base relative overflow-hidden transition-all duration-300 ${
                !isSignedIn || files.length < 2 || isMerging
                  ? isDark 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                  : isDark
                    ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] border border-purple-500/30'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] border border-purple-400/30'
              }`}
              whileHover={!(!isSignedIn || files.length < 2 || isMerging) ? { scale: 1.02 } : {}}
              whileTap={!(!isSignedIn || files.length < 2 || isMerging) ? { scale: 0.98 } : {}}
            >
              {/* Animated Background */}
              {!(!isSignedIn || files.length < 2 || isMerging) && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-500/20"
                  animate={{
                    x: [-100, 100],
                    opacity: [0, 0.5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}

              {/* Loading State */}
              {isMerging && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaSpinner className="animate-spin text-xl" />
                  <span>Merging...</span>
                  {mergingProgress > 0 && (
                    <span className="text-sm opacity-80">
                      {Math.round(mergingProgress)}%
                    </span>
                  )}
                </motion.div>
              )}

              {/* Button Content */}
              <motion.div
                className={`flex items-center justify-center gap-3 ${
                  isMerging ? 'opacity-0' : 'opacity-100'
                }`}
                animate={!isMerging ? {
                  scale: [1, 1.05, 1]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5
                }}
              >
                <FaMagic className="text-lg" />
                <span className="font-bold">
                  {!isSignedIn 
                    ? '🔒 Login Required'
                    : files.length < 2 
                      ? '📁 Add More Files'
                      : '✨ Merge PDF Files'
                  }
                </span>
                <FaRocket className="text-lg" />
              </motion.div>
            </motion.button>

            {/* Progress Bar */}
            {isMerging && mergingProgress > 0 && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-full h-2 rounded-full overflow-hidden ${
                  isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${mergingProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Merging your PDF files...
                  </span>
                  <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    {Math.round(mergingProgress)}%
                  </span>
                </div>
              </motion.div>
            )}

            {/* File Rating System */}
            {files.length >= 2 && !isMerging && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className={`mt-4 p-4 rounded-lg ${
                  isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Rate your experience:
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className={`p-1 transition-colors ${
                          star <= userRating
                            ? 'text-yellow-400'
                            : isDark ? 'text-gray-600' : 'text-gray-300'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaStar className="text-lg" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>            )}

            {/* PDF Review/Preview Section */}
            <div className="grid gap-8 pt-16">            <AnimatePresence mode="wait">
              {pdfBlobUrl && (
                <motion.div
                  key="pdf-preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.h2 
                    className={`text-2xl font-semibold mb-6 flex items-center gap-3 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🎉
                    </motion.span>
                    Your PDF is Successfully Merged!
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      ✨
                    </motion.span>
                  </motion.h2>

                  <motion.div
                    className={`rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm ${
                      isDark
                        ? 'bg-gray-900/50 shadow-xl border border-gray-800'
                        : 'bg-white/80 shadow-lg border border-gray-100'
                    }`}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Merged PDF Info Card */}
                    <motion.div
                      className={`mb-6 p-4 rounded-lg ${
                        isDark ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="flex items-center gap-2">
                          <motion.span
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            📋
                          </motion.span>
                          <span className={`font-medium ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                            Successfully merged {files.length} PDF files
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className={`${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                          <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {fileInfo?.estimatedTime || 'Quick merge'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaFileImage className={`${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Total size: {fileInfo?.totalSize || 'Processing...'}
                        </span>
                      </div>
                    </motion.div>

                    {/* File Preview Container */}
                    <motion.div
                      className={`rounded-xl border transition-colors duration-300 overflow-hidden mb-6 ${
                        isDark
                          ? 'border-gray-800 bg-gray-900'
                          : 'border-gray-200 bg-white'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Mobile View */}
                      <div className="block sm:hidden w-full p-3">
                        <div className="flex items-center gap-2">
                          <div className={`flex-shrink-0 p-1.5 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                            <BsFillFileEarmarkPdfFill className={`w-5 h-5 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs sm:text-sm font-medium truncate leading-tight ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                              Merged-PDF-Document.pdf
                            </p>
                            <p className={`text-[10px] sm:text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              ✨ Open in PC/tablet for full preview ✨
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Desktop View */}
                      <div className={`hidden sm:block w-full p-2 ${
                        isDark ? 'bg-black' : 'bg-gray-50'
                      }`}>                        <iframe
                          src={pdfBlobUrl || undefined}
                          className="w-full h-[350px] sm:h-[400px] md:h-[600px] rounded-lg transition-all duration-300"
                          title="Merged PDF Preview"
                          style={{
                            backgroundColor: isDark ? '#111827' : '#ffffff',
                            minHeight: '280px',
                            maxHeight: '600px',
                            border: 'none',
                            boxShadow: isDark
                              ? '0 0 10px rgba(0,0,0,0.5)'
                              : '0 0 10px rgba(0,0,0,0.1)'
                          }}
                        />
                      </div>
                    </motion.div>

                    {/* Download and Action Buttons */}
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      {/* Primary Download Button */}
                      <motion.button
                        onClick={downloadMergedPdf}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
                          isDark
                            ? 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white border border-green-500/30'
                            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white border border-green-400/30'
                        }`}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div className="flex items-center justify-center gap-3">
                          <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <FaDownload className="text-xl" />
                          </motion.div>
                          <span>Download Merged PDF</span>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            💾
                          </motion.div>
                        </motion.div>
                      </motion.button>

                      {/* Secondary Actions */}
                      <div className="flex gap-4">                        <motion.a
                          href={pdfBlobUrl || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 py-3 px-4 rounded-lg font-medium text-center transition-all ${
                            isDark
                              ? 'bg-gray-800 hover:bg-gray-700 text-purple-400 hover:text-purple-300 border border-purple-800'
                              : 'bg-gray-100 hover:bg-gray-200 text-purple-600 hover:text-purple-700 border border-purple-200'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <FaExternalLinkAlt className="text-sm" />
                            <span>Open in New Tab</span>
                          </div>
                        </motion.a>

                        <motion.button
                          onClick={() => {
                            setFiles([]);
                            setFileInfo(null);
                            setUserRating(0);
                            toast.success('Ready for new merge! 🚀', {
                              style: {
                                borderRadius: '10px',
                                background: isDark ? '#333' : '#fff',
                                color: isDark ? '#fff' : '#333',
                              },
                            });
                          }}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                            isDark
                              ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-600/30'
                              : 'bg-purple-100 hover:bg-purple-200 text-purple-600 border border-purple-200'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <FaPlus className="text-sm" />
                            <span>Merge New Files</span>
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* User Rating System */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                      className={`mt-6 p-4 rounded-lg ${
                        isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          How was your merging experience?
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              onClick={() => {
                                setUserRating(star);
                                toast.success(`Thank you for rating us ${star} star${star > 1 ? 's' : ''}! ⭐`, {
                                  duration: 3000,
                                  style: {
                                    borderRadius: '10px',
                                    background: isDark ? '#333' : '#fff',
                                    color: isDark ? '#fff' : '#333',
                                  },
                                });
                              }}
                              className={`p-1 transition-colors ${
                                star <= userRating
                                  ? 'text-yellow-400'
                                  : isDark ? 'text-gray-600' : 'text-gray-300'
                              }`}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaStar className="text-lg" />
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      {userRating > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-2 text-center"
                        >
                          <span className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            {userRating === 5 ? '🌟 Excellent! Thank you!' : 
                             userRating === 4 ? '⭐ Great job!' :
                             userRating === 3 ? '👍 Good service!' :
                             userRating === 2 ? '👌 Thanks for feedback!' :
                             '📝 We\'ll improve!'}
                          </span>
                        </motion.div>
                      )}
                    </motion.div>                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>            </div>          </motion.div>

          {/* Enhanced Features Section */}
          <ServiceSections
            serviceName="PDF Merger"
            steps={[
              {
                step: "1",
                title: "Upload PDF Files",
                desc: "Select and upload multiple PDF files you want to merge into one document",
                icon: "📁",
                color: "from-blue-400 to-purple-500"
              },
              {
                step: "2",
                title: "Arrange Order",
                desc: "Drag and drop files to arrange them in your desired order for the final PDF",
                icon: "🔄",
                color: "from-purple-400 to-pink-500"
              },
              {
                step: "3",
                title: "Download Merged PDF",
                desc: "Get your combined PDF file with all pages merged in perfect order",
                icon: "📄",
                color: "from-pink-400 to-red-500"
              }
            ]}
            testimonials={[
              {
                name: "Alex Chen",
                role: "Document Manager",
                text: "This PDF merger saved me hours of work! I can combine all my reports into one file effortlessly.",
                rating: 5,
                avatar: "👨‍💼"
              },
              {
                name: "Maria Rodriguez",
                role: "Academic Researcher",
                text: "Perfect for combining research papers and academic documents. The quality is preserved beautifully.",
                rating: 5,
                avatar: "👩‍🔬"
              },
              {
                name: "David Park",
                role: "Legal Assistant",
                text: "Reliable tool for merging legal documents. Fast processing and maintains all formatting perfectly.",
                rating: 5,
                avatar: "⚖️"
              }
            ]}
            callToActionMessage="Ready to merge your PDF files? Upload multiple PDFs and combine them into one document!"
          />
        </motion.div>
      </motion.main>
      
      <Footer />
    </>
  );
};

export default MergePDFPage;
