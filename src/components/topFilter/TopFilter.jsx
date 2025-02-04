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

  const [selectedOtherSort, setSelectedOtherSort] = useState("");
  const [isShowOtherSort, setIsShowOtherSort] = useState(false);
  const [isShow, setIsShow] = useState(true);

  // const handleToggleOtherSort = () => {
  //   if (!selectedOtherSort && isShow) {
  //     setIsShowOtherSort(true);
  //   } else if (selectedOtherSort && isShow) {
  //     setIsShowOtherSort(true);
  //   } else if (selectedOtherSort && !isShow) {
  //     setSortCriteria(selectedOtherSort);
  //     setIsShow(true);
  //   }
  // };

  const handleToggleOtherSort = () => {
    if (isShow) {
      setIsShowOtherSort(true);
    } else if (selectedOtherSort) {
      setSortCriteria(selectedOtherSort);
      setIsShow(true);
    }
  };

  const handleChangeSort = (criteria) => {
    setSortCriteria(criteria);

    if (selectedOtherSort) {
      setIsShow(false);
    } else {
      setIsShow(true);
    }
  };

  const handleChangeOtherSort = (criteria) => {
    setSortCriteria(criteria);
    setSelectedOtherSort(criteria);
    setIsShowOtherSort(false);
  };

  const sortOptions = {
    earliestTakeOff: {
      mainContent: `Take-off (${searchData.origin})`,
      subContent: "Earliest to latest",
    },
    latestTakeOff: {
      mainContent: `Take-off (${searchData.origin})`,
      subContent: "Latest to earliest",
    },
    earliestLanding: {
      mainContent: `Landing (${searchData.destination})`,
      subContent: "Earliest to latest",
    },
    latestLanding: {
      mainContent: `Landing (${searchData.destination})`,
      subContent: "Latest to earliest",
    },
    highestPrice: {
      mainContent: "Highest price",
      subContent: "Highest to lowest",
    },
    slowest: {
      mainContent: "Slowest",
      subContent: "Longest to shortest",
    },
  };

  const { mainContent = "", subContent = "" } =
    sortOptions[selectedOtherSort] || {};

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
      <div className="hidden lg:block w-full h-[85px] bg-white shadow-md  overflow-hidden rounded-[10px]">
        <div className="grid grid-cols-4 h-full">
          <div className={`flex justify-center items-center relative `}>
            <div
              className="flex-1 mx-2 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer"
              onClick={() => handleChangeSort("cheapest")}
            >
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
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 mx-2"></div>
            )}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-14 bg-gray-200"></div>
          </div>
          <div className={`flex justify-center items-center relative`}>
            <div
              className="flex-1 mx-2 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer"
              onClick={() => handleChangeSort("best")}
            >
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
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 mx-2"></div>
            )}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-14 bg-gray-200"></div>
          </div>

          <div className={`flex justify-center items-center relative`}>
            <div
              onClick={() => handleChangeSort("quickest")}
              className="flex-1 mx-2 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer"
            >
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
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 mx-2"></div>
            )}
            <div className="absolute right-0 top-1/2 w-px h-14 bg-gray-200"></div>
          </div>

          {/* conditionally render the content if other filter options selected */}
          {othersSortOptions.includes(selectedOtherSort) ? (
            <div className="flex justify-center items-center relative">
              <div
                className="flex flex-1 mx-2 justify-center items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer"
                onClick={handleToggleOtherSort}
              >
                <div className="flex flex-col items-start justify-center cursor-pointer">
                  <h3 className="font-semibold text-[14px]">{mainContent}</h3>
                  <p className="text-[12px] text-gray-600">{subContent}</p>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation(); // Stop event from bubbling up
                    setIsShowOtherSort(true);
                  }}
                >
                  <SortIcon />
                </div>
              </div>

              {othersSortOptions.includes(sortCriteria) && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 mx-2"></div>
              )}
            </div>
          ) : (
            <div className={`flex items-center justify-center`}>
              <button
                onClick={handleToggleOtherSort}
                className="flex flex-1 mx-2 gap-2 items-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 px-3 py-4 rounded-lg cursor-pointer"
              >
                <SortIcon />
                <span>Other sort</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {isShowOtherSort && (
        <div
          ref={dropdownRef}
          className="absolute right-0 bg-white overflow-y-auto min-w-64 max-h-48 shadow-xl border rounded"
        >
          <ul>
            <li
              className={`hover:bg-gray-200 transition-all text-sm text-gray-900 px-4 py-2 cursor-pointer ${
                sortCriteria === "earliestTakeOff"
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
              onClick={() => handleChangeOtherSort("earliestTakeOff")}
            >
              Earliest take-off ({searchData.origin})
            </li>
            <li
              className={`hover:bg-gray-200 transition-all text-sm text-gray-900 px-4 py-2 cursor-pointer ${
                sortCriteria === "latestTakeOff"
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
              onClick={() => handleChangeOtherSort("latestTakeOff")}
            >
              Latest take-off ({searchData.origin})
            </li>
            <li
              className={`hover:bg-gray-200 transition-all text-sm text-gray-900 px-4 py-2 cursor-pointer ${
                sortCriteria === "earliestLanding"
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
              onClick={() => handleChangeOtherSort("earliestLanding")}
            >
              Earliest landing ({searchData.destination})
            </li>
            <li
              className={`hover:bg-gray-200 transition-all text-sm text-gray-900 px-4 py-2 cursor-pointer ${
                sortCriteria === "latestLanding"
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
              onClick={() => handleChangeOtherSort("latestLanding")}
            >
              Latest landing ({searchData.destination})
            </li>
            <li
              className={`hover:bg-gray-200 transition-all text-sm text-gray-900 px-4 py-2 cursor-pointer ${
                sortCriteria === "highestPrice"
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
              onClick={() => handleChangeOtherSort("highestPrice")}
            >
              Highest price
            </li>
            <li
              className={`hover:bg-gray-200 transition-all text-sm text-gray-900 px-4 py-2 cursor-pointer ${
                sortCriteria === "slowest" ? "bg-gray-200 font-semibold" : ""
              }`}
              onClick={() => handleChangeOtherSort("slowest")}
            >
              Slowest
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
