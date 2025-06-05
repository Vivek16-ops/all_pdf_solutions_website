import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';
import PptxGenJS from 'pptxgenjs';
import fs from 'fs';
import path from 'path';
import os from 'os';

interface ConversionResponse {
    success: boolean;
    message: string;
    file?: string;
    previewData?: any;
}

interface PDFSlide {
    title: string;
    content: string[];
    images?: any[];
}

// Helper function to extract content from PDF for PowerPoint slides
function extractSlidesFromPDF(pdfData: any): PDFSlide[] {
    const slides: PDFSlide[] = [];
    
    if (!pdfData || !pdfData.Pages) {
        return slides;
    }
    
    // Process each page as a potential slide
    pdfData.Pages.forEach((page: any, pageIndex: number) => {
        const slide: PDFSlide = {
            title: `Slide ${pageIndex + 1}`,
            content: [],
            images: []
        };
        
        if (!page.Texts) {
            slides.push(slide);
            return;
        }
        
        // Extract text content from the page
        const textContent: string[] = [];
        let potentialTitle = '';
        
        // Group texts by Y position to understand layout
        const textsByRow = new Map<number, any[]>();
        
        page.Texts.forEach((text: any) => {
            if (text.R && text.R.length > 0) {
                const yPosition = Math.round(text.y * 10) / 10;
                
                if (!textsByRow.has(yPosition)) {
                    textsByRow.set(yPosition, []);
                }
                
                let textString = '';
                text.R.forEach((run: any) => {
                    if (run.T) {
                        textString += decodeURIComponent(run.T);
                    }
                });
                
                if (textString.trim()) {
                    textsByRow.get(yPosition)?.push({
                        x: text.x,
                        text: textString.trim(),
                        fontSize: text.R[0]?.TS?.[1] || 12 // Font size for determining title
                    });
                }
            }
        });
        
        // Sort by Y position (top to bottom)
        const sortedRows = Array.from(textsByRow.keys()).sort((a, b) => a - b);
        
        let titleFound = false;
        sortedRows.forEach((yPos, rowIndex) => {
            const rowTexts = textsByRow.get(yPos) || [];
            
            // Sort by X position (left to right)
            rowTexts.sort((a, b) => a.x - b.x);
            
            // Combine texts in the same row
            const rowText = rowTexts.map(item => item.text).join(' ').trim();
            
            if (rowText) {
                // First significant text or largest font might be title
                if (!titleFound && (rowIndex === 0 || (rowTexts[0]?.fontSize > 14))) {
                    slide.title = rowText.length > 50 ? rowText.substring(0, 50) + '...' : rowText;
                    titleFound = true;
                } else {
                    // Add as content, breaking long lines into bullet points
                    if (rowText.length > 80) {
                        // Split long sentences into smaller points
                        const sentences = rowText.split(/[.!?]+/).filter(s => s.trim().length > 0);
                        sentences.forEach(sentence => {
                            if (sentence.trim().length > 0) {
                                slide.content.push('• ' + sentence.trim());
                            }
                        });
                    } else {
                        slide.content.push('• ' + rowText);
                    }
                }
            }
        });
        
        // If no title was found, use a default
        if (!titleFound || slide.title === `Slide ${pageIndex + 1}`) {
            slide.title = `Page ${pageIndex + 1}`;
        }
        
        // Limit content to reasonable amount per slide
        if (slide.content.length > 8) {
            slide.content = slide.content.slice(0, 8);
            slide.content.push('• ... [Content truncated for better presentation]');
        }
        
        slides.push(slide);
    });
    
    return slides;
}

// Function to create PowerPoint-like content structure
function createPowerPointContent(slides: PDFSlide[]): any {
    const presentation = {
        title: "Converted from PDF",
        slides: slides.map((slide, index) => ({
            slideNumber: index + 1,
            title: slide.title,
            content: slide.content,
            layout: "titleAndContent",
            notes: `Slide ${index + 1} converted from PDF`
        })),
        metadata: {
            author: "PDF to PPT Converter",
            createdDate: new Date().toISOString(),
            totalSlides: slides.length
        }
    };
    
    return presentation;
}

// Function to generate actual PPTX file
async function generatePPTXFile(slides: PDFSlide[], originalFileName: string): Promise<Buffer> {
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.author = 'PDF to PPT Converter';
    pptx.company = 'PDF Merger Tool';
    pptx.title = 'Converted from PDF';
    pptx.subject = `PowerPoint presentation converted from ${originalFileName}`;
    
    // Create title slide
    const titleSlide = pptx.addSlide();
    titleSlide.addText('Converted from PDF', {
        x: 1,
        y: 2,
        w: 8,
        h: 1.5,
        fontSize: 32,
        bold: true,
        align: 'center',
        color: '2F5496'
    });
    
    titleSlide.addText(`Original file: ${originalFileName}`, {
        x: 1,
        y: 4,
        w: 8,
        h: 1,
        fontSize: 16,
        align: 'center',
        color: '666666'
    });
    
    titleSlide.addText(`Generated on: ${new Date().toLocaleDateString()}`, {
        x: 1,
        y: 5,
        w: 8,
        h: 1,
        fontSize: 14,
        align: 'center',
        color: '666666'
    });
    
    // Add content slides
    slides.forEach((slideData, index) => {
        const slide = pptx.addSlide();
        
        // Add slide title
        slide.addText(slideData.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 1,
            fontSize: 24,
            bold: true,
            color: '2F5496'
        });
        
        // Add content as bullet points
        if (slideData.content.length > 0) {
            const contentText = slideData.content.map(item => 
                item.startsWith('•') ? item : `• ${item}`
            ).join('\n');
            
            slide.addText(contentText, {
                x: 0.5,
                y: 1.8,
                w: 9,
                h: 5.5,
                fontSize: 14,
                valign: 'top',
                bullet: { type: 'bullet' },
                color: '333333',
                lineSpacing: 24
            });
        }
        
        // Add slide number
        slide.addText(`${index + 1}`, {
            x: 9.5,
            y: 7,
            w: 0.5,
            h: 0.3,
            fontSize: 10,
            align: 'center',
            color: '999999'
        });
    });
    
    // Generate and return the PPTX buffer
    const pptxBuffer = await pptx.write({ outputType: 'nodebuffer' }) as Buffer;
    return pptxBuffer;
}

// POST method - handles PDF to PowerPoint conversion
export async function POST(request: NextRequest) {
  try {
        // Get the file from the request
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            const response: ConversionResponse = {
                success: false,
                message: "No file provided"
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Check if it's a PDF file
        if (!file.type.includes('pdf')) {
            const response: ConversionResponse = {
                success: false,
                message: "Invalid file type. Please upload a PDF file"
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Convert file to buffer
        const buffer = await file.arrayBuffer();
        const pdfBuffer = Buffer.from(buffer);

        // Parse PDF using pdf2json
        const pdfParser = new PDFParser();
        
        // Parse PDF from buffer
        const parsedData = await new Promise<any>((resolve, reject) => {
            pdfParser.on('pdfParser_dataError', (errData: any) => {
                reject(new Error(`PDF parsing error: ${errData.parserError}`));
            });
            
            pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
                try {
                    resolve(pdfData);
                } catch (parseError) {
                    reject(new Error(`Error processing PDF data: ${parseError}`));
                }
            });
            
            // Parse the PDF buffer
            pdfParser.parseBuffer(pdfBuffer);
        });        // Extract slides from PDF
        const slides = extractSlidesFromPDF(parsedData);
        
        if (slides.length === 0) {
            const response: ConversionResponse = {
                success: false,
                message: "No content could be extracted from the PDF"
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Generate actual PPTX file
        const pptxBuffer = await generatePPTXFile(slides, file.name);
        
        // Create temporary file path
        const tempDir = os.tmpdir();
        const tempFileName = `converted_${Date.now()}_${file.name.replace('.pdf', '.pptx')}`;
        const tempFilePath = path.join(tempDir, tempFileName);
        
        // Write PPTX buffer to temporary file
        fs.writeFileSync(tempFilePath, pptxBuffer);
        
        // Create PowerPoint content structure for preview
        const pptContent = createPowerPointContent(slides);
        
        // Encode the PPTX file as base64 for download
        const base64File = pptxBuffer.toString('base64');
        
        const response: ConversionResponse = {
            success: true,
            message: `PDF successfully converted to PowerPoint with ${slides.length} slides`,
            file: base64File,
            previewData: {
                totalSlides: slides.length,
                fileName: file.name.replace('.pdf', '.pptx'),
                fileSize: pptxBuffer.length,
                slides: slides.slice(0, 3).map(slide => ({
                    title: slide.title,
                    contentPreview: slide.content.slice(0, 3)
                }))
            }
        };

        // Clean up temporary file after a delay
        setTimeout(() => {
            try {
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
            } catch (cleanupError) {
                console.warn('Could not clean up temporary file:', cleanupError);
            }
        }, 30000); // Clean up after 30 seconds

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error('PDF to PPT conversion error:', error);
        const response: ConversionResponse = {
            success: false,
            message: error instanceof Error ? error.message : "Error converting PDF to PowerPoint"
        };
        return NextResponse.json(response, { status: 500 });
    }
}