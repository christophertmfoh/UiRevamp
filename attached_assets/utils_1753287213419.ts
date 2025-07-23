
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import mammoth from 'mammoth';

// Configure the PDF.js worker
// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;


export function deepCopy<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as T;
    }

    if (Array.isArray(obj)) {
        const arrCopy: any[] = [];
        for (let i = 0; i < obj.length; i++) {
            arrCopy[i] = deepCopy(obj[i]);
        }
        return arrCopy as T;
    }

    const objCopy: { [key: string]: any } = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            objCopy[key] = deepCopy(obj[key]);
        }
    }

    return objCopy as T;
}

export async function readFileContent(file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'txt') {
        return file.text();
    } else if (fileExtension === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    } else if (fileExtension === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const textPages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            textPages.push(pageText);
        }
        return textPages.join('\n\n');
    } else {
        throw new Error('Unsupported file type. Please upload .txt, .pdf, or .docx');
    }
}