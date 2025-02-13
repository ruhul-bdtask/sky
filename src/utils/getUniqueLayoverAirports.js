export const getUniqueLayoverAirports = (allFlights) => {
  if (!Array.isArray(allFlights)) return [];

  const layoverAirportsSet = new Set();

  for (const flight of allFlights) {
    const schedules = flight?.schedules?.slice(1); // Skip the first schedule
    if (!schedules) continue;

    for (const schedule of schedules) {
      if (schedule?.departure_airport) {
        layoverAirportsSet.add(schedule.departure_airport);
      }
    }
  }

  return [...layoverAirportsSet]; // Spread syntax to convert Set to Array
};
