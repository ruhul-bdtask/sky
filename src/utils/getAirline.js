export const getAirline = (airlinesData, srtCode) => {
  const airline = airlinesData?.find((airline) => airline?.iata === srtCode);
  return airline ? airline.name : "Unknown Airline";
};
