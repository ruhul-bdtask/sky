"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpRight } from "lucide-react";

export default function FlightFilter() {
  const [takeoffTime, setTakeoffTime] = useState([0, 24]);
  const [landingTime, setLandingTime] = useState([0, 72]);

  const formatTime = (hours) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days > 0 ? `${days}d ` : ""}${remainingHours
      .toString()
      .padStart(2, "0")}:00`;
  };

  return (
    <div>
      <div className="hidden w-[300px] h-[208px] bg-white rounded-lg border p-4 md:flex flex-col justify-between  ">
        <div className="">
          <h2 className="text-lg font-semibold mb-1">Our Advice</h2>
          <div className="flex items-center mb-2">
            <span className="text-green-600 font-bold mr-2">Buy Now</span>
            <ArrowUpRight className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Prices are unlikely to decrease within 7 days
            <span className="inline-block ml-1 text-gray-400">ⓘ</span>
          </p>
        </div>
        {/* <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Track Price</span>
          <Switch />
        </div> */}
      </div>
      <div className="hidden md:block p-4 rounded-lg w-[300px]">
        <span className="text-[14px] font-semibold mb-4">68 of </span>
        <span className="text-[14px] text-[#FC660F]"> 283 flights</span>

        <section className="mb-6 border-t pt-3 ">
          <span className="text-[14px] font-semibold ">Stops </span>
          <div className="space-y-3 mt-4">
            <label className="flex items-center">
              <Checkbox id="direct" />
              <span className="text-[14px] ml-2 ">Direct </span>

              <span className="ml-auto text-[#64717B] text-[14px]">
                Tk 23,404
              </span>
            </label>
            <label className="flex items-center">
              <Checkbox id="direct" />
              <span className="text-[14px] ml-2 ">Stop 1 </span>

              <span className="ml-auto text-[#64717B] text-[14px]">
                Tk 23,404
              </span>
            </label>
            <label className="flex items-center">
              <Checkbox id="direct" />
              <span className="text-[14px] ml-2 ">Stop 2 </span>

              <span className="ml-auto text-[#64717B] text-[14px]">
                Tk 23,404
              </span>
            </label>
          </div>
        </section>

        <section className="mb-6 border-t pt-3">
          <span className="text-[14px] font-semibold ">Times </span>

          <div className="space-y-4">
            <div>
              <div className="py-4">
                <p className="mb-2 text-[18px]">Take-off from DAC</p>
                <p className="text-[12px]  mb-2">Tue 00:30 - Wed 00:30</p>
              </div>
              <Slider
                min={0}
                max={24}
                step={1}
                value={takeoffTime}
                onValueChange={setTakeoffTime}
                className="w-full "
              />
            </div>
            <div>
              <div className="py-4">
                <p className=" mb-2 text-[18px]">Landing at KUL</p>
                <p className="text-[12px]  mb-2">Tue 00:30 - Wed 00:30</p>
              </div>

              <Slider
                min={0}
                max={72}
                step={1}
                value={landingTime}
                onValueChange={setLandingTime}
                className="w-full"
              />
            </div>
          </div>
        </section>

        <section className="mb-6 border-t pt-3">
          <div className="flex justify-between mb-2">
            <span className="text-[14px] font-semibold ">Airlines </span>

            <div>
              <button className="text-blue-600 text-sm mr-4">Select All</button>
              <button className="text-blue-600 text-sm">Clear all</button>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { name: "Air Asia", price: "Tk 23,404" },
              { name: "Biman Bangladesh", price: "Tk 33,404" },
              { name: "Singapur Airline", price: "Tk 192,404" },
              { name: "Thai Lion Air", price: "Tk 23,404" },
              { name: "Biman Bangladesh", price: "Tk 33,404" },
              { name: "Singapur Airline", price: "Tk 23,404" },
            ].map((airline, index) => (
              <label key={index} className="flex items-center">
                <Checkbox id={`airline-${index}`} />
                <span className="text-[14px] ml-2 ">{airline.name}</span>
                <span className="ml-auto text-[#64717B] text-[14px]">
                  {airline.price}
                </span>
              </label>
            ))}
          </div>
        </section>
        <section className="mb-6 border-t pt-3 ">
          <span className="text-[14px] font-semibold ">Airports </span>
          <div className="space-y-3 mt-4">
            <div className="space-y-3">
              <span className="text-[14px] font-semibold ">Dhaka</span>
              <label className="flex items-center">
                <Checkbox id="direct" />
                <span className="text-[14px] ml-2 ">Direct </span>

                <span className="ml-auto text-[#64717B] text-[14px]">
                  Tk 23,404
                </span>
              </label>
            </div>
            <div className="space-y-3">
              <span className="text-[14px] font-semibold ">Kuala Lumpur</span>
              <label className="flex items-center">
                <Checkbox id="direct" />
                <span className="text-[14px] ml-2 ">Stop 2 </span>

                <span className="ml-auto text-[#64717B] text-[14px]">
                  Tk 23,404
                </span>
              </label>
            </div>
          </div>
        </section>
        <section className="mb-6 border-t pt-3">
          <span className="text-[14px] font-semibold ">Duration </span>
          <div className="space-y-4">
            <div>
              <div className="py-4">
                <p className="mb-2 text-[18px]">Flight Leg</p>
                <p className="text-[12px]  mb-2">3h 50m - 94h 50m</p>
              </div>
              <Slider
                min={0}
                max={24}
                step={1}
                value={takeoffTime}
                onValueChange={setTakeoffTime}
                className="w-full"
              />
            </div>
            <div>
              <div className="py-4">
                <p className=" mb-2 text-[18px]">Stopover</p>
                <p className="text-[12px]  mb-2">1h 0m - 75h 50m </p>
              </div>

              <Slider
                min={0}
                max={72}
                step={1}
                value={landingTime}
                onValueChange={setLandingTime}
                className="w-full"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
