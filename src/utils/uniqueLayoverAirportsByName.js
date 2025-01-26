export const uniqueLayoverAirportsByName = (allFlights) => {
  const uniqueLayoverAirports = [];
  const airlineSet = new Set();

  allFlights?.forEach((flight) => {
    if (flight.schedules.length > 0) {
      flight?.schedules
        ?.slice(1, flight?.schedules?.length)
        .forEach((schedule) => {
          if (!airlineSet.has(schedule?.departure_airport)) {
            airlineSet.add(schedule?.departure_airport);
            uniqueLayoverAirports.push(schedule?.departure_airport);
          }
        });
    }
  });
  return uniqueLayoverAirports;
};
