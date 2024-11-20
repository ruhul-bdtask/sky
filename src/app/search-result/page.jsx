"use client";
import React, { useEffect, useRef, useState } from "react";
import FlightCard from "@/components/flightCard/FlightCard";
import FlightFilter from "@/components/flightFilter/FlightFilter";
import TopFilter from "@/components/topFilter/TopFilter";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import useAirlineStore from "../../../stores/airlineStore";
import ResultPageSkeleton from "@/skeletons/ResultPageSkeleton";
import { useRouter } from "next/navigation";
import LoadingBar from "react-top-loading-bar";
export default function Page() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.continuousStart(); // Start the loading bar

    // Simulate an API call
    setTimeout(() => {
      ref.current.complete(); // Complete the loading bar
    }, 2000); // Simulate 2 seconds loading
  }, []);

  const {
    OriginDestinationInformation,
    setLegDescription,
    searchData,
    setMinPrice,
    setMaxPrice,
    minPrice,
    maxPrice,
  } = useAirlineStore();

  const ticketClass = searchData?.class; // Replace with actual value
  const directFlightsOnly = false; // Replace with actual value
  const availableFlightsOnly = true; // Replace with actual value

  const payload = {
    RequestLOG: true,
    RequireUTILS: false,
    RequestBody: {
      OriginDestinationInformation: OriginDestinationInformation,
      PassengerTypeQuantity: searchData?.passengers
        ? searchData.passengers?.map((passenger) => ({
            Code: passenger.type,
            Quantity: passenger.quantity,
            TPA_Extensions: {
              VoluntaryChanges: {
                Match: "Info",
              },
            },
          }))
        : [],
      TicketClass: ticketClass,
      DirectFlightsOnly: directFlightsOnly,
      AvailableFlightsOnly: availableFlightsOnly,
    },
  };

  const {
    data: allFlights,
    error: allFlightsError,
    isLoading: allFlightsLoading,
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
      allFlights?.data.sortedItineraries[0]?.fare_details?.total_fare
    );
    setMaxPrice(
      allFlights?.data.sortedItineraries[
        allFlights?.data.sortedItineraries.length - 1
      ]?.fare_details?.total_fare
    );
  }, [allFlights]);

  const [sortCriteria, setSortCriteria] = useState("cheapest");

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
          const durationToMinutes = (duration) => {
            const [hours, minutes] = duration.match(/\d+/g).map(Number); // Extract numbers
            return hours * 60 + minutes; // Convert to total minutes
          };

          return (
            durationToMinutes(a.flight_duration) -
            durationToMinutes(b.flight_duration)
          );
        });

      case "best":
        return [...allFlights.data.sortedItineraries].sort((a, b) => {
          const durationToMinutes = (duration) => {
            const [hours, minutes] = duration.match(/\d+/g).map(Number);
            return hours * 60 + minutes;
          };

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
                  allFlights={allFlights.data.sortedItineraries}
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
                  {sortedFlights().length > 0 ? (
                    sortedFlights().map((flight) => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))
                  ) : (
                    <p>No flights available</p>
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
