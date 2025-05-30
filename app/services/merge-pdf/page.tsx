'use client';
import React, { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';
import { IoMdClose } from "react-icons/io";
import { FaDownload, FaExternalLinkAlt, FaFilePdf } from "react-icons/fa";
import { useMergePdf } from '@/hooks/useMergePdf';

const MergePDFPage = () => {
  const { isSignedIn } = useAuth();
  const { isDark, mounted } = useTheme();
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!isSignedIn) {
      toast.error('Please login to upload files');
      return;
    }
    setFiles(prev => [...prev, ...acceptedFiles]);
    toast.success('Files added successfully!');
  }, [isSignedIn]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  }, []);
  const { loading, mergedPdfBase64, mergePdfs, downloadMergedPdf } = useMergePdf();

  const handleMerge = useCallback(async () => {
    if (!isSignedIn) {
      toast.error('Please login to merge files');
      return;
    }
    if (files.length < 2) {
      toast.error('Please add at least 2 files to merge');
      return;
    }
    
    setIsMerging(true);
    try {
      await mergePdfs(files);
    } catch (error) {
      console.error('Error merging files:', error);
      toast.error('Error merging files. Please try again.');
    } finally {
      setIsMerging(false);
    }
  }, [files, isSignedIn, mergePdfs]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

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
      <main className={`min-h-screen pt-10 transition-colors duration-300 ${
        isDark ? 'bg-gradient-to-br from-black via-purple-950 to-black' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}>
              Merge PDF Files
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-purple-300/90' : 'text-purple-700/90'}`}>
              Combine multiple PDF files into a single document quickly and easily
            </p>
            {!isSignedIn && (
              <p className={`mt-4 text-sm ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                Please login to merge files
              </p>
            )}
          </div>

          <div className={`rounded-2xl p-8 backdrop-blur-sm ${
            isDark 
              ? 'bg-gray-900/50 shadow-xl border border-gray-800' 
              : 'bg-white/80 shadow-lg border border-gray-100'
          }`}>            <div 
              {...getRootProps()} 
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 transform ${
                !isSignedIn
                  ? isDark 
                    ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed' 
                    : 'border-gray-300 bg-gray-100/50 cursor-not-allowed'
                : isDragActive
                  ? isDark 
                    ? 'border-purple-400 bg-purple-950/30 scale-[1.02] shadow-2xl shadow-purple-900/20' 
                    : 'border-purple-400 bg-purple-50 scale-[1.02] shadow-2xl shadow-purple-500/20'
                  : isDark 
                    ? 'border-gray-700 hover:border-purple-500 hover:bg-purple-950/20 hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-900/10' 
                    : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/50 hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-500/10'
              }`}
            >
              <input {...getInputProps()} />
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {!isSignedIn ? (
                  <div className="space-y-3">
                    <div className={`w-16 h-16 mx-auto rounded-xl border-2 ${
                      isDark ? 'border-gray-700 text-gray-600' : 'border-gray-300 text-gray-400'
                    }`}>
                      <FaFilePdf className="w-full h-full p-3" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">Login Required</p>
                      <p className="mt-2 text-sm">Please login to upload and merge files</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className={`w-16 h-16 mx-auto rounded-xl border-2 transition-colors ${
                      isDragActive
                        ? isDark 
                          ? 'border-purple-400 text-purple-400' 
                          : 'border-purple-400 text-purple-500'
                        : isDark 
                          ? 'border-gray-700 text-gray-400 group-hover:border-purple-500 group-hover:text-purple-400' 
                          : 'border-gray-300 text-gray-400 group-hover:border-purple-300 group-hover:text-purple-500'
                    }`}>
                      <FaFilePdf className="w-full h-full p-3" />
                    </div>
                    <div>
                      <p className={`text-lg font-medium ${
                        isDragActive
                          ? isDark ? 'text-purple-300' : 'text-purple-600'
                          : ''
                      }`}>
                        {isDragActive ? 'Drop your files here' : 'Drag and drop PDF files here'}
                      </p>
                      <p className="mt-2 text-sm">or click to select files</p>
                    </div>
                  </div>
                )}
              </div>
            </div>            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                {files.map((file, index) => (
                  <div 
                    key={`${file.name}-${index}`}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all transform hover:scale-[1.01] ${
                      isDark 
                        ? 'bg-gray-800/80 shadow-lg shadow-purple-900/10 border border-gray-700' 
                        : 'bg-white/80 shadow-lg shadow-purple-500/10 border border-purple-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg ${
                        isDark ? 'bg-gray-900/50' : 'bg-purple-50'
                      }`}>
                        <FaFilePdf className={`text-xl ${
                          isDark ? 'text-purple-400' : 'text-purple-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${
                          isDark ? 'text-purple-300' : 'text-purple-700'
                        }`}>
                          {file.name}
                        </p>
                        <p className={`text-xs mt-0.5 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          PDF Document
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className={`ml-4 p-2 rounded-lg transition-all transform hover:scale-110 active:scale-95 ${
                        isDark
                          ? 'bg-gray-900/50 hover:bg-red-900/50 text-gray-400 hover:text-red-300'
                          : 'bg-purple-50 hover:bg-red-50 text-gray-500 hover:text-red-500'
                      }`}
                      aria-label="Remove file"
                    >
                      <IoMdClose size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button              onClick={handleMerge}
              disabled={!isSignedIn || files.length < 2 || isMerging}
              className={`mt-6 w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all transform ${
                !isSignedIn || files.length < 2 || isMerging
                  ? isDark 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400 cursor-not-allowed border-2 border-gray-700'
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                  : isDark
                    ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white shadow-lg shadow-purple-900/30 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {!isSignedIn 
                ? '🔒 Login Required'
                : isMerging
                  ? '🔄 Merging Files...'
                  : files.length < 2
                    ? '📁 Add at least 2 files'
                    : '✨ Merge PDF Files ✨'}</button>            {/* Preview Section */}
            {mergedPdfBase64 && (
              <>
                <div className="mt-8">
                  <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                    Merged PDF Preview
                  </h3>

                  {/* Mobile View */}
                  <div className="block md:hidden">
                    <div className={`p-4 rounded-lg ${
                      isDark ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                            <FaFilePdf className={`text-3xl ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium flex items-center gap-2 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                              ✨ Merged PDF File ✨
                            </p>
                            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              🎉 Your files have been combined successfully!
                            </p>
                          </div>
                        </div>
                        <div className={`text-center mt-1 px-3 py-2.5 rounded-xl ${
                          isDark ? 'bg-gray-800/50' : 'bg-purple-50'
                        }`}>
                          <p className={`text-xs sm:text-sm font-medium mb-0.5 ${
                            isDark ? 'text-purple-300' : 'text-purple-600'
                          }`}>
                            🖥️ For Best Experience
                          </p>
                          <p className={`text-[10px] sm:text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            ✨ Open in PC/tablet for full preview ✨
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Preview */}
                  <div className="hidden md:block">
                    <div className={`aspect-[8.5/11] w-full rounded-lg overflow-hidden ${
                      isDark ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <iframe
                        src={`data:application/pdf;base64,${mergedPdfBase64}`}
                        className="w-full h-full"
                        title="Merged PDF Preview"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4">                    <button
                      onClick={downloadMergedPdf}
                      className={`flex-1 py-3.5 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${
                        isDark
                          ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white shadow-lg shadow-purple-900/30'
                          : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg shadow-purple-500/30'
                      }`}
                    >                      <FaDownload className="text-lg" />
                      <span className="font-semibold">Download PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        const pdfUrl = `data:application/pdf;base64,${mergedPdfBase64}`;
                        window.open(pdfUrl, '_blank');
                      }}
                      className={`flex-1 py-3.5 px-6 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${
                        isDark
                          ? 'bg-gray-800 hover:bg-gray-700 text-purple-400 hover:text-purple-300 border-2 border-purple-800 shadow-lg shadow-purple-900/10'
                          : 'bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 border-2 border-purple-200 shadow-lg shadow-purple-500/10'
                      }`}
                    >
                      <FaExternalLinkAlt className="text-lg" />
                      <span className="font-semibold">Open in New Tab</span>
                    </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MergePDFPage;
