// Import necessary libraries
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // 1. Get the uploaded file from the form data
        const data = await req.formData();
        const file: File | null = data.get('file') as unknown as File;

        // 2. Check if a file was uploaded
        if (!file) {
            return NextResponse.json({
                success: false,
                message: 'No file uploaded.',
            });
        }

        // 3. Read the file into a buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 4. Convert the file buffer to a Base64 string
        const base64File = buffer.toString('base64');

        // 5. Return a success response with the file content
        return NextResponse.json({
            success: true,
            message: 'File processed successfully.',
            file: base64File,
        });    } catch (error: unknown) {
        console.error('Error processing file:', error);
        // Return a generic error response
        return NextResponse.json({
            success: false,
            message: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}