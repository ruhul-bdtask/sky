export const getUniqueFlightsByAirlineName = (allFlights) => {
  if (!Array.isArray(allFlights)) return [];

  const uniqueFlights = [];
  const airlinesSet = new Set();

  allFlights.forEach((flight) => {
    if (!airlinesSet.has(flight.airline_name)) {
      airlinesSet.add(flight.airline_name); // Add the airline name to the Set
      uniqueFlights.push(flight); // Add the unique flight to the array
    }
  });

  return uniqueFlights;
};
