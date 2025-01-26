export const formatLongDataToShort = (journeyDate) => {
  const date = new Date(journeyDate);

  if (!date) {
    return "Pick a date";
  }
  // Format: 2024-12-25T00:00:00
  const isoFormat = date?.toISOString().split("T")[0] + "T00:00:00";

  // Format: Wed12/25
  const day = date?.toLocaleDateString("en-US", { weekday: "short" });
  const month = String(date?.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(date?.getDate()).padStart(2, "0");
  const shortFormat = `${day} ${month}/${dayOfMonth}`;

  // Return the desired format
  return ` ${shortFormat}`; // Combine or use as needed
};
