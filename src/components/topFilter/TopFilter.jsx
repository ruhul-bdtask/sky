"use client";
import { formatFlightFare } from "@/lib/formatFlightFare";
import { formatMinutesToHours } from "@/lib/formatMinutesToHours";
import SortIcon from "@/public/icons/SortIcon";
import { InfoIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useAirlineStore from "../../../stores/airlineStore";

export default function TopFilter({
  setSortCriteria,
  sortCriteria,
  topSortedFlights,
}) {
  const [isShowOtherSort, setIsShowOtherSort] = useState(false);
  const { searchData } = useAirlineStore();
  const dropdownRef = useRef(null);
  const othersSortOptions = [
    "earliestTakeOff",
    "latestTakeOff",
    "earliestLanding",
    "latestLanding",
    "highestPrice",
    "slowest",
  ];

  const handleOtherSort = () => {
    setIsShowOtherSort(!isShowOtherSort);
  };

  const handleOtherSortChange = (sortTerm) => {
    setSortCriteria(sortTerm);
    setIsShowOtherSort(false);
  };

  useEffect(() => {
    setSortCriteria("cheapest");
  }, []);

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowOtherSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="hidden lg:block w-full h-[100px] bg-white shadow-md  overflow-hidden rounded-[10px]">
        <div className="grid grid-cols-4 h-full">
          <div
            className={`flex-1 flex flex-col justify-center items-center relative cursor-pointer`}
            onClick={() => setSortCriteria("cheapest")}
          >
            <div>
              <h3 className="font-semibold text-[14px]">Cheapest</h3>
              <p className="text-[12px] text-gray-600">
                Tk{" "}
                {formatFlightFare(
                  topSortedFlights?.cheapest?.fare_details?.total_fare
                )}{" "}
                •{" "}
                {formatMinutesToHours(
                  topSortedFlights?.cheapest?.itinerary_leg_descs?.[0]?.duration
                )}
              </p>
            </div>
            {sortCriteria == "cheapest" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 w-[80%] mx-auto"></div>
            )}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-14 bg-gray-200"></div>
          </div>
          <div
            className={`flex-1 flex flex-col justify-center items-center  relative   cursor-pointer`}
            onClick={() => setSortCriteria("best")}
          >
            <div>
              <h3 className="font-semibold text-[14px] flex items-center">
                Best
                <InfoIcon className="w-4 h-4 ml-1 text-gray-400" />
              </h3>
              <p className="text-[12px] text-gray-600">
                Tk{" "}
                {formatFlightFare(
                  topSortedFlights?.best?.fare_details?.total_fare
                )}{" "}
                •{" "}
                {formatMinutesToHours(
                  topSortedFlights?.best?.itinerary_leg_descs?.[0]?.duration
                )}
              </p>
            </div>
            {sortCriteria == "best" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 w-[80%] mx-auto"></div>
            )}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-14 bg-gray-200"></div>
          </div>
          <div
            className={`flex-1 flex flex-col justify-center items-center  relative   cursor-pointer`}
            onClick={() => setSortCriteria("quickest")}
          >
            <div>
              <h3 className="font-semibold text-[14px]">Quickest</h3>
              <p className="text-[12px] text-gray-600">
                Tk{" "}
                {formatFlightFare(
                  topSortedFlights?.quickest?.fare_details?.total_fare
                )}{" "}
                •{" "}
                {formatMinutesToHours(
                  topSortedFlights?.quickest?.itinerary_leg_descs?.[0]?.duration
                )}
              </p>
            </div>
            {sortCriteria == "quickest" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 w-[80%] mx-auto"></div>
            )}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-14 bg-gray-200"></div>
          </div>
          <div
            className={`flex items-center justify-center px-6 cursor-pointer relative`}
            onClick={handleOtherSort}
          >
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <SortIcon />
              <span className="mr-2">Other sort</span>
            </button>
            {othersSortOptions.includes(sortCriteria) && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 w-[80%] mx-auto"></div>
            )}
          </div>
        </div>
      </div>
      {isShowOtherSort && (
        <div
          ref={dropdownRef}
          className="absolute right-0 bg-white overflow-y-auto min-w-64 max-h-48 shadow-xl border rounded"
        >
          <ul>
            <li
              className={`hover:bg-gray-200 transition-all px-4 py-2 cursor-pointer`}
              onClick={() => handleOtherSortChange("earliestTakeOff")}
            >
              Earliest take-off ({searchData.origin})
            </li>
            <li
              className="hover:bg-gray-200 transition-all px-4 py-2 cursor-pointer"
              onClick={() => handleOtherSortChange("latestTakeOff")}
            >
              Latest take-off ({searchData.origin})
            </li>
            <li
              className="hover:bg-gray-200 transition-all px-4 py-2 cursor-pointer"
              onClick={() => handleOtherSortChange("earliestLanding")}
            >
              Earliest landing ({searchData.destination})
            </li>
            <li
              className="hover:bg-gray-200 transition-all px-4 py-2 cursor-pointer"
              onClick={() => handleOtherSortChange("latestLanding")}
            >
              Latest landing ({searchData.destination})
            </li>
            <li
              className="hover:bg-gray-200 transition-all px-4 py-2 cursor-pointer"
              onClick={() => handleOtherSortChange("highestPrice")}
            >
              Highest price
            </li>
            <li
              className="hover:bg-gray-200 transition-all px-4 py-2 cursor-pointer"
              onClick={() => handleOtherSortChange("slowest")}
            >
              Slowest
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
