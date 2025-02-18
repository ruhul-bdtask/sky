"use client";
import { formatFlightFare } from "@/lib/formatFlightFare";
import { formatMinutesToHours } from "@/lib/formatMinutesToHours";
import { normalizeSeatClass } from "@/lib/normalizeSeatClass";
import { unifyTimeFormat } from "@/lib/unifyTimeFormat";
import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { RxCross2 } from "react-icons/rx";

import { useAirlines } from "@/hooks/useAirlines";
import useSyncSavedFlights from "@/hooks/useSyncSavedFlights";
import formatDateTime from "@/lib/formatDateTime";
import copy from "copy-to-clipboard";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaLink,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import useAirlineStore from "../../../stores/airlineStore";
import FlightDetails from "./FlightDetails";
import { useMemo } from "react";

export default function FlightCard({
  flight,
  setLoadingRevalidate,
  sortCriteria,
  type,
}) {
  const router = useRouter();
  const {
    token,
    searchData,
    OriginDestinationInformation,
    setLegDescription,
    savedTrips,
    isCreateTrip,
    isChangeTrip,
    isOpenSavedDialog,
    LegDescription,
    selectedSavedTrip,
    setSelectedFlight,
    selectedFlight,
    setIsOpenSavedDialog,
    setSelectedSavedTrip,
    setIsCreateTrip,
    setSavedTrips,
    setIsChangeTrip,
    savedSingleFlight,
    setSavedSingleFlight,
    setTravelPlanningDate,
  } = useAirlineStore();
  const { syncSavedFlights } = useSyncSavedFlights();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShowFlightDetails, setIsShowFlightDetails] = useState(false);
  const { airlinesData } = useAirlines();
  const pathname = usePathname();
  const toggleFlightDetails = (e) =>
    setIsShowFlightDetails(!isShowFlightDetails);
  const [sharedInfo, setSharedInfo] = useState();
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

  const handleRevalidate = async () => {
    setLoadingRevalidate(true);
    setTravelPlanningDate("");
    const res = await refetchAllFlights();
    if (res?.status === "success") {
      if (res?.data?.data) {
        setSelectedFlight(res?.data?.data?.sortedItineraries);
        router.push("/bookingForm");
        setLoadingRevalidate(false);
      } else {
        toast.error(res?.data?.message);
        setLoadingRevalidate(false);
      }
    }
  };

  const getAirline = (srtCode) => {
    const airline = airlinesData.find((airline) => airline?.iata === srtCode);
    return airline ? airline.name : "Unknown Airline";
  };

  useEffect(() => {
    const existingDepartureTime = searchParams.get("departure_time");
    const existingArrivalTime = searchParams.get("arrival_time");
    const flight_number = searchParams.get("flight_number");
    const operating_code = searchParams.get("operating_code");
    if (
      !existingDepartureTime &&
      !existingArrivalTime &&
      !flight_number &&
      !operating_code
    ) {
      const filterInfo = {
        departure_time: savedSingleFlight?.departure_time,
        arrival_time: savedSingleFlight?.arrival_time,
        flight_number: savedSingleFlight?.flight_number,
        operating_code: savedSingleFlight?.operating_code,
      };
      setSharedInfo(filterInfo);
    } else {
      const filterInfo = {
        departure_time: existingDepartureTime,
        arrival_time: existingArrivalTime,
        flight_number,
        operating_code,
      };
      setSharedInfo(filterInfo);
    }
  }, [router]);

  useEffect(() => {
    if (pathname !== "/search-result") {
      setSavedSingleFlight({});
    }
  }, [router]);

  const handleSavedFlights = async (flight, action) => {
    // open SaveDialog
    setIsOpenSavedDialog(true);

    // Check if the savedTrips array is empty
    if (action === "save" && savedTrips.length === 0) {
      setIsChangeTrip(true);
      toast.info("Please create a trip first");
      return;
    }

    // Always prompt the user to select a trip
    if (action === "save" && !selectedSavedTrip?.name) {
      setIsChangeTrip(true);
      toast.info("Please select a trip to save the flight");
      return;
    }

    // getting matching flight to remove
    const matchingFlight = savedTrips
      .map((trip) =>
        trip.flights?.find(
          (fl) =>
            fl?.flight_data?.airline_code === flight?.airline_code &&
            fl?.flight_data?.destination_code === flight?.destination_code &&
            fl?.flight_data?.origin_code === flight?.origin_code &&
            fl?.flight_data?.departure_date === flight?.departure_date &&
            fl?.flight_data?.arrival_date === flight?.arrival_date &&
            fl?.flight_data?.arrival_time === flight?.arrival_time &&
            fl?.flight_data?.departure_time === flight?.departure_time &&
            fl?.flight_data?.air_pricing_solution_key ===
              flight?.air_pricing_solution_key
        )
      )
      .find((flight) => flight !== undefined);

    let flightAlreadySaved = false;

    // Check if the flight already exists in any trip and update the trips
    let updatedSavedTrips = savedTrips.map((trip) => {
      const flightExists = trip?.flights?.some(
        (fl) =>
          fl?.flight_data?.airline_code === flight?.airline_code &&
          fl?.flight_data?.destination_code === flight?.destination_code &&
          fl?.flight_data?.origin_code === flight?.origin_code &&
          fl?.flight_data?.departure_date === flight?.departure_date &&
          fl?.flight_data?.arrival_date === flight?.arrival_date &&
          fl?.flight_data?.arrival_time === flight?.arrival_time &&
          fl?.flight_data?.departure_time === flight?.departure_time &&
          fl?.flight_data?.air_pricing_solution_key ===
            flight?.air_pricing_solution_key
      );

      if (flightExists) {
        flightAlreadySaved = true;

        // Remove the flight from the current trip
        return {
          ...trip,
          flights: trip.flights.filter(
            (fl) =>
              !(
                fl?.flight_data?.airline_code === flight?.airline_code &&
                fl?.flight_data?.destination_code ===
                  flight?.destination_code &&
                fl?.flight_data?.origin_code === flight?.origin_code &&
                fl?.flight_data?.departure_date === flight?.departure_date &&
                fl?.flight_data?.arrival_date === flight?.arrival_date &&
                fl?.flight_data?.arrival_time === flight?.arrival_time &&
                fl?.flight_data?.departure_time === flight?.departure_time &&
                fl?.flight_data?.air_pricing_solution_key ===
                  flight?.air_pricing_solution_key
              )
          ),
        };
      }
      return trip; // Keep other trips unchanged
    });

    if (flightAlreadySaved) {
      // Send DELETE request to remove the flight from the database
      if (token) {
        const payload = { flight_uid: matchingFlight.uid };
        const response = await fetchData(
          "/gds/remove-flight",
          "POST",
          payload,
          token
        );
        if (response.success) {
          const res = await fetchData(
            "/gds/get-saved-trips",
            "GET",
            null,
            token
          );
          if (res.success) {
            toast.success("Flight removed successfully!");
            setSavedTrips(res.data); // update the state with the modified trips
            setIsChangeTrip(false);
          }
          return;
        } else {
          console.error(response);
          toast.error(response?.errors?.[0] ?? "An unexpected error occurred.");
          return;
        }
      }
    } else {
      // Send POST request to save the flight to the database
      if (token) {
        const payload = {
          data: [{ trip_id: selectedSavedTrip?.id, flight_data: flight }],
        };
        const response = await fetchData(
          "/gds/save-flights",
          "POST",
          payload,
          token
        );
        if (response.success) {
          const res = await fetchData(
            "/gds/get-saved-trips",
            "GET",
            null,
            token
          );
          if (res.success) {
            toast.success("Flight saved successfully!");
            setSavedTrips(res.data); // Update the state with the modified trips
            setIsChangeTrip(false);
          }
          return;
        } else {
          console.error(response);
          toast.error(response?.errors?.[0] ?? "An unexpected error occurred.");
          return;
        }
      }
    }

    // if user has no token
    if (flightAlreadySaved) {
      setSavedTrips(updatedSavedTrips);
      setIsChangeTrip(false);
    } else {
      // Add the flight to the selectedSavedTrip
      updatedSavedTrips = updatedSavedTrips.map((trip) => {
        if (trip?.name === selectedSavedTrip?.name) {
          return {
            ...trip,
            flights: [...trip?.flights, { flight_data: flight }],
          };
        }
        return trip;
      });
      setSavedTrips(updatedSavedTrips);
      setIsChangeTrip(false);
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
        window.open(shareUrl, "_blank");

        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank");

        break;
      case "youtube":
        shareUrl = `https://www.youtube.com/watch?v=YOUR_VIDEO_ID`;
        window.open(shareUrl, "_blank");

        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `${shareText}\n${url}`
        )}`;
        window.open(shareUrl, "_blank");
        break;

      case "copyUrl":
        // navigator?.clipboard?.writeText(url);
        copy(url);
        toast.success("Copied to clipboard");
        break;
      default:
        return;
    }

    setIsShareModalOpen(false);

    const existingDepartureTime = searchParams.get("departure_time");
    const existingArrivalTime = searchParams.get("arrival_time");
    const flight_number = searchParams.get("flight_number");
    const operating_code = searchParams.get("operating_code");

    const filterInfo = {
      departure_time: existingDepartureTime,
      arrival_time: existingArrivalTime,
      flight_number,
      operating_code,
    };
    setSharedInfo(filterInfo);
  };

  const searchParams = useSearchParams();

  let customFlightFilter = [];
  OriginDestinationInformation.map((item) => {
    customFlightFilter.push(item?.OriginLocation.LocationCode);
  });

  const scheduleInfo = flight.schedules.map((schedule) => {
    return {
      flight_number: schedule.flight_number,
      operating_code: schedule.operating_code,
    };
  });

  const handleShareFilter = (departure_time, arrival_time) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const newFilter = {
      departure_time,
      arrival_time,
      flight_number: scheduleInfo.map((pro) => pro.flight_number),
      operating_code: scheduleInfo.map((pro) => pro.operating_code),
    };
    if (
      newFilter.departure_time &&
      newFilter.arrival_time &&
      newFilter.flight_number &&
      newFilter.operating_code
    ) {
      Object.entries(newFilter).forEach(([key, value]) => {
        currentParams.set(key, value);
      });

      const queryString = currentParams.toString();

      setIsShareModalOpen(true);
      router.push(`/search-result?${queryString}`);
    }
  };
  const shareExtraConditions = flight?.schedules?.map((schedule, i) => {
    return (
      sharedInfo?.flight_number?.includes(String(schedule.flight_number)) &&
      sharedInfo.operating_code?.includes(String(schedule.operating_code))
    );
  });

  const condition = shareExtraConditions.every((inc) => inc === true);

  const generateComp = (schedules) => {
    const dacToJfkStart = schedules.findIndex(
      (flight) => flight.departure_airport === customFlightFilter[0]
    );
    const dacToJfkEnd =
      schedules.findIndex(
        (flight) => flight.arrival_airport === customFlightFilter[1]
      ) + 1;

    const jfkToDacStart = schedules.findIndex(
      (flight) => flight.departure_airport === customFlightFilter[1]
    );
    const jfkToDacEnd =
      schedules.findIndex(
        (flight) => flight.arrival_airport === customFlightFilter[0]
      ) + 1;

    // Slicing the arrays
    const departureHereToThere = schedules.slice(dacToJfkStart, dacToJfkEnd);
    const departureThereToHere = schedules.slice(jfkToDacStart, jfkToDacEnd);

    let departureElapsedTime = departureHereToThere
      .map(
        (item) =>
          parseInt(item.elapsed_time) +
          parseInt(item.layover_time ? item.layover_time : 0)
      )
      .reduce((a, b) => a + b, 0);

    let arrivalElapsedTime = departureThereToHere
      .map(
        (item) =>
          parseInt(item.elapsed_time) +
          parseInt(item.layover_time ? item.layover_time : 0)
      )
      .reduce((a, b) => a + b, 0);

    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center gap-5 mt-2">
            <div className="flex items-center gap-5">
              <Image
                width={50}
                height={50}
                alt="air"
                src={flight?.airline_logo}
              ></Image>
              <div>
                <p className="text-[13px]">
                  {departureHereToThere[0]?.departure_airport} -{" "}
                  {
                    departureHereToThere[departureHereToThere.length - 1]
                      ?.arrival_airport
                  }
                </p>
                <p className="text-lg font-semibold">
                  {unifyTimeFormat(departureHereToThere[0]?.departure_time)} -{" "}
                  {unifyTimeFormat(
                    departureHereToThere[departureHereToThere.length - 1]
                      ?.arrival_time
                  )}{" "}
                </p>

                <div>
                  <p className="text-[#5F6D77] text-[12px]">
                    {flight?.airline_name}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-5">
              <p className="text-sm font-semibold text-start">
                {flight?.schedules.length === 0 && " Direct"}
                {flight?.schedules.length === 1 && "1 Stop"}
                {flight?.schedules.length > 1 &&
                  flight?.schedules.length + " " + "Stops"}
              </p>
              <p className="text-sm font-semibold text-start">
                {formatMinutesToHours(departureElapsedTime)}
              </p>
            </div>
          </div>

          {/* second */}
          <div className="flex justify-between items-center gap-5">
            <div className="flex items-center gap-5">
              <Image
                width={50}
                height={50}
                alt="air"
                src={flight?.airline_logo}
              ></Image>
              <div>
                <p className="text-[13px]">
                  {departureThereToHere[0]?.departure_airport} -{" "}
                  {
                    departureThereToHere[departureThereToHere.length - 1]
                      ?.arrival_airport
                  }
                </p>
                <p className="text-lg font-semibold">
                  {unifyTimeFormat(departureThereToHere[0]?.departure_time)} -{" "}
                  {unifyTimeFormat(
                    departureThereToHere[departureThereToHere.length - 1]
                      ?.arrival_time
                  )}{" "}
                </p>

                <div>
                  <p className="text-[#5F6D77] text-[12px]">
                    {flight?.airline_name}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-5">
              <p className="text-sm font-semibold text-start">
                {flight?.schedules.length === 0 && " Direct"}
                {flight?.schedules.length === 1 && "1 Stop"}
                {flight?.schedules.length > 1 &&
                  flight?.schedules.length + " " + "Stops"}
              </p>
              <p className="text-sm font-semibold text-start">
                {formatMinutesToHours(arrivalElapsedTime)}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  const isSavedFlight = useMemo(() => {
    return savedTrips?.some((trip) =>
      trip?.flights?.some(
        (fl) =>
          fl?.flight_data?.airline_code === flight?.airline_code &&
          fl?.flight_data?.destination_code === flight?.destination_code &&
          fl?.flight_data?.origin_code === flight?.origin_code &&
          fl?.flight_data?.departure_date === flight?.departure_date &&
          fl?.flight_data?.arrival_date === flight?.arrival_date &&
          fl?.flight_data?.arrival_time === flight?.arrival_time &&
          fl?.flight_data?.departure_date === flight?.departure_date
      )
    );
  }, [savedTrips, flight]);
  return (
    <>
      {/* Mobile */}
      <div
        onClick={toggleFlightDetails}
        className="max-w-md mx-auto w-full  h-fit border border-white transition-all  duration-500  hover:border-black cursor-pointer bg-white rounded-[7px] shadow-md overflow-hidden  block md:hidden my-10"
      >
        {/* Header with airline and save button */}

        {/* Cheapest tag */}
        <div className="flex space-x-2 p-2">
          {flight?.tags?.includes("Best") && sortCriteria === "best" && (
            <span className="bg-[#DFF9FF] text-black px-4 py-1 rounded-lg text-[12px] font-semibold">
              Best
            </span>
          )}
          {flight?.tags?.includes("Cheapest") && sortCriteria === "best" && (
            <span className="bg-[#CCFFE5] text-black px-4 py-1 rounded-lg text-[12px] font-semibold">
              Cheapest
            </span>
          )}

          {/* {flight?.tags?.includes("Quickest") &&
                  sortCriteria === "best" && (
                    <span className="bg-[#F9F6E6] text-black px-4 py-1 rounded-lg text-[12px] font-semibold">
                      Quickest
                    </span>
                  )} */}
        </div>

        {/* Flight details */}
        <div className="flex justify-between items-center p-4">
          <div className="flex flex-col gap-5">
            {flight?.itinerary_leg_descs?.map((leg, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div>
                    <img
                      src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${leg?.marketing_code}.png`}
                      // src={`https://pics.avs.io/200/200/${stop?.operating_code}@2x.png`}
                      alt="airline logo"
                      className="w-[30px] h-[30px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {formatDateTime(leg?.departure_datetime).time}
                    </span>
                    <span className="text-sm text-gray-500">
                      {leg?.departure_location}
                    </span>
                  </div>

                  <div className="flex flex-col items-center flex-1">
                    <div className="w-full flex items-center">
                      <div className="h-[1px] flex-1 bg-gray-300"></div>
                      <div className="text-xs text-gray-500 mx-2">
                        {formatMinutesToHours(leg?.duration)}
                      </div>
                      <div className="h-[1px] flex-1 bg-gray-300"></div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {formatDateTime(leg?.arrival_datetime).time}
                    </span>
                    <span className="text-sm text-gray-500">
                      {leg?.arrival_location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Return flight details */}

          {/* Price section */}
          <div className="">
            <div>
              <span className="text-md font-bold">
                {" "}
                TK.{formatFlightFare(flight?.fare_details?.total_fare)}
              </span>
              <p className="text-xs text-[#1A2024] text-[14px]">
                {normalizeSeatClass(flight?.passenger_infos[0]?.cabin_class)}
              </p>{" "}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRevalidate();
              }}
              disabled={allFlightsLoading}
              className={` bg-[#FC660F] text-white mt-2 font-semibold hover:bg-orange-600 transition duration-300 rounded-md w-full h-full `}
            >
              {allFlightsLoading ? (
                <div className="flex justify-center items-center py-2">
                  <Oval
                    visible={true}
                    height="10"
                    width="10"
                    color="#fff"
                    secondaryColor="#fff"
                    ariaLabel="oval-loading"
                    wrapperStyle={{
                      backgroundColor: "transparent",
                    }}
                    wrapperClass=""
                  />
                </div>
              ) : (
                <p className="text-sm text-center py-1">Select</p>
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-gray-200 p-2">
          <p className="text-xs">{flight?.airline_name}</p>
          {/* <button className="flex items-center text-gray-600 px-3 py-1 rounded-md border border-gray-300">
            <span className="mr-1">Save</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button> */}
          <button
            className={`border px-2 py-1 flex items-center gap-2 rounded-lg ${
              isSavedFlight ? "bg-black text-white" : "bg-transparent"
            }`}
            onClick={() =>
              handleSavedFlights(flight, isSavedFlight ? "remove" : "save")
            }
          >
            <Heart className="w-3 h-3" />

            {isSavedFlight ? (
              <p className="text-[12px] ">Saved</p>
            ) : (
              <p className="text-[12px]">Save</p>
            )}
          </button>
        </div>
        {isShowFlightDetails && <FlightDetails flight={flight} />}
      </div>

      {/* Web */}
      <div
        onClick={toggleFlightDetails}
        className={`w-full  bg-white rounded-[7px] shadow-md overflow-hidden hidden md:block ${
          type == "shared" ? "mt-0 mb-5" : "mt-5 mb-0"
        }  h-fit border border-white transition-all  duration-500  hover:border-black cursor-pointer`}
      >
        {sharedInfo?.departure_time == flight?.departure_time &&
          sharedInfo?.arrival_time == flight?.arrival_time &&
          condition &&
          type == "shared" && (
            <div className="border-b w-full p-3">
              <p className="text-[15px]">Shared flight</p>
            </div>
          )}
        <div className=" grid grid-cols-1 lg:grid-cols-8  ">
          <div className="  col-span-6 p-3 flex flex-col justify-between">
            <div className="flex justify-between items-center  flex-wrap">
              <div className="flex space-x-2">
                {flight?.tags?.includes("Best") && sortCriteria === "best" && (
                  <span className="bg-[#DFF9FF] text-black px-4 py-1 rounded-lg text-[12px] font-semibold">
                    Best
                  </span>
                )}
                {flight?.tags?.includes("Cheapest") &&
                  sortCriteria === "best" && (
                    <span className="bg-[#CCFFE5] text-black px-4 py-1 rounded-lg text-[12px] font-semibold">
                      Cheapest
                    </span>
                  )}
                {/* {flight?.tags?.includes("Quickest") &&
                  sortCriteria === "best" && (
                    <span className="bg-[#F9F6E6] text-black px-4 py-1 rounded-lg text-[12px] font-semibold">
                      Quickest
                    </span>
                  )} */}
              </div>
              <div className="text-right col-span-3">
                <div className="flex justify-end  gap-5 p-2">
                  <div
                    className={`text-gray-600 hover:text-gray-800 flex flex-col gap-10 `}
                  >
                    <button
                      className={`border px-2 py-1 flex items-center gap-2 rounded-lg ${
                        isSavedFlight ? "bg-black text-white" : "bg-transparent"
                      }`}
                      onClick={() =>
                        handleSavedFlights(
                          flight,
                          isSavedFlight ? "remove" : "save"
                        )
                      }
                    >
                      <Heart className="w-3 h-3" />

                      {isSavedFlight ? (
                        <p className="text-[12px] ">Saved</p>
                      ) : (
                        <p className="text-[12px]">Save</p>
                      )}
                    </button>
                  </div>
                  <div className="text-gray-600 hover:text-gray-800 flex flex-col gap-10">
                    <button
                      className="border px-2 py-1 flex items-center gap-2 rounded-lg"
                      onClick={() =>
                        handleShareFilter(
                          flight?.departure_time,
                          flight?.arrival_time
                        )
                      }
                    >
                      <Share2 className="w-3 h-3" />
                      <p className="text-[12px]">Share</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 
            <p className="text-sm font-semibold text-start">
                      {flight?.flight_duration}
                    </p>
                    <p className="text-sm font-semibold text-start">
                      {flight?.schedules.length > 1 ? "Multi city" : "Direct"}
                    </p> */}
            <div className="flex flex-col gap-3">
              {flight?.itinerary_leg_descs?.map((leg, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center gap-5 flex-wrap"
                >
                  <div className="flex items-center gap-5">
                    {/* <Image
                    width={50}
                    height={50}
                    alt="air"
                    src={flight?.airline_logo}
                  ></Image> */}
                    <img
                      src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${leg?.marketing_code}.png`}
                      // src={`https://pics.avs.io/200/200/${stop?.operating_code}@2x.png`}
                      alt="airline logo"
                      className="w-[30px] h-[30px]"
                    />

                    <div>
                      <p className="text-[13px]">
                        {leg?.departure_location} - {leg?.arrival_location}
                      </p>
                      <p className="text-lg font-semibold">
                        {formatDateTime(leg?.departure_datetime).time} -{" "}
                        {formatDateTime(leg?.arrival_datetime).time}
                      </p>

                      <div>
                        <p className="text-[#5F6D77] text-[13px]">
                          {getAirline(leg?.marketing_code)}
                        </p>
                        <p className="text-[#5F6D77] text-[13px]">
                          {formatDateTime(leg?.departure_datetime).date}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <p className="text-sm font-semibold text-start">
                      {formatMinutesToHours(leg?.duration)}
                    </p>
                    <p className="text-sm font-semibold text-start">
                      {leg?.stop_count === 0 && " Direct"}
                      {leg?.stop_count === 1 && "1 Stop"}
                      {leg?.stop_count > 1 &&
                        leg?.stop_count + " " + "Stops"}{" "}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* {flight?.itinerary_leg_descs?.length == 1 ? (
              <div className="flex justify-between items-center gap-5 flex-wrap">
                <div className="flex items-center gap-5">
                  <Image
                    width={50}
                    height={50}
                    alt="air"
                    src={flight?.airline_logo}
                  ></Image>

                  <div>
                    <p className="text-[13px]">
                      {flight?.origin_code} - {flight?.destination_code}
                    </p>
                    <p className="text-lg font-semibold">
                      {unifyTimeFormat(flight?.departure_time)} -{" "}
                      {unifyTimeFormat(flight?.arrival_time)}{" "}
                    </p>

                    <div>
                      <p className="text-[#5F6D77] text-[14px]">
                        {flight?.airline_name}
                      </p>
                      <p className="text-[#5F6D77] text-[14px]">
                        {flight?.departure_date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5">
                  <p className="text-sm font-semibold text-start">
                    {flight?.flight_duration}
                  </p>
                  <p className="text-sm font-semibold text-start">
                    {flight?.total_stop === 0 && " Direct"}
                    {flight?.total_stop === 1 && "1 Stop"}
                    {flight?.total_stop > 1 &&
                      flight?.total_stop + " " + "Stops"}{" "}
                  </p>
                </div>
              </div>
            ) : flight?.itinerary_leg_descs?.length == 2 ? (
              <>{generateComp(flight?.schedules)}</>
            ) : (
              <>
                {" "}
                <div className="col-span-6 p-3 flex flex-col gap-6 justify-between">
                  {flight?.itinerary_leg_descs?.flat()?.map((air, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center gap-5 flex-wrap">
                        <div className="flex items-center gap-5">
                          <Image
                            width={50}
                            height={50}
                            alt="air"
                            src={flight?.airline_logo}
                          ></Image>

                          <div>
                            <p className="text-[14px]">
                              {air?.departure_location} -{" "}
                              {air?.arrival_location}
                            </p>
                            <p className="text-[12px] font-semibold">
                              {air?.departure_datetime}
                            </p>

                            
                          </div>
                        </div>
                        <div className="flex gap-5">
                          <p className="text-sm font-semibold text-start">
                            {air?.duration}
                          </p>
                          <p className="text-sm font-semibold text-start">
                            {air?.stop_count === 0 && " Direct"}
                            {air?.stop_count === 1 && "1 Stop"}
                            {air?.stop_count > 1 &&
                              air?.stop_count + " " + " Stops"}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )} */}
          </div>

          {isShareModalOpen && (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 max-w-full md:max-w-[450px] py-8 flex flex-col gap-5">
                <div className="flex justify-between flex-wrap">
                  <h3 className="text-xl font-semibold text-center ">
                    Share this flight
                  </h3>
                  <p onClick={() => setIsShareModalOpen(false)}>
                    <RxCross2 />
                  </p>
                </div>
                <div className="bg-white shadow-custom_shadow px-3 mx-2 rounded-[10px] py-3 flex items-center justify-between flex-wrap">
                  <div className="flex gap-3">
                    <Image
                      width={50}
                      height={50}
                      alt="air"
                      src={flight?.airline_logo}
                    ></Image>
                    <div>
                      <p className="text-[17px] font-semibold">
                        {flight?.origin_code} - {flight?.destination_code}
                      </p>
                      <p className="text-[12px] ">
                        {unifyTimeFormat(flight?.departure_time)} -{" "}
                        {unifyTimeFormat(flight?.arrival_time)}{" "}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[16px] font-bold">
                      TK.{formatFlightFare(flight?.fare_details?.base_fare)}
                    </span>
                  </div>
                </div>
                <div className="text-gray-600 hover:text-gray-800 flex gap-5 md:gap-10 flex-wrap">
                  <button
                    className=" px-2 py-1 flex items-center gap-2 rounded-lg"
                    onClick={() => handleShare("copyUrl")}
                  >
                    <FaLink className="w-8 h-8 text-gray-600" />
                  </button>
                  <button
                    className=" px-2 py-1 flex items-center gap-2 rounded-lg"
                    onClick={() => handleShare("facebook")}
                  >
                    <FaFacebook className="w-8 h-8 text-blue-600" />
                  </button>

                  <button
                    className=" px-2 py-1 flex items-center gap-2 rounded-lg"
                    onClick={() => handleShare("twitter")}
                  >
                    <FaTwitter className="w-8 h-8 text-blue-400" />
                  </button>

                  <button
                    className=" px-2 py-1 flex items-center gap-2 rounded-lg"
                    onClick={() => handleShare("youtube")}
                  >
                    <FaYoutube className="w-8 h-8 text-red-600" />
                  </button>

                  <button
                    className=" px-2 py-1 flex items-center gap-2 rounded-lg"
                    onClick={() => handleShare("whatsapp")}
                  >
                    <FaWhatsapp className="w-8 h-8 text-green-500" />
                  </button>

                  {/* <button
                    className="mt-4 w-full bg-gray-400 text-white py-2 px-4 rounded-md"
                    
                  >
                    Close
                  </button> */}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center col-span-2 border-0 lg:border-s">
            <div className=" p-2 text-start flex flex-col gap-2">
              {/* <CardIcon /> */}
              <span className="text-[20px] font-bold ">
                TK.{formatFlightFare(flight?.fare_details?.total_fare)}
              </span>

              <p className="text-xs text-[#1A2024] text-[14px]  font-semibold">
                Tk.
                {formatFlightFare(
                  flight?.passenger_infos[0]?.approximate_total_price
                )}{" "}
                /Person
              </p>
              <p className="text-xs text-[#1A2024] text-[14px]">
                {normalizeSeatClass(flight?.passenger_infos[0]?.cabin_class)}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRevalidate();
                }}
                disabled={allFlightsLoading}
                className={` bg-[#FC660F] text-white py-2 font-semibold hover:bg-orange-600 transition duration-300 rounded-md w-[160px] h-full `}
              >
                {allFlightsLoading ? (
                  <div className="flex justify-center items-center ">
                    <Oval
                      visible={true}
                      height="20"
                      width="20"
                      color="#fff"
                      secondaryColor="#fff"
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

        {isShowFlightDetails && <FlightDetails flight={flight} />}
      </div>
    </>
  );
}
