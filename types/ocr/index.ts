/**
 * OCR data types for extracted payment slip information
 */

export interface OCRData {
  amount?: string;
  date?: string;
  reference?: string;
  rawText: string;
}
