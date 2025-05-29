'use client';
import React, { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';
import { IoMdClose } from "react-icons/io";

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
      // TODO: Implement merge logic
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      
      // Merge API call will go here
      toast.success('Files merged successfully!');
      
    } catch (error) {
      console.error('Error merging files:', error);
      toast.error('Error merging files. Please try again.');
    } finally {
      setIsMerging(false);
    }
  }, [files, isSignedIn]);

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
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {!isSignedIn ? (
                  <div>
                    <p className="text-lg font-medium">Login Required</p>
                    <p className="mt-2">Please login to upload and merge files</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium">Drag and drop PDF files here</p>
                    <p className="mt-2">or click to select files</p>
                  </div>
                )}
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                {files.map((file, index) => (
                  <div 
                    key={`${file.name}-${index}`}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDark ? 'bg-gray-800' : 'bg-gray-50'
                    }`}
                  >
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isDark
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-300'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-700'
                      }`}
                      aria-label="Remove file"
                    >
                      <IoMdClose size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleMerge}
              disabled={!isSignedIn || files.length < 2 || isMerging}
              className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition-all ${
                !isSignedIn || files.length < 2 || isMerging
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
                : isMerging
                  ? 'Merging...'
                  : files.length < 2
                    ? 'Add at least 2 files'
                    : 'Merge PDF Files'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MergePDFPage;
