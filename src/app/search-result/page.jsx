"use client";
import React, { useEffect } from "react";
import FlightCard from "@/components/flightCard/FlightCard";
import FlightFilter from "@/components/flightFilter/FlightFilter";
import TopFilter from "@/components/topFilter/TopFilter";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import useAirlineStore from "../../../stores/airlineStore";
import ResultPageSkeleton from "@/skeletons/ResultPageSkeleton";
export default function Page() {
  const { OriginDestinationInformation, setLegDescription, searchData } =
    useAirlineStore();

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
        : [], // Default to an empty array if passengers are undefined
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
  }, [allFlights]);

  return (
    <>
      <div className="bg-[#F0F3F5] py-10">
        {allFlightsLoading ? (
          <ResultPageSkeleton />
        ) : (
          <div className="container_search max-w-5xl">
            <div className="flex gap-5">
              <FlightFilter />
              <div className="flex-1">
                <TopFilter />
                {allFlights?.data?.sortedItineraries ? (
                  allFlights.data.sortedItineraries.map((flight) => (
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
        )}
      </div>
    </>
  );
}
