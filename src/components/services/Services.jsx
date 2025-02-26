"use client";
import React from "react";
import CouponIcon from "@/public/icons/CouponIcon";
import Skeleton from "react-loading-skeleton";

export default function Services({ servicesData, homeDataLoading }) {
  // const servicesData = [
  //   {
  //     icon: <CouponIcon />,
  //     title: " Search for the best flight deals",
  //     content:
  //       "Search for the best flight deals from 900+ travel sites. No need to search multiple websites, Ticketing allows you to compare all of  them in one place.",
  //   },
  //   // Add more services here
  //   {
  //     icon: <CouponIcon />,
  //     title: "Book with flexibility",
  //     content:
  //       "Easily find and filter flights that suit your different requirements, like no cancellation fees.",
  //   },
  //   {
  //     icon: <CouponIcon />,
  //     title: "Trusted and free",
  //     content: "We are completely free to use - no hidden charges or fees.",
  //   },
  //   {
  //     icon: <CouponIcon />,
  //     title: "Easy to use trip planning tools",
  //     content:
  //       "With useful tools like trip planner, flight tracker and bag measure, Ticketing is more than just a flight search site - it is your complete travel partner.",
  //   },
  // ];
  return (
    <div>
      {homeDataLoading ? (
        <>
          <div className="py-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 ">
              <Skeleton width={400} height={40} />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="px-4 py-12 border rounded-md  flex flex-col "
                >
                  <div className="w-16 h-16 mb-6 ">
                    <Skeleton height="100%" width="100%" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    <Skeleton width={150} />
                  </h3>
                  <p className="text-sm">
                    <Skeleton count={2} />
                  </p>
                </div>
              ))}
            </div>
          </div>{" "}
        </>
      ) : (
        <>
          <div className="py-10">
            {servicesData?.length > 0 && (
              <>
                <h2 className="text-[24px] font-bold text-black">
                  What Ticketing brings to the table.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 mx-auto lg:grid-cols-4 gap-[10px]  my-4 place-items-center">
                  {servicesData?.map((service, index) => (
                    <div
                      className="w-full h-full rounded-[11px] border overflow-hidden"
                      key={index}
                    >
                      <div className="p-5">
                        <div className="p-4 bg-[#FFDAC0] w-[56px] rounded-[7px]">
                          <img src={service?.image_url} alt="icon" />
                        </div>
                        <div className="py-4">
                          <p className="text-[17px] font-semibold text-[#1C2226] mb-1">
                            {service?.title}
                          </p>
                          <p className="text-[14px] text-[#6C7072] ">
                            {service?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
