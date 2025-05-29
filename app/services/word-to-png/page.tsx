'use client';
import React, { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';
import { IoMdClose } from "react-icons/io";

const WordToPNGPage = () => {
  const { isSignedIn } = useAuth();
  const { isDark, mounted } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);

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
    
    setIsConverting(true);
    try {
      // TODO: Implement conversion logic
      const formData = new FormData();
      formData.append('file', file);
      
      // Conversion API call will go here
      toast.success('File converted successfully!');
      
    } catch (error) {
      console.error('Error converting file:', error);
      toast.error('Error converting file. Please try again.');
    } finally {
      setIsConverting(false);
    }
  }, [file, isSignedIn]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
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
                Word to PNG Converter
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
          <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-purple-200' : 'text-purple-800'}`}>
              Word to PNG Converter
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-purple-300/90' : 'text-purple-700/90'}`}>
              Convert your Word documents to PNG format quickly and easily
            </p>
            {!isSignedIn && (
              <p className={`mt-4 text-sm ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                Please login to upload and convert files
              </p>
            )}
          </div>

          <div className={`rounded-2xl p-8 backdrop-blur-sm ${
            isDark 
              ? 'bg-gray-900/50 shadow-xl border border-gray-800' 
              : 'bg-white/80 shadow-lg border border-gray-100'
          }`}>
            <div 
              {...getRootProps()} 
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                !isSignedIn
                  ? isDark ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed' : 'border-gray-300 bg-gray-100/50 cursor-not-allowed'
                : isDragActive
                  ? isDark ? 'border-purple-400 bg-purple-950/30' : 'border-purple-400 bg-purple-50'
                  : isDark ? 'border-gray-700 hover:border-purple-500' : 'border-gray-300 hover:border-purple-300'
              }`}
            >
              <input {...getInputProps()} />
              {file && isSignedIn && (
                <button
                  onClick={handleRemoveFile}
                  className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
                    isDark
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-700'
                  }`}
                  aria-label="Remove file"
                >
                  <IoMdClose size={20} />
                </button>
              )}
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {!isSignedIn ? (
                  <div>
                    <p className="text-lg font-medium">Login Required</p>
                    <p className="mt-2">Please login to upload and convert files</p>
                  </div>
                ) : file ? (
                  <div className="relative">
                    <p className="text-lg font-medium">Selected file: {file.name}</p>
                    <p className="mt-2">Click or drag and drop to change file</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium">Drag and drop your Word file here</p>
                    <p className="mt-2">or click to select file</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleConvert}
              disabled={!isSignedIn || !file || isConverting}
              className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition-all ${
                !isSignedIn || !file || isConverting
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
                : isConverting 
                  ? 'Converting...' 
                  : 'Convert to PNG'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default WordToPNGPage;
