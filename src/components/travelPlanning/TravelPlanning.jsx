"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import useAirlineStore from "../../../stores/airlineStore";
import { useRouter } from "next/navigation";
export default function TravelPlanning() {
  const {
    originQuery,
    setOriginQuery,
    setDestinationQuery,
    destinationQuery,
    travelPlanningDate,
    setTravelPlanningDate,
    setDestinationAirport,
    setOriginAirport,
  } = useAirlineStore();

  const {
    data: travelData,
    error: travelDataError,
    isLoading: travelDataLoading,
    refetch: refetchTravelData,
  } = useQuery({
    queryKey: ["travelData"],
    queryFn: () => fetchData("/travel-plan/all", "GET"),
    enabled: true,
  });

  const handleSearch = (item, destination) => {
    // setOriginQuery(item?.departure_code);
    // setOriginAirport(item?.departure);
    // setDestinationQuery(destination?.code);
    // setDestinationAirport(destination?.name);
    // setTravelPlanningDate(item?.departure_date);

    // Build the URL with query parameters
    const queryParams = new URLSearchParams({
      destinationQuery: item?.departure_code,
      originQuery: destination?.code,
      travelPlanningDate: item?.departure_date,
      destinationAir: item?.departure,
      originAir: destination?.name,
    }).toString();

    window.open(`/travel-plan/?${queryParams}`, "_blank");
  };

  return (
    <>
      {travelData?.data?.length > 0 && (
        <div className="py-10">
          <div className="pb-6">
            <h2 className="text-[24px] font-bold text-black">
              Start your travel planning here
            </h2>
            <p className="text-[16px]">Search Flights</p>
          </div>
          <div className="w-full    ">
            <Accordion
              type="single"
              collapsible
              className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10"
            >
              {travelData?.data?.map((destination, index) => (
                <AccordionItem value={destination.name} key={index}>
                  <div className="text-[16ox] font-semibold py-3">
                    {destination.name}
                  </div>
                  <AccordionTrigger className="text-left py-1">
                    <div className="text-[12px]  text-[#0C7C99]">FLIGHTS</div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {destination.routes.map((item, itemIndex) => (
                        <li
                          onClick={() => handleSearch(item, destination)}
                          key={itemIndex}
                          className="flex justify-between text-sm hover:underline cursor-pointer"
                        >
                          <span>{item.departure}</span>
                          <span className="text-gray-600">{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      )}
    </>
  );
}
