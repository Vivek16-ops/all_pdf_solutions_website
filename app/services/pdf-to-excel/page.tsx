'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import { usePdfToExcel } from '@/hooks/usePdfToExcel';
import LoadingDots from '@/components/LoadingDots';

const PDFtoExcelPage = () => {
  const { isSignedIn } = useAuth();
  const { isDark, mounted } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { isConverting, excelFile, previewData, fullData, convertPdfToExcel, downloadExcel } = usePdfToExcel();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleRemoveFile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    toast.success('File removed');
  }, []);
  const handleConvert = useCallback(async () => {
    if (!isSignedIn) {
      toast.error('Please login to convert files');
      return;
    }
    if (!file) return;
    
    await convertPdfToExcel(file);
    setFile(null);
  }, [file, isSignedIn, convertPdfToExcel]);
  const openPreviewInNewTab = useCallback(() => {
    if (!excelFile || !fullData) {
      toast.error('No preview data available');
      return;
    }    // Function to clean cell content from any unwanted characters
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

    // Create HTML content for the preview with all data
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Excel Document Preview</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #6366f1; margin-bottom: 20px; }
            .info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #6366f1; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
            th { background-color: #f8f9fa; font-weight: bold; position: sticky; top: 0; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            tr:hover { background-color: #e8f4fd; }
            .download-btn { 
              background: #6366f1; 
              color: white; 
              padding: 12px 24px; 
              border: none; 
              border-radius: 5px; 
              cursor: pointer; 
              margin-top: 20px;
              font-size: 16px;
              font-weight: bold;
            }
            .download-btn:hover { background: #5856eb; }
            .stats { display: flex; gap: 20px; margin-bottom: 20px; }
            .stat { background: #e0e7ff; padding: 10px; border-radius: 5px; text-align: center; flex: 1; }
            .stat-number { font-size: 24px; font-weight: bold; color: #6366f1; }
            .stat-label { font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📊 Complete Excel Document</h1>
            <div class="info">
              <p><strong>Document successfully converted from PDF to Excel format.</strong> All data from your PDF has been extracted and organized in the table below.</p>
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

            <table>
              ${fullData.map((row, index) => 
                `<tr>
                  ${row.map(cell => {
                    const cleanedCell = cleanCellContent(cell || '');
                    return index === 0 
                      ? `<th>${cleanedCell || 'Column ' + (row.indexOf(cell) + 1)}</th>` 
                      : `<td>${cleanedCell || ''}</td>`
                  }).join('')}
                </tr>`
              ).join('')}
            </table>
            
            <button class="download-btn" onclick="downloadExcel()">
              ⬇️ Download Complete Excel File
            </button>
            
            <script>
              function downloadExcel() {
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
                link.setAttribute('download', 'converted.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
              }
            </script>
          </div>
        </body>
      </html>
    `;

    // Create blob with HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    
    // Open in new tab
    window.open(url, '_blank');
    
    // Clean up URL after a delay
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);

    toast.success('Full document preview opened in new tab! 🔍');
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-purple-800">
                PDF to Excel Converter
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
        className={`min-h-screen pt-10 transition-all duration-500 ${
          isDark 
            ? 'bg-gradient-to-br from-black via-purple-950 to-black' 
            : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12 transform transition-all">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3 ${
              isDark ? 'text-purple-200' : 'text-purple-800'
            }`}>
              <span className="animate-pulse">📄</span> 
              PDF to Excel Converter 
              <span className="animate-bounce">📊</span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDark ? 'text-purple-300/90' : 'text-purple-700/90'
            }`}>
              ✨ Transform your PDFs into organized spreadsheets instantly ✨
            </p>
            {!isSignedIn && (
              <p className={`mt-4 text-sm ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`}>
                🔐 Please login to upload and convert files
              </p>
            )}
          </div>

          <div className="grid gap-8">
            <div className={`rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.01] ${
              isDark 
                ? 'bg-gray-900/50 shadow-xl border border-gray-800 shadow-purple-900/30' 
                : 'bg-white/80 shadow-lg border border-gray-100 shadow-purple-500/20'
            }`}>
              <div 
                {...getRootProps()} 
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 group ${
                  !isSignedIn
                    ? isDark 
                      ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed opacity-80' 
                      : 'border-gray-300 bg-gray-100/50 cursor-not-allowed opacity-80'
                  : isDragActive
                    ? isDark 
                      ? 'border-purple-400 bg-purple-950/30 scale-[1.02] shadow-2xl shadow-purple-900/30 ring-4 ring-purple-500/20' 
                      : 'border-purple-400 bg-purple-50 scale-[1.02] shadow-2xl shadow-purple-500/20 ring-4 ring-purple-400/20'
                    : isDark 
                      ? 'border-gray-700 hover:border-purple-500 hover:bg-purple-950/20 hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-900/20' 
                      : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/50 hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-500/10'
                }`}
              >
                <input {...getInputProps()} />
                {file && isSignedIn && (
                  <motion.button
                    onClick={handleRemoveFile}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 transform hover:rotate-90 ${
                      isDark
                        ? 'bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-300'
                        : 'bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Remove file"
                  >
                    <IoMdClose size={20} />
                  </motion.button>
                )}
                <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {!isSignedIn ? (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <span className="text-4xl">🔒</span>
                      </div>
                      <p className="text-lg font-medium bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        Login Required
                      </p>
                      <p className="mt-2 opacity-80">Please login to upload and convert files</p>
                    </div>
                  ) : file ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-3">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                        }`}>
                          <span className="text-2xl">📄</span>
                        </div>
                        <p className={`text-lg font-medium ${
                          isDark ? 'text-purple-300' : 'text-purple-600'
                        }`}>
                          {file.name} ✅
                        </p>
                      </div>
                      <p className="mt-2 opacity-80">Click or drag and drop to change file 🔄</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                        isDragActive
                          ? isDark 
                            ? 'bg-purple-900/40 scale-110' 
                            : 'bg-purple-100 scale-110'
                          : isDark 
                            ? 'bg-purple-900/20' 
                            : 'bg-purple-50'
                      }`}>
                        <span className={`text-4xl transition-transform duration-300 ${
                          isDragActive ? 'scale-125' : 'scale-100'
                        }`}>
                          {isDragActive ? '✨' : '📄'}
                        </span>
                      </div>
                      <div>
                        <p className={`text-lg font-medium ${
                          isDragActive 
                            ? isDark 
                              ? 'text-purple-300' 
                              : 'text-purple-600'
                            : ''
                        }`}>
                          {isDragActive 
                            ? '✨ Drop your PDF here ✨' 
                            : 'Drag and drop your PDF file here 📥'}
                        </p>
                        <p className="mt-2 text-sm opacity-75">or click to select file</p>
                        <p className={`text-xs mt-4 ${
                          isDark ? 'text-purple-400' : 'text-purple-600'
                        }`}>
                          Supported format: <span className="font-medium">.pdf</span> 📄
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <motion.button
                onClick={handleConvert}
                disabled={!isSignedIn || !file || isConverting}
                className={`mt-6 w-full py-4 px-6 rounded-xl font-semibold text-base relative overflow-hidden transition-all duration-300 ${
                  !isSignedIn || !file || isConverting
                    ? isDark 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400 cursor-not-allowed border border-gray-700'
                      : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
                    : isDark
                      ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white shadow-lg shadow-purple-900/30'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg shadow-purple-500/20'
                }`}
                whileHover={!(!isSignedIn || !file || isConverting) ? { scale: 1.02 } : {}}
                whileTap={!(!isSignedIn || !file || isConverting) ? { scale: 0.98 } : {}}
              >
                {!isSignedIn 
                  ? '🔒 Login Required' 
                  : isConverting 
                    ? '⚡ Converting...' 
                    : '✨ Convert to Excel 📊'}
              </motion.button>
            </div>            {/* Excel Preview Section */}
            <AnimatePresence mode="wait">
              {excelFile && (
                <motion.div
                  key="excel-preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Mobile: Show success message */}
                  {isMobile ? (
                    <motion.div 
                      className="text-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                      }}
                    >
                      <motion.h2 
                        className={`text-2xl font-semibold flex items-center justify-center gap-3 ${
                          isDark ? 'text-purple-200' : 'text-purple-800'
                        }`}
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
                        >
                          🎉
                        </motion.span>
                        Your Excel File is Ready!
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
                        >
                          ✨
                        </motion.span>
                      </motion.h2>
                    </motion.div>
                  ) : (
                    /* Desktop: Show document preview */
                    <motion.div 
                      className="text-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                      }}
                    >
                      <motion.h2 
                        className={`text-2xl font-semibold flex items-center justify-center gap-3 mb-6 ${
                          isDark ? 'text-purple-200' : 'text-purple-800'
                        }`}
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
                        >
                          📊
                        </motion.span>
                        Excel Document Preview
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
                        >
                          ✨
                        </motion.span>
                      </motion.h2>
                      
                      {/* Document Preview Container */}                      <motion.div
                        className={`relative rounded-xl border-2 overflow-hidden shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02] ${
                          isDark
                            ? 'border-purple-800 bg-gray-900 shadow-purple-900/30'
                            : 'border-purple-200 bg-white shadow-purple-500/20'
                        }`}
                        onClick={openPreviewInNewTab}
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
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  <motion.div
                    className={`rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm ${
                      isDark
                        ? 'bg-gray-900/50 shadow-xl border border-gray-800 shadow-purple-900/30'
                        : 'bg-white/80 shadow-lg border border-gray-100 shadow-purple-500/20'
                    }`}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
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
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <motion.div 
                            className={`flex-shrink-0 p-3 rounded-lg ${
                              isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                            }`}
                            whileHover={{ scale: 1.1, rotate: 10 }}
                          >
                            <span className="text-2xl">📊</span>
                          </motion.div>
                          <div>
                            <h3 className={`font-medium ${
                              isDark ? 'text-purple-200' : 'text-purple-800'
                            }`}>
                              Download Options
                            </h3>
                            <p className={`text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {isMobile ? 'Your file is ready for download' : 'Save or preview your converted file'}
                            </p>
                          </div>
                        </div>

                        {!isMobile && (
                          <div className={`p-4 rounded-lg mb-4 ${
                            isDark ? 'bg-black/30' : 'bg-gray-50'
                          }`}>
                            <p className={`text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Your PDF has been successfully converted to Excel format. Use the preview above to view the content or download the file directly.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Download Buttons */}
                      <motion.div
                        className="flex gap-4 p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <motion.button
                          onClick={downloadExcel}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                            isDark
                              ? 'bg-gray-800 hover:bg-gray-700 text-purple-400 hover:text-purple-300 border border-purple-800'
                              : 'bg-gray-100 hover:bg-gray-200 text-purple-600 hover:text-purple-700 border border-purple-200'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>⬇️</span> Download Excel
                        </motion.button>                        <motion.button
                          onClick={openPreviewInNewTab}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium text-center transition-all flex items-center justify-center gap-2 ${
                            isDark
                              ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white shadow-md'
                              : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-md'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>🔍</span> {isMobile ? 'Open Excel' : 'Full Screen Preview'}
                        </motion.button>
                      </motion.div>
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

export default PDFtoExcelPage;
