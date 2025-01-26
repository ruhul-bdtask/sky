export const getUniqueAirports = (allFlights) => {
  const uniqueAirports = [];
  const airportsSet = new Set();
  allFlights?.forEach((flight) => {
    flight.schedules.forEach((schedule) => {
      // if (!airlineSet.has(schedule?.departure_airport)) {
      //   airlineSet.add(schedule?.departure_airport);
      //   uniqueAirports.push(schedule?.departure_airport);
      // } else if (!airlineSet.has(schedule?.arrival_airport)) {
      //   airlineSet.add(schedule?.arrival_airport);
      //   uniqueAirports.push(schedule?.arrival_airport);
      // }
      if (!airportsSet.has(schedule?.arrival_airport)) {
        airportsSet.add(schedule?.arrival_airport);
        uniqueAirports.push(schedule?.arrival_airport);
      }
    });
  });
  return uniqueAirports;
};
