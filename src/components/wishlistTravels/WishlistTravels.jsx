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
export default function WishlistTravels() {
  const travelsData = [
    {
      title: "New Delhi, National Capital Territory of India, India",
      distance: "from Tk 27,114",
      image: bangkok,
    },
    {
      title: "Mumbai, Maharashtra, India",
      distance: "from Tk 27,114",
      image: bangkok2,
    },
    {
      title: "New Delhi, National Capital Territory of India, India",
      distance: "from Tk 27,114",
      image: bangkok,
    },
    {
      title: "Mumbai, Maharashtra, India",
      distance: "from Tk 27,114",
      image: bangkok2,
    },
    {
      title: "Mumbai, Maharashtra, India",
      distance: "from Tk 27,114",
      image: bangkok,
    },
  ];

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
      <div className="w-full relative py-6">
        <div className="pb-6">
          <h2 className="text-[24px] font-bold text-black">
            Your Wishlist starts here
          </h2>
          <p className="text-[16px]">
            Save destinations all in one place—even if you're not ready to book
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
          {travelsData?.map((travel, index) => (
            <SwiperSlide key={index}>
              <div className="w-full xl:w-[631px] overflow-hidden">
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
                  <p className="text-[14px] text-black">{travel?.distance}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div>
        <div className="pb-6">
          <h2 className="text-[24px] font-bold text-black">
            Your Wishlist starts here
          </h2>
          <p className="text-[16px]">
            Save destinations all in one place—even if you're not ready to book
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {wishListData?.map((travel,index) => (
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
      </div>
    </div>
  );
}
