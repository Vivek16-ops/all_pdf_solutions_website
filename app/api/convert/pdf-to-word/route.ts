import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Use pdf2json instead of pdf-parse to avoid ENOENT errors
import PDFParser from 'pdf2json';

// Interface for extracted PDF content
interface ExtractedContent {
  text: string;
  pages: number;
  info?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

interface PDFTextRun {
  T: string;
}

interface PDFTextItem {
  R: PDFTextRun[];
}

interface PDFPage {
  Texts: PDFTextItem[];
}

interface PDFData {
  Pages: PDFPage[];
  Meta?: Record<string, unknown>;
}

/**
 * Extracts text content from PDF using pdf2json library
 * This is a Node.js-compatible solution that works reliably in server environments
 * @param pdfBuffer - Buffer containing the PDF data
 * @returns Promise<ExtractedContent> - Extracted text and metadata
 */
async function extractPdfContent(pdfBuffer: Buffer): Promise<ExtractedContent> {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF parser instance
      const pdfParser = new PDFParser();
        // Set up event handlers
      pdfParser.on('pdfParser_dataError', (errData: { parserError: string }) => {
        console.error('PDF Parser Error:', errData.parserError);
        reject(new Error('Failed to parse PDF: ' + errData.parserError));
      });
      
      pdfParser.on('pdfParser_dataReady', (pdfData: PDFData) => {
        try {
          // Extract text from all pages
          let extractedText = '';
          let pageCount = 0;
          
          if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
            pageCount = pdfData.Pages.length;
              pdfData.Pages.forEach((page: PDFPage) => {
              if (page.Texts && Array.isArray(page.Texts)) {
                page.Texts.forEach((textItem: PDFTextItem) => {
                  if (textItem.R && Array.isArray(textItem.R)) {
                    textItem.R.forEach((textRun: PDFTextRun) => {
                      if (textRun.T) {
                        // Decode the text and add it to the extracted text
                        const decodedText = decodeURIComponent(textRun.T);
                        extractedText += decodedText + ' ';
                      }
                    });
                  }
                });
                // Add line break after each page
                extractedText += '\n\n';
              }
            });
          }
          
          // Clean up the extracted text
          extractedText = extractedText
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n\s+\n/g, '\n\n') // Clean up paragraph breaks
            .trim();
          
          resolve({
            text: extractedText,
            pages: pageCount,
            info: pdfData.Meta || {},
            metadata: pdfData.Meta || {}
          });
        } catch (error) {
          console.error('Error processing PDF data:', error);
          reject(new Error('Failed to process extracted PDF data'));
        }
      });
      
      // Parse the PDF buffer
      pdfParser.parseBuffer(pdfBuffer);
      
    } catch (error) {
      console.error('Error initializing PDF parser:', error);
      reject(new Error('Failed to initialize PDF parser'));
    }
  });
}

/**
 * Creates a formatted Word document from extracted PDF text
 * @param extractedContent - Content extracted from the PDF
 * @param originalFilename - Original PDF filename for reference
 * @returns Promise<Buffer> - Word document buffer
 */
async function createWordDocument(extractedContent: ExtractedContent): Promise<Buffer> {
  // Preserve original text formatting by splitting on single line breaks
  const lines = extractedContent.text.split('\n');
    // Create document sections
  const documentSections: Paragraph[] = [];

  // Add extracted text preserving original formatting and alignment
  lines.forEach((line: string) => {
    // Preserve empty lines for spacing
    if (line.trim() === '') {
      documentSections.push(
        new Paragraph({
          children: [new TextRun({ text: '' })],
          spacing: { after: 120 }, // Minimal spacing for empty lines
        })
      );
      return;
    }

    // Detect if line appears to be a heading (all caps, short length, or specific patterns)
    const isHeading = line.length < 100 && (
      line === line.toUpperCase() || 
      /^[A-Z][A-Z\s]{2,}$/.test(line.trim()) ||
      /^\d+\.?\s/.test(line.trim()) // Numbered headings
    );

    // Detect indentation level from original text
    const leadingSpaces = line.length - line.trimStart().length;
    const indentLevel = Math.floor(leadingSpaces / 4) * 240; // Convert to twips    // Detect text alignment based on content positioning
    let alignment: 'left' | 'center' | 'right' = 'left';
    if (line.trim().length < 50 && leadingSpaces > 20) {
      alignment = 'center';
    } else if (leadingSpaces > 40) {
      alignment = 'right';
    }

    documentSections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: line.trim(),
            bold: isHeading,
            size: isHeading ? 26 : 24, // Slightly larger for headings
            color: '000000', // Keep original black text
          }),
        ],
        alignment: alignment,
        indent: {
          left: indentLevel,
        },
        spacing: {
          after: isHeading ? 240 : 120, // More spacing after headings
        },
      })
    );
  });
  // Create the Word document with minimal styling to preserve original formatting
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: {
            width: 8.5 * 914.4, // 8.5 inches in twips
            height: 11 * 914.4, // 11 inches in twips
          },
          margin: {
            top: 914.4, // 1 inch margins
            right: 914.4,
            bottom: 914.4,
            left: 914.4,
          },
        },
      },
      children: documentSections,
    }],
    styles: {
      default: {
        document: {
          run: {
            color: '000000', // Black text to match original
            size: 24, // 12pt font size
            font: 'Times New Roman', // Standard font
          },
          paragraph: {
            spacing: {
              line: 240, // Single line spacing
            },
          },
        },
      },
    },
  });

  // Generate and return the Word document buffer
  return await Packer.toBuffer(doc);
}

/**
 * API endpoint for converting PDF files to Word documents
 * Handles file upload, validation, content extraction, and Word generation
 */
export async function POST(request: NextRequest) {
  try {
    // Get the uploaded file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Validate file presence
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded"
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file type. Please upload a PDF file."
        },
        { status: 400 }
      );
    }

    // Validate file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "File size too large. Please upload a file smaller than 10MB."
        },
        { status: 400 }
      );
    }

    // Convert file to buffer for processing
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Extract text content from PDF
    const extractedContent = await extractPdfContent(fileBuffer);
    
    // Validate extracted content
    if (!extractedContent.text || extractedContent.text.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No text content found in the PDF file. The PDF might be image-based or encrypted."
        },
        { status: 400 }
      );
    }    // Create Word document from extracted content
    const wordBuffer = await createWordDocument(extractedContent);

    // Convert buffer to base64 for client download
    const base64Word = wordBuffer.toString('base64');    // Return success response with Word document and extraction details
    return NextResponse.json({
      success: true,
      message: "PDF successfully converted to Word document",
      file: base64Word,
      filename: `${file.name.replace('.pdf', '')}_converted.docx`,
      fileSize: wordBuffer.length,
      extractedText: extractedContent.text, // Add the extracted text for preview
      extractionDetails: {
        pagesProcessed: extractedContent.pages,
        totalTextLength: extractedContent.text.length,
        hasMetadata: !!extractedContent.metadata,
        pdfInfo: extractedContent.info || {}
      }
    });

  } catch (error) {
    console.error('Error in PDF to Word conversion:', error);
    
    // Return detailed error message for debugging
    return NextResponse.json(
      {
        success: false,
        message: "Failed to convert PDF to Word document",
        error: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}
