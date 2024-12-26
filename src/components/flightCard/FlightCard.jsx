"use client";
import { formatFlightFare } from "@/lib/formatFlightFare";
import { convertMinutesToHours } from "@/lib/formatMinutes";
import { normalizeSeatClass } from "@/lib/normalizeSeatClass";
import { unifyTimeFormat } from "@/lib/unifyTimeFormat";
import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { RxCross2 } from "react-icons/rx";

import useSyncSavedFlights from "@/hooks/useSyncSavedFlights";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
import copy from "copy-to-clipboard";

export default function FlightCard({ flight }) {
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
  } = useAirlineStore();
  const { syncSavedFlights } = useSyncSavedFlights();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShowFlightDetails, setIsShowFlightDetails] = useState(false);
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
    const res = await refetchAllFlights();
    if (res?.status === "success") {
      setSelectedFlight(res?.data?.data?.sortedItineraries);
      router.push("/bookingForm");
    }
  };

  // useEffect(() => {
  //   if (selectedFlight && Object.keys(selectedFlight).length > 0) {
  //     router.push("/bookingForm");
  //   }
  // }, [allFlights]);

  useEffect(() => {
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
  }, [router]);

  // const handleSavedFlights = (id) => {
  //   const isFlightSaved = selectedSavedTrip.flights.some(
  //     (savedFlight) =>
  //       savedFlight?.trip_data?.air_pricing_solution_key ===
  //       flight?.air_pricing_solution_key
  //   );

  //   // if (token) {
  //   //   syncSavedFlights(token);
  //   // }

  //   if (isFlightSaved) {
  //     setSavedTrips(
  //       selectedSavedTrip.flights.filter(
  //         (savedFlight) =>
  //           savedFlight?.trip_data?.air_pricing_solution_key !==
  //           flight?.air_pricing_solution_key
  //       )
  //     );
  //     // toast.success("Flight removed from saved!", {
  //     //   position: "top-center",
  //     //   autoClose: 5000,
  //     //   hideProgressBar: false,
  //     //   closeOnClick: true,
  //     //   pauseOnHover: true,
  //     //   draggable: true,
  //     //   progress: undefined,
  //     //   theme: "colored",
  //     // });
  //   } else {
  //     setSavedTrips([...savedTrips, { flight_data: flight }]);
  //     setIsOpenSavedDialog(true);
  //     // toast.success("Flight saved successfully!", {
  //     //   position: "top-center",
  //     //   autoClose: 5000,
  //     //   hideProgressBar: false,
  //     //   closeOnClick: true,
  //     //   pauseOnHover: true,
  //     //   draggable: true,
  //     //   progress: undefined,
  //     //   theme: "colored",
  //     // });
  //   }
  // };

  const handleSavedFlights = (solution_key) => {
    // Check if the flight is already saved in the selected trip's flights
    // const isFlightSaved = selectedSavedTrip.flights.some(
    //   (savedFlight) =>
    //     savedFlight?.trip_data?.air_pricing_solution_key === solution_key
    // );

    setIsOpenSavedDialog(true);
    if (savedTrips.length === 0) {
      setIsChangeTrip(true);
      toast.info("Please create a Trip first");
      return;
    }

    // Update the savedTrips array
    const updatedSavedTrips = savedTrips.map((trip) => {
      if (trip.name === selectedSavedTrip.name) {
        // Found the selected trip to update
        return {
          ...trip,
          flights: [...trip?.flights, { flight_data: flight }],
        };
      }
      // Return other trips unchanged
      return trip;
    });

    // Update the state with the modified savedTrips array
    setSavedTrips(updatedSavedTrips);

    //update selected saved trip data
    updatedSavedTrips.forEach((trip) => {
      if (trip.name === selectedSavedTrip.name) {
        setSelectedSavedTrip(trip);
      }
    });

    // if (isFlightSaved) {
    //   // Optionally show a success message for removal
    //   // toast.success("Flight removed from saved!", { ... });
    // } else {
    //   // Optionally show a success message for addition
    //   // toast.success("Flight saved successfully!", { ... });
    // }
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
                {convertMinutesToHours(departureElapsedTime)}
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
                {convertMinutesToHours(arrivalElapsedTime)}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div
        onClick={toggleFlightDetails}
        className="w-full  bg-white rounded-[7px] shadow-md overflow-hidden mt-5 h-fit border border-white transition-all  duration-500  hover:border-black cursor-pointer"
      >
        {sharedInfo?.departure_time == flight?.departure_time &&
          sharedInfo?.arrival_time == flight?.arrival_time &&
          condition && (
            <div className="border-b w-full p-3">
              <p className="text-[15px]">Shared flight</p>
            </div>
          )}
        <div className=" grid grid-cols-1 lg:grid-cols-8  ">
          <div className="  col-span-6 p-3 flex flex-col justify-between">
            <div className="flex justify-between items-center  flex-wrap">
              <div className="flex space-x-2">
                <span className="bg-[#DFF9FF] text-black px-4 py-1 rounded-lg text-[12px] font-semibold">
                  Best
                </span>
                <span className="bg-[#CCFFE5] text-black px-4 py-1 rounded-lg text-[12px] font-semibold">
                  Cheapest
                </span>
              </div>
              <div className="text-right col-span-3">
                <div className="flex justify-end  gap-5 p-2">
                  <div
                    className={`text-gray-600 hover:text-gray-800 flex flex-col gap-10 `}
                  >
                    <button
                      className={`border px-2 py-1 flex items-center gap-2 rounded-lg ${
                        savedTrips.some(
                          (savedFlight) =>
                            savedFlight?.trip_data?.air_pricing_solution_key ===
                            flight?.air_pricing_solution_key
                        )
                          ? "bg-black text-white"
                          : "bg-transparent"
                      }`}
                      onClick={() =>
                        handleSavedFlights(flight.air_pricing_solution_key)
                      }
                    >
                      <Heart className="w-3 h-3" />

                      {savedTrips.some(
                        (savedFlight) =>
                          savedFlight?.trip_data?.air_pricing_solution_key ===
                          flight?.air_pricing_solution_key
                      ) ? (
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

            {flight?.itinerary_leg_descs?.length == 1 ? (
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

                            {/* <div>
                            <p className="text-[#5F6D77] text-[14px]">
                              {flight?.airline_name}
                            </p>
                            <p className="text-[#5F6D77] text-[14px]">
                              {flight?.departure_date}
                            </p>
                          </div> */}
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
            )}

            <div>
              <p className="text-[#5F6D77] text-[14px]">{flight?.gds}</p>
            </div>
          </div>

          {isShareModalOpen && (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 max-w-full  md:max-w-[450px] py-8 flex flex-col gap-5">
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
                    <span className="text-[16px] font-bold ">
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
