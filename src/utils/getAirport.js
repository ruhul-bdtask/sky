export const getAirport = (airportsData, srtCode) => {
  const airport = airportsData.find((airport) => airport?.value === srtCode);
  return airport ? airport.name : "Unknown Airport";
};
