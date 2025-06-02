import { useState } from 'react';
import toast from 'react-hot-toast';

interface ConversionResponse {
    success: boolean;
    message: string;
    file?: string;
    previewData?: string[][];
    fullData?: string[][];
}

export const usePdfToExcel = () => {
    const [isConverting, setIsConverting] = useState(false);
    const [excelFile, setExcelFile] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<string[][] | null>(null);
    const [fullData, setFullData] = useState<string[][] | null>(null);    const convertPdfToExcel = async (file: File): Promise<void> => {
        setIsConverting(true);
        setExcelFile(null);
        setPreviewData(null);
        setFullData(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/convert/pdf-to-excel', {
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
                setExcelFile(data.file);
                setPreviewData(data.previewData || null);
                setFullData(data.fullData || null);
                toast.success('PDF successfully converted to Excel! 📊✨');
            } else {
                throw new Error(data.message || 'No file received from server');
            }
        } catch (error) {
            console.error('Conversion error:', error);
            if (error instanceof Error && error.message.includes('JSON')) {
                toast.error('API endpoint error. Please check server configuration.');
            } else {
                toast.error(error instanceof Error ? error.message : 'Failed to convert PDF to Excel');
            }
            setExcelFile(null);
            setPreviewData(null);
            setFullData(null);
        } finally {
            setIsConverting(false);
        }
    };

    const downloadExcel = () => {
        if (!excelFile) {
            toast.error('No Excel file available to download');
            return;
        }

        try {
            // Convert base64 to blob
            const byteCharacters = atob(excelFile);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'converted.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('Excel file downloaded successfully! 💾');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download Excel file');
        }
    };    return {
        isConverting,
        excelFile,
        previewData,
        fullData,
        convertPdfToExcel,
        downloadExcel
    };
};
