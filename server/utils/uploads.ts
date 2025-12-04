import { db } from "../db/index";
import { uploads } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Upload image to NeonDB
 * Stores the base64 encoded image data directly in the database
 */
export async function uploadImageToDatabase(
  base64Image: string,
  fileName: string,
  mimeType: string,
): Promise<{ id: number; url: string }> {
  try {
    // Remove data URI prefix if present
    let imageData = base64Image;
    if (base64Image.startsWith("data:")) {
      const parts = base64Image.split(",");
      imageData = parts[1] || base64Image;
    }

    // Calculate size (approximate)
    const size = Math.ceil((imageData.length * 3) / 4);

    // Insert into database
    const result = await db
      .insert(uploads)
      .values({
        fileName,
        mimeType,
        data: imageData,
        size,
      })
      .returning();

    if (!result || result.length === 0) {
      throw new Error("Failed to insert upload record");
    }

    const uploadRecord = result[0];

    // Generate URL for accessing the uploaded image
    const imageUrl = `/api/uploads/${uploadRecord.id}`;

    return {
      id: uploadRecord.id,
      url: imageUrl,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Database upload failed:", errorMsg);
    throw err;
  }
}

/**
 * Get upload data by ID
 */
export async function getUploadData(id: number) {
  try {
    const result = await db.select().from(uploads).where(eq(uploads.id, id));

    if (!result || result.length === 0) {
      return null;
    }

    return result[0];
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Failed to retrieve upload:", errorMsg);
    throw err;
  }
}
