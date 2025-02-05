export const formatDateForTicketCopy = (dateStr) => {
  const date = new Date(dateStr);
  return date
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, " ");
};

// Example usage
//  2024-09-14 - Sun, 14 Sep, 2024
