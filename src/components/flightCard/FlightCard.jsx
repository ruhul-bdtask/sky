"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import CardIcon from "@/public/icons/CardIcon";
import { Heart, Share2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import useAirlineStore from "../../../stores/airlineStore";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import { Oval } from "react-loader-spinner";
export default function FlightCard({ flight }) {
  const router = useRouter();
  const {
    searchData,
    OriginDestinationInformation,
    setLegDescription,
    LegDescription,
    setSelectedFlight,
    selectedFlight,
  } = useAirlineStore();

  const directFlightsOnly = false;
  const availableFlightsOnly = false;

  const payload = {
    RequestLOG: true,
    RequireUTILS: false,
    RequestBody: {
      OriginDestinationInformation: OriginDestinationInformation,
      TargetItinerary: flight,
      LegDescription: LegDescription,
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
    queryFn: () => fetchData("/gds/revalidate", "POST", payload),
    enabled: false,
  });

  console.log(allFlightsLoading);

  const handleRevalidate = () => {
    refetchAllFlights();
  };

  useEffect(() => {
    if (allFlights?.success === true) {
      setSelectedFlight(allFlights?.data?.sortedItineraries);
    }
    if (selectedFlight && Object.keys(selectedFlight).length > 0) {
      router.push("/bookingForm");
    }
  }, [allFlights, selectedFlight]);

  const { savedFlights, setSavedFlights } = useAirlineStore();

  const handleSavedFlights = () => {
    toast.success("flight saved successfully");
    setSavedFlights([...savedFlights, flight]);
  };

  return (
    <div className="w-full  bg-white rounded-[10px] shadow-md overflow-hidden mt-5 h-fit">
      <div className=" grid grid-cols-1 lg:grid-cols-7  ">
        <div className=" mb-4 col-span-3 p-8 flex flex-col justify-between gap-7">
          <div className="flex justify-between items-center mb-4 ">
            <div className="flex space-x-2">
              <span className="bg-[#DFF9FF] text-black px-5 py-2 rounded-lg text-[12px] font-semibold">
                Best
              </span>
              <span className="bg-[#CCFFE5] text-black px-5 py-2 rounded-lg text-[12px] font-semibold">
                Cheapest
              </span>
            </div>
          </div>
          <div className="flex  items-center gap-5">
            <Image
              width={50}
              height={50}
              alt="air"
              src={flight?.airline_logo}
            ></Image>
            <div>
              <p className="text-lg font-semibold">
                {flight?.departure_time} - {flight?.arrival_time}{" "}
              </p>
              <p className="text-sm text-gray-600">
                {flight?.origin_code} -{flight?.destination_code}{" "}
              </p>
            </div>
          </div>
          <div>
            <p className="text-[#5F6D77] text-[14px]">{flight?.airline_name}</p>
          </div>
          <div>
            <p className="text-[#5F6D77] text-[14px]">{flight?.gds}</p>
          </div>
        </div>
        <div className="text-right col-span-2">
          <div className="flex space-x-2 justify-around p-6">
            <div className="text-gray-600 hover:text-gray-800 flex flex-col gap-10 ">
              <button
                className="border px-2 py-1 flex items-center gap-2 rounded-lg"
                onClick={() => handleSavedFlights(flight.id)}
              >
                <Heart className="w-5 h-5" />
                <p>Save</p>
              </button>
              <p className="text-sm font-semibold text-start">
                {flight?.schedules.length > 1 ? "Multi city" : "Direct"}
              </p>
            </div>
            <div className="text-gray-600 hover:text-gray-800 flex flex-col gap-10 ">
              <button className="border px-2 py-1 flex items-center gap-2 rounded-lg">
                <Share2 className="w-5 h-5" />
                <p>Share</p>
              </button>
              <p className="text-sm font-semibold text-start">
                {flight?.flight_duration}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center col-span-2 border-0 lg:border-s">
          <div className=" p-6 text-start flex flex-col gap-2">
            <CardIcon />
            <span className="text-[31px] font-bold ">
              TK.{flight?.fare_details?.base_fare}
            </span>
            <p className="text-sm text-[#1A2024] text[14px] font-semibold">
              /Person
            </p>
            <p className="text-xs text-[#1A2024] text-[14px]  font-semibold">
              Tk.{flight?.fare_details?.total_fare} total
            </p>
            <p className="text-xs text-[#1A2024] text-[14px]">
              {flight?.passenger_infos[0]?.cabin_class}
            </p>

            <button
              onClick={() => handleRevalidate()}
              className=" bg-[#FC660F] text-white py-3 font-semibold hover:bg-orange-600 transition duration-300 rounded-lg w-[200px] h-[49px]"
            >
              {allFlightsLoading ? (
                <div className="flex justify-center items-center ">
                  <Oval
                    visible={true}
                    height="20"
                    width="20"
                    color="#fff"
                    ariaLabel="oval-loading"
                    wrapperStyle={{
                      backgroundColor: "transparent",
                    }}
                    wrapperClass=""
                  />
                </div>
              ) : (
                <span>Select</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
