import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface ConversionResult {
    success: boolean;
    message: string;
    pdf?: string;
}

export const useExcelToPdf = () => {
    const [isConverting, setIsConverting] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

    const convertExcelToPdf = async (file: File): Promise<void> => {
        setIsConverting(true);
        const toastId = toast.loading('Converting Excel to PDF...');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/convert/excel-to-pdf', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Server error' }));
                throw new Error(errorData.message || 'Failed to convert file');
            }

            const result: ConversionResult = await response.json();
            if (result.success && result.pdf) {
                try {
                    const byteCharacters = atob(result.pdf);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: 'application/pdf' });
                    
                    // Create Blob URL and update state
                    if (pdfBlobUrl) {
                        URL.revokeObjectURL(pdfBlobUrl);
                    }
                    const blobUrl = URL.createObjectURL(blob);
                    setPdfBlob(blob);
                    setPdfBlobUrl(blobUrl);
                    toast.success(result.message, { id: toastId });
                } catch (error) {
                    console.error('Error processing PDF:', error);
                    toast.error('Error processing PDF. Please try again.', { id: toastId });
                }
            } else {
                throw new Error('PDF conversion failed');
            }
        } catch (error) {
            console.error('Conversion error:', error);
            let errorMessage = 'Failed to convert file';

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            toast.error(errorMessage, {
                id: toastId,
                duration: 4000,
            });
        } finally {
            setIsConverting(false);
        }
    };

    const downloadPdf = () => {
        if (pdfBlob) {
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'converted.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
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
        isConverting,
        pdfBlobUrl,
        downloadPdf,
        convertExcelToPdf,
    };
};
