import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import PDFParser from 'pdf2json';

interface PDFText {
    R: Array<{ T: string }>;
    x: number;
    y: number;
    w?: number;
}

interface ProcessedText {
    x: number;
    text: string;
    width: number;
}

interface PDFPage {
    Texts?: PDFText[];
}

interface PDFData {
    Pages?: PDFPage[];
}

interface ConversionResponse {
    success: boolean;
    message: string;
    file?: string;
    previewData?: string[][];
    fullData?: string[][];
}

// Helper function to extract table structure from PDF data
function extractTableFromPDF(pdfData: PDFData): string[][] {
    const tableData: string[][] = [];
    
    if (!pdfData || !pdfData.Pages) {
        return tableData;
    }
      // Process each page
    pdfData.Pages.forEach((page: PDFPage) => {
        if (!page.Texts) return;
          // Group texts by Y position (rows) and sort by X position (columns)
        const textsByRow = new Map<number, ProcessedText[]>();
        
        page.Texts.forEach((text: PDFText) => {
            if (text.R && text.R.length > 0) {
                // Use more precise Y position grouping for better row detection
                const yPosition = Math.round(text.y * 10) / 10; // Round to 1 decimal place
                
                if (!textsByRow.has(yPosition)) {
                    textsByRow.set(yPosition, []);
                }
                
                // Extract the actual text content
                let textContent = '';                text.R.forEach((run: { T: string }) => {
                    if (run.T) {
                        textContent += decodeURIComponent(run.T);
                    }
                });
                  if (textContent.trim()) {
                    const processedText: ProcessedText = {
                        x: text.x,
                        text: textContent.trim(),
                        width: text.w || 0
                    };
                    textsByRow.get(yPosition)?.push(processedText);
                }
            }
        });
          // Merge rows that are very close to each other (same logical row)
        const mergedRows = new Map<number, ProcessedText[]>();
        const sortedYPositions = Array.from(textsByRow.keys()).sort((a, b) => a - b);
        
        let currentRowGroup = sortedYPositions[0];
        mergedRows.set(currentRowGroup, textsByRow.get(currentRowGroup) || []);
        
        for (let i = 1; i < sortedYPositions.length; i++) {
            const currentY = sortedYPositions[i];
            const prevY = sortedYPositions[i - 1];
            
            // If Y positions are very close (within 0.3 units), merge them
            if (Math.abs(currentY - prevY) <= 0.3) {
                const existingTexts = mergedRows.get(currentRowGroup) || [];
                const newTexts = textsByRow.get(currentY) || [];
                mergedRows.set(currentRowGroup, [...existingTexts, ...newTexts]);
            } else {
                currentRowGroup = currentY;
                mergedRows.set(currentRowGroup, textsByRow.get(currentY) || []);
            }
        }
        
        // Convert to rows and columns
        const sortedMergedRows = Array.from(mergedRows.keys()).sort((a, b) => a - b);
        
        sortedMergedRows.forEach(yPos => {
            const rowTexts = mergedRows.get(yPos) || [];
            
            // Sort by X position to maintain column order
            rowTexts.sort((a, b) => a.x - b.x);
            
            if (rowTexts.length === 0) return;
            
            // Detect column boundaries by analyzing X positions
            const xPositions = rowTexts.map(item => item.x).sort((a, b) => a - b);
            const columnBoundaries: number[] = [xPositions[0]];
            
            // Find significant gaps between X positions to determine column boundaries
            for (let i = 1; i < xPositions.length; i++) {
                const gap = xPositions[i] - xPositions[i - 1];
                if (gap > 0.5) { // Significant gap indicates new column
                    columnBoundaries.push(xPositions[i]);
                }
            }
            
            // Group texts into columns based on boundaries
            const columns: string[] = new Array(columnBoundaries.length).fill('');
            
            rowTexts.forEach(item => {
                // Find which column this text belongs to
                let columnIndex = 0;
                for (let i = columnBoundaries.length - 1; i >= 0; i--) {
                    if (item.x >= columnBoundaries[i] - 0.1) {
                        columnIndex = i;
                        break;
                    }
                }
                
                // Add text to the appropriate column
                if (columns[columnIndex]) {
                    columns[columnIndex] += ' ' + item.text;
                } else {
                    columns[columnIndex] = item.text;
                }
            });
            
            // Clean up columns
            const cleanedColumns = columns.map(col => col.trim()).filter(col => col.length > 0);
            
            // Only add rows that have content
            if (cleanedColumns.length > 0) {
                // Ensure consistent number of columns
                const maxColumns = Math.max(tableData.length > 0 ? tableData[0].length : 0, cleanedColumns.length, 2);
                while (cleanedColumns.length < maxColumns) {
                    cleanedColumns.push('');
                }
                tableData.push(cleanedColumns);
            }
        });
    });
    
    // Post-process: ensure all rows have the same number of columns
    if (tableData.length > 0) {
        const maxColumns = Math.max(...tableData.map(row => row.length));
        tableData.forEach(row => {
            while (row.length < maxColumns) {
                row.push('');
            }
        });
    }
    
    return tableData;
}

// Fallback function to extract simple text
function extractSimpleText(pdfData: PDFData): string {
    let fullText = '';
    
    if (pdfData && pdfData.Pages) {
        pdfData.Pages.forEach((page: PDFPage) => {
            if (page.Texts) {
                page.Texts.forEach((text: PDFText) => {
                    if (text.R) {
                        text.R.forEach((run: { T: string }) => {
                            if (run.T) {
                                fullText += decodeURIComponent(run.T) + ' ';
                            }
                        });
                    }
                });
                fullText += '\n';
            }
        });
    }
    
    return fullText.trim();
}

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
        }        // Convert file to buffer
        const buffer = await file.arrayBuffer();
        const pdfBuffer = Buffer.from(buffer);
        
        // Create a new Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PDF Data');
        
        // Declare tableData in the outer scope so it's accessible after the try block
        let tableData: string[][] = [];
        try {
            // Parse PDF using pdf2json
            const pdfParser = new PDFParser();            // Parse PDF from buffer
            const parsedData = await new Promise<PDFData>((resolve, reject) => {
                pdfParser.on('pdfParser_dataError', (errData: { parserError: string }) => {
                    reject(new Error(`PDF parsing error: ${errData.parserError}`));
                });
                
                pdfParser.on('pdfParser_dataReady', (pdfData: PDFData) => {
                    try {
                        resolve(pdfData);
                    } catch (parseError) {
                        reject(new Error(`Error processing PDF data: ${parseError}`));
                    }
                });
                
                // Parse the PDF buffer
                pdfParser.parseBuffer(pdfBuffer);
            });// Process PDF data to extract table structure
            tableData = extractTableFromPDF(parsedData);
            
            if (tableData.length > 0) {
                // Add table data to worksheet
                tableData.forEach((row, index) => {
                    worksheet.addRow(row);
                    
                    // Style the header row if it's the first row
                    if (index === 0) {
                        const headerRow = worksheet.getRow(index + 1);
                        headerRow.font = { bold: true };
                        headerRow.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFE6E6FA' } // Light purple background
                        };
                    }
                });
            } else {
                // Fallback: extract as simple text if no table structure detected
                const fallbackText = extractSimpleText(parsedData);
                const rows = fallbackText.split('\n')
                    .map((line: string) => line.trim())
                    .filter((line: string) => line.length > 0);
                
                worksheet.addRow(['Content']);
                rows.forEach((row: string) => {
                    worksheet.addRow([row]);
                });
            }            // Auto-fit columns
            worksheet.columns.forEach((column: Partial<ExcelJS.Column>, index: number) => {
                const columnLetter = String.fromCharCode(65 + index); // A, B, C, etc.
                const maxLength = Math.max(
                    ...worksheet.getColumn(columnLetter).values
                        .map((value: ExcelJS.CellValue) => value ? value.toString().length : 0)
                        .filter((length: number) => length > 0),
                    10 // minimum width
                );
                column.width = Math.min(maxLength + 2, 50); // Cap at 50 characters
            });
            
        } catch (pdfError) {
            throw pdfError;
        }        // Generate Excel file
        const excelBuffer = await workbook.xlsx.writeBuffer();

        // Convert buffer to base64
        const base64 = Buffer.from(excelBuffer).toString('base64');        // Prepare preview data (first 5 rows for display) and full data
        const previewData = tableData.length > 0 ? tableData.slice(0, 5) : [['No data found']];
        const fullData = tableData.length > 0 ? tableData : [['No data found']];

        // Return success response with the file, preview data, and full data
        const response: ConversionResponse = {
            success: true,
            message: "PDF successfully converted to Excel",
            file: base64,
            previewData: previewData,
            fullData: fullData
        };

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error('Conversion error:', error);
        const response: ConversionResponse = {
            success: false,
            message: error instanceof Error ? error.message : "Error converting PDF to Excel"
        }; return NextResponse.json(response, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: "PDF to Excel conversion API is ready",
        endpoint: "/api/convert/pdf-to-excel",
        method: "POST",
        accepts: "multipart/form-data with 'file' field containing PDF"
    });
}