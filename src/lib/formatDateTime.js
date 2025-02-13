export default function formatDateTime(datetime) {
  if (!datetime) return { date: "", time: "" };

  const [date, time] = datetime.split(" ");
  return { date, time };
}
