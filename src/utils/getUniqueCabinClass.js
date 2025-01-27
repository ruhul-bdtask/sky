export const getUniqueCabinClass = (allFlights) => {
  if (!Array.isArray(allFlights)) return [];

  const uniqueCabinClasses = new Set();

  allFlights.forEach((flight) => {
    const cabinClass = flight?.passenger_infos?.[0]?.cabin_class;
    if (cabinClass) {
      uniqueCabinClasses.add(cabinClass);
    }
  });

  return Array.from(uniqueCabinClasses); // Convert Set to Array and return
};
