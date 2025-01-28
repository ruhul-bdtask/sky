"use client";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
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
export default function Travels({ travelsData, homeDataLoading }) {
  // const travelsData = [
  //   {
  //     title: "Bangkok",
  //     distance: "from Tk 27,114",
  //     direct: true,
  //     image: bangkok,
  //   },
  //   {
  //     title: "Bangkok",
  //     distance: "from Tk 27,114",
  //     direct: true,
  //     image: bangkok,
  //   },
  //   {
  //     title: "Bangkok",
  //     distance: "from Tk 27,114",
  //     direct: true,
  //     image: bangkok,
  //   },
  //   {
  //     title: "Bangkok",
  //     distance: "from Tk 27,114",
  //     direct: true,
  //     image: bangkok,
  //   },
  //   {
  //     title: "Bangkok",
  //     distance: "from Tk 27,114",
  //     direct: true,
  //     image: bangkok,
  //   },
  //   {
  //     title: "Bangkok",
  //     distance: "from Tk 27,114",
  //     direct: true,
  //     image: bangkok,
  //   },
  //   {
  //     title: "Bangkok",
  //     distance: "from Tk 27,114",
  //     direct: true,
  //     image: bangkok,
  //   },
  //   {
  //     title: "Bangkok",
  //     distance: "from Tk 27,114",
  //     direct: true,
  //     image: bangkok,
  //   },
  //   {
  //     title: "Bangkok",
  //     distance: "from Tk 27,114",
  //     direct: true,
  //     image: bangkok,
  //   },
  //   {
  //     title: "Bangkok",
  //     distance: "from Tk 27,114",
  //     direct: true,
  //     image: bangkok,
  //   },
  //   {
  //     title: "Bangkok",
  //     distance: "from Tk 27,114",
  //     direct: true,
  //     image: bangkok,
  //   },
  // ];

  return (
    <>
      {homeDataLoading ? (
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
              <SwiperSlide key={index}>
              <div className="">
                <div className="relative">
                  <img
                    src={travel?.image_url}
                    alt="Bangkok cityscape"
                    className="object-cover h-[400px] w-full rounded-xl"
                  />
                  <button className="absolute top-2 right-2 text-black bg-white hover:bg-slate-200 transition-colors px-3 py-1 rounded-[4px]">
                    <HeartIcon className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-4 bg-white text-black text-xs font-semibold py-1 px-2 rounded">
                    {travel?.stop == 1
                      ? "Direct"
                      : travel?.stop == 2
                      ? "1 Stop"
                      : "Multi stops"}
                  </div>
                </div>
                {/* <div className="py-4">
                  <h3 className="font-semibold text-[16px] mb-1 text-black">
                    {travel?.title}
                  </h3>
                  <p className="text-[14px] text-black">{travel?.distance}</p>
                </div> */}
              </div>
            </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
}
