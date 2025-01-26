"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useAirlines } from "@/hooks/useAirlines";
import { useAirports } from "@/hooks/useAirports";

import { dateTimeToMilliseconds } from "@/lib/dateTimeToMilliseconds";
import { formatMinutesToHours } from "@/lib/formatMinutesToHours";
import { millisecondsToDateTime } from "@/lib/millisecondsToDateTime";
import { getAirport } from "@/utils/getAirport";
import { getChangingCity } from "@/utils/getChangingCity";
import { useEffect, useState } from "react";
import useAirlineStore from "../../../stores/airlineStore";
import MultiRangeSlider from "../ui/multiRangeSlider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { uniqueAirlinesByName } from "@/utils/uniqueAirlinesByName";
import { uniqueAirportsByName } from "@/utils/uniqueAirportsByName";
import { uniqueLayoverAirportsByName } from "@/utils/uniqueLayoverAirportsByName";

export default function FlightFilter({ sortedFlights, allFlights, timer }) {
  const {
    filterOptions,
    setFilterOptions,
    filterData,
    originQuery,
    searchData,
  } = useAirlineStore();
  // const filterOptions = useAirlineStore((state) => state.filterOptions);
  // const setFilterOptions = useAirlineStore((state) => state.setFilterOptions);
  // const filterData = useAirlineStore((state) => state.filterData);

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

  // airports change handler
  const handleAirportsChange = (airport) => {
    const updatedAirports = filterOptions.airports.some((ap) => ap === airport)
      ? filterOptions.airports.filter((air) => air !== airport)
      : [...filterOptions.airports, airport];

    setFilterOptions({ ...filterOptions, airports: updatedAirports });
  };

  // layover airports change handler
  const handleLayoverAirportsChange = (airport) => {
    const updatedAirports = filterOptions.layoverAirports.some(
      (ap) => ap === airport
    )
      ? filterOptions.layoverAirports.filter((air) => air !== airport)
      : [...filterOptions.layoverAirports, airport];

    setFilterOptions({ ...filterOptions, layoverAirports: updatedAirports });
  };

  // unique airlines name list
  const uniqueAirlines = uniqueAirlinesByName(allFlights);

  // unique airports name list
  const uniqueAirports = uniqueAirportsByName(allFlights);

  // unique layover airports name list
  const uniqueLayoverAirports = uniqueLayoverAirportsByName(allFlights);
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
    const updatedFilterOptions = { ...filterOptions, [key]: newValues };
    setFilterOptions(updatedFilterOptions);
  };

  // trigger the slider when slide handler released
  const handleSliderFinalChange = (key, newValues) => {
    const updatedFilterOptions = { ...filterOptions, [key]: newValues };
    setFilterOptions(updatedFilterOptions);
  };

  // select all airlines handler
  const handleSelectAllAirlines = () => {
    // unique airlines name list
    const updatedAirlines = uniqueAirlines.map(
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

  // effect for set initial values for all the filter options
  useEffect(() => {
    if (allFlights && allFlights.length > 0) {
      const takeOffTimestamps = allFlights.map((flight) =>
        dateTimeToMilliseconds(flight.departure_date, flight.departure_time)
      );
      const landingTimestamps = allFlights.map((flight) =>
        dateTimeToMilliseconds(flight.arrival_date, flight.arrival_time)
      );
      const legTimestamps = allFlights.map(
        (flight) => flight?.itinerary_leg_descs?.[0]?.duration
      );

      const layoverTimestamps = allFlights.flatMap(
        (flight) =>
          flight?.schedules?.reduce(
            (total, leg) => total + Number(leg.layover_time),
            0
          ) || [0]
      );

      const price = allFlights.map(
        (flight) => flight?.fare_details?.total_fare
      );

      const initialMinTakeOff = Math.min(...takeOffTimestamps);
      const initialMaxTakeOff = Math.max(...takeOffTimestamps);

      const initialMinLanding = Math.min(...landingTimestamps);
      const initialMaxLanding = Math.max(...landingTimestamps);

      const initialMinLegDuration = Math.min(...legTimestamps);
      const initialMaxLegDuration = Math.max(...legTimestamps);

      const initialMinLayoverDuration = Math.min(...layoverTimestamps);
      const initialMaxLayoverDuration = Math.max(...layoverTimestamps);

      const initialMinPrice = Math.min(...price);
      const initialMaxPrice = Math.max(...price);

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
    }
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
        <span className="text-[14px] font-semibold mb-4">
          {filterData?.length} of{" "}
        </span>
        <span className="text-[14px] text-[#FC660F]">
          {allFlights?.length} flights
        </span>

        <section className="mb-6 border-t pt-3 ">
          <span className="text-[14px] font-semibold ">Stops </span>
          <div className="space-y-3 mt-4">
            {["Nonstop", "1 stop", "2+ stops"].map((stop) => (
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

        <section className="mb-6 border-t pt-3">
          <span className="text-[14px] font-semibold ">Times </span>
          <div className="space-y-4">
            <div className="pt-4">
              <div className="mb-4">
                <p className="mb-1 text-sm">
                  Take-off from {searchData?.destination}
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
                <p className="mb-1 text-sm">Landing at {searchData?.arrival}</p>
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

        <section className="mb-6 border-t pt-3">
          <div className="flex justify-between">
            <span className="text-[14px] font-semibold">Airlines </span>
            <div>
              <button
                className="text-orange-600 text-sm mr-4"
                onClick={handleSelectAllAirlines}
              >
                Select All
              </button>
              <button
                className="text-orange-600 text-sm"
                onClick={handleClearAllAirlines}
              >
                Clear all
              </button>
            </div>
          </div>
          <div
            className={`space-y-2 mt-3 overflow-hidden ${
              uniqueAirlines.length > 6 && !isShowMoreAirlines
                ? "max-h-[168px]"
                : "max-h-fit"
            }`}
          >
            {uniqueAirlines.map((flight, index) => (
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
          {uniqueAirlines.length > 6 && (
            <button
              onClick={toggleMoreLessAirlines}
              className="text-orange-600 mt-3 text-sm"
            >
              {isShowMoreAirlines
                ? "Show less"
                : `Show more ${uniqueAirlines.length - 6} airlines`}
            </button>
          )}
        </section>
        <section className="mb-6 border-t pt-3 ">
          <span className="text-[14px] font-semibold ">Airports </span>
          <div className="mt-3 space-y-2">
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
                  {/* <span className="ml-auto text-[#64717B] text-[14px]">
                    Tk 23,404
                  </span> */}
                </label>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-6 border-t pt-3">
          <span className="text-[14px] font-semibold ">Duration </span>
          <div className="space-y-4">
            <div className="pt-4">
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

            <div className="pt-4">
              <div className="mb-4">
                <p className="mb-1 text-sm">Layover</p>
                <p className="text-xs ">
                  {formatMinutesToHours(localFilterOptions.layoverRange?.[0])} -{" "}
                  {formatMinutesToHours(localFilterOptions.layoverRange?.[1])}
                </p>
              </div>
              <div>
                {/* {minLayoverDuration && maxLayoverDuration ? ( */}
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
                {/* ) : (
                  <p>Loading slider...</p>
                )} */}
              </div>
            </div>

            {/* <div>
              <div className="py-4">
                <p className=" mb-2 text-[18px]">Stopover</p>
                <p className="text-[12px]  mb-2">1h 0m - 75h 50m </p>
              </div>

              <Slider
                min={0}
                max={72}
                step={1}
                value={filterOptions.stopOverRange}
                onValueChange={(value) =>
                  handleSliderChange("stopOverRange", value)
                }
                className="w-full"
              />
            </div> */}

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="hover:no-underline">
                  <span className="font-semibold">Price</span>
                </AccordionTrigger>
                <AccordionContent style={{ overflow: "visible" }}>
                  <p className="text-xs mb-4">
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
            </Accordion>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="hover:no-underline">
                  <span className="font-semibold">Layover Airports</span>
                </AccordionTrigger>
                <AccordionContent style={{ overflow: "visible" }}>
                  {" "}
                  <section className="mb-6 border-t pt-3 ">
                    <div className="mt-3 space-y-2">
                      {uniqueLayoverAirports.map((airport) => (
                        <div key={airport} className="space-y-0">
                          <span className="text-sm font-medium block mb-1">
                            {getChangingCity(airportsData, airport)
                              .split(",")
                              .slice(1, 2)
                              .join(" ")
                              .split("(")
                              .slice(0, 1)}
                          </span>
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
                  </section>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </div>
    </div>
  );
}
