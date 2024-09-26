"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function TravelPlanning() {
  const destinations = [
    {
      city: "New York",
      expanded: false,
      items: [],
    },
    {
      city: "Orlando",
      expanded: true,
      items: [
        { name: "Monumental Movieland Hotel", price: "$47+" },
        { name: "Rosen Inn Closest to Universal", price: "$68+" },
        { name: "Rosen Inn International", price: "$68+" },
        { name: "Flight Atlanta - Orlando (ATL - MCO)", price: "$43+" },
        { name: "Flight Islip - Orlando (ISP - MCO)", price: "$55+" },
        { name: "Flight New York - Orlando (LGA - MCO)", price: "$56+" },
      ],
    },
    {
      city: "London",
      expanded: false,
      items: [],
    },
    {
      city: "Fort Lauderdale",
      expanded: false,
      items: [],
    },
    {
      city: "Seattle",
      expanded: false,
      items: [],
    },
    {
      city: "Fort Lauderdale",
      expanded: false,
      items: [],
    },
    {
      city: "Seattle",
      expanded: false,
      items: [],
    },
  ];
  return (
    <div className="py-10">
      <div className="pb-6">
        <h2 className="text-[24px] font-bold text-black">
          Start your travel planning here
        </h2>
        <p className="text-[16px]">Search Flights</p>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  py-4 gap-10 ">
        <Accordion type="single" collapsible className="w-full">
          {destinations.map((destination, index) => (
            <AccordionItem value={destination.city} key={index}>
              <div className="text-[16ox] font-semibold py-3">
                {destination.city}
              </div>
              <AccordionTrigger className="text-left py-1">
                <div className="text-[12px]  text-[#0C7C99]">FLIGHTS</div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {destination.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex justify-between text-sm"
                    >
                      <span>{item.name}</span>
                      <span className="text-gray-600">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Accordion type="single" collapsible className="w-full">
          {destinations.map((destination, index) => (
            <AccordionItem value={destination.city} key={index}>
              <div className="text-[16ox] font-semibold py-3">
                {destination.city}
              </div>
              <AccordionTrigger className="text-left py-1">
                <div className="text-[12px]  text-[#0C7C99]">FLIGHTS</div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {destination.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex justify-between text-sm"
                    >
                      <span>{item.name}</span>
                      <span className="text-gray-600">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Accordion type="single" collapsible className="w-full">
          {destinations.map((destination, index) => (
            <AccordionItem value={destination.city} key={index}>
              <div className="text-[16ox] font-semibold py-3">
                {destination.city}
              </div>
              <AccordionTrigger className="text-left py-1">
                <div className="text-[12px]  text-[#0C7C99]">FLIGHTS</div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {destination.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex justify-between text-sm"
                    >
                      <span>{item.name}</span>
                      <span className="text-gray-600">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
