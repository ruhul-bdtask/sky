import TravelDashboard from "@/components/dashoboard/travelDashboard/TravelDashboard";
import React from "react";

export default function page() {
  return (
    <div>
      <TravelDashboard />
      <div className="leading-10 text-[14px] max-w-[1300px] mx-auto py-8">
        <p className="text-[#0B7C9E] hover:underline cursor-pointer">
          Top International Flight Routes.
        </p>
        <p className="text-[#565656]">
          Cheap flights,
          <span className="text-[#0B7C9E] hover:underline cursor-pointer">
             hotels
          </span>
          , hire cars and travel deals: 
        </p>
        <p className="text-[#565656]">
          Ticketing searches hundreds of other travel sites at once to find the
          best deals on airline tickets, cheap hotels, holidays and hire cars.
        </p>
        <p className="text-[#565656]">
          Not what you’re looking for? Find thousands of other
          <span className="text-[#0B7C9E] hover:underline cursor-pointer">
             hotels, flights
          </span>
          , car hires and package deals with Ticketing.
        </p>
      </div>
    </div>
  );
}
