"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CardIcon from "@/public/icons/CardIcon";
import { Heart, Share2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import useAirlineStore from "../../../stores/airlineStore";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import { Oval } from "react-loader-spinner";
import { unifyTimeFormat } from "@/lib/unifyTimeFormat";
import { normalizeSeatClass } from "@/lib/normalizeSeatClass";
import { formatFlightFare } from "@/lib/formatFlightFare";
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
export default function FlightCard({ flight }) {
  const router = useRouter();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const {
    searchData,
    OriginDestinationInformation,
    setLegDescription,
    LegDescription,
    setSelectedFlight,
    selectedFlight,
    isOpenSavedDialog,
    setIsOpenSavedDialog,
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

  const handleSavedFlights = (id) => {
    const isFlightSaved = savedFlights.some(
      (savedFlight) =>
        savedFlight.air_pricing_solution_key === flight.air_pricing_solution_key
    );

    if (isFlightSaved) {
      setSavedFlights(
        savedFlights.filter(
          (savedFlight) =>
            savedFlight.air_pricing_solution_key !==
            flight.air_pricing_solution_key
        )
      );
      toast.success("Flight removed from saved!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      setSavedFlights([...savedFlights, flight]);
      setIsOpenSavedDialog(true);
      toast.success("Flight saved successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleShare = (platform) => {
    const shareText = `Check out this amazing flight on ${
      flight?.airline_name
    }: ${flight?.origin_code} to ${
      flight?.destination_code
    } for BDT ${formatFlightFare(flight?.fare_details?.total_fare)} total.`;

    const url = window.location.href;
    const flightImageUrl = flight?.airline_logo || "DEFAULT_IMAGE_URL";

    let shareUrl;

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}&quote=${encodeURIComponent(shareText)}&picture=${encodeURIComponent(
          flightImageUrl
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "youtube":
        shareUrl = `https://www.youtube.com/watch?v=YOUR_VIDEO_ID`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
    setIsShareModalOpen(false);
  };

  return (
    <div className="w-full bg-white rounded-[7px] shadow-md overflow-hidden mt-5 h-fit hover:border transition-all ease-in-out border-black cursor-pointer">
      <div className=" grid grid-cols-1 lg:grid-cols-8  ">
        <div className="  col-span-3 p-3 flex flex-col justify-between ">
          <div className="flex justify-between items-center ">
            <div className="flex space-x-2">
              <span className="bg-[#DFF9FF] text-black px-4 py-1 rounded-lg text-[12px] font-semibold">
                Best
              </span>
              <span className="bg-[#CCFFE5] text-black px-4 py-1 rounded-lg text-[12px] font-semibold">
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
                {unifyTimeFormat(flight?.departure_time)} -{" "}
                {unifyTimeFormat(flight?.arrival_time)}{" "}
              </p>

              <div>
                <p className="text-[#5F6D77] text-[14px]">
                  {flight?.airline_name}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[#5F6D77] text-[14px]">{flight?.gds}</p>
          </div>
        </div>
        <div className="text-right col-span-3">
          <div className="flex justify-end  gap-5 p-2">
            <div
              className={`text-gray-600 hover:text-gray-800 flex flex-col gap-10 `}
            >
              <button
                className={`border px-2 py-1 flex items-center gap-2 rounded-lg ${
                  savedFlights.some(
                    (savedFlight) =>
                      savedFlight.air_pricing_solution_key ===
                      flight.air_pricing_solution_key
                  )
                    ? "bg-black text-white"
                    : "bg-transparent"
                }`}
                onClick={() =>
                  handleSavedFlights(flight.air_pricing_solution_key)
                }
              >
                <Heart className="w-3 h-3" />

                {savedFlights.some(
                  (savedFlight) =>
                    savedFlight.air_pricing_solution_key ===
                    flight.air_pricing_solution_key
                ) ? (
                  <p className="text-[12px] ">Saved</p>
                ) : (
                  <p className="text-[12px]">Save</p>
                )}
              </button>
              <p className="text-sm font-semibold text-start">
                {flight?.schedules.length > 1 ? "Multi city" : "Direct"}
              </p>
            </div>
            <div className="text-gray-600 hover:text-gray-800 flex flex-col gap-10">
              <button
                className="border px-2 py-1 flex items-center gap-2 rounded-lg"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 className="w-3 h-3" />
                <p className="text-[12px]">Share</p>
              </button>
              <p className="text-sm font-semibold text-start">
                {flight?.flight_duration}
              </p>
            </div>
          </div>
        </div>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-80">
              <h3 className="text-lg font-semibold text-center mb-4">
                Share this flight
              </h3>
              <div className="text-gray-600 hover:text-gray-800 flex flex-col gap-5">
                <button
                  className="border px-2 py-1 flex items-center gap-2 rounded-lg"
                  onClick={() => handleShare("facebook")}
                >
                  <FaFacebook className="w-4 h-4 text-blue-600" />
                  <p className="text-[12px]">Share to Facebook</p>
                </button>

                <button
                  className="border px-2 py-1 flex items-center gap-2 rounded-lg"
                  onClick={() => handleShare("twitter")}
                >
                  <FaTwitter className="w-4 h-4 text-blue-400" />
                  <p className="text-[12px]">Share to Twitter</p>
                </button>

                <button
                  className="border px-2 py-1 flex items-center gap-2 rounded-lg"
                  onClick={() => handleShare("youtube")}
                >
                  <FaYoutube className="w-4 h-4 text-red-600" />
                  <p className="text-[12px]">Share to YouTube</p>
                </button>

                <button
                  className="mt-4 w-full bg-gray-400 text-white py-2 px-4 rounded-md"
                  onClick={() => setIsShareModalOpen(false)} // Close modal
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center col-span-2 border-0 lg:border-s">
          <div className=" p-2 text-start flex flex-col gap-2">
            {/* <CardIcon /> */}
            <span className="text-[20px] font-bold ">
              TK.{formatFlightFare(flight?.fare_details?.base_fare)}
            </span>
            <p className="text-sm text-[#1A2024] text[14px] font-semibold">
              /Person
            </p>
            <p className="text-xs text-[#1A2024] text-[14px]  font-semibold">
              Tk.{formatFlightFare(flight?.fare_details?.total_fare)} total
            </p>
            <p className="text-xs text-[#1A2024] text-[14px]">
              {normalizeSeatClass(flight?.passenger_infos[0]?.cabin_class)}
            </p>

            <button
              onClick={() => handleRevalidate()}
              className=" bg-[#FC660F] text-white py-2 font-semibold hover:bg-orange-600 transition duration-300 rounded-lg w-[160px] h-full"
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
