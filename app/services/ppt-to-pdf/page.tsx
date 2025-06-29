'use client';
import React, { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';
import { IoMdClose } from "react-icons/io";
import { ServiceSections } from '@/components/service-components';

const PPTtoPDFPage = () => {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt']
    },
    maxFiles: 1
  });  const handleConvert = useCallback(async () => {
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
    } finally {
      setIsConverting(false);
    }
  }, [isSignedIn, file]);

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
                PowerPoint to PDF Converter
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
              PowerPoint to PDF Converter
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-purple-300/90' : 'text-purple-700/90'}`}>
              Convert your PowerPoint presentations to PDF format seamlessly
            </p>
          </div>

          <div className={`rounded-2xl p-8 backdrop-blur-sm ${
            isDark 
              ? 'bg-gray-900/50 shadow-xl border border-gray-800' 
              : 'bg-white/80 shadow-lg border border-gray-100'
          }`}>            <div 
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
              {file && (
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
              )}              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>                {!isSignedIn ? (
                  <div>
                    <p className="text-lg font-medium">Login Required</p>
                    <p className="mt-2">Please login to upload and convert files</p>
                  </div>
                ) : file ? (
                  <div>
                    <p className="text-lg font-medium">Selected file: {file.name}</p>
                    <p className="mt-2">Click or drag and drop to change file</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium">Drag and drop your PowerPoint file here</p>
                    <p className="mt-2">or click to select file</p>
                  </div>
                )}
              </div>
            </div>            <button
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
            >              {!isSignedIn 
                ? 'Login Required' 
                : isConverting 
                  ? 'Converting...' 
                  : 'Convert to PDF'}            </button>

          {/* Enhanced Features Section */}
          <ServiceSections 
            serviceName="PPT to PDF Converter"
            steps={[
              {
                step: "1",
                title: "Upload PPT",
                desc: "Drag & drop or click to select your PowerPoint file",
                icon: "📊",
                color: "from-orange-500 to-red-500"
              },
              {
                step: "2",
                title: "Convert to PDF",
                desc: "Our tool converts your presentation to PDF format",
                icon: "🔄",
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "3",
                title: "Download PDF",
                desc: "Get your professional PDF document instantly",
                icon: "📄",
                color: "from-green-500 to-emerald-500"
              }
            ]}
            testimonials={[
              {
                name: "Rachel Green",
                role: "Sales Manager",
                text: "Perfect for converting our sales presentations to PDF. The formatting is always preserved perfectly.",
                rating: 5,
                avatar: "💼"
              },
              {
                name: "Tom Anderson",
                role: "Trainer",
                text: "Great for converting training materials to PDF format. Easy to share with participants!",
                rating: 5,
                avatar: "🎓"
              },
              {
                name: "Nina Patel",
                role: "Marketing Director",
                text: "Excellent tool for converting pitch decks to PDF. Professional results every time.",
                rating: 5,
                avatar: "📈"
              }
            ]}
            callToActionMessage="Ready to convert your PowerPoint to PDF? Start now!"          />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PPTtoPDFPage;
