"use client";
import { formatFlightFare } from "@/lib/formatFlightFare";
import { convertMinutesToHours } from "@/lib/formatMinutes";
import { normalizeSeatClass } from "@/lib/normalizeSeatClass";
import { unifyTimeFormat } from "@/lib/unifyTimeFormat";
import airAsia from "@/public/images/air-asia.png";
import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsFillPlugFill } from "react-icons/bs";
import { FaFacebook, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { GiCommercialAirplane } from "react-icons/gi";
import { IoWifi } from "react-icons/io5";
import {
  MdKeyboardArrowDown,
  MdOndemandVideo,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { Oval } from "react-loader-spinner";
import useAirlineStore from "../../../stores/airlineStore";
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
      // toast.success("Flight removed from saved!", {
      //   position: "top-center",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "colored",
      // });
    } else {
      setSavedFlights([...savedFlights, flight]);
      setIsOpenSavedDialog(true);
      // toast.success("Flight saved successfully!", {
      //   position: "top-center",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "colored",
      // });
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
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `${shareText}\n${url}`
        )}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
    setIsShareModalOpen(false);
  };

  let customFlightFilter = [];
  OriginDestinationInformation.map((item) => {
    customFlightFilter.push(item?.OriginLocation.LocationCode);
  });

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
                {flight?.schedules.length > 1 ? "Multi stop" : "Direct"}
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
                {flight?.schedules.length > 1 ? "Multi stop" : "Direct"}
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

  const [isShowDetail, setIsShowDetail] = useState(false);
  const [isShowIconDetail, setIsShowIconDetail] = useState(false);

  const handleFlightDetailToggler = (e) => {
    setIsShowDetail(!isShowDetail);
  };
  const handleIconDetailToggler = (e) => {
    setIsShowIconDetail(!isShowIconDetail);
  };

  return (
    <>
      <div
        onClick={handleFlightDetailToggler}
        className="w-full bg-white rounded-[7px] shadow-md overflow-hidden mt-5 h-fit hover:border transition-all ease-in-out border-black cursor-pointer"
      >
        <div className=" grid grid-cols-1 lg:grid-cols-8  ">
          <div className="  col-span-6 p-3 flex flex-col justify-between ">
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
                  </div>
                  <div className="text-gray-600 hover:text-gray-800 flex flex-col gap-10">
                    <button
                      className="border px-2 py-1 flex items-center gap-2 rounded-lg"
                      onClick={() => setIsShareModalOpen(true)}
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
                    {flight?.schedules.length > 1 ? "Multi city" : "Direct"}
                  </p>
                </div>
              </div>
            ) : (
              <>{generateComp(flight?.schedules)}</>
            )}

            <div>
              <p className="text-[#5F6D77] text-[14px]">{flight?.gds}</p>
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
                    className="border px-2 py-1 flex items-center gap-2 rounded-lg"
                    onClick={() => handleShare("whatsapp")}
                  >
                    <FaWhatsapp className="w-4 h-4 text-green-500" />
                    <p className="text-[12px]">Share to WhatsApp</p>
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

        {isShowDetail && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="m-5 border rounded-xl cursor-default "
          >
            <div className="flex justify-between border-b p-3">
              <b>Depart • Wed, Dec 25</b>
              <span>31h 55m</span>
            </div>

            <div className="px-4 py-1 flex justify-between ">
              <div className="">
                <div className="space-x-2 flex items-center">
                  <Image src={airAsia} width={25} height={25} alt="logo" />
                  <span>IndiGo 1104</span>
                  <input
                    className="border p-1 rounded focus:outline-none max-w-32"
                    type="text"
                    value="IndiGo"
                  />
                </div>

                <div className="my-3">
                  <div className="space-x-5 flex">
                    <span className="ml-2">
                      <span className="h-2 w-2 bg-white border rounded-full border-gray-400 flex"></span>
                      <span className="h-full w-0.5 bg-gray-400 flex ml-[3px]"></span>
                    </span>
                    <b>9:00 pm</b>
                    <span>Dhaka Hazrat Shahjalal Intl (DAC)</span>
                  </div>
                  <div className="flex space-x-2 items-center mt-2 ">
                    <GiCommercialAirplane size={25} />
                    <span>2h 50m</span>
                  </div>
                  <div className="space-x-5 flex">
                    <span className="ml-2">
                      <span className="h-full w-0.5 bg-gray-400 flex ml-[3px]"></span>
                      <span className="h-2 w-2 bg-white border rounded-full border-gray-400 flex"></span>
                    </span>
                    <b>9:00 pm</b>
                    <span>Dhaka Hazrat Shahjalal Intl (DAC)</span>
                  </div>
                </div>
              </div>
              <div className="">
                {!isShowIconDetail ? (
                  <div className="flex p-2 bg-slate-100 rounded-full space-x-1 ">
                    <IoWifi />
                    <MdOndemandVideo />
                    <BsFillPlugFill />
                    <button
                      onClick={(e) => {
                        handleIconDetailToggler(!isShowIconDetail);
                      }}
                    >
                      <MdKeyboardArrowDown />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start p-2 bg-slate-100 rounded-xl space-x-1 ">
                    <ul className="mt-3">
                      <li className="flex space-x-2 items-center text-sm">
                        <IoWifi />
                        <span> Wifi Facilities</span>
                      </li>
                      <li className="flex space-x-2 items-center text-sm">
                        <MdOndemandVideo /> <span> TV Facilities</span>
                      </li>
                      <li className="flex space-x-2 items-center text-sm">
                        <BsFillPlugFill />
                        <span> Mobile Charging Port</span>
                      </li>
                    </ul>

                    <button
                      onClick={(e) => {
                        handleIconDetailToggler(!isShowIconDetail);
                      }}
                    >
                      <MdOutlineKeyboardArrowUp />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="">hello world</div>
          </div>
        )}
      </div>
    </>
  );
}
