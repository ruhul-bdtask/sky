"use client";
import Image from "next/image";
import React from "react";
import CardIcon from "@/public/icons/CardIcon";
import { Heart, Share2, Users } from "lucide-react";
import airAsia from "@/public/images/air-asia.png";
import { useRouter } from "next/navigation";
export default function FlightCard() {
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/bookingForm");
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
            <Image alt="air" src={airAsia}></Image>
            <div>
              <p className="text-lg font-semibold">3:30 - 4:45 </p>
              <p className="text-sm text-gray-600">Biman Bangladesh</p>
            </div>
          </div>
          <div>
            <p className="text-[#5F6D77] text-[14px]">Air asia airlines</p>
          </div>
        </div>
        <div className="text-right col-span-2">
          <div className="flex space-x-2 justify-around p-6">
            <div className="text-gray-600 hover:text-gray-800 flex flex-col gap-10 ">
              <button className="border px-2 py-1 flex items-center gap-2 rounded-lg">
                <Heart className="w-5 h-5" />
                <p>Save</p>
              </button>
              <p className="text-sm font-semibold text-start">Direct</p>
            </div>
            <div className="text-gray-600 hover:text-gray-800 flex flex-col gap-10 ">
              <button className="border px-2 py-1 flex items-center gap-2 rounded-lg">
                <Share2 className="w-5 h-5" />
                <p>Share</p>
              </button>
              <p className="text-sm font-semibold text-start">3h 55m</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center col-span-2 border-0 lg:border-s">
          <div className=" p-6 text-start flex flex-col gap-2">
            <CardIcon />
            <span className="text-[31px] font-bold ">TK.23,404</span>
            <p className="text-sm text-[#1A2024] text[14px] font-semibold">
              Person
            </p>
            <p className="text-xs text-[#1A2024] text-[14px]  font-semibold">
              Tk.46,808 total
            </p>
            <p className="text-xs text-[#1A2024] text-[14px]">Economy</p>

            <button
              onClick={handleRedirect}
              className=" bg-[#FC660F] text-white py-3 font-semibold hover:bg-orange-600 transition duration-300 rounded-lg w-[200px] h-[49px]"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
