export const formatMinutesToHours = (minutes) => {
  const days = Math.floor(minutes / 1440); // Full days (1440 minutes in a day)
  const remainingMinutesAfterDays = minutes % 1440; // Remaining minutes after extracting full days
  const hours = Math.floor(remainingMinutesAfterDays / 60); // Full hours
  const remainingMinutes = remainingMinutesAfterDays % 60; // Remaining minutes

  // Format output
  let result = "";
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  result += `${remainingMinutes}m`;

  return result;
};
