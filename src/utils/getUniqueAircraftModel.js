export const getUniqueAircraftModel = (allFlights) => {
  const uniqueModels = [];
  const modelsSet = new Set();

  allFlights?.forEach((flight) => {
    flight.schedules.forEach((schedule) => {
      if (!modelsSet.has(schedule?.equipment)) {
        modelsSet.add(schedule?.equipment);
        uniqueModels.push(schedule?.equipment);
      }
    });
  });

  return uniqueModels;
};
