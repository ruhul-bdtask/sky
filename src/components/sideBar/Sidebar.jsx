// app/components/Sidebar.js

import { useSidebar } from "@/app/sidebar-context";

import FlightIcon from "@/public/icons/FlightIcon";
import Love from "@/public/icons/Love";
import Business from "@/public/icons/Business";
import Clock from "@/public/icons/Clock";
import Feedback from "@/public/icons/Feedback";
import { useState } from "react";
export default function Sidebar() {
  const { isSidebarOpen } = useSidebar(); // Access the sidebar state
  const [isActive, setIsActive] = useState("flight");

  const navItems = [
    { icon: <FlightIcon />, label: "Flights", shortCode: "flights" },
    { icon: <Clock />, label: "Travel Blog", shortCode: "travel_blog" },
    {
      icon: <Business />,
      label: "TICKETING for Business",
      shortCode: "ticking_for_business",
    },
    { icon: <Love />, label: "Trips", shortCode: "trips" },
    { icon: <Feedback />, label: "Feedback", shortCode: "feedback" },
  ];

  return (
    <aside
      className={`  transition-all duration-300 ease-in-out fixed top-20 left-0 bottom-0 ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="h-full p-2  overflow-y-auto  border-r w-full">
        <nav className="space-y-2 ">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setIsActive(item.shortCode)}
              className={` rounded-sm hover:bg-gray-300 transition-all ease-in-out duration-200 w-full p-3 ${
                isActive == item?.shortCode ? " bg-gray-300" : ""
              }`}
            >
              <div className="flex items-center  text-base font-normal w-full">
                <span
                  className={`me-6 ${
                    isActive == item?.shortCode
                      ? " text-black "
                      : "text-[var(--nav-color)]"
                  }`}
                >
                  {item.icon}
                </span>{" "}
                <span
                  className={`line-clamp-1 text-[14px] ${
                    isActive == item?.shortCode
                      ? " text-black font-semibold"
                      : "text-[var(--nav-color)]"
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {/* <span className="ml-2">{item.label}</span> */}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
