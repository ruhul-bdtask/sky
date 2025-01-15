"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useAirlines } from "@/hooks/useAirlines";
import { useAirports } from "@/hooks/useAirports";

import { dateTimeToMilliseconds } from "@/lib/dateTimeToMilliseconds";
import { millisecondsToDateTime } from "@/lib/millisecondsToDateTime";
import { getAirport } from "@/utils/getAirport";
import { getChangingCity } from "@/utils/getChangingCity";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import useAirlineStore from "../../../stores/airlineStore";
import MultiRangeSlider from "../ui/multiRangeSlider";

export default function FlightFilter({ sortedFlights, allFlights, timer }) {
  // const { filterOptions, setFilterOptions } = useAirlineStore();
  const filterOptions = useAirlineStore((state) => state.filterOptions);
  const setFilterOptions = useAirlineStore((state) => state.setFilterOptions);

  const [localFilterOptions, setLocalFilterOptions] = useState({
    stops: [],
    takeOffRange: [0, 100],
    landingRange: [0, 100],
    airlines: [],
    airports: [],
    legRange: [0, 100],
    stopOverRange: [0, 100],
  });

  const [minTakeOff, setMinTakeOff] = useState(0);
  const [maxTakeOff, setMaxTakeOff] = useState(100);
  const [minLanding, setMinLanding] = useState(0);
  const [maxLanding, setMaxLanding] = useState(100);

  //load airports data from JSON
  const { airportsData, airportError, airportLoading } = useAirports();
  // load airlines data from JSON
  const { airlinesData, airlineError, airlineLoading } = useAirlines();

  const { minutes, seconds } = timer;

  // stops change handler
  const handleStopChange = (value) => {
    const updatedStops = filterOptions.stops.includes(value)
      ? filterOptions.stops.filter((stop) => stop !== value)
      : [...filterOptions.stops, value];

    setFilterOptions({ ...filterOptions, stops: updatedStops });
  };

  // airlines change handler
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

  // unique airlines name list
  const uniqueAirlinesByName = (sortedFlights) => {
    const uniqueFlights = [];
    const airlineSet = new Set();

    sortedFlights.forEach((flight) => {
      if (!airlineSet.has(flight.airline_name)) {
        airlineSet.add(flight.airline_name); // Add the airline name to the Set
        uniqueFlights.push(flight); // Add the unique flight to the array
      }
    });

    return uniqueFlights;
  };

  const uniqueAirlines = uniqueAirlinesByName(sortedFlights);

  // unique airports name list
  const uniqueAirportsByName = (sortedFlights) => {
    const uniqueAirlines = [];
    const airlineSet = new Set();
    sortedFlights?.forEach((flight) => {
      flight.schedules.forEach((schedule) => {
        // if (!airlineSet.has(schedule?.departure_airport)) {
        //   airlineSet.add(schedule?.departure_airport);
        //   uniqueAirlines.push(schedule?.departure_airport);
        // } else if (!airlineSet.has(schedule?.arrival_airport)) {
        //   airlineSet.add(schedule?.arrival_airport);
        //   uniqueAirlines.push(schedule?.arrival_airport);
        // }
        if (!airlineSet.has(schedule?.arrival_airport)) {
          airlineSet.add(schedule?.arrival_airport);
          uniqueAirlines.push(schedule?.arrival_airport);
        }
      });
    });
    return uniqueAirlines;
  };

  const uniqueAirports = uniqueAirportsByName(sortedFlights);

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

  const handleFinalChange = (key, newValues) => {
    const updatedFilterOptions = { ...filterOptions, [key]: newValues };
    setFilterOptions(updatedFilterOptions);
  };

  useEffect(() => {
    if (allFlights && allFlights.length > 0) {
      const takeOffTimestamps = allFlights.map((flight) =>
        dateTimeToMilliseconds(flight.departure_date, flight.departure_time)
      );
      const landingTimestamps = allFlights.map((flight) =>
        dateTimeToMilliseconds(flight.arrival_date, flight.arrival_time)
      );
      const initialMinTakeOff = Math.min(...takeOffTimestamps);
      const initialMaxTakeOff = Math.max(...takeOffTimestamps);

      const initialMinLanding = Math.min(...landingTimestamps);
      const initialMaxLanding = Math.max(...landingTimestamps);

      setLocalFilterOptions({
        ...filterOptions,
        takeOffRange: [initialMinTakeOff, initialMaxTakeOff],
        landingRange: [initialMinLanding, initialMaxLanding],
      });
      setMinTakeOff(initialMinTakeOff);
      setMaxTakeOff(initialMaxTakeOff);
      setMinLanding(initialMinLanding);
      setMaxLanding(initialMaxLanding);
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
          {sortedFlights?.length} of{" "}
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
                <p className="mb-1 text-sm">Take-off from DAC</p>
                <p className="text-sm ">
                  {millisecondsToDateTime(localFilterOptions.takeOffRange?.[0])}{" "}
                  -{" "}
                  {millisecondsToDateTime(localFilterOptions.takeOffRange?.[1])}
                </p>
              </div>
              <div>
                {minTakeOff && maxTakeOff ? (
                  <MultiRangeSlider
                    min={minTakeOff}
                    max={maxTakeOff}
                    step={1000 * 60 * 5} // 5-minute intervals
                    values={localFilterOptions.takeOffRange}
                    onChange={(newValues) =>
                      handleSliderChange("takeOffRange", newValues)
                    }
                    onFinalChange={(newValues) =>
                      handleFinalChange("takeOffRange", newValues)
                    }
                  />
                ) : (
                  <p>Loading slider...</p>
                )}
              </div>
            </div>
            <div className="pt-4">
              <div className="mb-4">
                <p className="mb-1 text-sm">Landing at KUL</p>
                <p className="text-sm">
                  {millisecondsToDateTime(localFilterOptions.landingRange?.[0])}{" "}
                  -{" "}
                  {millisecondsToDateTime(localFilterOptions.landingRange?.[1])}
                </p>
              </div>
              <div>
                {minTakeOff && maxTakeOff ? (
                  <MultiRangeSlider
                    min={minLanding}
                    max={maxLanding}
                    step={1000 * 60 * 5} // 5-minute intervals
                    values={localFilterOptions.landingRange}
                    onChange={(newValues) =>
                      handleSliderChange("landingRange", newValues)
                    }
                    onFinalChange={(newValues) =>
                      handleFinalChange("landingRange", newValues)
                    }
                  />
                ) : (
                  <p>Loading slider...</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 border-t pt-3">
          <div className="flex justify-between">
            <span className="text-[14px] font-semibold">Airlines </span>
            <div>
              <button className="text-blue-600 text-sm mr-4">Select All</button>
              <button className="text-blue-600 text-sm">Clear all</button>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            {uniqueAirlines.map((flight, index) => (
              <label key={index} className="flex items-center">
                <Checkbox
                  id={`flight-${index}`}
                  checked={filterOptions.airlines?.some(
                    (al) => al === flight.airline_name
                  )}
                  onCheckedChange={(checked) => handleAirlinesChange(flight)}
                />

                <span className="text-[14px] ml-2 ">{flight.airline_name}</span>
                <span className="ml-auto text-[#64717B] text-[14px]">
                  {flight.price}
                </span>
              </label>
            ))}
          </div>
        </section>
        <section className="mb-6 border-t pt-3 ">
          <span className="text-[14px] font-semibold ">Airports </span>
          <div className="mt-3 space-y-2">
            {uniqueAirports.map((airport) => (
              <div key={airport} className="space-y-0">
                <span className="text-sm font-medium ">
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
                  <span className="text-sm ml-2 ">
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
            <div>
              <div className="py-4">
                <p className="mb-2 text-[18px]">Flight Leg</p>
                <p className="text-[12px]  mb-2">
                  {/* 3h 50m - 94h 50m{" "} */}
                  {filterOptions.legRange?.[0] +
                    "-" +
                    filterOptions.legRange?.[1]}
                </p>
              </div>
              <Slider
                defaultValue={100}
                min={0}
                max={24}
                step={1}
                value={filterOptions.legRange}
                onValueChange={(value) => handleSliderChange("legRange", value)}
                className="w-full"
              />
            </div>
            <div>
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
