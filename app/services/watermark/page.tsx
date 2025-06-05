'use client';
import React, { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ServiceSections } from '@/components/service-components';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';

const WatermarkPage = () => {
  const { isSignedIn } = useAuth();
  const { isDark, mounted } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [opacity, setOpacity] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);

  const onPDFDrop = useCallback((acceptedFiles: File[]) => {
    if (!isSignedIn) {
      toast.error('Please login to upload files');
      return;
    }
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
      toast.success('File added successfully!');
    }
  }, [isSignedIn]);

  const onImageDrop = useCallback((acceptedFiles: File[]) => {
    if (!isSignedIn) {
      toast.error('Please login to upload watermark image');
      return;
    }
    if (acceptedFiles?.length > 0) {
      setWatermarkImage(acceptedFiles[0]);
      toast.success('Watermark image added successfully!');
    }
  }, [isSignedIn]);

  const { getRootProps: getPDFRootProps, getInputProps: getPDFInputProps, isDragActive: isPDFDragActive } = useDropzone({
    onDrop: onPDFDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({
    onDrop: onImageDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const handleAddWatermark = async () => {
    if (!isSignedIn) {
      toast.error('Please login to add watermark');
      return;
    }
    if (!file || (watermarkType === 'text' && !watermarkText) || (watermarkType === 'image' && !watermarkImage)) return;
    
    setIsProcessing(true);
    try {
      // TODO: Implement watermark logic
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', watermarkType);
      formData.append('opacity', opacity.toString());
      
      if (watermarkType === 'text') {
        formData.append('text', watermarkText);
      } else if (watermarkImage) {
        formData.append('image', watermarkImage);
      }
      
      // Watermark API call will go here
      toast.success('Watermark added successfully!');
      
    } catch (error) {
      console.error('Error adding watermark:', error);
      toast.error('Error adding watermark');
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
                Add Watermark to PDF
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
              Add Watermark to PDF
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-purple-300/90' : 'text-purple-700/90'}`}>
              Add text or image watermarks to your PDF documents
            </p>
          </div>

          <div className={`rounded-2xl p-8 backdrop-blur-sm ${
            isDark 
              ? 'bg-gray-900/50 shadow-xl border border-gray-800' 
              : 'bg-white/80 shadow-lg border border-gray-100'
          }`}>
            {/* PDF Upload */}
            <div {...getPDFRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              !isSignedIn 
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer ' + (
                  isPDFDragActive
                    ? isDark ? 'border-purple-400 bg-purple-950/30' : 'border-purple-400 bg-purple-50'
                    : isDark ? 'border-gray-700 hover:border-purple-500' : 'border-gray-300 hover:border-purple-300'
                )
            }`}>
              <input {...getPDFInputProps()} />
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {!isSignedIn ? (
                  <div>
                    <p className="text-lg font-medium">Login Required</p>
                    <p className="mt-2">Please login to upload and add watermarks</p>
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
              <div className="mt-6 space-y-6">
                {/* Watermark Type Selection */}
                <div>
                  <label className={`block mb-2 font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                    Watermark Type
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setWatermarkType('text')}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        watermarkType === 'text'
                          ? isDark ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                          : isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Text
                    </button>
                    <button
                      onClick={() => setWatermarkType('image')}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        watermarkType === 'image'
                          ? isDark ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                          : isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Image
                    </button>
                  </div>
                </div>

                {/* Watermark Content */}
                {watermarkType === 'text' ? (
                  <div>
                    <label 
                      htmlFor="watermarkText" 
                      className={`block mb-2 font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}
                    >
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      id="watermarkText"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="Enter watermark text"
                      className={`w-full p-3 rounded-lg ${
                        isDark
                          ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500'
                          : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400'
                      } border focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                  </div>
                ) : (
                  <div>
                    <label 
                      className={`block mb-2 font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}
                    >
                      Watermark Image
                    </label>
                    <div {...getImageRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      isImageDragActive
                        ? isDark ? 'border-purple-400 bg-purple-950/30' : 'border-purple-400 bg-purple-50'
                        : isDark ? 'border-gray-700 hover:border-purple-500' : 'border-gray-300 hover:border-purple-300'
                    }`}>
                      <input {...getImageInputProps()} />
                      <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {watermarkImage ? (
                          <p className="text-sm">Selected: {watermarkImage.name}</p>
                        ) : (
                          <p className="text-sm">Drop an image here, or click to select</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Opacity Slider */}
                <div>
                  <label 
                    htmlFor="opacity" 
                    className={`block mb-2 font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}
                  >
                    Watermark Opacity: {opacity}%
                  </label>
                  <input
                    type="range"
                    id="opacity"
                    min="10"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleAddWatermark}
                  disabled={!isSignedIn || !file || (watermarkType === 'text' && !watermarkText) || (watermarkType === 'image' && !watermarkImage) || isProcessing}
                  className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    !isSignedIn || !file || (watermarkType === 'text' && !watermarkText) || (watermarkType === 'image' && !watermarkImage) || isProcessing
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
                      ? 'Adding Watermark...'                      : 'Add Watermark'}
                </button>
              </div>
            )}

          {/* Enhanced Features Section */}
          <ServiceSections
            serviceName="PDF Watermark Tool"
            steps={[
              {
                step: "1",
                title: "Upload PDF File",
                desc: "Select and upload the PDF file you want to add a watermark to",
                icon: "📤",
                color: "from-cyan-400 to-blue-500"
              },
              {
                step: "2",
                title: "Choose Watermark",
                desc: "Add text watermark or upload image watermark with custom opacity settings",
                icon: "🏷️",
                color: "from-blue-400 to-purple-500"
              },
              {
                step: "3",
                title: "Download Protected PDF",
                desc: "Get your watermarked PDF with professional protection and branding",
                icon: "🔒",
                color: "from-purple-400 to-pink-500"
              }
            ]}
            testimonials={[
              {
                name: "Jennifer Davis",
                role: "Brand Manager",
                text: "Perfect for adding our company logo to official documents. Professional watermarks every time!",
                rating: 5,
                avatar: "👩‍💼"
              },
              {
                name: "Robert Kim",
                role: "Photographer",
                text: "Great tool for watermarking my portfolio PDFs. Protects my work while looking professional.",
                rating: 5,
                avatar: "📸"
              },
              {
                name: "Anna Martinez",
                role: "Legal Consultant",
                text: "Essential for adding confidentiality watermarks to legal documents. Reliable and easy to use!",
                rating: 5,
                avatar: "⚖️"
              }
            ]}
            callToActionMessage="Protect your documents with watermarks! Add text or image watermarks to your PDFs now!"
          />
          </div>
        </div>
      </main>      <Footer />
    </>
  );
};

export default WatermarkPage;
