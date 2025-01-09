"use client";

import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpRight } from "lucide-react";
import { fetchAirlinesData, fetchAirportsData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useAirports } from "@/hooks/useAirports";
import { useAirlines } from "@/hooks/useAirlines";
import useAirlineStore from "../../../stores/airlineStore";
import { getAirline } from "@/utils/getAirline";
import { getAirport } from "@/utils/getAirport";
import { getChangingCity } from "@/utils/getChangingCity";

export default function FlightFilter({ sortedFlights, allFlights }) {
  const [takeoffTime, setTakeoffTime] = useState([0, 24]);
  const [landingTime, setLandingTime] = useState([0, 72]);

  const formatTime = (hours) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days > 0 ? `${days}d ` : ""}${remainingHours
      .toString()
      .padStart(2, "0")}:00`;
  };
  // const [filterOptions, setFilterOptions] = useState({
  //   stops: [],
  //   takeOffRange: [0, 24],
  //   landingRange: [0, 72],
  //   airlines: [],
  //   airports: [],
  //   legRange: [0, 1000], // in minutes
  //   stopOverRange: [0, 1000], // in minutes
  // });

  const filterOptions = useAirlineStore((state) => state.filterOptions);
  const setFilterOptions = useAirlineStore((state) => state.setFilterOptions);

  // Call applyFilters whenever filterOptions change
  const { airportsData, airportError, airportLoading } = useAirports();
  const { airlinesData, airlineError, airlineLoading } = useAirlines();

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

  // slider change handler
  const handleSliderChange = (type, value) => {
    setFilterOptions({
      ...filterOptions,
      [type]: value,
    });
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
        if (!airlineSet.has(schedule?.departure_airport)) {
          airlineSet.add(schedule?.departure_airport);
          uniqueAirlines.push(schedule?.departure_airport);
        } else if (!airlineSet.has(schedule?.arrival_airport)) {
          airlineSet.add(schedule?.arrival_airport);
          uniqueAirlines.push(schedule?.arrival_airport);
        }
      });
    });
    return uniqueAirlines;
  };

  const uniqueAirports = uniqueAirportsByName(sortedFlights);

  console.log(filterOptions);

  return (
    <div>
      <div className="hidden w-[260px] h-[160px] bg-white rounded-lg border p-4 md:flex flex-col justify-between  ">
        <div className="">
          <h2 className="text-lg font-semibold mb-1">Our Advice</h2>
          <div className="flex items-center mb-2">
            <span className="text-green-600 font-bold mr-2">Buy Now</span>
            <ArrowUpRight className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Prices are unlikely to decrease within 7 days
            <span className="inline-block ml-1 text-gray-400">ⓘ</span>
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
            {["Direct", "Stop 1", "Stop 2"].map((stop) => (
              <label key={stop} className="flex items-center">
                <Checkbox
                  value={stop}
                  onChange={handleStopChange}
                  checked={filterOptions.stops.includes(stop)}
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
            <div>
              <div className="py-4">
                <p className="mb-2 text-[18px]">Take-off from DAC</p>
                <p className="text-[12px]  mb-2">Tue 00:30 - Wed 00:30</p>
              </div>
              <Slider
                min={0}
                max={24}
                step={1}
                value={filterOptions.takeOffRange}
                onValueChange={(value) =>
                  handleSliderChange("takeOffRange", value)
                }
                className="w-full "
              />
            </div>
            <div>
              <div className="py-4">
                <p className=" mb-2 text-[18px]">Landing at KUL</p>
                <p className="text-[12px]  mb-2">Tue 00:30 - Wed 00:30</p>
              </div>

              <Slider
                min={0}
                max={72}
                step={1}
                value={filterOptions.landingRange}
                onValueChange={(value) =>
                  handleSliderChange("landingRange", value)
                }
                className="w-full"
              />
            </div>
          </div>
        </section>

        <section className="mb-6 border-t pt-3">
          <div className="flex justify-between mb-2">
            <span className="text-[14px] font-semibold ">Airlines </span>

            <div>
              <button className="text-blue-600 text-sm mr-4">Select All</button>
              <button className="text-blue-600 text-sm">Clear all</button>
            </div>
          </div>
          <div className="space-y-2">
            {uniqueAirlines.map((flight, index) => (
              <label key={index} className="flex items-center">
                <Checkbox
                  id={`flight-${index}`}
                  checked={filterOptions.airlines.some(
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
          <div className="space-y-3 mt-4">
            {uniqueAirports.map((airport) => (
              <div key={airport} className="space-y-3">
                <span className="text-[14px] font-semibold ">
                  {getChangingCity(airportsData, airport).split(",")[0]}
                </span>
                <label className="flex items-center">
                  <Checkbox
                    id="direct"
                    checked={filterOptions.airports.some(
                      (ap) => ap === airport
                    )}
                    onCheckedChange={(checked) => handleAirportsChange(airport)}
                  />
                  <span className="text-sm ml-2">
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
                  {filterOptions.legRange[0] + "-" + filterOptions.legRange[1]}
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
