"use client";
import { Plane } from "lucide-react";
import React from "react";

import Image from "next/image";
import { PinRightIcon } from "@radix-ui/react-icons";
import RightIcon from "@/public/icons/RightIcon";
import DownloadIcon from "@/public/icons/DownloadIcon";
import sky from "@/public/images/sky.png";
import bimanbd from "@/public/images/bimanbd.png";
import Link from "next/link";
export default function TripsList({ booking }) {
  return (
    <>
      <div className="w-full max-w-4xl mx-auto space-y-5 pb-20 ">
        <div
          key={booking.fabricated_pnr}
          className="bg-white rounded-[7px] shadow-custom_shadow overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3 h-40 sm:h-auto relative p-4">
              <Image
                src={sky}
                alt="Airplane wing over clouds"
                className="w-[284px] h-full object-cover"
              />
              <div className="absolute top-8 left-8 bg-[#EAF4FD] rounded-[5px] p-1 flex ">
                <Plane className="w-5 h-5 text-black" />
                <span>Flight</span>
              </div>
            </div>
            <div className="p-4 sm:w-2/3 flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start ">
                  <div className="space-y-3">
                    <p className="text-[16px] text-black">
                      Booking ID: {booking.fabricated_pnr}
                    </p>
                    <h2 className="text-[20px] font-[600]">
                      From {booking.legs[0]?.first_airport} To{" "}
                      {booking.legs[0]?.last_airport}
                    </h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/ticket-copy?status=success&slack=${booking?.transaction_number}`}
                      className="bg-[#FC660F] text-white px-3 py-2 rounded-[10px] text-sm flex items-center gap-2 "
                    >
                      <div className="hidden md:block">
                        <DownloadIcon />
                      </div>
                      Ticket Copy
                    </Link>
                    <Link
                      href={`/ticket-invoice?status=success&slack=${booking?.transaction_number}`}
                      className="bg-[#FC660F] text-white px-3 py-2 rounded-[10px] text-sm flex items-center gap-2 "
                    >
                      <div className="hidden md:block">
                        <DownloadIcon />
                      </div>
                      Ticket invoice
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${booking?.flights[0]?.airline_code}.png`}
                    // src={`https://pics.avs.io/200/200/${stop?.operating_code}@2x.png`}
                    alt="airline logo"
                    className="w-[30px] h-[30px]"
                  />
                  <p className="text-[16px] font-[400] ">
                    {booking?.flights[0]?.airline_code}
                  </p>
                </div>
                <p className="text-[16px] font-[500] text-black">
                  Departure: {booking?.legs[0].departure_date}
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
            <button className="bg-[#EAF4FD] text-[#151515] px-3 py-1 rounded-md text-sm font-semibold">
              Book Again
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
