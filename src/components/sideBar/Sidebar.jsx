"use client";
import FlightIcon from "@/public/icons/FlightIcon";
import Love from "@/public/icons/Love";
import Business from "@/public/icons/Business";
import Clock from "@/public/icons/Clock";
import Feedback from "@/public/icons/Feedback";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSidebar } from "@/context/sidebar-context";

export default function Sidebar() {
  const { isSidebarOpen } = useSidebar();
  const [isActive, setIsActive] = useState("");

  useEffect(() => {
    // Get the active tab from localStorage
    const savedTab = localStorage.getItem("activeSidebarTab");
    if (savedTab) {
      setIsActive(savedTab);
    } else {
      setIsActive("flights"); // Default selection
    }
  }, []);

  const handleTabClick = (shortCode) => {
    setIsActive(shortCode);
    localStorage.setItem("activeSidebarTab", shortCode);
  };

  const navItems = [
    { icon: <FlightIcon />, label: "Flights", shortCode: "flights", link: "/" },
    {
      icon: <Clock />,
      label: "Travel Blog",
      shortCode: "travel_blog",
      link: "/travel-blog",
    },
    {
      icon: <Business />,
      label: "TICKETING for Business",
      shortCode: "ticking_for_business",
      link: "/ticketingForBusiness",
    },
    {
      icon: <Love />,
      label: "Trips",
      shortCode: "trips",
      link: "#",
    },
    {
      icon: <Feedback />,
      label: "Feedback",
      shortCode: "feedback",
      link: "/feedback",
    },
  ];

  return (
    <aside
      className={`hidden lg:block transition-all duration-300 ease-in-out fixed top-20 left-0 bottom-0 ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="h-full p-2 overflow-y-auto border-r w-full">
        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <Link href={item?.link} key={index}>
              <button
                onClick={() => handleTabClick(item.shortCode)}
                className={`rounded-sm hover:bg-[#E6EBEF] transition-all ease-in-out duration-200 w-full p-3 ${
                  isActive === item.shortCode ? "bg-[#E6EBEF]" : ""
                }`}
              >
                <div className="flex items-center text-base font-normal w-full">
                  <span
                    className={`ms-0.5 me-6 ${
                      isActive === item.shortCode
                        ? "text-black fill-black"
                        : "text-[var(--nav-color)] fill-[var(--nav-color)]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`line-clamp-1 text-[14px] ${
                      isActive === item.shortCode
                        ? "text-black font-semibold"
                        : "text-[var(--nav-color)]"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </button>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
