import { uploadImageToDatabase } from "../../utils/uploads";
import { handleBadRequestError, handleError } from "../../utils/errors";

/**
 * Upload image to NeonDB
 * Accepts base64 encoded image and returns image access URL
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { image, fileName = "image" } = body;

    // Validate input
    if (!image || typeof image !== "string") {
      handleBadRequestError(
        "Image data is required and must be a base64 string",
      );
    }

    // Validate base64 format (basic check)
    if (!image.includes("base64") && !image.match(/^[A-Za-z0-9+/=]+$/)) {
      handleBadRequestError(
        "Invalid image format. Expected base64 encoded image",
      );
    }

    // Determine MIME type from data URI
    let mimeType = "image/jpeg"; // default
    if (image.startsWith("data:")) {
      const match = image.match(/^data:([^;]+)/);
      if (match) {
        mimeType = match[1];
      }
    }

    // Upload to database
    const { id, url } = await uploadImageToDatabase(image, fileName, mimeType);

    // Return image URL
    return {
      success: true,
      data: {
        imageUrl: url,
        uploadId: id,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Image upload error:", errorMessage, error);
    handleError(error, "Failed to upload image");
  }
});
