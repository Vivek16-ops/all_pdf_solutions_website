import { useState } from 'react';
import toast from 'react-hot-toast';

interface ConversionResponse {
    success: boolean;
    message: string;
    file?: string;
    filename?: string;
    fileSize?: number;
    extractedText?: string; // Add extracted text field
    extractionDetails?: {
        pagesProcessed: number;
        totalTextLength: number;
        hasMetadata: boolean;
        pdfInfo: any;
    };
}

export const usePdfToWord = () => {
    const [isConverting, setIsConverting] = useState(false);
    const [wordFile, setWordFile] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [extractionDetails, setExtractionDetails] = useState<ConversionResponse['extractionDetails'] | null>(null);
    const [extractedText, setExtractedText] = useState<string | null>(null);

    const convertPdfToWord = async (file: File): Promise<void> => {        setIsConverting(true);
        setWordFile(null);
        setFileName(null);
        setExtractionDetails(null);
        setExtractedText(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/convert/pdf-to-word', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data: ConversionResponse = await response.json();            if (data.success && data.file) {
                setWordFile(data.file);
                setFileName(data.filename || `${file.name.replace('.pdf', '')}_converted.docx`);
                setExtractionDetails(data.extractionDetails || null);
                setExtractedText(data.extractedText || null);
                  // Show success message with extraction details
                const detailsMessage = data.extractionDetails 
                    ? ` (${data.extractionDetails.pagesProcessed} pages, ${data.extractionDetails.totalTextLength} characters)`
                    : '';
                
                toast.success(`PDF converted to Word successfully${detailsMessage}`);
            } else {
                toast.error(data.message || 'Conversion failed');
            }
        } catch (error) {
            console.error('PDF to Word conversion error:', error);
            toast.error('Failed to convert PDF to Word. Please try again.');
        } finally {
            setIsConverting(false);
        }
    };

    const downloadWordFile = () => {
        if (wordFile && fileName) {
            try {
                // Convert base64 to blob
                const byteCharacters = atob(wordFile);
                const byteNumbers = new Array(byteCharacters.length);
                
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], {
                    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                });

                // Create download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                toast.success('Word document downloaded successfully!');
            } catch (error) {
                console.error('Download error:', error);
                toast.error('Failed to download Word document');
            }
        }
    };    const resetState = () => {
        setWordFile(null);
        setFileName(null);
        setExtractionDetails(null);
        setExtractedText(null);
        setIsConverting(false);
    };

    return {
        isConverting,
        wordFile,
        fileName,
        extractionDetails,
        extractedText,
        convertPdfToWord,
        downloadWordFile,
        resetState
    };
};
