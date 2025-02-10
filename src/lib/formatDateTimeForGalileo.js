export const formatDateTimeForGalileo = (dateString) => {
  const date = new Date(dateString);
  const options = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};
// Input: 2025-02-08T09:35:00.000+06:00
// Output: Sat, 8 Feb, 2025
