'use client'
import React, { useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isSignedIn } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (file) => !selectedFiles.some((f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)
      );
      
      if (newFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...newFiles]);
        toast.success(`${newFiles.length} ${newFiles.length === 1 ? 'file' : 'files'} added successfully`);
      } else {
        toast.error('These files have already been added');
      }
    }
  };

  const handleRemoveFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewName(file.name);
  };

  const handleClosePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewName(null);
  };
  const handleUploadClick = () => {
    if (!isSignedIn) {
      toast.error('Please log in to upload files.');
      return;
    }
    
    inputRef.current?.click();
  };

  const theme = useAppSelector((state: { theme: { theme: string } }) => state.theme.theme);
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const sectionClass = isDark
    ? 'flex flex-col items-center justify-center py-12 px-4 bg-gray-900 w-full'
    : 'flex flex-col items-center justify-center py-12 px-4 bg-white w-full';

  const cardClass = isDark
    ? 'w-full max-w-xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8'
    : 'w-full max-w-xl bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-8';

  const h2Class = isDark
    ? 'text-2xl md:text-3xl font-bold mb-4 text-purple-300 text-center'
    : 'text-2xl md:text-3xl font-bold mb-4 text-purple-700 text-center';

  const labelClass = isDark
    ? 'w-full flex flex-col items-center px-4 py-8 bg-gray-800 rounded-lg shadow-md border-2 border-dashed border-purple-300 cursor-pointer hover:border-purple-500 transition-all'
    : 'w-full flex flex-col items-center px-4 py-8 bg-white rounded-lg shadow-md border-2 border-dashed border-purple-300 cursor-pointer hover:border-purple-500 transition-all';

  const spanClass = isDark
    ? 'text-gray-300'
    : 'text-gray-600';

  const fileItemClass = isDark
    ? 'flex items-center justify-between bg-gray-800 px-4 py-2 rounded-lg'
    : 'flex items-center justify-between bg-purple-100 px-4 py-2 rounded-lg';

  const fileNameClass = isDark
    ? 'text-purple-200'
    : 'text-purple-700';

  return (
    <section id="upload" className={sectionClass}>
      <div className={cardClass}>
        <h2 className={h2Class}>Upload your PDF files</h2>
        <form className="flex flex-col gap-4 items-center" onSubmit={e => e.preventDefault()}>          <div
            className={labelClass}
            role="button"
            tabIndex={0}
            onClick={handleUploadClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleUploadClick();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.add('border-purple-500');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.classList.remove('border-purple-500');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isSignedIn) {
                toast.error('Please log in to upload files.');
                return;
              }
              const droppedFiles = Array.from(e.dataTransfer.files);
              if (droppedFiles.some(file => !file.type.includes('pdf'))) {
                toast.error('Only PDF files are allowed');
                return;
              }
              const dataTransfer = new DataTransfer();
              droppedFiles.forEach(file => dataTransfer.items.add(file));
              if (inputRef.current) {
                inputRef.current.files = dataTransfer.files;
                inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }}
          >
            <svg className="w-12 h-12 text-purple-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className={spanClass}>Click to select or drag & drop PDF files</span>
            <input
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              ref={inputRef}
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all">Merge PDFs</button>
        </form>
        
        {/* Display selected files */}
        {selectedFiles.length > 0 && (
          <ul className="mt-6 space-y-2">
            {selectedFiles.map((file, idx) => (
              <li
                key={idx}
                className={fileItemClass + " relative group cursor-pointer pr-10 transition-transform duration-200 hover:scale-105 hover:shadow-lg"}
                onClick={() => handlePreview(file)}
                tabIndex={0}
                aria-label={`Preview ${file.name}`}
              >
                <button
                  type="button"
                  className="absolute top-1 right-2 bg-pink-500/90 text-white rounded-full w-6 h-6 flex items-center justify-center text-base shadow hover:bg-pink-600 hover:scale-110 transition-all duration-150 z-10 border-2 border-white dark:border-gray-900 opacity-90 hover:opacity-100"
                  onClick={e => { e.stopPropagation(); handleRemoveFile(idx); }}
                  aria-label={`Remove ${file.name}`}
                  tabIndex={0}
                >
                  <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l8 8M6 14L14 6" strokeLinecap="round" />
                  </svg>
                </button>
                <span className="flex w-8 h-8 bg-purple-200 dark:bg-gray-700 rounded shadow items-center justify-center overflow-hidden mr-3">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-purple-700 dark:text-purple-200">
                    <rect x="4" y="2" width="16" height="20" rx="3" fill="currentColor" fillOpacity="0.15" />
                    <path d="M8 10h8M8 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="8" y="18" width="8" height="1.5" rx="0.75" fill="currentColor" />
                  </svg>
                </span>
                <span className={fileNameClass}>{file.name}</span>
                <span className="text-xs text-gray-500 ml-2">{(file.size / 1024).toFixed(1)} KB</span>
              </li>
            ))}
          </ul>
        )}

        {/* Large Preview Modal */}
        {previewUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-4 max-w-2xl w-full relative flex flex-col items-center">
              <button
                type="button"
                className="absolute top-2 right-2 bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-2xl shadow hover:bg-pink-700"
                onClick={handleClosePreview}
                aria-label="Close preview"
              >
                &times;
              </button>
              <div className="w-full flex flex-col items-center">
                <span className="font-semibold mb-2 text-purple-700 dark:text-purple-200 text-center">{previewName}</span>
                <object
                  data={previewUrl}
                  type="application/pdf"
                  className="w-full h-[60vh] border rounded"
                >
                  <p className="text-center">PDF preview not supported in this browser.</p>
                </object>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FileUpload;
