'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';
import { usePdfToWord } from '@/hooks/usePdfToWord';
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import { BsFillFileEarmarkPdfFill } from 'react-icons/bs';
import { FaFileWord, FaStar, FaFileImage, FaClock, FaInfoCircle, FaFont, FaPalette, FaExpand, FaEye, FaDownload } from 'react-icons/fa';
import { ServiceSections } from '@/components/service-components';

const PDFtoWordPage = () => {
  const { isSignedIn } = useAuth();
  const { isDark, mounted } = useTheme();
  const { isConverting, wordFile, fileName, extractionDetails, extractedText, convertPdfToWord, downloadWordFile, resetState } = usePdfToWord();
  const [file, setFile] = useState<File | null>(null);  const [fileInfo, setFileInfo] = useState<{ size: string, estimatedTime?: string } | null>(null);  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');

  // Show helpful tooltips
  useEffect(() => {
    const tips = [
      "For best results, use PDFs with clear text and formatting!",
      "Our converter preserves layouts, images, and styling automatically.",
      "Files are securely processed and deleted after conversion.",
      "Try uploading PDFs with complex layouts - they convert beautifully!",
      "Pro tip: Images in PDFs become editable elements in your Word document!"
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

  const handleRemoveFile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setFileInfo(null);
    toast.success('🗑️ File removed successfully!');
  }, []);  // Open preview in popup window - Excel style
  const openPreviewInPopup = useCallback(() => {
    if (!extractedText) {
      toast.error('Preview is being generated, please wait a moment...');
      return;
    }

    const popupFeatures = [
      'width=1200',
      'height=800',
      'left=' + (window.screen.width / 2 - 600),
      'top=' + (window.screen.height / 2 - 400),
      'toolbar=no',
      'location=no',
      'directories=no',
      'status=no',
      'menubar=no',
      'scrollbars=yes',
      'resizable=yes',
      'copyhistory=no'
    ].join(',');

    // Create HTML content for the preview
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Word Document Preview - PDF to Word Converter</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.6;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              min-height: 100vh;
              padding: 20px;
            }
            
            .container {
              max-width: 900px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              text-align: center;
            }
            
            .header h1 {
              font-size: 24px;
              margin-bottom: 5px;
            }
            
            .header p {
              opacity: 0.9;
              font-size: 14px;
            }
            
            .document-content {
              padding: 40px;
              background: white;
              min-height: 600px;
              position: relative;
            }
            
            .document-content::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image: repeating-linear-gradient(
                transparent,
                transparent 27px,
                #e3f2fd 27px,
                #e3f2fd 28px
              );
              opacity: 0.3;
              pointer-events: none;
            }
            
            .content-wrapper {
              position: relative;
              z-index: 1;
            }
            
            .document-title {
              font-size: 20px;
              font-weight: bold;
              color: #1976d2;
              margin-bottom: 20px;
              text-align: center;
            }
            
            .document-meta {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 4px solid #1976d2;
            }
            
            .document-text {
              font-size: 14px;
              line-height: 1.8;
              color: #333;
              white-space: pre-wrap;
              text-align: justify;
            }
            
            .footer {
              background: #f8f9fa;
              padding: 15px 20px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #dee2e6;
            }
            
            .close-btn {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #dc3545;
              color: white;
              border: none;
              padding: 10px 15px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: bold;
              z-index: 1000;
            }
            
            .close-btn:hover {
              background: #c82333;
            }
          </style>
        </head>
        <body>
          <button class="close-btn" onclick="window.close()">✕ Close Preview</button>
          
          <div class="container">            <div class="header">
              <h1>📄 Word Document</h1>
              <p>${fileName || 'converted-document.docx'}</p>
            </div>
              <div class="document-content">
              <div class="content-wrapper">
                <div class="document-text">${extractedText.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
              <div class="footer">
              Word Document - Ready for Download
            </div>
          </div>
        </body>
      </html>
    `;

    const popup = window.open('', 'WordPreview', popupFeatures);
    
    if (popup) {
      popup.document.open();
      popup.document.write(htmlContent);
      popup.document.close();
      popup.focus();
      toast.success('📄 Word preview opened in popup window! 🎉');
    } else {
      toast.error('Please allow popups to view the document preview');    }
  }, [extractedText, fileName]);// Watch for conversion completion and generate preview
  useEffect(() => {
    console.log('Preview effect:', { wordFile: !!wordFile, extractionDetails: !!extractionDetails, extractedText: !!extractedText });
    
    if (wordFile && extractedText && !previewContent) {
      console.log('Setting extracted text as preview content...');
      setShowCelebration(true);
      setShowPreview(true);
      
      // Use the actual extracted text from the PDF
      setPreviewContent(extractedText);
      console.log('Preview content set with actual extracted text');
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [wordFile, extractedText, previewContent, extractionDetails]);

  const handleConvert = useCallback(async () => {
    if (!isSignedIn) {
      toast.error('Please login to convert files');
      return;
    }
    if (!file) return;
    
    try {
      await convertPdfToWord(file);
      
      // Reset file after successful conversion
      setFile(null);
      setFileInfo(null);
    } catch (error) {
      console.error('Error converting file:', error);
    }
  }, [file, isSignedIn, convertPdfToWord]);

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
                PDF to Word Converter
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  className="inline-block ml-3"
                >
                  📝
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
            className={`absolute top-40 right-20 text-5xl ${isDark ? 'text-blue-800/20' : 'text-blue-200/30'}`}
            animate={{ 
              y: [0, 15, 0],
              x: [0, -10, 0],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            📝
          </motion.div>
          <motion.div
            className={`absolute bottom-40 left-20 text-4xl ${isDark ? 'text-purple-800/20' : 'text-purple-200/30'}`}
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
                    'radial-gradient(ellipse at 100% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 0% 100%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 0%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
                  ]
                : [
                    'radial-gradient(ellipse at 0% 0%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 100%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 0% 100%, rgba(147, 51, 234, 0.12) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                  ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Floating Word Icons */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute ${
                isDark ? 'text-blue-300/10' : 'text-blue-200/30'
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
              {i % 3 === 0 ? (
                <BsFillFileEarmarkPdfFill className="w-12 h-12" />
              ) : i % 3 === 1 ? (
                <FaFileWord className="w-10 h-10" />
              ) : (
                <span className="text-2xl">📝</span>
              )}
            </motion.div>
          ))}

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
                      scale: [0, 1, 0],
                      rotate: Math.random() * 360
                    }}
                    transition={{
                      duration: 3,
                      ease: "easeOut",
                      delay: Math.random() * 0.8
                    }}
                  >
                    {['🎉', '✨', '🎊', '📄', '📝'][Math.floor(Math.random() * 5)]}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Tooltip Display */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-medium shadow-lg ${
                  isDark
                    ? 'bg-purple-900/90 text-purple-100 border border-purple-700'
                    : 'bg-purple-100/90 text-purple-800 border border-purple-300'
                }`}
              >
                💡 {showTooltip}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6"
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
                📄
              </motion.span>
              <span className="bg-gradient-to-r from-red-600 via-blue-600 to-purple-600 bg-clip-text text-transparent break-words">
                PDF to Word
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
                📝
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
                Professional Converter
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
              ✨ Transform your PDF documents into editable Word documents with ease! 
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
              >
                Please login to upload and convert files
              </motion.p>
            )}
          </div>          <div className="grid gap-8">
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
                        ? 'border-blue-400/80 bg-blue-900/30 scale-[1.02] shadow-2xl shadow-blue-900/30 ring-4 ring-blue-500/20' 
                        : 'border-blue-400/80 bg-blue-50 scale-[1.02] shadow-2xl shadow-blue-500/20 ring-4 ring-blue-400/20'
                      : isDark 
                        ? 'border-gray-700 hover:border-blue-500/70 hover:bg-blue-950/20 hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-900/20 group-hover:ring-2 group-hover:ring-blue-500/20' 
                        : 'border-gray-300/90 hover:border-blue-300 hover:bg-blue-50/70 hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/10 group-hover:ring-2 group-hover:ring-blue-300/50'
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
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="mb-4 md:mb-6"
                      >
                        <BsFillFileEarmarkPdfFill className={`text-4xl sm:text-5xl md:text-6xl mx-auto ${isDark ? 'text-red-400' : 'text-red-500'}`} />
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
                        <span className="text-center">Selected PDF File</span>
                        <motion.span
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-lg sm:text-xl md:text-2xl"
                        >
                          ✨
                        </motion.span>
                      </h3>
                      
                      <p className={`text-lg sm:text-xl font-medium mb-3 ${
                        isDark ? 'text-blue-300' : 'text-blue-600'
                      }`}>
                        {file.name}
                      </p>
                      
                      <p className="text-sm sm:text-base opacity-90 mb-4">
                        Click or drag and drop to change file
                      </p>
                      
                      <motion.button
                        onClick={handleRemoveFile}
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                          isDark
                            ? 'bg-red-950/30 text-red-400 border border-red-900/50 hover:bg-red-950/50'
                            : 'bg-red-50 text-red-600 border border-red-200/50 hover:bg-red-100/80'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IoMdClose className="mr-2" />
                        Remove File
                      </motion.button>
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
                              ? 'border-blue-400/80 text-blue-300 bg-blue-900/20' 
                              : 'border-blue-400/80 text-blue-500 bg-blue-50/80'
                            : isDark
                              ? 'border-gray-700 text-gray-400 group-hover:border-blue-500/70 group-hover:text-blue-400' 
                              : 'border-gray-300/90 text-gray-500 group-hover:border-blue-300 group-hover:text-blue-500'
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
                              rotate: isDragActive ? [0, 10, -10, 0] : [0, 5, -5, 0]
                            }}
                            transition={{ 
                              duration: isDragActive ? 0.5 : 2, 
                              repeat: Infinity,
                              repeatType: "mirror",
                              ease: "easeInOut"
                            }}
                          >
                            <BsFillFileEarmarkPdfFill className="w-12 h-12" />
                          </motion.div>
                        </div>
                      </motion.div>

                      <motion.h3 
                        className="text-lg sm:text-xl md:text-2xl font-bold mb-3"
                        animate={{ 
                          color: isDragActive 
                            ? isDark ? '#60a5fa' : '#3b82f6'
                            : isDark ? '#d1d5db' : '#4b5563'
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {isDragActive ? "Drop your PDF here!" : "Drag & Drop PDF"}
                      </motion.h3>
                      
                      <p className="text-sm sm:text-base md:text-lg opacity-90 mb-4">
                        or <span className="font-semibold underline decoration-2 underline-offset-2">click to browse</span>
                      </p>
                      
                      <div className={`text-xs sm:text-sm opacity-75 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <p>📄 Supports: PDF files up to 10MB</p>
                        <p>🔒 Secure & Private conversion</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Convert Button */}
              <motion.button
                onClick={handleConvert}
                disabled={!isSignedIn || !file || isConverting}
                className={`mt-6 w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                  !isSignedIn || !file || isConverting
                    ? isDark 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400 cursor-not-allowed border border-gray-700'
                      : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
                    : isDark
                      ? 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02]'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                whileHover={!isSignedIn || !file || isConverting ? {} : { scale: 1.02 }}
                whileTap={!isSignedIn || !file || isConverting ? {} : { scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-3">
                  {!isSignedIn ? (
                    <>
                      <span className="text-xl">🔐</span>
                      <span>Login Required</span>
                    </>
                  ) : isConverting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="text-xl"
                      >
                        ⚙️
                      </motion.span>
                      <span>Converting to Word...</span>
                      <motion.span
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-xl"
                      >
                        ✨
                      </motion.span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🚀</span>
                      <span>Convert to Word Document</span>
                      <span className="text-xl">📝</span>
                    </>
                  )}
                </div>              </motion.button>
            </motion.div>
          </div>

          {/* Download Section with Extraction Details */}
          <AnimatePresence>
            {wordFile && extractionDetails && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <div className={`relative overflow-hidden rounded-2xl p-6 ${
                  isDark 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                    : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'
                }`}>
                  {/* Success icon animation */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="absolute top-4 right-4"
                  >
                    <motion.span 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-3xl"
                    >
                      🎉
                    </motion.span>
                  </motion.div>

                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                        ✅ Conversion Complete!
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Your PDF has been successfully converted to Word with advanced extraction
                      </p>
                    </motion.div>
                  </div>

                  {/* Extraction Details */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                  >
                    <div className={`text-center p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-white bg-opacity-70'
                    }`}>
                      <FaFileImage className={`mx-auto text-lg mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {extractionDetails.pagesProcessed}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Pages
                      </div>
                    </div>

                    <div className={`text-center p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-white bg-opacity-70'
                    }`}>
                      <FaInfoCircle className={`mx-auto text-lg mb-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />                      <div className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {extractionDetails.hasMetadata ? 'Yes' : 'No'}
                      </div>                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Metadata
                      </div>
                    </div>

                    <div className={`text-center p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-white bg-opacity-70'
                    }`}>
                      <FaFont className={`mx-auto text-lg mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`} />                      <div className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {extractionDetails.totalTextLength.toLocaleString()}
                      </div>                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Text Length
                      </div>
                    </div>

                    <div className={`text-center p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-white bg-opacity-70'
                    }`}>
                      <FaPalette className={`mx-auto text-lg mb-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                      <div className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {(extractionDetails.totalTextLength / 1000).toFixed(1)}K
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Characters
                      </div>
                    </div>                  </motion.div>                  {/* Word Document Preview Section - Excel Style */}
                  {(showPreview || wordFile) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mb-6"
                    >
                      <motion.div
                        className={`max-w-5xl mx-auto relative rounded-xl border-2 overflow-hidden shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
                          isDark
                            ? 'border-blue-800 bg-gray-900 shadow-blue-900/30'
                            : 'border-blue-200 bg-white shadow-blue-500/20'
                        }`}
                        onClick={openPreviewInPopup}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Preview Header */}
                        <div className={`px-4 py-3 border-b flex items-center justify-between ${
                          isDark 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className={`p-2 rounded-lg ${
                                isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                              }`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <FaFileWord className="text-blue-600 text-lg" />
                            </motion.div>                            <div className="text-left">
                              <h3 className={`font-medium text-sm ${
                                isDark ? 'text-blue-200' : 'text-blue-800'
                              }`}>
                                Word Document
                              </h3>
                              <p className={`text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Click to view full content
                              </p>
                            </div>
                          </div>
                          <motion.div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isDark 
                                ? 'bg-green-900/30 text-green-400' 
                                : 'bg-green-100 text-green-600'
                            }`}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            ✓ Ready
                          </motion.div>
                        </div>                        {/* Word Document Preview Content */}
                        <div className={`p-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                          {/* Document Paper Effect */}
                          <div className={`relative min-h-[300px] p-6 rounded-lg shadow-inner ${
                            isDark 
                              ? 'bg-gray-800 border border-gray-700' 
                              : 'bg-white border border-gray-100 shadow-sm'
                          }`}>
                            {/* Ruled Lines Effect */}
                            <div className="absolute inset-0 opacity-10">
                              {[...Array(15)].map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`border-b ${isDark ? 'border-gray-600' : 'border-blue-100'}`}
                                  style={{ marginTop: '24px' }}
                                />
                              ))}
                            </div>
                              {/* Document Content Preview */}
                            <div className="relative z-10">
                              {previewContent ? (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                    <pre className="whitespace-pre-wrap font-serif">
                                      {previewContent}
                                    </pre>
                                  </div>
                                </motion.div>
                              ) : (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex items-center justify-center h-full min-h-[200px]"
                                >
                                  <div className="text-center">
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                      className="mx-auto mb-4"
                                    >
                                      <FaFileWord className={`text-4xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                    </motion.div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                      Loading document content...
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                            
                            {/* Preview Overlay Gradient */}
                            {previewContent && (
                              <div className={`absolute bottom-0 left-0 right-0 h-8 ${
                                isDark 
                                  ? 'bg-gradient-to-t from-gray-800 to-transparent' 
                                  : 'bg-gradient-to-t from-white to-transparent'
                              }`} />
                            )}
                          </div>
                            {/* Click to expand hint */}
                          <motion.div 
                            className={`mt-4 text-center p-3 rounded-lg border-2 border-dashed ${
                              isDark 
                                ? 'border-blue-800 bg-blue-950/20 text-blue-300' 
                                : 'border-blue-300 bg-blue-50 text-blue-700'
                            }`}
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <p className="text-sm font-medium flex items-center justify-center gap-2">
                              <span>�</span>
                              Click to view full document
                              <span>�</span>
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}                  {/* Download Options Section */}
                  <motion.div
                    className={`max-w-2xl mx-auto mt-8 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm ${
                      isDark
                        ? 'bg-gray-900/50 shadow-xl border border-gray-800 shadow-blue-900/30'
                        : 'bg-white/80 shadow-lg border border-gray-100 shadow-blue-500/20'
                    }`}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <motion.div
                      className={`rounded-xl border transition-colors duration-300 overflow-hidden ${
                        isDark
                          ? 'border-gray-800 bg-gray-900'
                          : 'border-gray-200 bg-white'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="p-6 text-center">
                        <div className="flex items-center justify-center gap-3 mb-6">
                          <motion.div 
                            className={`flex-shrink-0 p-3 rounded-lg ${
                              isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                            }`}
                            whileHover={{ scale: 1.1, rotate: 10 }}
                          >
                            <FaFileWord className="text-blue-600 text-2xl" />
                          </motion.div>
                          <div>
                            <h3 className={`font-bold text-lg ${
                              isDark ? 'text-blue-200' : 'text-blue-800'
                            }`}>
                              Download Your Word Document
                            </h3>
                            <p className={`text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Save or preview your converted file
                            </p>
                          </div>
                        </div>

                        <div className={`p-4 rounded-lg mb-6 ${
                          isDark ? 'bg-black/30' : 'bg-gray-50'
                        }`}>
                          <p className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            ✅ Your PDF has been successfully converted to Word format. Use the preview above to view the content or download the file directly.
                          </p>
                        </div>

                        {/* Enhanced Download Buttons */}
                        <motion.div
                          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                        >
                          <motion.button
                            onClick={downloadWordFile}
                            className={`flex-1 py-4 px-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 ${
                              isDark
                                ? 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white shadow-lg hover:shadow-xl'
                            }`}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaDownload className="text-xl" />
                            <span>Download Word</span>
                            <FaFileWord className="text-xl" />
                          </motion.button>

                          <motion.button
                            onClick={openPreviewInPopup}
                            className={`flex-1 py-4 px-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 ${
                              isDark
                                ? 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg hover:shadow-xl'
                            }`}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaExpand className="text-xl" />
                            <span>Full Preview</span>
                            <FaEye className="text-xl" />
                          </motion.button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Reset Button */}
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => {
                      resetState();
                      setFile(null);
                      setFileInfo(null);
                    }}
                    className={`w-full mt-3 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                      isDark 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Convert Another File
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <ServiceSections 
              serviceName="PDF to Word Converter"
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
                  title: "Convert to Word",
                  desc: "Our AI extracts text and preserves formatting",
                  icon: "📝",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  step: "3",
                  title: "Download Word",
                  desc: "Get your editable Word document instantly",
                  icon: "💾",
                  color: "from-green-500 to-emerald-500"
                }
              ]}
              testimonials={[
                {
                  name: "Sandra Williams",
                  role: "Content Writer",
                  text: "Amazing tool! Converted my PDF research papers to Word documents perfectly. Saved me hours of retyping.",
                  rating: 5,
                  avatar: "✍️"
                },
                {
                  name: "Carlos Martinez",
                  role: "Legal Assistant",
                  text: "Perfect for converting legal documents to editable format. The accuracy is impressive!",
                  rating: 5,
                  avatar: "⚖️"
                },
                {
                  name: "Amy Chen",
                  role: "Student",
                  text: "Great for converting PDF textbooks to Word format for note-taking. Works flawlessly!",
                  rating: 5,
                  avatar: "📚"
                }
              ]}
              callToActionMessage="Ready to convert your PDF to Word? Upload your file and start editing!"          
            />          </motion.div>
        </div>
      </motion.main>      {/* Full Screen Preview Modal */}
      {/* Removed - now using popup window like Excel style */}

      <Footer />
    </>
  );
};

export default PDFtoWordPage;
