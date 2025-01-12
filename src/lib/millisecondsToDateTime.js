export const millisecondsToDateTime = (milliseconds) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const date = new Date(milliseconds); // Convert to Date object
  const day = days[date.getDay()]; // Get day of the week
  const hours = date.getHours().toString().padStart(2, "0"); // Format hours as two digits
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Format minutes as two digits

  return `${day} ${hours}:${minutes}`;
};
