"use client";
import { Plane } from "lucide-react";
import React from "react";
import sky from "@/public/images/sky.png";
import bimanbd from "@/public/images/bimanbd.png";

import Image from "next/image";
import { PinRightIcon } from "@radix-ui/react-icons";
import RightIcon from "@/public/icons/RightIcon";
import DownloadIcon from "@/public/icons/DownloadIcon";

const bookings = [
  {
    id: "Fb-TI1234567891",
    from: "DAC",
    to: "DXB",
    airline: "Biman Bangladesh Airlines",
    departure: "Tue, 15 Oct  05:25PM . 10:15PM",
    type: "One way",
    img: sky,
    airlineImg: bimanbd,
  },
  {
    id: "Fb-TI1235977891",
    from: "DAC",
    to: "MAA",
    airline: "Air India",
    departure: "Tue, 15 Oct  05:25PM . 10:15PM",
    type: "One way",
    img: sky,
    airlineImg: bimanbd,
  },
  {
    id: "Fb-TI1233587891",
    from: "DAC",
    to: "DXB",
    airline: "Emirates",
    departure: "Tue, 16 Oct  05:25PM . 10:15PM",
    type: "One way",
    img: sky,
    airlineImg: bimanbd,
  },
];

export default function TripsList() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-[36px] font-[700] py-8">Trips</h2>
      <div className=" bg-white shadow-custom_shadow grid grid-cols-10 p-5 rounded-[7px]">
        <div className="col-span-3">
          <p className="text-[24px] font-[500]">0</p>
          <span className="text-[14px]">Days on the road</span>
        </div>
        <div className="col-span-3">
          <p className="text-[24px] font-[500]">0</p>
          <span className="text-[14px]">Miles flown</span>
        </div>
        <div className="col-span-3">
          <p className="text-[24px] font-[500]">0</p>
          <span className="text-[14px]">Cities visited</span>
        </div>
        <button className="col-span-1 flex justify-end items-center">
          <RightIcon />
        </button>
      </div>
      <h2 className="text-[20px] font-[600] w-[140px] my-10 ml-2 pb-1  border-b-2 border-black">
        Ticket List <span className="">(3)</span>
      </h2>
      <div className="w-full max-w-4xl mx-auto space-y-5 pb-20 ">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-[7px] shadow-custom_shadow overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/3 h-40 sm:h-auto relative p-4">
                <Image
                  src={booking?.img}
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
                        Booking ID: {booking.id}
                      </p>
                      <h2 className="text-[20px] font-[600]">
                        From {booking.from} To {booking.to}
                      </h2>
                    </div>
                    <button className="bg-[#FC660F] text-white px-3 py-2 rounded-[10px] text-sm flex items-center gap-2 ">
                      <div className="hidden md:block">
                        <DownloadIcon />
                      </div>
                      Ticket Copy
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image alt="airline" src={booking?.airlineImg}></Image>
                    <p className="text-[16px] font-[400] ">{booking.airline}</p>
                  </div>
                  <p className="text-[16px] font-[500] text-black">
                    Departure: {booking.departure}
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
        ))}
      </div>
    </div>
  );
}
