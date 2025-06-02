declare module 'pdf2json' {
    interface PDFText {
        R: Array<{
            T: string;
            S: number;
            TS: [number, number, number, number];
        }>;
        x: number;
        y: number;
        w: number;
        clr?: number;
    }

    interface PDFPage {
        Texts: PDFText[];
        Width: number;
        Height: number;
    }

    interface PDFData {
        Pages: PDFPage[];
        Meta: any;
        Transcripts?: any[];
    }

    class PDFParser {
        constructor();
        parseBuffer(buffer: Buffer): void;
        on(event: 'pdfParser_dataReady', callback: (pdfData: PDFData) => void): void;
        on(event: 'pdfParser_dataError', callback: (error: any) => void): void;
    }

    export = PDFParser;
}
