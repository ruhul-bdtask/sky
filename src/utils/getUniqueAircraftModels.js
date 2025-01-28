export const getUniqueAircraftModels = (allFlights) => {
  if (!Array.isArray(allFlights)) return [];

  const modelsSet = new Set();

  allFlights.forEach((flight) => {
    flight.schedules?.forEach((schedule) => {
      const equipment = schedule?.equipment;
      if (equipment) {
        modelsSet.add(equipment);
      }
    });
  });

  return [...modelsSet];
};
