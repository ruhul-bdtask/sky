"use client";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import bangkok from "@/public/images/wishlist-travel.png";
import bangkok2 from "@/public/images/wishlist-travel-2.png";
import wishlist1 from "@/public/images/wishlist-1.png";
import wishlist2 from "@/public/images/wishlist-2.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Import required modules from Swiper
import { Navigation } from "swiper/modules";
import Skeleton from "react-loading-skeleton";
import useAirlineStore from "../../../stores/airlineStore";
import Link from "next/link";
export default function WishlistTravels({ wishlistData, homeDataLoading }) {
  const { savedTrips } = useAirlineStore();
  const wishListData = [
    {
      title: "New Delhi, National Capital Territory of India, India",
      image: wishlist1,
    },
    {
      title: "Mumbai, Maharashtra, India",
      image: wishlist2,
    },
  ];

  return (
    <div>
      {homeDataLoading ? (
        <div className="py-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold  ">
            <Skeleton width={400} height={30} />
          </h2>
          <h2 className="text-2xl font-bold mb-4 ">
            <Skeleton width={300} height={20} />
          </h2>
          <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex flex-col ">
                {/* Image Skeleton */}
                <div className="w-full h-[350px] mb-2 rounded-md relative">
                  {/* Heart Icon Placeholder */}
                  <div className="absolute top-2 right-2">
                    <Skeleton width={24} height={24} circle={true} />
                  </div>
                  <Skeleton height="100%" />
                </div>

                {/* City Name */}
                <div className="">
                  <h3 className="text-lg font-semibold  mb-1">
                    <Skeleton width={150} />
                  </h3>

                  {/* Price */}
                  <p className="text-sm text-gray-500 ">
                    <Skeleton width={80} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full relative py-6">
          <div className="pb-6">
            <h2 className="text-[24px] font-bold text-black">
              Your Wishlist starts here
            </h2>
            <p className="text-[16px]">
              Save destinations all in one place—even if you&apos;re not ready
              to book
            </p>
          </div>
          <div className="">
            <div className="z-10 travel-prev absolute -left-4 top-0 bottom-0 my-auto bg-white shadow-lg rounded-lg w-[40px] h-[40px] flex justify-center items-center cursor-pointer ">
              <FaAngleLeft />
            </div>
            <div className="z-10 travel-next absolute -right-4 top-0 bottom-0 my-auto bg-white shadow-lg rounded-lg w-[40px] h-[40px] flex justify-center items-center cursor-pointer">
              <FaAngleRight />
            </div>
          </div>
          <Swiper
            className="z-30"
            slidesPerView={2}
            breakpoints={{
              375: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
            }}
            spaceBetween={18}
            navigation={{
              nextEl: ".travel-next",
              prevEl: ".travel-prev",
            }}
            modules={[Navigation]}
          >
            {savedTrips?.map((item, index) => (
              <SwiperSlide key={index}>
                <Link
                  href={"/trips"}
                  className="w-full xl:w-[631px] overflow-hidden"
                >
                  <div className="">
                    <Image
                      src={item?.image_url ? item?.image_url : bangkok}
                      alt="Trip"
                      width={631}
                      height={200}
                      className="object-cover h-[370px] w-full rounded-xl"
                    />
                  </div>
                  <div className="py-4">
                    <h3 className="font-semibold text-[16px] mb-1 text-black">
                      {item?.destination}
                    </h3>
                    <p className="text-[14px] text-black">
                      {item?.start_date} - {item?.end_date}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      {/* <div>
        <div className="pb-6">
          <h2 className="text-[24px] font-bold text-black">
            Your Wishlist starts here
          </h2>
          <p className="text-[16px]">
            Save destinations all in one place—even if you&apos;re not ready to
            book
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {wishListData?.map((travel, index) => (
            <div className="w-full xl:w-[631px] overflow-hidden" key={index}>
              <div className="relative">
                <Image
                  src={travel?.image}
                  alt="Bangkok cityscape"
                  width={631}
                  height={200}
                  className="object-cover"
                />
                <button className="absolute top-2 right-2 text-black bg-white hover:bg-slate-200 transition-colors px-3 py-1 rounded-[4px]">
                  <HeartIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="py-4">
                <h3 className="font-semibold text-[16px] mb-1 text-black">
                  {travel?.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
