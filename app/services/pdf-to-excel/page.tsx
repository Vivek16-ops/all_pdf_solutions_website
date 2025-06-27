'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';
import { IoMdClose, IoMdInformationCircle } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import { usePdfToExcel } from '@/hooks/usePdfToExcel';
import { BsFillFileEarmarkPdfFill, BsFileEarmarkExcel } from 'react-icons/bs';
import { FaFileExcel, FaTable, FaMagic, FaStar, FaRocket, FaClock, FaFileImage, FaSpinner, FaTimes } from 'react-icons/fa';
import { ServiceSections } from '@/components/service-components';

const PDFtoExcelPage = () => {
  const { isSignedIn } = useAuth();
  const { isDark, mounted } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { isConverting, excelFile, previewData, fullData, convertPdfToExcel, downloadExcel } = usePdfToExcel();
    // Enhanced state management
  const [conversionProgress, setConversionProgress] = useState(0);
  const [fileInfo, setFileInfo] = useState<{size: string, estimatedTime?: string} | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show helpful tooltips
  useEffect(() => {
    const tips = [
      "For best results, use PDFs with clear text and data tables!",
      "Our converter extracts data from tables automatically.",
      "Files are securely processed and deleted after conversion.",
      "Try uploading files with complex tables - they convert beautifully!",
      "Pro tip: Images in PDFs become text in your Excel file!"
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
    if (sizeInMB < 1) return '30-45 seconds';
    if (sizeInMB < 5) return '45-90 seconds';
    if (sizeInMB < 10) return '1-3 minutes';
    return '3-5 minutes';
  }, []);
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
        size: sizeFormatted,        estimatedTime: estimatedTime      });
      
      toast.success('📄 PDF file added successfully! ✨', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });    }
  }, [isSignedIn, isDark, formatFileSize, estimateConversionTime]);
  
  // Enhanced remove file handler
  const handleRemoveFile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); 
    setFile(null);
    setFileInfo(null);
    setConversionProgress(0);
    toast.success('🗑️ File removed successfully!');
  }, []);
  
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
      toast.success('🚀 Starting PDF to Excel conversion...', {
        icon: '✨',
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });

      await convertPdfToExcel(file);
      
      clearInterval(progressInterval);
      setConversionProgress(100);
      
      toast.success('🎉 PDF converted to Excel successfully! ✨', {
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        },
      });      setShowCelebration(true);
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
  }, [file, isSignedIn, convertPdfToExcel, isDark]);  const openPreviewInPopup = useCallback(() => {
    if (!excelFile || !fullData) {
      toast.error('No preview data available');
      return;
    }

    // Function to clean cell content from any unwanted characters
    const cleanCellContent = (content: string): string => {
      if (!content) return '';
      
      // More comprehensive character cleaning
      return content
        // Remove Chinese characters (CJK Unified Ideographs)
        .replace(/[\u4e00-\u9fff]/g, '')
        // Remove Korean characters (Hangul)
        .replace(/[\uac00-\ud7af]/g, '')
        // Remove Japanese Hiragana and Katakana
        .replace(/[\u3040-\u309f\u30a0-\u30ff]/g, '')
        // Remove other CJK symbols and punctuation
        .replace(/[\u3000-\u303f]/g, '')
        // Remove any remaining non-printable and special Unicode characters
        .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, '')
        // Clean up extra whitespace
        .replace(/\s+/g, ' ')
        // Remove any remaining control characters
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .trim();
    };

    // Create HTML content for the preview with all data - English only
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Excel Document Preview - PDF to Excel Converter</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              padding: 20px;
            }
            .header {
              background: rgba(255, 255, 255, 0.95);
              padding: 20px;
              border-radius: 12px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
              margin-bottom: 20px;
              text-align: center;
              backdrop-filter: blur(10px);
            }
            .header h1 {
              color: #4a5568;
              font-size: 2.5rem;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 15px;
            }
            .header p {
              color: #718096;
              font-size: 1.1rem;
            }
            .container { 
              max-width: 1400px; 
              margin: 0 auto; 
              background: rgba(255, 255, 255, 0.98); 
              padding: 30px; 
              border-radius: 16px; 
              box-shadow: 0 20px 60px rgba(0,0,0,0.15);
              backdrop-filter: blur(10px);
            }
            .section-title {
              color: #2d3748;
              font-size: 1.8rem;
              margin-bottom: 20px;
              text-align: center;
              font-weight: 600;
            }
            .info { 
              background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%); 
              padding: 20px; 
              border-radius: 10px; 
              margin-bottom: 25px; 
              border-left: 5px solid #38b2ac;
              box-shadow: 0 4px 12px rgba(56, 178, 172, 0.1);
            }
            .info p {
              color: #2d3748;
              font-size: 1rem;
              line-height: 1.6;
            }
            .stats { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 20px; 
              margin-bottom: 30px; 
            }
            .stat { 
              background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%); 
              padding: 20px; 
              border-radius: 12px; 
              text-align: center; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.08);
              transition: transform 0.3s ease;
            }
            .stat:hover { transform: translateY(-2px); }
            .stat-number { 
              font-size: 2.5rem; 
              font-weight: bold; 
              color: #4c51bf; 
              margin-bottom: 8px;
            }
            .stat-label { 
              font-size: 0.9rem; 
              color: #718096; 
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .table-container {
              overflow-x: auto;
              border-radius: 12px;
              box-shadow: 0 8px 25px rgba(0,0,0,0.1);
              margin-bottom: 30px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              font-size: 14px;
              background: white;
            }
            th, td { 
              border: 1px solid #e2e8f0; 
              padding: 12px 16px; 
              text-align: left; 
              vertical-align: top; 
            }
            th { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white;
              font-weight: 600; 
              position: sticky; 
              top: 0; 
              z-index: 1;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.5px;
            }
            tr:nth-child(even) { background-color: #f8fafc; }
            tr:hover { background-color: #edf2f7; transition: background-color 0.2s ease; }
            .actions {
              display: flex;
              gap: 15px;
              justify-content: center;
              flex-wrap: wrap;
              margin-top: 30px;
            }
            .download-btn { 
              background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
              color: white; 
              padding: 15px 30px; 
              border: none; 
              border-radius: 8px; 
              cursor: pointer; 
              font-size: 16px;
              font-weight: 600;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .download-btn:hover { 
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);
            }
            .close-btn {
              background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
              color: white; 
              padding: 15px 30px; 
              border: none; 
              border-radius: 8px; 
              cursor: pointer; 
              font-size: 16px;
              font-weight: 600;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(252, 129, 129, 0.3);
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .close-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(252, 129, 129, 0.4);
            }
            .footer {
              background: rgba(255, 255, 255, 0.95);
              padding: 20px;
              border-radius: 12px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
              margin-top: 20px;
              text-align: center;
              backdrop-filter: blur(10px);
            }
            .footer p {
              color: #718096;
              font-size: 0.9rem;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>
              <span>📊</span>
              Excel Document Preview
              <span>✨</span>
            </h1>
            <p>Complete Excel file converted from your PDF document</p>
          </div>
          
          <div class="container">
            <h2 class="section-title">📋 Document Overview</h2>
            
            <div class="info">
              <p><strong>✅ Conversion Successful!</strong> Your PDF document has been successfully converted to Excel format. All data has been extracted and organized in the table below for easy viewing and editing.</p>
            </div>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-number">${fullData.length}</div>
                <div class="stat-label">Total Rows</div>
              </div>
              <div class="stat">
                <div class="stat-number">${fullData[0]?.length || 0}</div>
                <div class="stat-label">Columns</div>
              </div>
              <div class="stat">
                <div class="stat-number">${fullData.length * (fullData[0]?.length || 0)}</div>
                <div class="stat-label">Total Cells</div>
              </div>
            </div>

            <h2 class="section-title">📄 Excel Data Preview</h2>
            
            <div class="table-container">
              <table>
                ${fullData.map((row, index) => 
                  `<tr>
                    ${row.map(cell => {
                      const cleanedCell = cleanCellContent(cell || '');
                      return index === 0 
                        ? `<th>${cleanedCell || 'Column ' + (row.indexOf(cell) + 1)}</th>` 
                        : `<td>${cleanedCell || '-'}</td>`
                    }).join('')}
                  </tr>`
                ).join('')}
              </table>
            </div>
            
            <div class="actions">
              <button class="download-btn" onclick="downloadExcel()">
                <span>⬇️</span>
                Download Complete Excel File
                <span>📊</span>
              </button>
              <button class="close-btn" onclick="window.close()">
                <span>✖️</span>
                Close Preview
              </button>
            </div>
            
            <script>
              function downloadExcel() {
                try {
                  // Convert base64 to blob and download
                  const base64 = '${excelFile}';
                  const byteCharacters = atob(base64);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);
                  const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'converted-excel-file.xlsx');
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  window.URL.revokeObjectURL(url);
                  
                  // Show success message
                  alert('✅ Excel file downloaded successfully!');
                } catch (error) {
                  alert('❌ Error downloading file. Please try again.');
                  console.error('Download error:', error);
                }
              }
            </script>
          </div>
          
          <div class="footer">
            <p>📊 <strong>PDF to Excel Converter</strong> - Professional document conversion service</p>
          </div>
        </body>
      </html>
    `;

    // Open in popup window instead of new tab
    const popupFeatures = 'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no';
    const popup = window.open('', 'ExcelPreview', popupFeatures);
    
    if (popup) {
      popup.document.write(htmlContent);
      popup.document.close();
      popup.focus();
      
      toast.success('📊 Excel preview opened in popup window! 🎉');
    } else {
      // Fallback: create blob URL and open in new tab if popup is blocked
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
      toast.error('Popup blocked! Opened in new tab instead.');
    }
  }, [excelFile, fullData]);

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
                PDF to Excel Converter
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
            className={`absolute top-40 right-20 text-5xl ${isDark ? 'text-green-800/20' : 'text-green-200/30'}`}
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
                    'radial-gradient(ellipse at 0% 0%, rgba(239, 68, 68, 0.2) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 100%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 0% 100%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 0%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)',
                  ]
                : [
                    'radial-gradient(ellipse at 0% 0%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 100%, rgba(34, 197, 94, 0.08) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 0% 100%, rgba(239, 68, 68, 0.12) 0%, transparent 50%)',
                    'radial-gradient(ellipse at 100% 0%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
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
                isDark ? 'text-red-300/10' : 'text-red-200/30'
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
              >
                <div className="flex items-start gap-3">
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
                📄
              </motion.span>
              <span className="bg-gradient-to-r from-red-600 via-blue-600 to-green-600 bg-clip-text text-transparent break-words">
                PDF to Excel
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
              ✨ Transform your PDF documents into organized Excel spreadsheets with ease! 
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
                        ? 'border-red-400/80 bg-red-900/30 scale-[1.02] shadow-2xl shadow-red-900/30 ring-4 ring-red-500/20' 
                        : 'border-red-400/80 bg-red-50 scale-[1.02] shadow-2xl shadow-red-500/20 ring-4 ring-red-400/20'
                      : isDark 
                        ? 'border-gray-700 hover:border-red-500/70 hover:bg-red-950/20 hover:scale-[1.01] hover:shadow-xl hover:shadow-red-900/20 group-hover:ring-2 group-hover:ring-red-500/20' 
                        : 'border-gray-300/90 hover:border-red-300 hover:bg-red-50/70 hover:scale-[1.01] hover:shadow-xl hover:shadow-red-500/10 group-hover:ring-2 group-hover:ring-red-300/50'
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
                        isDark ? 'text-red-300' : 'text-red-600'
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
                              ? 'border-red-400/80 text-red-300 bg-red-900/20' 
                              : 'border-red-400/80 text-red-500 bg-red-50/80'
                            : isDark
                              ? 'border-gray-700 text-gray-400 group-hover:border-red-500/70 group-hover:text-red-400' 
                              : 'border-gray-300/90 text-gray-500 group-hover:border-red-300 group-hover:text-red-500'
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
                            <BsFileEarmarkExcel className="w-12 h-12" />
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
                                  isDark ? 'bg-red-500/10' : 'bg-red-100/50'
                                } animate-pulse rounded-lg`} />
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${
                                  isDark ? 'bg-red-400/50' : 'bg-red-500/30'
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
                          📄
                        </motion.span>
                        <span className={isDragActive ? (isDark ? 'text-red-300' : 'text-red-600') : ''}>
                          {isDragActive ? 'Drop your PDF file here!' : 'Drag & Drop PDF File'}
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
                          isDark ? 'text-red-400' : 'text-red-600'
                        }`}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Supported format: <span className="font-bold">.pdf</span>
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
                      ? 'bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-500 hover:to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] border border-red-500/30'
                      : 'bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-400 hover:to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] border border-red-400/30'
                }`}
                whileHover={!(!file || isConverting || !isSignedIn) ? { scale: 1.02 } : {}}
                whileTap={!(!file || isConverting || !isSignedIn) ? { scale: 0.98 } : {}}
              >
                {/* Animated Background */}
                {!(!file || isConverting || !isSignedIn) && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-purple-500/20"
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
                        ? '📄 Select PDF File'
                        : '✨ Convert to Excel'
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
                      className="h-full bg-gradient-to-r from-red-500 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${conversionProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      Converting your PDF file...
                    </span>
                    <span className={`font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
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
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Enhanced Tooltip Display */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`mt-6 p-4 rounded-xl border backdrop-blur-sm ${
                  isDark
                    ? 'bg-blue-950/30 border-blue-800/50 text-blue-200'
                    : 'bg-blue-50/80 border-blue-200/70 text-blue-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="flex-shrink-0 mt-0.5"
                  >
                    <IoMdInformationCircle className={`text-lg ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed font-medium">{showTooltip}</p>
                  </div>
                  <motion.button
                    onClick={() => setShowTooltip(null)}
                    className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
                      isDark ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-100'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes className="text-xs" />
                  </motion.button>
                </div>
              </motion.div>
            )}          </AnimatePresence>
        </motion.div>        {/* Excel Preview Section */}
        <div className="w-full px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {excelFile && (
                <motion.div
                  key="excel-preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <motion.h2 
                    className={`text-3xl md:text-4xl font-bold mb-8 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    🎉 Your Excel File is Ready! ✨
                  </motion.h2>

                  <motion.div
                    className={`max-w-6xl mx-auto rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm ${
                      isDark
                        ? 'bg-gray-900/50 shadow-xl border border-gray-800'
                        : 'bg-white/80 shadow-lg border border-gray-100'
                    }`}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Success Message */}
                    <motion.div 
                      className="text-center mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                      }}
                    >
                      <motion.div 
                        className={`flex items-center justify-center gap-3 mb-4 ${
                          isDark ? 'text-purple-200' : 'text-purple-800'
                        }`}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <motion.span
                          animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 10, 0]
                          }}
                          transition={{ 
                            duration: 1,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                          className="text-3xl"
                        >
                          🎉
                        </motion.span>
                        <h2 className="text-xl md:text-2xl font-bold">
                          {isMobile ? 'Excel File Ready!' : 'Excel Document Preview'}
                        </h2>
                        <motion.span
                          animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, -10, 0]
                          }}
                          transition={{ 
                            duration: 1,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                          className="text-3xl"
                        >
                          ✨
                        </motion.span>
                      </motion.div>
                    </motion.div>
                        {/* Document Preview Container */}                      <motion.div
                        className={`max-w-5xl mx-auto relative rounded-xl border-2 overflow-hidden shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
                          isDark
                            ? 'border-purple-800 bg-gray-900 shadow-purple-900/30'
                            : 'border-purple-200 bg-white shadow-purple-500/20'
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
                                isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                              }`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <span className="text-lg">📊</span>
                            </motion.div>
                            <div className="text-left">
                              <h3 className={`font-medium text-sm ${
                                isDark ? 'text-purple-200' : 'text-purple-800'
                              }`}>
                                Converted Excel File
                              </h3>
                              <p className={`text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Click to open in full screen
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
                        </div>                        {/* Real Excel Preview */}
                        <div className={`p-6 ${
                          isDark ? 'bg-gray-900' : 'bg-white'
                        }`}>
                          <div className="space-y-3">
                            {previewData && previewData.length > 0 ? (
                              <>
                                {/* Dynamic Excel-like header row using actual column count */}
                                <div 
                                  className={`grid gap-2 p-2 rounded ${
                                    isDark ? 'bg-gray-800' : 'bg-gray-100'
                                  }`}
                                  style={{ gridTemplateColumns: `repeat(${previewData[0]?.length || 1}, 1fr)` }}
                                >
                                  {previewData[0] && previewData[0].map((_, colIndex) => (
                                    <div 
                                      key={colIndex}
                                      className={`text-xs font-semibold text-center py-1 ${
                                        isDark ? 'text-purple-300' : 'text-purple-700'
                                      }`}
                                    >
                                      {String.fromCharCode(65 + colIndex)} {/* A, B, C, etc. */}
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Real Excel-like data rows */}
                                {previewData.map((row, rowIndex) => (
                                  <motion.div 
                                    key={rowIndex}
                                    className={`grid gap-2 p-2 rounded border ${
                                      isDark 
                                        ? 'border-gray-700 hover:bg-gray-800/50' 
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                    style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: rowIndex * 0.1 }}
                                  >
                                    {row.map((cell, cellIndex) => (
                                      <div 
                                        key={cellIndex}
                                        className={`text-xs p-1 truncate ${
                                          isDark ? 'text-gray-300' : 'text-gray-700'
                                        }`}
                                        title={cell} // Show full content on hover
                                      >
                                        {cell || '-'} {/* Show dash for empty cells */}
                                      </div>
                                    ))}
                                  </motion.div>
                                ))}
                              </>
                            ) : (
                              <div className={`text-center py-8 ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                <span className="text-2xl">📋</span>
                                <p className="mt-2">No preview data available</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Click to expand hint */}
                          <motion.div 
                            className={`mt-4 text-center p-3 rounded-lg border-2 border-dashed ${
                              isDark 
                                ? 'border-purple-800 bg-purple-950/20 text-purple-300' 
                                : 'border-purple-300 bg-purple-50 text-purple-700'
                            }`}
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <p className="text-sm font-medium flex items-center justify-center gap-2">
                              <span>🔍</span>
                              Click anywhere to view in full screen
                              <span>🚀</span>
                            </p>
                          </motion.div>                        </div>
                      </motion.div>
                    </motion.div>                    {/* Download Options Section */}
                    <motion.div
                      className={`max-w-2xl mx-auto mt-8 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm ${
                        isDark
                          ? 'bg-gray-900/50 shadow-xl border border-gray-800 shadow-purple-900/30'
                          : 'bg-white/80 shadow-lg border border-gray-100 shadow-purple-500/20'
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
                                isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                              }`}
                              whileHover={{ scale: 1.1, rotate: 10 }}
                            >
                              <span className="text-2xl">📊</span>
                            </motion.div>
                            <div>
                              <h3 className={`font-bold text-lg ${
                                isDark ? 'text-purple-200' : 'text-purple-800'
                              }`}>
                                Download Your Excel File
                              </h3>
                              <p className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {isMobile ? 'Your file is ready for download' : 'Save or preview your converted file'}
                              </p>
                            </div>
                          </div>

                          {!isMobile && (
                            <div className={`p-4 rounded-lg mb-6 ${
                              isDark ? 'bg-black/30' : 'bg-gray-50'
                            }`}>
                              <p className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                ✅ Your PDF has been successfully converted to Excel format. Use the preview above to view the content or download the file directly.
                              </p>
                            </div>
                          )}

                          {/* Enhanced Download Buttons */}
                          <motion.div
                            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                          >
                            <motion.button
                              onClick={downloadExcel}
                              className={`flex-1 py-4 px-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 ${
                                isDark
                                  ? 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white shadow-lg hover:shadow-xl'
                              }`}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span className="text-xl">⬇️</span> 
                              <span>Download Excel</span>
                              <span className="text-xl">📊</span>
                            </motion.button>                            <motion.button
                              onClick={openPreviewInPopup}
                              className={`flex-1 py-4 px-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 ${
                                isDark
                                  ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg hover:shadow-xl'
                              }`}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span className="text-xl">🔍</span> 
                              <span>{isMobile ? 'Open Excel' : 'Full Preview'}</span>
                              <span className="text-xl">🚀</span>
                            </motion.button>
                          </motion.div>

                          {/* Additional Info */}
                          <motion.div
                            className={`mt-6 p-4 rounded-lg ${
                              isDark ? 'bg-blue-950/30 border border-blue-800/50' : 'bg-blue-50/80 border border-blue-200/70'
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                          >
                            <p className={`text-sm ${
                              isDark ? 'text-blue-300' : 'text-blue-700'
                            }`}>
                              💡 <strong>Tip:</strong> Your converted Excel file contains all the data from your PDF, organized in spreadsheet format for easy editing and analysis.
                            </p>                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                </motion.div>
              )}            </AnimatePresence>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <ServiceSections 
          serviceName="PDF to Excel Converter"
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
              title: "Extract Data",
              desc: "Our AI extracts tables and data from your PDF",
              icon: "🔍",
              color: "from-purple-500 to-pink-500"
            },
            {
              step: "3",
              title: "Download Excel",
              desc: "Get your organized Excel spreadsheet instantly",
              icon: "📊",
              color: "from-green-500 to-emerald-500"
            }
          ]}
          testimonials={[
            {
              name: "David Park",
              role: "Data Analyst",
              text: "Amazing tool! Converts my PDF reports to Excel perfectly. The data extraction is incredibly accurate.",
              rating: 5,
              avatar: "👨‍💼"
            },
            {
              name: "Rachel Green",
              role: "Accountant",
              text: "This has revolutionized how I work with financial PDFs. Quick, accurate, and saves me hours of manual work.",
              rating: 5,
              avatar: "👩‍💼"
            },
            {
              name: "Alex Thompson",
              role: "Research Assistant",
              text: "Perfect for converting research data from PDFs to Excel. The formatting preservation is excellent!",
              rating: 5,
              avatar: "👨‍🔬"
            }
          ]}
          callToActionMessage="Ready to convert your PDF to Excel? Start now!"
        />
        </motion.main>
      <Footer />
    </>
  );
};

export default PDFtoExcelPage;
