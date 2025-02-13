"use client";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import bangkok from "@/public/images/bangkok.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Import required modules from Swiper
import { Navigation } from "swiper/modules";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import useAirlineStore from "../../../stores/airlineStore";
import { useRouter } from "next/navigation";
export default function Travels({ latestFlightsLoading, travelsData }) {
  const {
    setOriginQuery,
    setSearchData,
    setOriginDestinationInformation,
    setDestinationQuery,
    setOriginAirportName,
    setDestinationAirportName,
  } = useAirlineStore();

  const router = useRouter();

  const [originalDate, setOriginalDate] = useState();
  const [originalArrivalDate, setOriginalArrivalDate] = useState();

  useEffect(() => {
    // Get the current date
    const currentDate = new Date();

    // Add 10 days for the first date
    const dateAfter10Days = new Date(currentDate);
    dateAfter10Days.setDate(currentDate.getDate() + 10);

    // Add 15 days for the second date
    const dateAfter15Days = new Date(currentDate);
    dateAfter15Days.setDate(currentDate.getDate() + 15);

    // Set the state
    setOriginalDate(dateAfter10Days.toISOString().split("T")[0]);
    setOriginalArrivalDate(dateAfter15Days.toISOString().split("T")[0]);
  }, []);

  const handleSearch = (info) => {
    const passengers = [
      {
        type: "ADT",
        quantity: 1,
      },
    ];
    const originDestinationInfo = [
      {
        DepartureDateTime: originalDate,
        OriginLocation: {
          LocationCode: info?.origin,
          LocationType: "A",
        },
        DestinationLocation: {
          LocationCode: info?.destination,
          LocationType: "A",
        },
        RPH: "0",
      },
    ];

    if (info?.trip_type === "Round Trip") {
      originDestinationInfo.push({
        DepartureDateTime: originalArrivalDate,
        OriginLocation: {
          LocationCode: info?.destination,
          LocationType: "A",
        },
        DestinationLocation: {
          LocationCode: info?.origin,
          LocationType: "A",
        },
        RPH: "1",
      });
    }

    setOriginDestinationInformation(originDestinationInfo);

    const searchData = {
      origin: info?.origin,
      destination: info?.destination,
      tripType:
        info?.trip_type == "One Way"
          ? "one_way"
          : info?.trip_type == "Round Trip"
          ? "return"
          : "multi_city",
      class: "Y",
      passengers: passengers,
      journeyDate: originalDate,
      returnDate: info?.trip_type == "One Way" ? "" : originalArrivalDate,
    };
    setSearchData(searchData);

    setOriginQuery(info?.origin);
    setDestinationQuery(info?.destination);
    // setTravelPlanningDate(originalDate);
    setDestinationAirportName(info?.destination_city, `(${info?.origin})`);
    setOriginAirportName(info?.origin_city, `(${info?.destination})`);

    const queryString = new URLSearchParams({
      search: JSON.stringify(searchData),
      originDestinationInfo: JSON.stringify(originDestinationInfo),
    }).toString();

    router.push(`/search-result?${queryString}`);
  };

  return (
    <>
      {latestFlightsLoading ? (
        <div className="py-4 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">
            <Skeleton width={180} />
          </h2>
          <p className="text-gray-500 mb-6">
            <Skeleton width={250} />
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex flex-col ">
                {/* Image Skeleton (Full Card) */}
                <div className="w-full h-96 mb-4 rounded-lg ">
                  <Skeleton height="100%" />
                </div>

                {/* City Name */}
                <h3 className="text-lg font-semibold mb-1">
                  <Skeleton width={100} />
                </h3>

                {/* Price */}
                <p className="text-sm text-gray-500">
                  <Skeleton width={80} />
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full relative">
          <div className="pb-6">
            <h2 className="text-[24px] font-bold text-black">
              Hop on, hop off
            </h2>
            <p className="text-[16px]">
              Skip the layovers and fly nonstop to these destinations{" "}
            </p>
          </div>
          <div className="">
            <div className="z-10 prev absolute -left-4 top-0 bottom-0 my-auto bg-white shadow-lg rounded-lg w-[40px] h-[40px] flex justify-center items-center cursor-pointer ">
              <FaAngleLeft />
            </div>
            <div className="z-10 next absolute -right-4 top-0 bottom-0 my-auto bg-white shadow-lg rounded-lg w-[40px] h-[40px] flex justify-center items-center cursor-pointer">
              <FaAngleRight />
            </div>
          </div>
          <Swiper
            className="z-30"
            slidesPerView={4}
            spaceBetween={18}
            breakpoints={{
              375: {
                slidesPerView: 1,
              },
              600: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1420: {
                slidesPerView: 4,
              },
            }}
            navigation={{
              nextEl: ".next",
              prevEl: ".prev",
            }}
            modules={[Navigation]}
          >
            {travelsData?.map((travel, index) => (
              <SwiperSlide key={index} onClick={() => handleSearch(travel)}>
                {/* <a
                  href="#"
                  className="group relative block bg-black rounded-xl"
                >
                  <img
                    alt=""
                    src={travel?.image}
                    className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50 "
                  />

                  <div className="relative p-4 sm:p-6 lg:p-8">
                    <p className="bg-white text-black text-xs font-semibold py-1 px-2 rounded w-fit">
                      {travel?.trip_type}
                    </p>


                    <div className="mt-32 sm:mt-48 lg:mt-64">
                      <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="text-white text-[17px]">
                          {travel?.origin_city} - {travel?.destination_city}
                        </p>
                        <span className="text-white text-[12px]">
                          Price: {travel?.fare}
                        </span>
                      </div>
                    </div>
                  </div>
                </a> */}

                <div className="group relative block rounded-xl overflow-hidden cursor-pointer">
                  <img
                    alt=""
                    src={travel?.image}
                    className="absolute inset-0 min-h-full w-full object-cover"
                  />

                  <div className="relative">
                    <div className="p-8">
                      <p className="bg-white text-black text-xs font-semibold py-1 px-2 rounded w-fit">
                        {travel?.trip_type}
                      </p>
                    </div>

                    <div className="mt-32 sm:mt-48 lg:mt-64">
                      <div className="translate-y-8 transform opacity-0 transition-all  group-hover:translate-y-0 group-hover:opacity-100  bg-black opacity-75i  p-4 rounded-b-lg">
                        <p className="text-white text-[17px]">
                          {travel?.origin_city} - {travel?.destination_city}
                        </p>
                        <span className="text-white text-[12px]">
                          Price: {travel?.fare}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="">
                  <div className="">
                    <img
                      src={travel?.image}
                      alt="Bangkok cityscape"
                      className="object-cover h-[400px] w-full rounded-xl"
                    />
                    <button className="absolute top-2 right-2 text-black bg-white hover:bg-slate-200 transition-colors px-3 py-1 rounded-[4px]">
                      <HeartIcon className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-4 bg-white text-black text-xs font-semibold py-1 px-2 rounded">
                      {travel?.trip_type}
                    </div>
                  </div>
                  <div className="py-4">
                  <h3 className="font-semibold text-[16px] mb-1 text-black">
                    {travel?.title}
                  </h3>
                  <p className="text-[14px] text-black">{travel?.distance}</p>
                </div>
                </div> */}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
}
