"use client";
import Image from "next/image";
import { useState } from "react";
import trip from "@/public/images/trip-seats.png";
import Account from "../account/Account";
import Preferences from "../preferences/Preferences";
import Travelers from "../travelers/Travelers";
import Payment from "../payment/Payment";
import Notifications from "../notifications/Notifications";
import Airplane from "@/public/icons/Airplane";
import accountImg from "@/public/images/accountImg.png";

export default function TravelDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabContent = {
    dashboard: (
      <>
        <section className="mb-8">
          <h2 className="text-[22px] font-semibold mb-4">Trip Stats</h2>
          <div
            className={`bg-gray-100 px-6 py-8 `}
            style={{
              backgroundImage: `url(${trip.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex items-center justify-between flex-wrap">
              <div>
                <p className=" mb-2 text-[18px] font-semibold">
                  You don't have any Trip Stats yet
                </p>
                <p className="text-[14px] font-semibold text-black mb-4">
                  Kick your trip into gear. Get started!
                </p>
                <button className="bg-[#363F45] text-white text-[14px] font-semibold px-4 py-2 rounded">
                  View Trips
                </button>
              </div>
              <Image className="w-[382px] h-[182px]" src={accountImg}></Image>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Recent searches</h2>
          <div className="border overflow-hidden  mx-auto">
            {/* First search item */}
            <div className="flex items-center justify-between py-4  w-[95%] mx-auto">
              <div className="flex gap-4">
                <Airplane />
                <p className="font-semibold">DAC Dhaka → CCU Kolkata</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Sat, 10/05 - Sun, 10/13</p>
              </div>
              <p className="text-sm text-gray-600">1 traveler, economy</p>
            </div>

            {/* Second search item */}
            <div className="flex items-center justify-between py-4 border-t w-[95%] mx-auto">
              <div className="flex gap-4">
                <Airplane />
                <p className="font-semibold">DAC Dhaka → CCU Kolkata</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Sat, 10/05 - Sun, 10/13</p>
              </div>
              <p className="text-sm text-gray-600">1 traveler, economy</p>
            </div>
          </div>
          <button className="text-sm text-gray-600 mt-5 hover:underline">
            See all search history
          </button>
        </section>
      </>
    ),
    account: <Account />,
    preferences: <Preferences />,
    travelers: <Travelers />,
    payment: <Payment />,
    notifications: <Notifications />,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1012px] mx-auto px-4 py-8">
        <header className="grid grid-cols-1 lg:grid-cols-10 items-center">
          <div className="flex justify-between items-end gap-10 flex-wrap  col-span-7">
            <div>
              <h1 className="text-[40px] font-bold mb-1">Welcome</h1>
              <p className="text-[12px] font-semibold text-[#3E4346]">
                Account Email
              </p>
              <p className="text-[16px] font-semibold text-black">
                mynameI2345@gmail.com
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-gray-600 mr-2 ">
                <span className="text-[12px] font-semibold text-[#3E4346]">
                  Home Airport
                </span>
                <br />
                <span className="text-[16px] font-semibold text-black">
                  Dhaka, Bangladesh - Hazrat Shahjalal Intl
                </span>
              </p>
            </div>
          </div>

          <div className="col-span-3 justify-end flex">
            <div className="w-[100px] lg:w-[192px] h-[100px] lg:h-[192px] bg-orange-500 rounded-full flex items-center justify-center text-white text-[96px] font-bold">
              M
            </div>
            <button className="ml-2 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>
        </header>

        <nav className="flex border-b mb-8 overflow-x-auto scrollbar-hide">
          {[
            "dashboard",
            "account",
            "preferences",
            "travelers",
            "payment",
            "notifications",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 mr-4 ${
                activeTab === tab
                  ? "text-gray-800 border-b-2 border-gray-800"
                  : "text-gray-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {tabContent[activeTab]}
      </div>
    </div>
  );
}
