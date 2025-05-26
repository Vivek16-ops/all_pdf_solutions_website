'use client'
import React, { useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleLabelClick = () => {
    inputRef.current?.click();
  };

  const theme = useAppSelector((state: any) => state.theme.theme);
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
        <form className="flex flex-col gap-4 items-center" onSubmit={e => e.preventDefault()}>
          <label
            className={labelClass}
            onClick={handleLabelClick}
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
          </label>
          <button type="submit" className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all">Merge PDFs</button>
        </form>
        {/* Display selected files */}
        {selectedFiles.length > 0 && (
          <ul className="mt-6 space-y-2">
            {selectedFiles.map((file, idx) => (
              <li key={idx} className={fileItemClass}>
                <span className={fileNameClass}>{file.name}</span>
                <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default FileUpload;
