export const unifyTimeFormat = (time) => {
  if (time?.includes("+") || time?.includes(":00")) {
    const isoTime = `1970-01-01T${time}`;
    const date = new Date(isoTime);
    return date?.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return time;
};
