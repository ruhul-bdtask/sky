export const convertMinutesToHours = (minutes) => {
  const hours = Math.floor(minutes / 60); // Full hours
  const remainingMinutes = minutes % 60; // Remaining minutes
  return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
};


