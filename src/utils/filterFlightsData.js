import { dateTimeToMilliseconds } from "@/lib/dateTimeToMilliseconds";

export const filterFlightsData = (sortFlights, filterOptions = {}) => {
  console.log("filtering...");
  // const {
  //   stops = [],
  //   airlines = [],
  //   layoverAirports = [],
  //   aircraftModels = [],
  //   cabinClasses = [],
  //   takeOffRange = [0, 100],
  //   landingRange = [0, 100],
  //   legRange = [0, 100],
  //   layoverRange = [0, 100],
  //   priceRange = [0, 100],
  // } = filterOptions;

  const stopMapping = {
    Nonstop: 0,
    "1 stop": 1,
    "2+ stops": Infinity, // Represents 2 or more stops
  };

  // Map the stop labels from filterOptions to their corresponding stop counts
  const stopCountsToFilter = filterOptions.stops.map(
    (stop) => stopMapping[stop]
  );

  // Check if the airline filter is applied
  const airlinesToFilter = filterOptions.airlines;

  //TODO: uncomment below lines if airports filter needed further
  // Check if the airport filter is applied
  // const airportsToFilter = filterOptions.airports?.length
  //   ? filterOptions.airports
  //   : null;

  // Check if the layover airport filter is applied
  const layoverAirportsToFilter = filterOptions.layoverAirports;

  // Check if the airlines model filter is applied
  const airlinesModelToFilter = filterOptions.aircraftModels;

  // Check if the airlines model filter is applied
  const cabinClassToFilter = filterOptions.cabinClasses;

  // Filter the flights based on the conditions
  return sortFlights.filter((flight) => {
    // const matchesStopCount = !stopCountsToFilter || stopCountsToFilter.includes(flight.total_stop);
    const matchesStopCount = stopCountsToFilter.some((stopCount) =>
      stopCount === Infinity
        ? flight.total_stop >= 2
        : flight.total_stop === stopCount
    );

    // if matches airlines
    const matchesAirline = airlinesToFilter.includes(flight.airline_name);

    // const matchesAirport =
    //   !airportsToFilter ||
    //   flight.schedules.some((schedule) =>
    //     airportsToFilter.includes(schedule.arrival_airport)
    //   );

    const matchesLayoverAirports =
      !layoverAirportsToFilter.length || // Allow all if the array is empty
      flight.schedules.some((schedule) =>
        layoverAirportsToFilter.includes(schedule.departure_airport)
      );

    const matchesAirlinesModel = flight.schedules.some((schedule) =>
      airlinesModelToFilter.includes(schedule.equipment)
    );

    const matchesCabinClass = cabinClassToFilter.includes(
      flight.passenger_infos?.[0]?.cabin_class
    );

    // if matches take off times
    const matchesTakeOffRange =
      filterOptions.takeOffRange[0] === 0 &&
      filterOptions.takeOffRange[1] === 100
        ? true // If range is [0, 0], include all flights
        : flight.schedules.some((schedule) => {
            const departureTime = dateTimeToMilliseconds(
              schedule.departure_date,
              schedule.departure_time
            );

            // Extract start and end range from filterOptions
            const [takeOffStart, takeOffEnd] = filterOptions.takeOffRange;

            // Check if departureTime is within the range
            return departureTime >= takeOffStart && departureTime <= takeOffEnd;
          });

    // if matches landing times
    const matchesLandingRange =
      filterOptions.landingRange[0] === 0 &&
      filterOptions.landingRange[1] === 100
        ? true // If range is [0, 0], include all flights
        : flight.schedules.some((schedule) => {
            const arrivalTime = dateTimeToMilliseconds(
              schedule.arrival_date,
              schedule.arrival_time
            );
            // Extract start and end range from filterOptions
            const [landingStart, landingEnd] = filterOptions.landingRange;

            // Check if arrivalTime is within the range
            return arrivalTime >= landingStart && arrivalTime <= landingEnd;
          });

    // if matches flight's durations
    const [legDurationStart, legDurationEnd] = filterOptions.legRange;
    const legDuration = flight.itinerary_leg_descs?.[0]?.duration;
    const matchesLagDuration =
      filterOptions.legRange[0] === 0 && filterOptions.legRange[1] === 100
        ? true
        : legDuration >= legDurationStart && legDuration <= legDurationEnd;

    // if matches flight's layover duration
    const [layoverDurationStart, layoverDurationEnd] =
      filterOptions.layoverRange;
    const layoverDuration = flight?.schedules?.reduce(
      (total, leg) => total + Number(leg.layover_time),
      0
    );

    const matchesLayoverDuration =
      filterOptions.layoverRange[0] === 0 &&
      filterOptions.layoverRange[1] === 100
        ? true
        : layoverDuration >= layoverDurationStart &&
          layoverDuration <= layoverDurationEnd;

    // flight price range
    const [priceStart, priceEnd] = filterOptions.priceRange;
    const totalPrice = flight.fare_details?.total_fare;

    const matchesPrice =
      filterOptions.priceRange[0] === 0 && filterOptions.priceRange[1] === 100
        ? true
        : totalPrice >= priceStart && totalPrice <= priceEnd;

    return (
      matchesStopCount &&
      matchesAirline &&
      // matchesAirport &&
      matchesTakeOffRange &&
      matchesLandingRange &&
      matchesLagDuration &&
      matchesLayoverDuration &&
      matchesPrice &&
      matchesLayoverAirports &&
      matchesAirlinesModel &&
      matchesCabinClass
    );
  });
};
