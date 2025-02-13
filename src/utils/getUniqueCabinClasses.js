export const getUniqueCabinClasses = (allFlights) => {
  if (!Array.isArray(allFlights)) return [];

  const uniqueCabinClasses = new Set();

  allFlights.forEach((flight) => {
    const cabinClasses = flight?.passenger_infos?.[0]?.cabin_class;
    if (cabinClasses) {
      uniqueCabinClasses.add(cabinClasses);
    }
  });

  return Array.from(uniqueCabinClasses); // Convert Set to Array and return
};
