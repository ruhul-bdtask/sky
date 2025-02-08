"use client";
import React from "react";
import blog3 from "@/public/images/blog3.png";
import blog5 from "@/public/images/blog5.png";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function BlackBlog({ position }) {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop();
  return (
    <div className="bg-[#192024] h-full lg:h-[711px] flex justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center ">
        <div className="flex justify-center items-center text-white w-full h-full">
          <div className="p-10 md:p-36 flex flex-col gap-5">
            <h2 className="text-[32px] font-bold">
              {position !== undefined
                ? position == 1
                  ? "Ready to get out there?"
                  : "News"
                : lastSegment == "tips-and-tricks"
                ? "Tips & tricks"
                : lastSegment == "travel-experiences"
                ? "Travel-exp"
                : ""}
            </h2>
            <p className="text-[15px]  text-white">
              {position !== undefined
                ? position == 1
                  ? "Reading about travel will only take you so far. See how TICKETING Navigator can inch you towards your next escape."
                  : "Read the latest news about the travel industry, our products and services, and what’s happening at TICKETING."
                : lastSegment == "tips-tricks"
                ? "Hack your way to the most amazing trips ever with tips on everything from how to pack your carry-on to how to eat dumplings."
                : lastSegment == "travel-experiences"
                ? "Travel-exp"
                : ""}
            </p>
            {position !== undefined && (
              <button className=" px-4 border text-[14px] font-semibold h-9 w-32 rounded-[4px]">
                <span>{position == 1 ? " Lets do it" : "Learn more"}</span>
              </button>
            )}
          </div>
        </div>
        <div className="px-10 md:px-36 pb-20 lg:pb-0">
          <Image
            className="rounded-[12px]"
            src={position == 1 ? blog3 : blog5}
          ></Image>
        </div>
      </div>
    </div>
  );
}
