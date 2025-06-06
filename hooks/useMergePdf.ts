import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface MergePdfResponse {
  success: boolean;
  message: string;
  file?: string;
  error?: string;
}

export const useMergePdf = () => {
  const [loading, setLoading] = useState(false);
  const [mergedPdfBase64, setMergedPdfBase64] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const mergePdfs = async (files: File[]): Promise<boolean> => {
    if (!files || files.length < 2) {
      toast.error('Please select at least 2 PDF files to merge');
      return false;
    }

    // Validate file types
    const invalidFiles = files.some(file => !file.type.includes('pdf'));
    if (invalidFiles) {
      toast.error('Please select only PDF files');
      return false;
    }

    setLoading(true);
    setMergedPdfBase64(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/merge-pdfs', {
        method: 'POST',
        body: formData,
      });

      const result: MergePdfResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to merge PDFs');
      }      if (result.success && result.file) {
        try {
          // Store the base64 data
          setMergedPdfBase64(result.file);
          
          // Create blob and blob URL for preview
          const blob = base64ToBlob(result.file, 'application/pdf');
          
          // Clean up previous blob URL
          if (pdfBlobUrl) {
            URL.revokeObjectURL(pdfBlobUrl);
          }
          
          const blobUrl = URL.createObjectURL(blob);
          setPdfBlob(blob);
          setPdfBlobUrl(blobUrl);
          
          toast.success(result.message || 'PDFs merged successfully');
          return true;
        } catch (error) {
          console.error('Error processing merged PDF:', error);
          toast.error('Error processing merged PDF. Please try again.');
          return false;
        }
      } else {
        throw new Error(result.message || 'Failed to merge PDFs');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to merge PDFs');
      return false;
    } finally {
      setLoading(false);
    }
  };
  const downloadMergedPdf = () => {
    if (!mergedPdfBase64) {
      toast.error('No merged PDF available to download');
      return;
    }

    try {
      // Use existing blob if available, otherwise create new one
      const blob = pdfBlob || base64ToBlob(mergedPdfBase64, 'application/pdf');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download merged PDF');
    }
  };
  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string, type: string): Blob => {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  return {
    loading,
    mergedPdfBase64,
    pdfBlobUrl,
    mergePdfs,
    downloadMergedPdf
  };
};
