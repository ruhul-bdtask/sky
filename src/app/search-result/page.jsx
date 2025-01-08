"use client";
import React, { useEffect, useRef, useState } from "react";
import FlightCard from "@/components/flightCard/FlightCard";
import FlightFilter from "@/components/flightFilter/FlightFilter";
import TopFilter from "@/components/topFilter/TopFilter";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import useAirlineStore from "../../../stores/airlineStore";
import ResultPageSkeleton from "@/skeletons/ResultPageSkeleton";
import LoadingBar from "react-top-loading-bar";
import { notFound } from "next/navigation";
import Link from "next/link";
export default function Page({ searchParams }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.continuousStart();

    setTimeout(() => {
      ref.current?.complete();
    }, 2000);
  }, []);

  const {
    OriginDestinationInformation,
    setLegDescription,
    setMinPrice,
    setMaxPrice,
    minPrice,
    maxPrice,
    timer,
    startTimer
  } = useAirlineStore();

  console.log(timer)

  const { search, originDestinationInfo } = searchParams;
  let parsedSearchData;
  try {
    parsedSearchData = JSON.parse(search);
  } catch (error) {
    console.error("Error parsing searchData:", error);
    notFound();
  }

  const ticketClass = parsedSearchData?.class;
  const directFlightsOnly = false;
  const availableFlightsOnly = true;

  const payload = {
    RequestLOG: true,
    RequireUTILS: false,
    RequestBody: {
      OriginDestinationInformation: JSON.parse(originDestinationInfo),
      PassengerTypeQuantity: parsedSearchData?.passengers?.map((passenger) => ({
        Code: passenger.type,
        Quantity: passenger.quantity,
        TPA_Extensions: {
          VoluntaryChanges: {
            Match: "Info",
          },
        },
      })),

      TicketClass: ticketClass,
      DirectFlightsOnly: directFlightsOnly,
      AvailableFlightsOnly: availableFlightsOnly,
    },
  };

  const {
    data: allFlights,
    error: allFlightsError,
    isLoading: allFlightsLoading = true,
    refetch: refetchAllFlights,
  } = useQuery({
    queryKey: ["flights", payload],
    queryFn: () => fetchData("/gds/search", "POST", payload),
    retry: 2,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    setLegDescription(allFlights?.data?.LegDescription);
    setMinPrice(
      allFlights?.data?.sortedItineraries[0]?.fare_details?.total_fare
    );
    setMaxPrice(
      allFlights?.data?.sortedItineraries[
        allFlights?.data?.sortedItineraries?.length - 1
      ]?.fare_details?.total_fare
    );
  }, [allFlights]);

  const [sortCriteria, setSortCriteria] = useState("cheapest");

  const durationToMinutes = (duration) => {
    const [hours, minutes] = duration.match(/\d+/g).map(Number);
    return hours * 60 + minutes;
  };
  const sortedFlights = () => {
    if (!allFlights?.data?.sortedItineraries) return [];

    switch (sortCriteria) {
      case "cheapest":
        return allFlights.data.sortedItineraries.filter(
          (flight) =>
            flight.fare_details?.total_fare >= minPrice &&
            flight.fare_details?.total_fare <= maxPrice
        );
      // .sort(
      //   (a, b) => a.fare_details?.total_fare - b.fare_details?.total_fare
      // );
      case "quick":
        return [...allFlights.data.sortedItineraries].sort((a, b) => {
          return (
            durationToMinutes(a.flight_duration) -
            durationToMinutes(b.flight_duration)
          );
        });

      case "best":
        return [...allFlights.data.sortedItineraries].sort((a, b) => {
          const aScore =
            a.fare_details?.total_fare * 0.4 +
            durationToMinutes(a.flight_duration) * 0.4 +
            (a.total_stop || 0) * 0.2;

          const bScore =
            b.fare_details?.total_fare * 0.4 +
            durationToMinutes(b.flight_duration) * 0.4 +
            (b.total_stop || 0) * 0.2;

          return aScore - bScore;
        });
      default:
        return allFlights.data.sortedItineraries;
    }
  };

  const filterOptions = useAirlineStore((state) => state.filterOptions);
  const sortFlights = sortedFlights();
  // const filterFlightData = (sortFlights, filterOptions) => {
  //   return sortFlights.filter((flight) => {
  //     const {
  //       stops,
  //       takeOffRange,
  //       landingRange,
  //       airlines,
  //       airports,
  //       legRange,
  //       stopOverRange,
  //     } = filterOptions;

  //     const stopMapping = {
  //       Direct: 0,
  //       "Stop 1": 1,
  //       "Stop 2": 2,
  //       // add more mappings if needed
  //     };

  //     const stopCountsToFilter = filterOptions.stops.map(
  //       (stop) => stopMapping[stop]
  //     );

  //     // Filter the data based on the stop_count
  //     const filteredData = sortFlights.filter((flight) =>
  //       stopCountsToFilter.includes(flight.total_stop)
  //     );

  //     console.log({ filteredData });
  //     //// 2. Check for airline filter
  //     // const isAirlineValid =
  //     //   airlines.length === 0 || airlines.includes(flight.airline_name);

  //     // // 3. Check for airport filter (origin and destination airports)
  //     // const isAirportValid =
  //     //   airports.length === 0 ||
  //     //   airports.includes(flight.origin_airport_name) ||
  //     //   airports.includes(flight.destination_airport_name);

  //     // // 4. Check for takeOffRange filter (departure time in minutes)
  //     // const departureTimeInMinutes = getMinutesFromTime(flight.departure_time);
  //     // const isTakeOffRangeValid =
  //     //   takeOffRange[0] <= departureTimeInMinutes &&
  //     //   departureTimeInMinutes <= takeOffRange[1];

  //     // // 5. Check for landingRange filter (arrival time in minutes)
  //     // const arrivalTimeInMinutes = getMinutesFromTime(flight.arrival_time);
  //     // const isLandingRangeValid =
  //     //   landingRange[0] <= arrivalTimeInMinutes &&
  //     //   arrivalTimeInMinutes <= landingRange[1];

  //     // // 6. Check for legRange filter (flight duration in minutes)
  //     // const flightDurationInMinutes = parseInt(
  //     //   flight.itinerary_leg_descs[0][0].duration,
  //     //   10
  //     // );
  //     // const isLegRangeValid =
  //     //   legRange[0] <= flightDurationInMinutes &&
  //     //   flightDurationInMinutes <= legRange[1];

  //     // // 7. Check for stopOverRange filter (layover time)
  //     // const isStopOverRangeValid =
  //     //   stopOverRange[0] <= flight.itinerary_leg_descs[0][0].layover_time &&
  //     //   flight.itinerary_leg_descs[0][0].layover_time <= stopOverRange[1];

  //     // Return true if all conditions are satisfied
  //     //return filteredData;
  //     // &&
  //     // isAirlineValid &&
  //     // isAirportValid &&
  //     // isTakeOffRangeValid &&
  //     // isLandingRangeValid &&
  //     // isLegRangeValid &&
  //     // isStopOverRangeValid
  //   });
  // };

  // Helper function to convert time in "HH:MM" format to minutes
  // const getMinutesFromTime = (time) => {
  //   const [hours, minutes] = time.split(":").map(Number);
  //   return hours * 60 + minutes;
  // };

  const filterFlightData = (sortFlights, filterOptions) => {
    // Define the mapping of stop labels to their corresponding stop counts
    const stopMapping = {
      Direct: 0,
      "Stop 1": 1,
      "Stop 2": 2,
      // Add more mappings if needed
    };

    // Check if the stops filter is applied and map the stop labels to their corresponding stop counts
    const stopCountsToFilter = filterOptions.stops?.length
      ? filterOptions.stops.map((stop) => stopMapping[stop])
      : null;

    // Filter the flights based on the total_stop property if stop filters are applied
    return stopCountsToFilter
      ? sortFlights.filter((flight) =>
          stopCountsToFilter.includes(flight.total_stop)
        )
      : sortFlights;
  };

  const filteredFlights = filterFlightData(sortFlights, filterOptions);

  return (
    <>
      <div className="bg-[#F0F3F5] py-10">
        <LoadingBar color="#f11946" height={2} ref={ref} />
        {allFlightsLoading ? (
          <ResultPageSkeleton />
        ) : (
          <>
            <div className="container_search max-w-5xl">
              <div className="flex gap-5">
                <FlightFilter
                  allFlights={allFlights?.data?.sortedItineraries}
                  sortedFlights={sortedFlights()}
                />
                <div className="flex-1">
                  <TopFilter
                    setSortCriteria={setSortCriteria}
                    sortCriteria={sortCriteria}
                  />
                  {/* {allFlights?.data?.sortedItineraries ? (
                    allFlights.data.sortedItineraries.map((flight) => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))
                  ) : (
                    <p>No flights available</p>
                  )} */}
                  {filteredFlights.length > 0 ? (
                    filteredFlights.map((flight) => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-[500px]">
                      <div className="flex flex-col gap-2 items-center">
                        <p className="text-red-400 ">No flights available</p>
                        <Link href={"/"}>
                          <button className="p-3 text-white  bg-[#FC660F] rounded-lg mt-2 hover:bg-[#dd773b] ease-in-out duration-300 transition-all">
                            Search again
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
                  {/* <button className="w-full p-5 rounded-[10px] bg-[#5F6D77] text-white my-3 text-[14px] font-semibold">
                  Show More Results
                </button> */}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
