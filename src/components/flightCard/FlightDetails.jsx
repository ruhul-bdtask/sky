import { formatShortDate } from "@/lib/formatShortDate";
import Image from "next/image";
import { useState } from "react";
import { BsFillPlugFill } from "react-icons/bs";
import { GiCommercialAirplane } from "react-icons/gi";
import { IoWifi } from "react-icons/io5";
import { MdOndemandVideo, MdOutlineKeyboardArrowUp } from "react-icons/md";

const FlightDetails = ({ flight }) => {
  const [isShowIconDetails, setIsShowIconDetails] = useState(false);
  const {
    airline_logo,
    airline_name,
    origin_airport_name,
    arrival_time,
    departure_time,
    schedules,
    destination_airport_name,
    flight_duration,
    departure_date,
  } = flight;

  console.log(flight);
  console.log(flight.schedules);

  const handleIconDetailsToggler = (e) =>
    setIsShowIconDetails(!isShowIconDetails);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="m-5 border rounded-xl cursor-default "
    >
      <div className="flex justify-between border-b p-3">
        <strong className="font-semibold">
          Depart • {formatShortDate(departure_date)}
        </strong>
        <span>{flight_duration}</span>
      </div>

      <div className="p-3 space-x-6 text-xs border-y-2 m-4">
        <span>31h 55m</span>
        <span>• Changes Plane in New Delhi (DEL)</span>
        <span className="py-1 px-2 bg-red-100 rounded-md text-red-900 ">
          Long layover
        </span>
      </div>

      <div className="px-4 py-1 flex justify-between">
        <div className="">
          <div className="space-x-2 flex items-center text-sm text-gray-500">
            <Image src={airline_logo} width={50} height={50} alt="logo" />
            <span className="">{airline_name}</span>
            <div className="border p-1 rounded focus:outline-none">
              IndiGo 1104 Airlines
            </div>
          </div>

          <div className="my-3 ">
            <div className="space-x-7 flex min-h-8 text-gray-800">
              <div className="ml-2 relative">
                <span className="h-2 w-2 bg-white border rounded-full border-gray-400 absolute top-0"></span>
                <span className="h-full w-[1px] bg-gray-400 flex ml-[3px]"></span>
              </div>
              <strong className="font-semibold">{departure_time}</strong>
              <span>{origin_airport_name}</span>
            </div>
            <div className="flex space-x-5 text-xs">
              <GiCommercialAirplane size={25} />
              <span>{flight_duration}</span>
            </div>
            <div className="space-x-7 flex min-h-8 text-gray-800">
              <span className="ml-2 relative">
                <span className="h-full w-[1px] bg-gray-400 flex ml-[3px]"></span>
                <span className="h-2 w-2 bg-white border rounded-full border-gray-400 absolute bottom-0"></span>
              </span>
              <strong className="font-semibold">{arrival_time}</strong>
              <span>{destination_airport_name}</span>
            </div>
          </div>
        </div>
        <div className="mt-1">
          <div
            className={`flex p-2 bg-slate-100  ${
              isShowIconDetails ? "rounded-xl" : "rounded-full"
            }`}
          >
            <div className="flex items-start space-x-1 ">
              <ul
                className={`${
                  !isShowIconDetails ? "flex space-x-2" : "block"
                }  mt-1 `}
              >
                {isShowIconDetails ? (
                  <>
                    <li className="flex items-center space-x-2 text-sm ">
                      <IoWifi /> <span>Wifi Facilities</span>
                    </li>
                    <li className="flex items-center space-x-2 text-sm ">
                      <MdOndemandVideo /> <span>TV Facilities</span>
                    </li>
                    <li className="flex items-center space-x-2 text-sm ">
                      <BsFillPlugFill /> <span>Mobile Charging Port</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center space-x-2 text-sm ">
                      <IoWifi />
                    </li>
                    <li className="flex items-center space-x-2 text-sm ">
                      <MdOndemandVideo />
                    </li>
                    <li className="flex items-center space-x-2 text-sm ">
                      <BsFillPlugFill />
                    </li>
                  </>
                )}
              </ul>
              <MdOutlineKeyboardArrowUp
                size={20}
                onClick={handleIconDetailsToggler}
                className={`${
                  isShowIconDetails ? "rotate-0" : "-rotate-180"
                } transition-all `}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
