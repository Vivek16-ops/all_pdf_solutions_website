'use client';
import React, { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';
import { IoMdClose } from "react-icons/io";
import { useExcelToPdf } from '@/hooks/useExcelToPdf';
import LoadingDots from '@/components/LoadingDots';
import { motion, AnimatePresence } from 'framer-motion';
import { BsFillFileEarmarkPdfFill } from 'react-icons/bs';

const ExcelToPDFPage = () => {
  const { isSignedIn } = useAuth();
  const { isDark, mounted } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const { isConverting, pdfBlobUrl, downloadPdf, convertExcelToPdf } = useExcelToPdf();

  // Handler for file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!isSignedIn) {
      toast.error('Please login to upload files');
      return;
    }
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
      toast.success('File added successfully!');
    }
  }, [isSignedIn]);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    disabled: !isSignedIn
  }); 

  // Conversion Logic - Submit button handler
  const handleConvert = useCallback(async () => {
    if (!isSignedIn) {
      toast.error('Please login to convert files');
      return;
    }
    if (!file) return;

    try {
      await convertExcelToPdf(file);
      setFile(null);
    } catch (error) {
      console.error('Error converting file:', error);
    }
  }, [file, isSignedIn, convertExcelToPdf]);

  // Remove file handler
  const handleRemoveFile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); 
    setFile(null);
    toast.success('File removed');
  }, []);

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-10 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
          <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-purple-800">
                Excel to PDF Converter
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
      <main
        className={`min-h-screen pt-10 transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-black via-purple-950 to-black'
            : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Excel to PDF Converter
            </motion.h1>
            <motion.p 
              className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-purple-300/90' : 'text-purple-700/90'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Convert your Excel spreadsheets to PDF format quickly and easily
            </motion.p>
            {!isSignedIn && (
              <motion.p 
                className={`mt-4 text-sm ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Please login to upload and convert files
              </motion.p>
            )}
          </motion.div>

          <div className="grid gap-8">
            <motion.div 
              className={`rounded-2xl p-8 backdrop-blur-sm ${
                isDark
                  ? 'bg-gray-900/50 shadow-xl border border-gray-800'
                  : 'bg-white/80 shadow-lg border border-gray-100'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Main Drop Zone Container */}
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 transform group ${
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
                
                {/* File Icon and Content */}
                <div className={`space-y-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {/* Icon Container */}
                  <div className={`w-20 h-20 mx-auto rounded-xl border-2 transition-all duration-300 transform group-hover:scale-110 relative overflow-hidden ${
                    isDragActive
                      ? isDark 
                        ? 'border-purple-400/80 text-purple-300 bg-purple-900/20' 
                        : 'border-purple-400/80 text-purple-500 bg-purple-50/80'
                      : isDark
                        ? 'border-gray-700 text-gray-400 group-hover:border-purple-500/70 group-hover:text-purple-400' 
                        : 'border-gray-300/90 text-gray-500 group-hover:border-purple-300 group-hover:text-purple-500'
                  }`}>
                    <div className="relative w-full h-full flex items-center justify-center">
                      <BsFillFileEarmarkPdfFill 
                        className={`w-3/4 h-3/4 transition-all duration-300 ${
                          isDragActive ? 'scale-110' : 'group-hover:scale-110'
                        } z-10`} 
                      />
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
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
                              isDark ? 'bg-purple-400/50' : 'bg-purple-500/30'
                            } animate-ping`} />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* File Status and Actions */}
                  {file ? (
                    <div className="space-y-3">
                      <p className={`text-lg font-medium ${
                        isDark ? 'text-purple-300' : 'text-purple-600'
                      }`}>
                        {file.name}
                      </p>
                      <p className="text-sm opacity-90">
                        Click or drag and drop to change file
                      </p>
                      <motion.button
                        onClick={handleRemoveFile}
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full ${
                          isDark
                            ? 'bg-red-950/30 text-red-400 border border-red-900/50 hover:bg-red-950/50'
                            : 'bg-red-50 text-red-600 border border-red-200/50 hover:bg-red-100/80'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                      >
                        <IoMdClose className="mr-1" />
                        Remove
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className={`text-lg font-medium ${
                        isDark ? 'text-purple-300' : 'text-purple-600'
                      }`}>
                        {isDragActive
                          ? 'Drop your Excel file here'
                          : 'Drag and drop your Excel file here'
                      }
                      </p>
                      <p className="text-sm opacity-90">
                        or click to select file
                      </p>
                      <p className={`text-xs opacity-75 ${
                        isDark ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        Supported formats: <span className="font-medium">.xlsx</span>, <span className="font-medium">.xls</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Convert Button */}
              <motion.button
                onClick={handleConvert}
                className={`mt-6 w-full py-4 px-6 rounded-xl font-semibold text-base relative overflow-hidden transition-all duration-300 ${
                  !isSignedIn || !file || isConverting
                    ? isDark
                      ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-500 cursor-not-allowed border border-gray-800'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed border border-gray-200'
                    : isDark
                      ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white shadow-lg shadow-purple-900/30'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg shadow-purple-500/20'
                }`}
                disabled={!isSignedIn || !file || isConverting}
                whileTap={!(!isSignedIn || !file || isConverting) ? {
                  scale: 0.98,
                  transition: { duration: 0.1 }
                } : {}}
              >
                {isConverting && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LoadingDots isDark={isDark} />
                  </motion.div>
                )}
                <span className={isConverting ? 'opacity-0' : 'opacity-100'}>
                  Convert to PDF
                </span>
              </motion.button>
            </motion.div>

            {/* PDF Preview Section */}
            <AnimatePresence mode="wait">
              {pdfBlobUrl && (
                <motion.div
                  key="pdf-preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.h2 
                    className={`text-2xl font-semibold mb-4 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Your PDF is Ready!
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
                              {pdfBlobUrl?.split('/').pop() || 'Document.pdf'}
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
                      }`}>
                        <iframe
                          src={pdfBlobUrl}
                          className="w-full h-[350px] sm:h-[400px] md:h-[600px] rounded-lg transition-all duration-300"
                          title="PDF Preview"
                          style={{
                            backgroundColor: isDark ? '#111827' : '#ffffff',
                            minHeight: '280px',
                            maxHeight: window?.innerWidth >= 280 && window?.innerWidth <= 350 ? '450px' : '600px',
                            border: 'none',
                            boxShadow: isDark
                              ? '0 0 10px rgba(0,0,0,0.5)'
                              : '0 0 10px rgba(0,0,0,0.1)'
                          }}
                        />
                      </div>
                    </motion.div>

                    {/* Download Buttons */}
                    <motion.div
                      className="flex gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <motion.button
                        onClick={downloadPdf}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                          isDark
                            ? 'bg-gray-800 hover:bg-gray-700 text-purple-400 hover:text-purple-300 border border-purple-800'
                            : 'bg-gray-100 hover:bg-gray-200 text-purple-600 hover:text-purple-700 border border-purple-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Download PDF
                      </motion.button>

                      <motion.a
                        href={pdfBlobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 py-3 px-4 rounded-lg font-medium text-center transition-all ${
                          isDark
                            ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white shadow-md'
                            : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-md'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Open in New Tab
                      </motion.a>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ExcelToPDFPage;