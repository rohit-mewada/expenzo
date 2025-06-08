/**
 * Format a date string to a human-readable format.
 * @param {string} dateString - Date string (e.g., "2025-06-01")
 * @returns {string} - Formatted date (e.g., "June 1, 2025")
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}