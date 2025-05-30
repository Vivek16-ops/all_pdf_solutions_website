import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

// Dynamic imports for pdfmake to work in Next.js environment
let pdfMakeModule: any = null;

export async function initializePdfMake() {
  if (!pdfMakeModule) {
    try {
      const pdfMake = await import('pdfmake/build/pdfmake');
      const pdfFonts = await import('pdfmake/build/vfs_fonts');

      const realPdfMake = pdfMake.default || pdfMake;
      const realPdfFonts = pdfFonts.default || pdfFonts;

      // ✅ Fix: Assign the correct vfs
      realPdfMake.vfs = realPdfFonts.vfs;

      pdfMakeModule = realPdfMake;
    } catch (error) {
      console.error('Error initializing pdfMake:', error);
      throw new Error('Failed to initialize PDF generator');
    }
  }

  return pdfMakeModule;
}


interface ExcelCell {
  value: string;
  style?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export async function POST(req: NextRequest) {
  console.log('Starting conversion request...');
  try {
    // Initialize pdfMake first
    console.log('Initializing PDF generator...');
    const pdfMake = await initializePdfMake();
    
    // Get the file from form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      console.log('No valid file provided');
      return NextResponse.json(
        { success: false, message: 'No valid file provided' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const fileName = file instanceof File ? file.name : 'unknown';
    if (!fileName.match(/\.(xlsx?|csv)$/i)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Please upload an Excel file.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    try {      // Process Excel file
      console.log('Reading Excel file...');
      const arrayBuffer = await file.arrayBuffer();
      
      // Create a new workbook
      const workbook = new ExcelJS.Workbook();
      
      try {
        // Try to load the Excel file
        await workbook.xlsx.load(arrayBuffer);
      } catch (loadError) {
        console.error('Error loading Excel file:', loadError);
        return NextResponse.json(
          { 
            success: false, 
            message: 'Invalid or corrupted Excel file. Please ensure the file is a valid Excel document.'
          },
          { status: 400 }
        );
      }

      // Get the first worksheet
      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) {
        return NextResponse.json(
          { success: false, message: 'No worksheet found in the Excel file' },
          { status: 400 }
        );
      }

      console.log('Processing worksheet data...');
      const tableData: ExcelCell[][] = [];
      let maxWidth = 0;

      // Process rows
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        const rowData: ExcelCell[] = [];
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          try {
            let value = '';
            const isHeader = rowNumber === 1;
            
            // Handle different cell types
            if (cell.value === null || cell.value === undefined) {
              value = '';
            } else if (cell.type === ExcelJS.ValueType.Date) {
              const date = cell.value instanceof Date ? cell.value : new Date(cell.value as any);
              value = date.toLocaleDateString();
            } else if (cell.type === ExcelJS.ValueType.Number) {
              value = cell.value.toString();
            } else if (cell.type === ExcelJS.ValueType.Formula) {
              value = cell.result?.toString() || '';
            } else if (typeof cell.value === 'object' && cell.value !== null) {
              if ('text' in cell.value) {
                value = (cell.value as { text: string }).text || '';
              } else if ('richText' in cell.value) {
                value = ((cell.value as { richText: Array<{ text: string }> }).richText || [])
                  .map(rt => rt.text)
                  .join('');
              }
            } else {
              value = cell.text || String(cell.value || '');
            }

            rowData.push({
              value: value.trim(),
              style: isHeader ? 'header' : undefined,
            });
          } catch (error) {
            console.error(`Error processing cell (${rowNumber}, ${colNumber}):`, error);
            rowData.push({ value: 'Error' });
          }
        });

        maxWidth = Math.max(maxWidth, rowData.length);
        tableData.push(rowData);
      });

      if (tableData.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Excel file is empty' },
          { status: 400 }
        );
      }

      // Normalize table data
      tableData.forEach(row => {
        while (row.length < maxWidth) {
          row.push({ value: '' });
        }
      });  
        console.log('Creating PDF document...');      // Create simple PDF document definition
      const docDefinition: TDocumentDefinitions = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [40, 40, 40, 40] as [number, number, number, number],
        content: [{
          table: {
            headerRows: 1,
            widths: Array(maxWidth).fill('*'),
            body: tableData.map(row => 
              row.map(cell => ({
                text: cell.value,
                ...(cell.style === 'header' ? {
                  alignment: 'center',
                  fillColor: '#F3F4F6'
                } : {
                  alignment: 'left'
                })
              }))
            )
          }
        }]
      };

      // Generate PDF with better error handling
      const pdfBase64 = await new Promise<string>((resolve, reject) => {
        try {
          console.log('Generating PDF...');
          const pdfDoc = pdfMake.createPdf(docDefinition);
          
          pdfDoc.getBase64((base64: string) => {
            console.log('PDF generated successfully');
            resolve(base64);
          });
        } catch (error) {
          console.error('Error in PDF generation:', error);
          reject(new Error('Failed to generate PDF'));
        }
      });

      return NextResponse.json({
        success: true,
        message: 'File successfully converted',
        pdf: pdfBase64
      });

    } catch (error) {
      console.error('Error processing Excel file:', error);
      let errorMessage = 'Error processing Excel file';
      if (error instanceof Error) {
        if (error.message.includes('central directory')) {
          errorMessage = 'Invalid Excel file format. Please ensure you are uploading a valid Excel file.';
        } else {
          errorMessage = error.message;
        }
      }
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error converting file'
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false
  }
};