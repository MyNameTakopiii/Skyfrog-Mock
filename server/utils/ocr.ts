import { createWorker } from "tesseract.js";
import type { OCRData } from "../../types";

/**
 * Extract text from an image using Tesseract.js OCR
 * Supports both English and Thai language recognition
 * @param imageUrl - URL or path to the image file
 * @returns Extracted text from the image
 */
export async function extractTextFromImage(imageUrl: string): Promise<string> {
  let worker;
  try {
    // Create Tesseract worker with English and Thai language support
    worker = await createWorker(["eng", "tha"]);

    // Recognize text from the image
    const {
      data: { text },
    } = await worker.recognize(imageUrl);

    return text;
  } catch (error) {
    console.error("OCR text extraction error:", error);
    throw new Error("Failed to extract text from image");
  } finally {
    // Always terminate the worker to free up resources
    if (worker) {
      await worker.terminate();
    }
  }
}

/**
 * Parse payment slip text to extract structured data
 * Extracts amount, date, and reference number from OCR text
 * @param text - Raw text extracted from payment slip
 * @returns Structured OCR data with extracted fields
 */
export function parsePaymentSlip(text: string): OCRData {
  try {
    // Initialize result object
    const result: OCRData = {
      rawText: text,
    };

    // Extract amount (matches patterns like 1,234.56 or 1234.56 or 1,234)
    const amountPatterns = [
      /(?:THB|฿|บาท)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i,
      /(?:amount|จำนวน|ยอดเงิน)[\s:]*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i,
      /(\d{1,3}(?:,\d{3})*\.\d{2})/,
    ];

    for (const pattern of amountPatterns) {
      const amountMatch = text.match(pattern);
      if (amountMatch) {
        result.amount = amountMatch[1] || amountMatch[0];
        break;
      }
    }

    // Extract date (matches patterns like DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY)
    const datePatterns = [
      /(\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4})/,
      /(\d{4}[/\-.]\d{1,2}[/\-.]\d{1,2})/,
      /(?:date|วันที่)[\s:]*(\d{1,2}[/\-.]\d{1,2}[/\-.]\d{4})/i,
    ];

    for (const pattern of datePatterns) {
      const dateMatch = text.match(pattern);
      if (dateMatch) {
        result.date = dateMatch[1] || dateMatch[0];
        break;
      }
    }

    // Extract reference number (matches patterns like REF: 123456, Ref No: 123456)
    const referencePatterns = [
      /(?:ref(?:erence)?|เลขที่อ้างอิง)[\s:]*([A-Z0-9-]+)/i,
      /(?:transaction|trans)[\s:]*([A-Z0-9-]+)/i,
      /(?:no|number)[\s:]*([A-Z0-9-]+)/i,
    ];

    for (const pattern of referencePatterns) {
      const refMatch = text.match(pattern);
      if (refMatch) {
        result.reference = refMatch[1];
        break;
      }
    }

    return result;
  } catch (error) {
    console.error("Payment slip parsing error:", error);
    // Return raw text even if parsing fails
    return {
      rawText: text,
    };
  }
}
