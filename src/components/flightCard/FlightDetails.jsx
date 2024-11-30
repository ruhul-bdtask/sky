import { formatShortDate } from "@/lib/formatShortDate";
import Image from "next/image";
import { useState } from "react";
import { BsFillPlugFill } from "react-icons/bs";
import { GiCommercialAirplane } from "react-icons/gi";
import { IoWifi } from "react-icons/io5";
import { MdOndemandVideo, MdOutlineKeyboardArrowUp } from "react-icons/md";

const FlightDetails = ({ flight }) => {
  const [expandIconDetails, setExpandIconDetails] = useState(false);
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

  const handleIconDetailsToggler = () =>
    setExpandIconDetails(!expandIconDetails);

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

      {schedules.map((schedule) => {
        return (
          <div key={schedule.flight_number}>
            {/* Layover Information */}
            {schedule.layover_time > 0 && (
              <div className="p-3 space-x-6 text-xs border-y-2 m-4">
                <span>31h 55m</span>
                <span>• Changes Plane in New Delhi (DEL)</span>
                <span className="py-1 px-2 bg-red-100 rounded-md text-red-900">
                  Long layover
                </span>
              </div>
            )}

            {/* Flight Schedule Information */}
            <div className="px-4 py-1 flex justify-between">
              <div>
                {/* Airline Information */}
                <div className="space-x-2 flex items-center text-sm text-gray-500">
                  <Image
                    src={flight.airline_logo}
                    width={50}
                    height={50}
                    alt="logo"
                  />
                  <span>{flight.airline_name}</span>
                  <div className="border p-1 rounded focus:outline-none">
                    {flight.airline_code} Airlines
                  </div>
                </div>

                {/* Departure, Duration, and Arrival Information */}
                <div className="my-3 text-sm  ">
                  {/* Departure */}
                  <div className="space-x-7 flex min-h-8 text-gray-800 ">
                    <div className="ml-2 relative">
                      <span className="h-2 w-2 bg-white border rounded-full border-gray-400 absolute top-0"></span>
                      <span className="h-full w-[1px] bg-gray-400 flex ml-[3px]"></span>
                    </div>
                    <strong className="font-semibold ">
                      {schedule.departure_time}
                    </strong>
                    <span>{flight.origin_airport_name}</span>
                  </div>

                  {/* Flight Duration */}
                  <div className="flex space-x-5 text-xs">
                    <GiCommercialAirplane size={25} />
                    <span>{flight.flight_duration}</span>
                  </div>

                  {/* Arrival */}
                  <div className="space-x-7 flex min-h-8 text-gray-800">
                    <span className="ml-2 relative">
                      <span className="h-full w-[1px] bg-gray-400 flex ml-[3px]"></span>
                      <span className="h-2 w-2 bg-white border rounded-full border-gray-400 absolute bottom-0"></span>
                    </span>
                    <strong className="font-semibold">
                      {schedule.arrival_time}
                    </strong>
                    <span>{flight.destination_airport_name}</span>
                  </div>
                </div>
              </div>

              {/* Additional Facilities */}
              <div className="mt-1 ">
                <div className={`flex p-2 bg-slate-100 rounded-xl`}>
                  <div className="flex items-start space-x-1">
                    <ul
                      className={`${
                        !expandIconDetails ? "flex space-x-2" : "block"
                      } mt-1`}
                    >
                      {expandIconDetails ? (
                        <>
                          <li className="flex items-center space-x-2 text-sm">
                            <IoWifi />
                            <span>Wifi Facilities</span>
                          </li>
                          <li className="flex items-center space-x-2 text-sm">
                            <MdOndemandVideo />
                            <span>TV Facilities</span>
                          </li>
                          <li className="flex items-center space-x-2 text-sm">
                            <BsFillPlugFill />
                            <span>Mobile Charging Port</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center space-x-2 text-sm">
                            <IoWifi />
                          </li>
                          <li className="flex items-center space-x-2 text-sm">
                            <MdOndemandVideo />
                          </li>
                          <li className="flex items-center space-x-2 text-sm">
                            <BsFillPlugFill />
                          </li>
                        </>
                      )}
                    </ul>
                    <MdOutlineKeyboardArrowUp
                      size={20}
                      onClick={() =>
                        handleIconDetailsToggler(schedule.flight_number)
                      }
                      className={`${
                        expandIconDetails ? "rotate-0" : "-rotate-180"
                      } transition-all`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlightDetails;
