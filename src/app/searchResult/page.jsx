import React from "react";

import FlightCard from "@/components/flightCard/FlightCard";
import FlightFilter from "@/components/flightFilter/FlightFilter";
import { InfoIcon } from "lucide-react";
import TopFilter from "@/components/topFilter/TopFilter";
export default function page() {
  const cards = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },

    // Add more cards as needed...
  ];
  return (
    <>
      <div className="bg-[#F0F3F5] py-10">
        <div className="flex  container mx-auto gap-5">
          <FlightFilter />
          <div className="">
            <TopFilter />
            {cards?.map((card) => (
              <FlightCard key={card.id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
