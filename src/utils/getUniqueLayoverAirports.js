export const getUniqueLayoverAirports = (allFlights) => {
  const uniqueLayoverAirports = [];
  const layoverAirportsSet = new Set();

  allFlights?.forEach((flight) => {
    if (flight.schedules.length > 0) {
      flight?.schedules
        ?.slice(1, flight?.schedules?.length)
        .forEach((schedule) => {
          if (!layoverAirportsSet.has(schedule?.departure_airport)) {
            layoverAirportsSet.add(schedule?.departure_airport);
            uniqueLayoverAirports.push(schedule?.departure_airport);
          }
        });
    }
  });
  return uniqueLayoverAirports;
};
