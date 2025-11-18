/**
 * Formatting utility functions for Thai locale
 */

/**
 * Format price with thousand separators (Thai format)
 * @param price - Price to format
 * @returns Formatted price string with 2 decimal places
 * @example formatPrice(1234.56) // "1,234.56"
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Format date to readable string (Thai format)
 * @param date - Date to format (Date object or string)
 * @returns Formatted date string with time
 * @example formatDate(new Date()) // "18 พ.ย. 2568, 14:30"
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format date to short format without time (Thai format)
 * @param date - Date to format (Date object or string)
 * @returns Formatted date string without time
 * @example formatDateShort(new Date()) // "18 พ.ย. 2568"
 */
export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format currency with Thai Baht symbol
 * @param amount - Amount to format
 * @param currency - Currency symbol (default: ฿)
 * @returns Formatted currency string
 * @example formatCurrency(1234.56) // "฿1,234.56"
 */
export const formatCurrency = (
  amount: number,
  currency: string = "฿",
): string => {
  return `${currency}${formatPrice(amount)}`;
};

/**
 * Format number with thousand separators (Thai format)
 * @param num - Number to format
 * @returns Formatted number string
 * @example formatNumber(1234567) // "1,234,567"
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString("th-TH");
};
