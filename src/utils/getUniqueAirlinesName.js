export const getUniqueAirlinesName = (allFlights) => {
  if (!Array.isArray(allFlights)) return [];

  const airlinesSet = new Set();

  allFlights.forEach((flight) => {
    const airline = flight?.airline_name;
    if (airline) {
      airlinesSet.add(airline); // Add the airline name to the Set
    }
  });

  return [...airlinesSet];
};
