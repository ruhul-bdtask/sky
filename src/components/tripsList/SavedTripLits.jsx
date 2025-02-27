"use client";
import { Plane, Ticket } from "lucide-react";
import React from "react";
import Image from "next/image";
import sky from "@/public/images/sky.png";
import { getAirlineLogo } from "@/utils/getAirlineLogo";
import { getAirline } from "@/utils/getAirline";
export default function SavedTripsList({ booking, airlinesData }) {
  return (
    <>
      <div className="w-full max-w-4xl mx-auto space-y-5 pb-20 ">
        <div className="bg-white rounded-[7px] shadow-custom_shadow overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3 h-40 sm:h-auto relative p-4">
              <Image
                src={sky}
                alt="Airplane wing over clouds"
                className="w-[284px] h-full object-cover"
              />
              <div className="absolute top-8 left-8 bg-[#EAF4FD] rounded-[5px] p-1 flex items-center gap-1">
                <Ticket className="w-5 h-5 text-black" />
                <span>
                  {" "}
                  <p className="text-sm text-green-400 font-semibold">Saved</p>
                </span>
              </div>
            </div>
            <div className="p-4 sm:w-2/3 flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start ">
                  <div className="space-y-3">
                    <h2 className="text-[20px] font-[600]">
                      From {booking?.origin_code} To {booking?.destination_code}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    // src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${booking?.airline_code}.png`}
                    // src={`https://pics.avs.io/200/200/${stop?.operating_code}@2x.png`}
                    src={getAirlineLogo(booking?.airline_code)}
                    alt="airline logo"
                    className="w-[30px] h-[30px]"
                  />
                  <p className="text-[16px] font-[400] ">
                    {getAirline(airlinesData, booking?.airline_code)}
                  </p>
                </div>
                <p className="text-[16px] font-[500] text-black">
                  Departure: {booking?.departure_date}
                </p>
                <p className="text-[16px] font-[500] text-black">
                  {booking.type}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#FC660F] p-3 flex justify-between items-center">
            <p className="text-white text-sm">
              It&apos;s not too late, book again with us.
            </p>
            {/* <button className="bg-[#EAF4FD] text-[#151515] px-3 py-1 rounded-md text-sm font-semibold">
              Book Again
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
}
