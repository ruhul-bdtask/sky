export const getChangingCity = (airportsData, srtCode) => {
  const airport = airportsData.find((airport) => airport?.value === srtCode);
  return airport ? airport.label : "Unknown City";
};
