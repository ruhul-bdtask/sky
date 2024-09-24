"use client";
import React from "react";
import CouponIcon from "@/public/icons/CouponIcon";

export default function Services() {
  const servicesData = [
    {
      icon: <CouponIcon />,
      title: " Search for the best flight deals",
      content:
        "Search for the best flight deals from 900+ travel sites. No need to search multiple websites, KAYAK allows you to compare all of  them in one place.",
    },
    // Add more services here
    {
      icon: <CouponIcon />,
      title: "Book with flexibility",
      content:
        "Easily find and filter flights that suit your different requirements, like no cancellation fees.",
    },
    {
      icon: <CouponIcon />,
      title: "Trusted and free",
      content: "We are completely free to use - no hidden charges or fees.",
    },
    {
      icon: <CouponIcon />,
      title: "Easy to use trip planning tools",
      content:
        "With useful tools like trip planner, flight tracker and bag measure, KAYAK is more than just a flight search site - it is your complete travel partner.",
    },
  ];
  return (
    <div>
      <div className="py-10">
        <h2 className="text-[24px] font-bold text-black">
          What KAYAK brings to the table.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 mx-auto lg:grid-cols-4 gap-[10px]  my-4 place-items-center">
          {servicesData?.map((service) => (
            <div className="w-[312px] h-[228px] rounded-[11px] border">
              <div className="p-5">
                <div className="p-4 bg-[#FFDAC0] w-[56px] rounded-[7px]">
                  {service?.icon}
                </div>
                <div className="py-4">
                  <p className="text-[17px] font-semibold text-[#1C2226] mb-1">
                    {service?.title}
                  </p>
                  <p className="text-[14px] text-[#6C7072]">
                    {service?.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
