import React from "react";
import { X } from "lucide-react";
import Cookies from "js-cookie";

export default function Preferences() {
  const token = Cookies.get("auth-token");
  console.log(token);

  return (
    <section>
      <div className="w-full mx-auto flex flex-col gap-10 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200  p-10">
          <h2 className="text-[20px] font-semibold text-black mb-2">
            Airports
          </h2>
          <p className="text-[14px] text-black mb-6">
            Search for flights more easily by saving your home airport and other
            airports you travel through often.
          </p>

          <div className="mb-6">
            <h3 className="text-[16px] font-medium text-gray-700 mb-2">
              Home airport
            </h3>
            <div className="inline-flex items-center bg-[#363F45] text-white text-[16px] font-semibold rounded px-2 py-3">
              <span>Dhaka (DAC)</span>
              <button className="ml-2 focus:outline-none">
                <X size={16} />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-[16px] font-medium text-black mb-2">
              Secondary airports
            </h3>
            <input
              type="text"
              placeholder="Search for alternative airports"
              className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none "
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
          <h2 className="text-[16px] font-semibold text-black mb-2">
            Airlines
          </h2>
          <p className="text-[14px] text-[#686868] mb-6">
            Get better search results by adding your airlines preferences.
          </p>

          <div>
            <h3 className="text-[16px] font-semibold text-black mb-2">Avoid</h3>
            <p className="text-[14px] text-[#686868]">
              These will show up lower in the results
            </p>
            <input
              type="text"
              placeholder="Search airlines"
              className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none "
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
          <h2 className="text-[16px] font-semibold text-black mb-2">
            Hotel chains
          </h2>
          <p className="text-[14px] text-[#686868] mb-6">
            Get better search results by adding your hotel chains preferences.
          </p>

          <div>
            <h3 className="text-[16px] font-semibold text-black mb-2">
              Preferred
            </h3>
            <p className="text-[14px] text-[#686868] ">
              These will show up higher in the results
            </p>
            <input
              type="text"
              placeholder="Search Hotel Chains"
              className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none "
            />
          </div>
          <div className="pt-6">
            <h3 className="text-[16px] font-semibold text-black mb-2">Avoid</h3>
            <p className="text-[14px] text-[#686868] ">
              These will show up lower in the results
            </p>
            <input
              type="text"
              placeholder="Search Hotel Chains"
              className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none "
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
          <h2 className="text-[16px]  font-semibold text-black mb-2">
            Saved places
          </h2>
          <p className="text-[14px] text-[#686868] mb-6">
            Choose from your saved places to narrow your search to nearby hotels
            and hire
          </p>

          <p className="text-[#007799] text-[14px] font-semibold cursor-pointer">
            Add a place
          </p>
        </div>
      </div>
    </section>
  );
}
