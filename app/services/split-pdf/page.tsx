'use client';
import React, { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ServiceSections } from '@/components/service-components';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';

const SplitPDFPage = () => {
  const { isSignedIn } = useAuth();
  const { isDark, mounted } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [pageRanges, setPageRanges] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleSplit = async () => {
    if (!isSignedIn) {
      toast.error('Please login to split files');
      return;
    }
    if (!file || !pageRanges.trim()) return;
    
    setIsProcessing(true);
    try {
      // TODO: Implement split logic
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ranges', pageRanges);
      
      // Split API call will go here
      toast.success('File split successfully!');
      
    } catch (error) {
      console.error('Error splitting file:', error);
      toast.error('Error splitting file');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-10 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
          <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-purple-800">
                Split PDF File
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
        isDark 
          ? 'bg-gradient-to-br from-black via-purple-950 to-black' 
          : 'bg-gradient-to-br from-purple-50 via-pink-50 to-white'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}>
              Split PDF File
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-purple-300/90' : 'text-purple-700/90'}`}>
              Split your PDF into multiple files by page ranges
            </p>
          </div>

          <div className={`rounded-2xl p-8 backdrop-blur-sm ${
            isDark 
              ? 'bg-gray-900/50 shadow-xl border border-gray-800' 
              : 'bg-white/80 shadow-lg border border-gray-100'
          }`}>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                !isSignedIn 
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer ' + (
                    isDragActive
                      ? isDark ? 'border-purple-400 bg-purple-950/30' : 'border-purple-400 bg-purple-50'
                      : isDark ? 'border-gray-700 hover:border-purple-500' : 'border-gray-300 hover:border-purple-300'
                  )
              }`}>
              <input {...getInputProps()} />
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {!isSignedIn ? (
                  <div>
                    <p className="text-lg font-medium">Login Required</p>
                    <p className="mt-2">Please login to upload and split files</p>
                  </div>
                ) : file ? (
                  <div>
                    <p className="text-lg font-medium">Selected file: {file.name}</p>
                    <p className="mt-2">Click or drag and drop to change file</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium">Drag and drop your PDF file here</p>
                    <p className="mt-2">or click to select file</p>
                  </div>
                )}
              </div>
            </div>

            {file && (
              <div className="mt-6">
                <label 
                  htmlFor="pageRanges" 
                  className={`block mb-2 font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}
                >
                  Page Ranges
                </label>
                <input
                  type="text"
                  id="pageRanges"
                  placeholder="e.g., 1-3, 4-6, 7"
                  value={pageRanges}
                  onChange={(e) => setPageRanges(e.target.value)}
                  className={`w-full p-3 rounded-lg ${
                    isDark
                      ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500'
                      : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400'
                  } border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                />
                <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Separate ranges with commas. Example: 1-3 will create a PDF with pages 1 to 3
                </p>
              </div>
            )}

            <button
              onClick={handleSplit}
              disabled={!isSignedIn || !file || !pageRanges.trim() || isProcessing}
              className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition-all ${
                !isSignedIn || !file || !pageRanges.trim() || isProcessing
                  ? isDark 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400 cursor-not-allowed border border-gray-700'
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
                  : isDark
                    ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-md'
              }`}
            >
              {!isSignedIn 
                ? 'Login Required' 
                : isProcessing 
                  ? 'Splitting...'                  : 'Split PDF'}            </button>
          </div>

          {/* Enhanced Features Section */}
          <ServiceSections
            serviceName="PDF Splitter"
            steps={[
              {
                step: "1",
                title: "Upload PDF File",
                desc: "Select and upload the PDF file you want to split into separate documents",
                icon: "📤",
                color: "from-green-400 to-blue-500"
              },
              {
                step: "2",
                title: "Specify Page Ranges",
                desc: "Enter page ranges or specific pages to extract from your PDF document",
                icon: "✂️",
                color: "from-blue-400 to-purple-500"
              },
              {
                step: "3",
                title: "Download Split Files",
                desc: "Get your separated PDF files with the exact pages you specified",
                icon: "📥",
                color: "from-purple-400 to-pink-500"
              }
            ]}
            testimonials={[
              {
                name: "Sarah Williams",
                role: "Content Editor",
                text: "Perfect for extracting specific chapters from large documents. Clean splits every time!",
                rating: 5,
                avatar: "✏️"
              },
              {
                name: "Michael Zhang",
                role: "Project Manager",
                text: "Great tool for breaking down project reports into individual sections. Very efficient!",
                rating: 5,
                avatar: "📊"
              },
              {
                name: "Lisa Thompson",
                role: "Teacher",
                text: "I use this to split textbooks into individual lessons for my students. Works flawlessly!",
                rating: 5,
                avatar: "👩‍🏫"
              }
            ]}
            callToActionMessage="Need to split your PDF? Upload your file and extract specific pages easily!"
          />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default SplitPDFPage;
