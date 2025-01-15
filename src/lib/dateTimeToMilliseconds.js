export const dateTimeToMilliseconds = (date, time) => {
  // Combine date and time into a single string
  const dateTimeString = `${date}T${time}:00`;

  // Convert to milliseconds
  const milliseconds = new Date(dateTimeString).getTime();

  return milliseconds;
};
