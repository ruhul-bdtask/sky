"use client";
import SortIcon from "@/public/icons/SortIcon";
import { InfoIcon } from "lucide-react";
import React, { useState } from "react";

export default function TopFilter() {
  const [topFilter, setTopFilter] = useState("cheapest");
  console.log(topFilter);
  return (
    <div>
      <div className="hidden lg:block w-[985px] h-[100px] bg-white shadow-md  overflow-hidden rounded-[10px]">
        <div className="grid grid-cols-4  h-full">
          <div
            className={`flex-1 flex flex-col justify-center items-center px-10 relative cursor-pointer`}
            onClick={() => setTopFilter("cheapest")}
          >
            <div>
              <h3 className="font-semibold text-lg">Cheapest</h3>
              <p className="text-sm text-gray-600">Tk 24,414 • 3h 55m</p>
            </div>
            {topFilter == "cheapest" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 w-[80%] mx-auto"></div>
            )}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-14 bg-gray-200"></div>
          </div>
          <div
            className={`flex-1 flex flex-col justify-center items-center  relative   cursor-pointer`}
            onClick={() => setTopFilter("best")}
          >
            <div>
              <h3 className="font-semibold text-lg flex items-center">
                Best
                <InfoIcon className="w-4 h-4 ml-1 text-gray-400" />
              </h3>
              <p className="text-sm text-gray-600">Tk 23,414 • 3h 55m</p>
            </div>
            {topFilter == "best" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 w-[80%] mx-auto"></div>
            )}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-14 bg-gray-200"></div>
          </div>
          <div
            className={`flex-1 flex flex-col justify-center items-center  relative   cursor-pointer`}
            onClick={() => setTopFilter("quick")}
          >
            <div>
              <h3 className="font-semibold text-lg">Quickest</h3>
              <p className="text-sm text-gray-600">Tk 24,414 • 3h 50m</p>
            </div>
            {topFilter == "quick" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 w-[80%] mx-auto"></div>
            )}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-14 bg-gray-200"></div>
          </div>
          <div
            className={`flex items-center justify-center px-6 cursor-pointer relative`}
            onClick={() => setTopFilter("other")}
          >
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <SortIcon />
              <span className="mr-2">Other sort</span>
            </button>
            {topFilter == "other" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 w-[80%] mx-auto"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
