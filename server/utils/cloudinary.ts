import { v2 as cloudinary } from "cloudinary";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image locally as fallback
 * @param base64Image - Base64 encoded image string
 * @returns Public URL of the uploaded image
 */
async function uploadImageLocally(base64Image: string): Promise<string> {
  try {
    // Extract base64 data and mime type
    const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    const base64Data = matches ? matches[2] : base64Image;
    const mimeType = matches ? matches[1] : "image/jpeg";

    // Determine file extension
    const ext = mimeType.split("/")[1] || "jpg";

    // Generate unique filename
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    // Create uploads directory in public folder
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Write file
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, base64Data, "base64");

    // Return public URL
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Local upload error:", error);
    throw new Error("Failed to upload image locally");
  }
}

/**
 * Upload a base64 image to Cloudinary with local fallback
 * @param base64Image - Base64 encoded image string (with or without data URI prefix)
 * @returns Secure URL of the uploaded image
 */
export async function uploadImage(base64Image: string): Promise<string> {
  // Check if Cloudinary is properly configured
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== "mock" &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  // Try Cloudinary first if configured
  if (isCloudinaryConfigured) {
    try {
      // Ensure the base64 string has the proper data URI format
      const imageData = base64Image.startsWith("data:")
        ? base64Image
        : `data:image/jpeg;base64,${base64Image}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(imageData, {
        folder: "ecommerce-products",
        resource_type: "image",
      });

      console.log("Image uploaded to Cloudinary successfully");
      return result.secure_url;
    } catch (error) {
      console.warn(
        "Cloudinary upload failed, falling back to local storage:",
        error,
      );
    }
  } else {
    console.log("Cloudinary not configured, using local storage");
  }

  // Fallback to local storage
  return await uploadImageLocally(base64Image);
}
