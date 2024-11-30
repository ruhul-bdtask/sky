export const normalizeSeatClass = (seatClass) => {

  const seatClassMap = {
    Y: "Economy",
    C: "Business",
    F: "First",
    P: "Premium Economy",
    J: "Business",
    Economy: "Economy",
    Business: "Business",
    First: "First",
    "Premium Economy": "Premium Economy",
  };

  return seatClassMap[seatClass] || "Unknown Class";
};
