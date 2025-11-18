import { uploadImage } from "../../utils/cloudinary";
import { handleBadRequestError, handleError } from "../../utils/errors";

/**
 * Upload image to Cloudinary
 * Accepts base64 encoded image and returns secure URL
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { image } = body;

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

    // Upload to Cloudinary
    const imageUrl = await uploadImage(image);

    // Return secure URL
    return {
      success: true,
      data: {
        imageUrl,
      },
    };
  } catch (error) {
    console.error("Image upload error:", error);
    handleError(error, "Failed to upload image");
  }
});
