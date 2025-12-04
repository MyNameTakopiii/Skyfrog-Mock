import { getUploadData } from "../../utils/uploads";
import { handleNotFoundError, handleError } from "../../utils/errors";

/**
 * Get uploaded image from NeonDB
 * Returns the image as binary data with correct MIME type
 */
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id || isNaN(parseInt(id))) {
      handleNotFoundError("Invalid upload ID");
    }

    const uploadRecord = await getUploadData(parseInt(id));

    if (!uploadRecord) {
      handleNotFoundError("Upload not found");
    }

    // Set correct headers for image serving
    setHeader(event, "Content-Type", uploadRecord.mimeType);
    setHeader(event, "Cache-Control", "public, max-age=31536000");

    // Convert base64 to binary buffer
    const binaryData = Buffer.from(uploadRecord.data, "base64");

    return binaryData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Upload retrieval error:", errorMessage);
    handleError(error, "Failed to retrieve upload");
  }
});
