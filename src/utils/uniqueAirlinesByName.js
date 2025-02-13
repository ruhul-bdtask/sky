export const uniqueAirlinesByName = (allFlights) => {
  const uniqueFlights = [];
  const airlineSet = new Set();

  allFlights?.forEach((flight) => {
    if (!airlineSet.has(flight.airline_name)) {
      airlineSet.add(flight.airline_name); // Add the airline name to the Set
      uniqueFlights.push(flight); // Add the unique flight to the array
    }
  });

  return uniqueFlights;
};
