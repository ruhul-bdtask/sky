export const getUniqueCabinClass = (allFlights) => {
  const uniqueCabinClass = [];
  const cabinClassSet = new Set();

  allFlights?.forEach((flight) => {
    if (!cabinClassSet.has(flight?.passenger_infos?.[0]?.cabin_class)) {
      cabinClassSet.add(flight?.passenger_infos?.[0]?.cabin_class);
      uniqueCabinClass.push(flight?.passenger_infos?.[0]?.cabin_class);
    }
  });

  return uniqueCabinClass;
};
