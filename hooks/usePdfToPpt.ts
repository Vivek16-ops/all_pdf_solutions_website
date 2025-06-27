import { useState } from 'react';

interface ConversionResponse {
    success: boolean;
    message: string;
    file?: string;
}

export const usePdfToPpt = () => {
    const [isConverting, setIsConverting] = useState(false);
    const [pptFile, setPptFile] = useState<string | null>(null);

    const convertPdfToPpt = async (file: File): Promise<void> => {
        setIsConverting(true);
        setPptFile(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/convert/pdf-to-ppt', {
                method: 'POST',
                body: formData,
            });

            const data: ConversionResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Conversion failed');
            }

            if (data.success && data.file) {
                setPptFile(data.file);
            } else {
                throw new Error(data.message || 'Conversion failed');
            }
        } catch (error) {
            console.error('Conversion error:', error);
            throw error;
        } finally {
            setIsConverting(false);
        }
    };

    const downloadPpt = () => {
        if (!pptFile) return;

        try {
            const byteCharacters = atob(pptFile);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { 
                type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'converted.pptx');
            
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            throw error;
        }
    };

    return {
        isConverting,
        pptFile,
        convertPdfToPpt,
        downloadPpt,
    };
};
