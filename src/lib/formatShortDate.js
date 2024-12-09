export const formatShortDate = (dateString) => {
  const date = new Date(dateString);

  // Format the date to "Wed, Dec 25"
  const options = { weekday: "short", month: "short", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
};
