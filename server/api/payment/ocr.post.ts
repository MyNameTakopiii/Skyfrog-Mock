import { extractTextFromImage, parsePaymentSlip } from "../../utils/ocr";
import { handleBadRequestError, handleError } from "../../utils/errors";

/**
 * Process payment slip image using OCR
 * Extracts text and parses payment information
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { imageUrl } = body;

    // Validate input
    if (!imageUrl || typeof imageUrl !== "string") {
      handleBadRequestError("Image URL is required");
    }

    // Validate URL format (basic check)
    try {
      new URL(imageUrl);
    } catch {
      handleBadRequestError("Invalid image URL format");
    }

    // Extract text from image using Tesseract.js
    const extractedText = await extractTextFromImage(imageUrl);

    if (!extractedText || extractedText.trim().length === 0) {
      handleBadRequestError("No text could be extracted from the image");
    }

    // Parse payment slip data
    const ocrData = parsePaymentSlip(extractedText);

    // Return OCR data
    return {
      success: true,
      data: ocrData,
    };
  } catch (error) {
    console.error("OCR processing error:", error);
    handleError(error, "Failed to process payment slip image");
  }
});
