'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';
import { IoMdClose, IoMdInformationCircle } from "react-icons/io";
import { useExcelToPdf } from '@/hooks/useExcelToPdf';
import { motion, AnimatePresence } from 'framer-motion';
import { BsFillFileEarmarkPdfFill, BsFileEarmarkExcel } from 'react-icons/bs';
import { FaFileExcel, FaTable, FaMagic, FaStar, FaRocket, FaEye, FaClock, FaFileImage, FaSpinner, FaTimes } from 'react-icons/fa';
import * as ExcelJS from 'exceljs';
import { ServiceSections } from '@/components/service-components';

const ExcelToPDFPage = () => {
  const { isSignedIn } = useAuth();
  const { isDark, mounted } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const { isConverting, pdfBlobUrl, downloadPdf, convertExcelToPdf } = useExcelToPdf();
    // Enhanced state management
  const [conversionProgress, setConversionProgress] = useState(0);  const [fileInfo, setFileInfo] = useState<{size: string, estimatedTime?: string} | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Excel preview state
  const [showExcelPreview, setShowExcelPreview] = useState(false);
  const [excelData, setExcelData] = useState<string[][]>([]);
  const [excelSheets, setExcelSheets] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Show helpful tooltips
  useEffect(() => {
    const tips = [
      "For best results, use Excel files with clear formatting and data!",
      "Our converter preserves your spreadsheet layout automatically.",
      "Files are securely processed and deleted after conversion.",
      "Try uploading files with multiple sheets - they'll be included!",
      "Pro tip: Charts and graphs convert beautifully to PDF!"
    ];
    
    const showRandomTip = () => {
      if (!showTooltip && !isConverting) {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        setShowTooltip(randomTip);
        setTimeout(() => setShowTooltip(null), 5000);
      }
    };

    const interval = setInterval(showRandomTip, 15000);    return () => clearInterval(interval);
  }, [showTooltip, isConverting]);

  // Helper function to format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);
  
  // Estimate conversion time based on file size
  const estimateConversionTime = useCallback((fileSize: number): string => {
    const sizeInMB = fileSize / (1024 * 1024);
    if (sizeInMB < 1) return '20-30 seconds';
    if (sizeInMB < 5) return '30-60 seconds';
    if (sizeInMB < 10) return '1-2 minutes';
    return '2-3 minutes';
  }, []);

  // Excel preview function
  const handleExcelPreview = useCallback(async () => {
    if (!file) return;
    
    setIsLoadingPreview(true);
    
    try {
      const fileData = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(fileData);
      
      // Get all sheet names
      const sheetNames = workbook.worksheets.map(ws => ws.name);
      setExcelSheets(sheetNames);
      
      // Set the first sheet as active
      const firstSheet = sheetNames[0];
      setActiveSheet(firstSheet);
        // Get the first worksheet
      const worksheet = workbook.getWorksheet(firstSheet);
      if (!worksheet) {
        throw new Error('No worksheet found');
      }
      
      // Convert worksheet to array format
      const jsonData: string[][] = [];
      
      // Get the actual range of data (up to 20 rows and 10 columns for preview)
      const maxRows = Math.min(worksheet.actualRowCount || 20, 20);
      const maxCols = Math.min(worksheet.actualColumnCount || 10, 10);
      
      // Fix the first function's types
      for (let rowNum = 1; rowNum <= maxRows; rowNum++) {
        const row: string[] = [];
        const worksheetRow = worksheet.getRow(rowNum);
        
        for (let colNum = 1; colNum <= maxCols; colNum++) {
          const cell = worksheetRow.getCell(colNum);
          // Get the display value of the cell
          let cellValue = '';
          
          if (cell.value !== null && cell.value !== undefined) {
            if (typeof cell.value === 'object' && 'result' in cell.value) {
              // Handle formula cells
              cellValue = cell.value.result?.toString() || '';
            } else if (typeof cell.value === 'object' && 'richText' in cell.value) {
              // Handle rich text cells
              cellValue = cell.value.richText?.map((rt: { text: string }) => rt.text).join('') || '';
            } else {
              cellValue = cell.value.toString();
            }
          }
          
          row.push(cellValue);
        }
        jsonData.push(row);
      }
      
      setExcelData(jsonData);
      setShowExcelPreview(true);
      
      toast.success('📊 Excel preview loaded successfully! ✨', {
        icon: '👀',
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });
      
    } catch (error) {
      console.error('Error reading Excel file:', error);
      toast.error('Failed to preview Excel file. Please try again.', {
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });
    } finally {
      setIsLoadingPreview(false);
    }
  }, [file, isDark]);
  // Switch between sheets
  const handleSheetChange = useCallback(async (sheetName: string) => {
    if (!file) return;
    
    try {
      const fileData = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(fileData);
      
      const worksheet = workbook.getWorksheet(sheetName);
      if (!worksheet) {
        throw new Error(`Worksheet "${sheetName}" not found`);
      }
      
      // Convert worksheet to array format
      const jsonData: string[][] = [];
      
      // Get the actual range of data (up to 20 rows and 10 columns for preview)
      const maxRows = Math.min(worksheet.actualRowCount || 20, 20);
      const maxCols = Math.min(worksheet.actualColumnCount || 10, 10);
      
      // Fix the second function's types  
      for (let rowNum = 1; rowNum <= maxRows; rowNum++) {
        const row: string[] = [];
        const worksheetRow = worksheet.getRow(rowNum);
        
        for (let colNum = 1; colNum <= maxCols; colNum++) {
          const cell = worksheetRow.getCell(colNum);
          // Get the display value of the cell
          let cellValue = '';
          
          if (cell.value !== null && cell.value !== undefined) {
            if (typeof cell.value === 'object' && 'result' in cell.value) {
              // Handle formula cells
              cellValue = cell.value.result?.toString() || '';
            } else if (typeof cell.value === 'object' && 'richText' in cell.value) {
              // Handle rich text cells
              cellValue = cell.value.richText?.map((rt: { text: string }) => rt.text).join('') || '';
            } else {
              cellValue = cell.value.toString();
            }
          }
          
          row.push(cellValue);
        }
        jsonData.push(row);
      }
      
      setExcelData(jsonData);
      setActiveSheet(sheetName);
      
    } catch (error) {
      console.error('Error switching sheet:', error);
      toast.error('Failed to load sheet. Please try again.');
    }
  }, [file]);
  
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
      const estimatedTime = estimateConversionTime(selectedFile.size);      setFileInfo({
        size: sizeFormatted,
        estimatedTime: estimatedTime
      });
      
      toast.success('📊 Excel file added successfully! ✨', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });
    }
  }, [isSignedIn, isDark, formatFileSize, estimateConversionTime]);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    disabled: !isSignedIn  }); 
  
  // Enhanced conversion logic with progress simulation  
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
      toast.success('🚀 Starting Excel to PDF conversion...', {
        icon: '✨',
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });

      await convertExcelToPdf(file);
      
      clearInterval(progressInterval);
      setConversionProgress(100);
      
      toast.success('🎉 Excel converted to PDF successfully! ✨', {
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },  });

      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
      setFile(null);
      setFileInfo(null);
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
  }, [file, isSignedIn, convertExcelToPdf, isDark]);
    // Enhanced remove file handler
  const handleRemoveFile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); 
    setFile(null);
    setFileInfo(null);
    setConversionProgress(0);
    toast.success('🗑️ File removed successfully!');
  }, []);

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
                  📊
                </motion.span>
                Excel to PDF Converter
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  className="inline-block ml-3"
                >
                  📄
                </motion.span>
              </motion.h1>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }  return (
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
            className={`absolute top-20 left-10 text-6xl ${isDark ? 'text-green-800/20' : 'text-green-200/30'}`}
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
            className={`absolute top-40 right-20 text-5xl ${isDark ? 'text-red-800/20' : 'text-red-200/30'}`}
            animate={{ 
              y: [0, 15, 0],
              x: [0, -10, 0],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            📄
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
                    'radial-gradient(ellipse at 0% 0%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 100%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 0% 100%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 0%, rgba(239, 68, 68, 0.2) 0%, transparent 50%)',
                  ]
                : [
                    'radial-gradient(ellipse at 0% 0%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 100%, rgba(239, 68, 68, 0.08) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 0% 100%, rgba(34, 197, 94, 0.12) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 0%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
                  ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Floating Excel Icons */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute ${
                isDark ? 'text-green-300/10' : 'text-green-200/30'
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
                <BsFileEarmarkExcel className="w-12 h-12" />
              ) : i % 3 === 1 ? (
                <FaFileExcel className="w-10 h-10" />
              ) : (
                <FaTable className="w-8 h-8" />
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
            )}          </AnimatePresence>
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
              >
                <div className="flex items-start gap-3">
                  <IoMdInformationCircle className={`text-xl flex-shrink-0 mt-0.5 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
                  <p className="text-sm leading-relaxed">{showTooltip}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Header Section */}
          <div className="text-center mb-8 md:mb-12 px-2">            <motion.h1 
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight ${isDark ? 'text-purple-200' : 'text-purple-800'}`}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >              <motion.span
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="inline-block mr-2 md:mr-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              >
                📊
              </motion.span>
              <span className="bg-gradient-to-r from-green-600 via-blue-600 to-red-600 bg-clip-text text-transparent break-words">
                Excel to PDF
              </span>              <motion.span
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
              ✨ Transform your Excel spreadsheets into professional PDF documents with ease! 
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
              </motion.p>            )}
          </div>

          <div className="grid gap-8">
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
                        ? 'border-green-400/80 bg-green-900/30 scale-[1.02] shadow-2xl shadow-green-900/30 ring-4 ring-green-500/20' 
                        : 'border-green-400/80 bg-green-50 scale-[1.02] shadow-2xl shadow-green-500/20 ring-4 ring-green-400/20'
                      : isDark 
                        ? 'border-gray-700 hover:border-green-500/70 hover:bg-green-950/20 hover:scale-[1.01] hover:shadow-xl hover:shadow-green-900/20 group-hover:ring-2 group-hover:ring-green-500/20' 
                        : 'border-gray-300/90 hover:border-green-300 hover:bg-green-50/70 hover:scale-[1.01] hover:shadow-xl hover:shadow-green-500/10 group-hover:ring-2 group-hover:ring-green-300/50'
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
                        <FaFileExcel className={`text-4xl sm:text-5xl md:text-6xl mx-auto ${isDark ? 'text-green-400' : 'text-green-500'}`} />
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
                            {/* Interactive Preview Button */}
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExcelPreview();
                            }}
                            disabled={isLoadingPreview}
                            className={`w-full py-2 px-4 rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
                              isDark 
                                ? 'bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-600/30 disabled:opacity-50'
                                : 'bg-green-100 hover:bg-green-200 text-green-600 border border-green-200 disabled:opacity-50'
                            }`}
                            whileHover={{ scale: isLoadingPreview ? 1 : 1.02 }}
                            whileTap={{ scale: isLoadingPreview ? 1 : 0.98 }}
                          >
                            {isLoadingPreview ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaEye />
                            )}
                            <span className="text-sm font-medium">
                              {isLoadingPreview ? 'Loading Preview...' : 'Preview Excel File'}
                            </span>
                          </motion.button>
                        </motion.div>
                      )}
                      
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 md:mb-3 flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                        <motion.span
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="text-lg sm:text-xl md:text-2xl"
                        >
                          📊
                        </motion.span>
                        <span className="text-center">Selected Excel File</span>
                        <motion.span
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-lg sm:text-xl md:text-2xl"
                        >
                          ✨
                        </motion.span>
                      </h3>
                      
                      <p className={`text-lg sm:text-xl font-medium mb-3 ${
                        isDark ? 'text-green-300' : 'text-green-600'
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
                              ? 'border-green-400/80 text-green-300 bg-green-900/20' 
                              : 'border-green-400/80 text-green-500 bg-green-50/80'
                            : isDark
                              ? 'border-gray-700 text-gray-400 group-hover:border-green-500/70 group-hover:text-green-400' 
                              : 'border-gray-300/90 text-gray-500 group-hover:border-green-300 group-hover:text-green-500'
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
                            <BsFillFileEarmarkPdfFill className="w-12 h-12" />
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
                                  isDark ? 'bg-green-500/10' : 'bg-green-100/50'
                                } animate-pulse rounded-lg`} />
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${
                                  isDark ? 'bg-green-400/50' : 'bg-green-500/30'
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
                          📊
                        </motion.span>
                        <span className={isDragActive ? (isDark ? 'text-green-300' : 'text-green-600') : ''}>
                          {isDragActive ? 'Drop your Excel file here!' : 'Drag & Drop Excel File'}
                        </span>
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        >
                          ✨
                        </motion.span>
                      </motion.h3>
                      
                      <p className="text-sm sm:text-base md:text-lg opacity-90 mb-3">
                        or click to select file
                      </p>
                      
                      <motion.p 
                        className={`text-xs sm:text-sm opacity-75 ${
                          isDark ? 'text-green-400' : 'text-green-600'
                        }`}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Supported formats: <span className="font-bold">.xlsx</span>, <span className="font-bold">.xls</span>
                      </motion.p>
                    </motion.div>
                  )}
                </div>
              </div>              {/* Convert Button */}
              <motion.button
                onClick={handleConvert}
                disabled={!file || isConverting || !isSignedIn}
                className={`mt-6 w-full py-4 px-6 rounded-xl font-semibold text-base relative overflow-hidden transition-all duration-300 ${
                  !file || isConverting || !isSignedIn
                    ? isDark 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                    : isDark
                      ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] border border-green-500/30'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] border border-green-400/30'
                }`}
                whileHover={!(!file || isConverting || !isSignedIn) ? { scale: 1.02 } : {}}
                whileTap={!(!file || isConverting || !isSignedIn) ? { scale: 0.98 } : {}}
              >
                {/* Animated Background */}
                {!(!file || isConverting || !isSignedIn) && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20"
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
                {isConverting && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaSpinner className="animate-spin text-xl" />
                    <span>Converting...</span>
                    {conversionProgress > 0 && (
                      <span className="text-sm opacity-80">
                        {Math.round(conversionProgress)}%
                      </span>
                    )}
                  </motion.div>
                )}

                {/* Button Content */}
                <motion.div
                  className={`flex items-center justify-center gap-3 ${
                    isConverting ? 'opacity-0' : 'opacity-100'
                  }`}
                  animate={!isConverting ? {
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
                      : !file 
                        ? '📄 Select Excel File'
                        : '✨ Convert to PDF'
                    }
                  </span>
                  <FaRocket className="text-lg" />
                </motion.div>
              </motion.button>

              {/* Progress Bar */}
              {isConverting && conversionProgress > 0 && (
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
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${conversionProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      Converting your Excel file...
                    </span>
                    <span className={`font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {Math.round(conversionProgress)}%
                    </span>
                  </div>
                </motion.div>
              )}

              {/* File Rating System */}
              {file && !isConverting && (
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
                    </div>                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>          {/* PDF Preview Section */}
          <div className="grid gap-8 pt-16">
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
                    className={`text-2xl font-semibold mb-6 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}
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
                </motion.div>              )}            </AnimatePresence>
          </div>        </motion.div>
      </motion.main>

      {/* Excel Preview Modal */}
      <AnimatePresence>
        {showExcelPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowExcelPreview(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl ${
                isDark 
                  ? 'bg-gray-900 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between p-6 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <FaFileExcel className={`text-2xl ${isDark ? 'text-green-400' : 'text-green-500'}`} />
                  </motion.div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Excel File Preview
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {file?.name} • {excelData.length} rows shown (max 20)
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowExcelPreview(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="text-xl" />
                </motion.button>
              </div>

              {/* Sheet Tabs */}
              {excelSheets.length > 1 && (
                <div className={`flex gap-2 p-4 border-b overflow-x-auto ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  {excelSheets.map((sheetName) => (
                    <motion.button
                      key={sheetName}
                      onClick={() => handleSheetChange(sheetName)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        activeSheet === sheetName
                          ? isDark
                            ? 'bg-green-600 text-white'
                            : 'bg-green-500 text-white'
                          : isDark
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaTable className="inline mr-2" />
                      {sheetName}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Excel Data Table */}
              <div className="p-6 overflow-auto max-h-[60vh]">
                {excelData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className={`w-full text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <tbody>
                        {excelData.map((row, rowIndex) => (
                          <motion.tr
                            key={rowIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: rowIndex * 0.05 }}
                            className={`border-b ${
                              isDark ? 'border-gray-700' : 'border-gray-200'
                            } ${rowIndex === 0 ? 'font-semibold' : ''}`}
                          >
                            {/* Row number */}
                            <td className={`px-3 py-2 text-xs font-mono sticky left-0 ${
                              isDark 
                                ? 'bg-gray-800 text-gray-500 border-r border-gray-700' 
                                : 'bg-gray-50 text-gray-400 border-r border-gray-200'
                            }`}>
                              {rowIndex + 1}
                            </td>
                            {Array.from({ length: 10 }, (_, colIndex) => (
                              <td
                                key={colIndex}
                                className={`px-3 py-2 border-r max-w-[200px] truncate ${
                                  isDark ? 'border-gray-700' : 'border-gray-200'
                                }`}
                                title={row[colIndex]?.toString() || ''}
                              >
                                {row[colIndex] !== undefined && row[colIndex] !== null 
                                  ? row[colIndex].toString() 
                                  : ''}
                              </td>
                            ))}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl mb-4"
                    >
                      📄
                    </motion.div>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      No data found in this sheet
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className={`flex items-center justify-between p-6 border-t ${
                isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Showing first 20 rows and 10 columns for preview
                </div>
                <motion.button
                  onClick={() => setShowExcelPreview(false)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    isDark
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close Preview
                </motion.button>
              </div>
            </motion.div>
          </motion.div>        )}
      </AnimatePresence>

      {/* Enhanced Features Section */}
      <ServiceSections 
        serviceName="Excel to PDF Converter"
        steps={[
          {
            step: "1",
            title: "Upload Excel",
            desc: "Drag & drop or click to select your Excel file",
            icon: "📊",
            color: "from-green-500 to-emerald-500"
          },
          {
            step: "2",
            title: "Process File",
            desc: "Our tool converts your spreadsheet to PDF format",
            icon: "⚙️",
            color: "from-blue-500 to-cyan-500"
          },
          {
            step: "3",
            title: "Download PDF",
            desc: "Get your professional PDF document instantly",
            icon: "📄",
            color: "from-purple-500 to-pink-500"
          }
        ]}
        testimonials={[
          {
            name: "Maria Santos",
            role: "Finance Manager",
            text: "Perfect for converting our financial reports to PDF. The formatting stays exactly as intended!",
            rating: 5,
            avatar: "👩‍💼"
          },
          {
            name: "James Wilson",
            role: "Project Manager",
            text: "Great tool for sharing project data in PDF format. Easy to use and very reliable.",
            rating: 5,
            avatar: "👨‍💼"
          },
          {
            name: "Sophia Lee",
            role: "HR Specialist",
            text: "Excellent for converting employee data sheets to secure PDF format. Highly recommended!",
            rating: 5,
            avatar: "👩‍💻"
          }
        ]}
        callToActionMessage="Ready to convert your Excel to PDF? Start now!"
      />

      <Footer />
    </>
  );
};

export default ExcelToPDFPage;