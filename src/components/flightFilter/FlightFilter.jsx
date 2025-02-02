"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useAirlines } from "@/hooks/useAirlines";
import { useAirports } from "@/hooks/useAirports";

import { dateTimeToMilliseconds } from "@/lib/dateTimeToMilliseconds";
import { formatMinutesToHours } from "@/lib/formatMinutesToHours";
import { millisecondsToDateTime } from "@/lib/millisecondsToDateTime";
import { getAirport } from "@/utils/getAirport";
import { getChangingCity } from "@/utils/getChangingCity";
import { getUniqueAircraftModels } from "@/utils/getUniqueAircraftModels";
import { getUniqueAirlinesName } from "@/utils/getUniqueAirlinesName";
import { getUniqueCabinClasses } from "@/utils/getUniqueCabinClasses";
import { getUniqueFlightsByAirlineName } from "@/utils/getUniqueFlightsByAirlineName";
import { getUniqueLayoverAirports } from "@/utils/getUniqueLayoverAirports";
import { useEffect, useState } from "react";
import useAirlineStore from "../../../stores/airlineStore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import MultiRangeSlider from "../ui/multiRangeSlider";

export default function FlightFilter({ sortedFlights, allFlights, timer }) {
  const {
    filterOptions,
    setFilterOptions,
    filteredData,
    originQuery,
    searchData,
  } = useAirlineStore();
  // const filterOptions = useAirlineStore((state) => state.filterOptions);
  // const setFilterOptions = useAirlineStore((state) => state.setFilterOptions);
  // const filteredData = useAirlineStore((state) => state.filteredData);

  //load airports data from JSON
  const { airportsData, airportError, airportLoading } = useAirports();
  // load airlines data from JSON
  const { airlinesData, airlineError, airlineLoading } = useAirlines();

  const [isShowMoreAirlines, setIsShowMoreAirlines] = useState(false);

  const [localFilterOptions, setLocalFilterOptions] = useState({
    stops: [],
    takeOffRange: [0, 100],
    landingRange: [0, 100],
    airlines: [],
    airports: [],
    layoverAirports: [],
    aircraftModels: [],
    legRange: [0, 100],
    layoverRange: [0, 100],
    priceRange: [0, 100],
  });

  const [minTakeOff, setMinTakeOff] = useState(0);
  const [maxTakeOff, setMaxTakeOff] = useState(100);
  const [minLanding, setMinLanding] = useState(0);
  const [maxLanding, setMaxLanding] = useState(100);
  const [minLegDuration, setMinLegDuration] = useState(0);
  const [maxLegDuration, setMaxLegDuration] = useState(100);
  const [minLayoverDuration, setMinLayoverDuration] = useState(0);
  const [maxLayoverDuration, setMaxLayoverDuration] = useState(100);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);

  const { minutes, seconds } = timer;

  // stops change handler
  const handleStopChange = (value) => {
    const updatedStops = filterOptions.stops.includes(value)
      ? filterOptions.stops.filter((stop) => stop !== value)
      : [...filterOptions.stops, value];

    setFilterOptions({ ...filterOptions, stops: updatedStops });
  };

  // airlines add/remove toggler
  const handleAirlinesChange = (flight) => {
    const updatedAirlines = filterOptions.airlines.some(
      (airline) => airline === flight?.airline_name
    )
      ? filterOptions.airlines.filter(
          (airline) => airline !== flight?.airline_name
        )
      : [...filterOptions.airlines, flight?.airline_name];

    setFilterOptions({
      ...filterOptions,
      airlines: updatedAirlines,
    });
  };

  // // airports change handler
  // const handleAirportsChange = (airport) => {
  //   const updatedAirports = filterOptions.airports.some((ap) => ap === airport)
  //     ? filterOptions.airports.filter((air) => air !== airport)
  //     : [...filterOptions.airports, airport];

  //   setFilterOptions({ ...filterOptions, airports: updatedAirports });
  // };

  // layover airports change handler
  const handleLayoverAirportsChange = (airport) => {
    const updatedAirports = filterOptions.layoverAirports.some(
      (ap) => ap === airport
    )
      ? filterOptions.layoverAirports.filter((air) => air !== airport)
      : [...filterOptions.layoverAirports, airport];

    setFilterOptions({ ...filterOptions, layoverAirports: updatedAirports });
  };

  // airlines model change handler
  const handleAircraftModelChange = (model) => {
    const updatedAircraftModel = filterOptions.aircraftModels.some(
      (al) => al === model
    )
      ? filterOptions.aircraftModels.filter((mod) => mod !== model)
      : [...filterOptions.aircraftModels, model];

    setFilterOptions({
      ...filterOptions,
      aircraftModels: updatedAircraftModel,
    });
  };

  // airlines model change handler
  const handleCabinClassChange = (cabinClasses) => {
    const updatedCabinClass = filterOptions.cabinClasses.some(
      (cc) => cc === cabinClasses
    )
      ? filterOptions.cabinClasses.filter((cc) => cc !== cabinClasses)
      : [...filterOptions.cabinClasses, cabinClasses];
    setFilterOptions({ ...filterOptions, cabinClasses: updatedCabinClass });
  };

  // stops
  const stops = ["Nonstop", "1 stop", "2+ stops"];

  // unique flights by airline name
  const uniqueFlightsByAirlineName = getUniqueFlightsByAirlineName(allFlights);

  // // unique airports name list
  // const uniqueAirports = getUniqueAirports(allFlights);

  // unique airlines model list
  const uniqueCabinClasses = getUniqueCabinClasses(allFlights);

  // unique layover airports name list
  const uniqueLayoverAirports = getUniqueLayoverAirports(allFlights);

  // unique airlines model list
  const uniqueAircraftModels = getUniqueAircraftModels(allFlights);

  // unique airlines name list
  const uniqueAirlinesName = getUniqueAirlinesName(allFlights);

  // show and hide more airline lists
  const toggleMoreLessAirlines = () => {
    setIsShowMoreAirlines(!isShowMoreAirlines);
  };

  // slider changer handler
  const handleSliderChange = (key, newValues) => {
    const updatedLocalFilterOptions = {
      ...localFilterOptions,
      [key]: newValues,
    };
    setLocalFilterOptions(updatedLocalFilterOptions);

    //TODO: remove the below two lines if only filter flights handler released
    // const updatedFilterOptions = { ...filterOptions, [key]: newValues };
    // setFilterOptions(updatedFilterOptions);
  };

  // trigger the slider when slide handler released
  const handleSliderFinalChange = (key, newValues) => {
    const updatedFilterOptions = { ...filterOptions, [key]: newValues };
    setFilterOptions(updatedFilterOptions);
  };

  // select all airlines handler
  const handleSelectAllAirlines = () => {
    // unique airlines name list
    const updatedAirlines = uniqueFlightsByAirlineName.map(
      (airline) => airline.airline_name
    );
    setFilterOptions({
      ...filterOptions,
      airlines: updatedAirlines,
    });
  };

  // dis select all airlines
  const handleClearAllAirlines = () => {
    setFilterOptions({ ...filterOptions, airlines: [] });
  };

  // reset all stops to default
  const handleResetStops = () => {
    setFilterOptions({ stops: stops.map((stop) => stop) });
  };

  // reset all stops to default
  const handleResetCabinClasses = (e) => {
    e.stopPropagation();
    setFilterOptions({ cabinClasses: uniqueCabinClasses });
  };
  // reset all layover airports to default
  const handleResetLayoverAirports = (e) => {
    e.stopPropagation();
    setFilterOptions({ layoverAirports: uniqueLayoverAirports });
  };
  // reset all aircraft model to default
  const handleResetAircraftModels = (e) => {
    e.stopPropagation();
    setFilterOptions({ aircraftModels: uniqueAircraftModels });
  };

  // effect for set initial values for all the filter options
  useEffect(() => {
    if (!allFlights || allFlights.length === 0) return;

    // const takeOffTimestamps = allFlights.map((flight) =>
    //   dateTimeToMilliseconds(flight.departure_date, flight.departure_time)
    // );
    // const landingTimestamps = allFlights.map((flight) =>
    //   dateTimeToMilliseconds(flight.arrival_date, flight.arrival_time)
    // );
    // const legTimestamps = allFlights.map(
    //   (flight) => flight?.itinerary_leg_descs?.[0]?.duration
    // );

    // const layoverTimestamps = allFlights.flatMap(
    //   (flight) =>
    //     flight?.schedules?.reduce(
    //       (total, leg) => total + Number(leg.layover_time),
    //       0
    //     ) || [0]
    // );

    // const prices = allFlights.map((flight) => flight?.fare_details?.total_fare);

    let takeOffTimestamps = [],
      landingTimestamps = [],
      legTimestamps = [],
      layoverTimestamps = [],
      prices = [];

    allFlights.forEach((flight) => {
      takeOffTimestamps.push(
        dateTimeToMilliseconds(flight.departure_date, flight.departure_time)
      );
      landingTimestamps.push(
        dateTimeToMilliseconds(flight.arrival_date, flight.arrival_time)
      );
      legTimestamps.push(flight?.itinerary_leg_descs?.[0]?.duration || 0);
      layoverTimestamps.push(
        flight?.schedules?.reduce(
          (total, leg) => total + Number(leg.layover_time),
          0
        ) || 0
      );
      prices.push(flight?.fare_details?.total_fare || 0);
    });

    const initialMinTakeOff = Math.min(...takeOffTimestamps);
    const initialMaxTakeOff = Math.max(...takeOffTimestamps);

    const initialMinLanding = Math.min(...landingTimestamps);
    const initialMaxLanding = Math.max(...landingTimestamps);

    const initialMinLegDuration = Math.min(...legTimestamps);
    const initialMaxLegDuration = Math.max(...legTimestamps);

    const initialMinLayoverDuration = Math.min(...layoverTimestamps);
    const initialMaxLayoverDuration = Math.max(...layoverTimestamps);

    const initialMinPrice = Math.min(...prices);
    const initialMaxPrice = Math.max(...prices);

    setLocalFilterOptions({
      ...localFilterOptions,
      takeOffRange: [initialMinTakeOff, initialMaxTakeOff],
      landingRange: [initialMinLanding, initialMaxLanding],
      legRange: [initialMinLegDuration, initialMaxLegDuration],
      layoverRange: [initialMinLayoverDuration, initialMaxLayoverDuration],
      priceRange: [initialMinPrice, initialMaxPrice],
    });
    setMinTakeOff(initialMinTakeOff);
    setMaxTakeOff(initialMaxTakeOff);
    setMinLanding(initialMinLanding);
    setMaxLanding(initialMaxLanding);
    setMinLegDuration(initialMinLegDuration);
    setMaxLegDuration(initialMaxLegDuration);
    setMinLayoverDuration(initialMinLayoverDuration);
    setMaxLayoverDuration(initialMaxLayoverDuration);
    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);

    // all filter options checked by default
    setFilterOptions({
      ...filterOptions,
      stops: ["Nonstop", "1 stop", "2+ stops"],
      airlines: uniqueAirlinesName,
      cabinClasses: uniqueCabinClasses,
      layoverAirports: uniqueLayoverAirports,
      aircraftModels: uniqueAircraftModels,
    });
  }, []);

  return (
    <div>
      <div className="hidden w-[260px] h-[160px] bg-white rounded-lg border p-4 md:flex flex-col justify-between  ">
        {/* <div className="">
          <h2 className="text-lg font-semibold mb-1">Our Advice</h2>
          <div className="flex items-center mb-2">
            <span className="text-green-600 font-bold mr-2">Buy Now</span>
            <ArrowUpRight className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Countdown: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            Prices are unlikely to decrease within 7 days
            <span className="inline-block ml-1 text-gray-400">ⓘ</span>
          </p>
        </div> */}

        <div className="p-4 flex justify-center flex-col gap-1 items-center">
          <h2 className="text-xl font-bold text-gray-800">Time Left</h2>
          <div className=" text-3xl font-mono text-[#FC660F]">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <p className="text-[12px] text-center">
            Make sure to book before this time.
          </p>
        </div>

        {/* <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Track Price</span>
          <Switch />
        </div> */}
      </div>
      <div className="hidden md:block p-4 rounded-lg w-[260px]">
        <div className="pb-4">
          <span className="text-[14px] font-semibold mb-8">
            {filteredData?.length} of{" "}
          </span>
          <span className="text-[14px] text-[#137799]">
            {allFlights?.length} flights
          </span>
        </div>

        <section className="mb-6 border-t pt-4 ">
          <div className="text-[14px] font-semibold mb-4 flex justify-between">
            <span>Stops </span>
            {stops.length !== filterOptions.stops.length && (
              <button
                className="text-[#137799] font-semibold font-mono"
                onClick={handleResetStops}
              >
                Reset
              </button>
            )}
          </div>
          <div className="space-y-3">
            {stops.map((stop) => (
              <label key={stop} className="flex items-center">
                <Checkbox
                  value={stop}
                  onChange={handleStopChange}
                  checked={filterOptions.stops?.includes(stop)}
                  onCheckedChange={(checked) => handleStopChange(stop)}
                />
                <span className="text-[14px] ml-2 ">{stop} </span>
                <span className="ml-auto text-[#64717B] text-[14px]">
                  {/* Display corresponding price */}
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="mb-6 border-t pt-4">
          <p className="text-[14px] font-semibold mb-4">Times </p>
          <div className="space-y-4">
            <div>
              <div className="mb-4">
                <p className="mb-2 text-sm">
                  Take-off from {searchData?.origin}
                </p>
                <p className="text-xs ">
                  {millisecondsToDateTime(localFilterOptions.takeOffRange?.[0])}{" "}
                  -{" "}
                  {millisecondsToDateTime(localFilterOptions.takeOffRange?.[1])}
                </p>
              </div>
              <div>
                <MultiRangeSlider
                  min={minTakeOff}
                  max={minTakeOff !== maxTakeOff ? maxTakeOff : maxTakeOff + 1}
                  step={1000 * 60 * 5} // 5-minute intervals
                  values={localFilterOptions.takeOffRange}
                  onChange={(newValues) =>
                    handleSliderChange("takeOffRange", newValues)
                  }
                  onFinalChange={(newValues) =>
                    handleSliderFinalChange("takeOffRange", newValues)
                  }
                />
              </div>
            </div>
            <div className="pt-4">
              <div className="mb-4">
                <p className="mb-1 text-sm">
                  Landing at {searchData?.destination}
                </p>
                <p className="text-xs">
                  {millisecondsToDateTime(localFilterOptions.landingRange?.[0])}{" "}
                  -{" "}
                  {millisecondsToDateTime(localFilterOptions.landingRange?.[1])}
                </p>
              </div>
              <div>
                <MultiRangeSlider
                  min={minLanding}
                  max={minLanding !== maxLanding ? maxLanding : maxLanding + 1}
                  step={1000 * 60 * 5} // 5-minute intervals
                  values={localFilterOptions.landingRange}
                  onChange={(newValues) =>
                    handleSliderChange("landingRange", newValues)
                  }
                  onFinalChange={(newValues) =>
                    handleSliderFinalChange("landingRange", newValues)
                  }
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 border-t pt-4">
          <div className="flex justify-between">
            <p className="text-[14px] font-semibold mb-4">Airlines </p>
            <div>
              <button
                className="text-[#137799] font-semibold text-sm mr-4"
                onClick={handleSelectAllAirlines}
              >
                Select All
              </button>
              <button
                className="text-[#137799] font-semibold text-sm"
                onClick={handleClearAllAirlines}
              >
                Clear all
              </button>
            </div>
          </div>
          <div
            className={`space-y-3 overflow-hidden ${
              !isShowMoreAirlines && uniqueFlightsByAirlineName.length > 6
                ? "max-h-[185px]"
                : "max-h-fit"
            }`}
          >
            {uniqueFlightsByAirlineName.map((flight, index) => (
              <label key={index} className="flex items-center">
                <Checkbox
                  id={`flight-${index}`}
                  checked={filterOptions.airlines?.some(
                    (al) => al === flight.airline_name
                  )}
                  onCheckedChange={(checked) => handleAirlinesChange(flight)}
                />

                <span className="text-[14px] ml-2 ">
                  {flight.airline_name.split(" ").slice(0, 2).join(" ")}
                </span>
                <span className="ml-auto text-[#64717B] text-[12px]">
                  {"৳"}
                  {flight.fare_details.total_fare}
                </span>
              </label>
            ))}
          </div>
          {uniqueFlightsByAirlineName.length > 6 && (
            <button
              onClick={toggleMoreLessAirlines}
              className="text-[#137799] font-semibold text-sm mt-2"
            >
              {isShowMoreAirlines
                ? "Show less"
                : `Show more ${uniqueFlightsByAirlineName.length - 6} airlines`}
            </button>
          )}
        </section>
        {/* <section className="mb-6 border-t pt-4 ">
          <p className="text-[14px] font-semibold mb-4">Airports </p>
          <div className="mt-3 space-y-3">
            {uniqueAirports.map((airport) => (
              <div key={airport} className="space-y-0">
                <span className="text-sm font-medium block mb-1">
                  {getChangingCity(airportsData, airport).split(",")[0]}
                </span>
                <label className="flex items-center">
                  <Checkbox
                    id="direct"
                    checked={filterOptions.airports?.some(
                      (ap) => ap === airport
                    )}
                    onCheckedChange={(checked) => handleAirportsChange(airport)}
                  />
                  <span className="text-sm ml-2 text-gray-700">
                    {`${airport}: ${getAirport(airportsData, airport)
                      .split(" ")
                      .slice(0, 2)
                      .join(" ")}`}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </section> */}
        <section className="mb-6 border-t pt-4">
          <p className="text-[14px] font-semibold mb-4">Duration </p>
          <div className="space-y-6">
            <div>
              <div className="mb-4">
                <p className="mb-1 text-sm">Flight leg</p>
                <p className="text-xs ">
                  {formatMinutesToHours(localFilterOptions.legRange?.[0])} -{" "}
                  {formatMinutesToHours(localFilterOptions.legRange?.[1])}
                </p>
              </div>
              <div>
                <MultiRangeSlider
                  min={minLegDuration}
                  max={
                    minLegDuration !== maxLegDuration
                      ? maxLegDuration
                      : maxLegDuration + 1
                  }
                  step={5}
                  values={localFilterOptions.legRange}
                  onChange={(newValues) =>
                    handleSliderChange("legRange", newValues)
                  }
                  onFinalChange={(newValues) =>
                    handleSliderFinalChange("legRange", newValues)
                  }
                />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <p className="mb-1 text-sm">Layover</p>
                <p className="text-xs ">
                  {formatMinutesToHours(localFilterOptions.layoverRange?.[0])} -{" "}
                  {formatMinutesToHours(localFilterOptions.layoverRange?.[1])}
                </p>
              </div>
              <div>
                <MultiRangeSlider
                  min={minLayoverDuration}
                  max={
                    minLayoverDuration !== maxLayoverDuration
                      ? maxLayoverDuration
                      : maxLayoverDuration + 1
                  }
                  step={5}
                  values={localFilterOptions.layoverRange}
                  onChange={(newValues) =>
                    handleSliderChange("layoverRange", newValues)
                  }
                  onFinalChange={(newValues) =>
                    handleSliderFinalChange("layoverRange", newValues)
                  }
                />
              </div>
            </div>
          </div>
        </section>
        <section className="mb-6 pt-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:no-underline">
                <span className="font-semibold">Price</span>
              </AccordionTrigger>
              <AccordionContent style={{ overflow: "visible" }}>
                <p className="text-xs py-4">
                  {"৳"}
                  {localFilterOptions.priceRange?.[0]} - {"৳"}
                  {localFilterOptions.priceRange?.[1]}
                </p>
                <MultiRangeSlider
                  min={minPrice}
                  max={minPrice !== maxPrice ? maxPrice : maxPrice + 1}
                  step={10} // taka
                  values={localFilterOptions.priceRange}
                  onChange={(newValues) =>
                    handleSliderChange("priceRange", newValues)
                  }
                  onFinalChange={(newValues) =>
                    handleSliderFinalChange("priceRange", newValues)
                  }
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="hover:no-underline">
                <div className="w-full flex justify-between">
                  <span className="font-semibold">Cabin</span>
                  {uniqueCabinClasses.length !==
                    filterOptions.cabinClasses.length && (
                    <button
                      className="mr-2 text-[#137799] font-semibold font-mono"
                      onClick={handleResetCabinClasses}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </AccordionTrigger>
              <p className="mb-4"></p>
              <AccordionContent style={{ overflow: "visible" }}>
                {uniqueCabinClasses.map((cabinClasses) => (
                  <div key={cabinClasses} className="mb-2">
                    <label className="flex items-center">
                      <Checkbox
                        id="direct"
                        checked={filterOptions.cabinClasses?.some(
                          (cc) => cc === cabinClasses
                        )}
                        onCheckedChange={(checked) =>
                          handleCabinClassChange(cabinClasses)
                        }
                      />
                      <span className="text-sm ml-2 text-gray-700">
                        {cabinClasses}
                      </span>
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {uniqueLayoverAirports.length > 0 && (
              <AccordionItem value="item-3">
                <AccordionTrigger className="hover:no-underline">
                  <div className="w-full flex justify-between">
                    <span className="font-semibold">Layover Airports</span>
                    {uniqueLayoverAirports.length !==
                      filterOptions.layoverAirports.length && (
                      <button
                        className="mr-2 text-[#137799] font-semibold font-mono"
                        onClick={handleResetLayoverAirports}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent
                  style={{ overflow: "visible" }}
                  className="pt-4"
                >
                  <div className="">
                    {uniqueLayoverAirports.map((airport) => (
                      <div key={airport} className="mb-2">
                        <p className="text-sm font-medium mb-2">
                          {getChangingCity(airportsData, airport)
                            .split(",")
                            .slice(1, 2)
                            .join(" ")
                            .split("(")
                            .slice(0, 1)}
                        </p>
                        <label className="flex items-center">
                          <Checkbox
                            id="direct"
                            checked={filterOptions.layoverAirports?.some(
                              (ap) => ap === airport
                            )}
                            onCheckedChange={(checked) =>
                              handleLayoverAirportsChange(airport)
                            }
                          />
                          <span className="text-sm ml-2 text-gray-700">
                            {`${getAirport(airportsData, airport)
                              .split(" ")
                              .slice(0, 2)
                              .join(" ")} (${airport})`}
                          </span>
                          {/* <span className="ml-auto text-[#64717B] text-[14px]">
                          Tk 23,404
                        </span> */}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="item-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="w-full flex justify-between">
                  <span className="font-semibold">Aircraft</span>
                  {uniqueAircraftModels.length !==
                    filterOptions.aircraftModels.length && (
                    <button
                      className="mr-2 text-[#137799] font-semibold font-mono"
                      onClick={handleResetAircraftModels}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent
                style={{ overflow: "visible" }}
                className="pt-4"
              >
                <p className="text-sm font-medium mb-2">Model</p>
                <div className="">
                  {uniqueAircraftModels.map((model) => (
                    <div key={model} className="mb-2">
                      <label className="flex items-center">
                        <Checkbox
                          id="direct"
                          checked={filterOptions.aircraftModels?.some(
                            (ap) => ap === model
                          )}
                          onCheckedChange={(checked) =>
                            handleAircraftModelChange(model)
                          }
                        />
                        <span className="text-sm ml-2 text-gray-700">
                          {model}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  );
}
