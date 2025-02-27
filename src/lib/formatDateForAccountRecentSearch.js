export const formatDateForAccountRecentSearch = (dateStr) => {
  if (!dateStr) return "Invalid Date"; // Handle empty or undefined input

  // Ensure UTC interpretation for ISO strings with "Z"
  const date = new Date(dateStr); // JavaScript handles ISO 8601 format natively

  // Check if the date is valid
  if (isNaN(date.getTime())) return "Invalid Date";

  return date
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, " ");
};

// console.log(formatDateForTicketCopy("2025-03-28T00:00:00"));
// 2025-03-25T18:00:00.000Z both
// // Output: "Fri, 28 Mar, 2025"
