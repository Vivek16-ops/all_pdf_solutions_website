import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length < 2) {
      return NextResponse.json({
        success: false,
        message: 'Please provide at least 2 PDF files to merge',
      }, { status: 400 });
    }

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();

    // Process each file
    for (const file of files) {
      if (!(file instanceof Blob)) {
        continue;
      }

      try {
        // Convert file to ArrayBuffer
        const pdfBuffer = await file.arrayBuffer();
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        // Get all pages
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        // Add each page to the merged document
        pages.forEach((page) => mergedPdf.addPage(page));
      } catch (error) {
        console.error('Error processing PDF:', error);
        return NextResponse.json({
          success: false,
          message: 'Error processing PDF file. Please ensure all files are valid PDFs.',
        }, { status: 400 });
      }
    }

    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();

    // Convert to base64
    const base64String = Buffer.from(mergedPdfBytes).toString('base64');

    return NextResponse.json({
      success: true,
      message: 'PDFs merged successfully',
      file: base64String
    });

  } catch (error) {
    console.error('Error merging PDFs:', error);
    return NextResponse.json({
      success: false,
      message: 'Error merging PDFs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
