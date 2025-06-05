import { useState } from 'react';
import toast from 'react-hot-toast';

interface ConversionResponse {
    success: boolean;
    message: string;
    file?: string;
    previewData?: {
        totalSlides: number;
        fileName: string;
        fileSize: number;
        slides: Array<{
            title: string;
            contentPreview: string[];
        }>;
    };
}

export const usePdfToPpt = () => {
    const [isConverting, setIsConverting] = useState(false);
    const [pptFile, setPptFile] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<ConversionResponse['previewData'] | null>(null);

    const convertPdfToPpt = async (file: File): Promise<void> => {
        setIsConverting(true);
        setPptFile(null);
        setPreviewData(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/convert/pdf-to-ppt', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data: ConversionResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Conversion failed');
            }

            if (data.success && data.file) {
                setPptFile(data.file);
                setPreviewData(data.previewData || null);
                toast.success('PDF successfully converted to PowerPoint! 🎨✨');
            } else {
                throw new Error(data.message || 'No file received from server');
            }
        } catch (error) {
            console.error('Conversion error:', error);
            if (error instanceof Error && error.message.includes('JSON')) {
                toast.error('API endpoint error. Please check server configuration.');
            } else {
                toast.error(error instanceof Error ? error.message : 'Failed to convert PDF to PowerPoint');
            }
            setPptFile(null);
            setPreviewData(null);
        } finally {
            setIsConverting(false);
        }
    };

    const downloadPpt = () => {
        if (!pptFile) {
            toast.error('No PowerPoint file available to download');
            return;
        }

        try {
            // Convert base64 to blob
            const byteCharacters = atob(pptFile);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { 
                type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
            });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Use the original filename from preview data or fallback to default
            const fileName = previewData?.fileName || 'converted.pptx';
            link.setAttribute('download', fileName);
            
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('PowerPoint file downloaded successfully! 💾');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download PowerPoint file');
        }
    };

    const resetConversion = () => {
        setPptFile(null);
        setPreviewData(null);
        setIsConverting(false);
    };

    return {
        isConverting,
        pptFile,
        previewData,
        convertPdfToPpt,
        downloadPpt,
        resetConversion
    };
};
