import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(base64Image: string): Promise<string> {
  try {
    // Check if credentials are configured
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Missing Cloudinary credentials", {
        cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
        api_key: !!process.env.CLOUDINARY_API_KEY,
        api_secret: !!process.env.CLOUDINARY_API_SECRET,
      });
      throw new Error("Cloudinary credentials are not configured");
    }

    // Ensure data URI format
    const dataUri = base64Image.startsWith("data:")
      ? base64Image
      : `data:image/jpeg;base64,${base64Image}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "ecommerce-products",
      resource_type: "image",
    });

    return result.secure_url;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Cloudinary upload failed:", errorMsg);
    throw err;
  }
}
