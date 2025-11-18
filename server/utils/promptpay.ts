import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

/**
 * Generate a PromptPay QR code as a data URL
 * @param phoneNumber - PromptPay phone number (e.g., '0812345678')
 * @param amount - Payment amount in Thai Baht
 * @returns QR code as a data URL string
 */
export async function generatePromptPayQR(
  phoneNumber: string,
  amount: number,
): Promise<string> {
  try {
    // Generate PromptPay payload
    const payload = generatePayload(phoneNumber, { amount });

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(payload);

    return qrCodeDataURL;
  } catch (error) {
    console.error("PromptPay QR generation error:", error);
    throw new Error("Failed to generate PromptPay QR code");
  }
}
