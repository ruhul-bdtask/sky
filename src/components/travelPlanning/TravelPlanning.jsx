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
    <div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 p-4 gap-10 ">
        <Accordion type="single" collapsible className="w-full">
          {destinations.map((destination, index) => (
            <AccordionItem value={destination.city} key={index}>
              <AccordionTrigger className="text-left">
                <div>
                  <div className="font-semibold">{destination.city}</div>
                  <div className="text-sm text-blue-500">FLIGHTS</div>
                </div>
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
              <AccordionTrigger className="text-left">
                <div>
                  <div className="font-semibold">{destination.city}</div>
                  <div className="text-sm text-blue-500">FLIGHTS</div>
                </div>
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
              <AccordionTrigger className="text-left">
                <div>
                  <div className="font-semibold">{destination.city}</div>
                  <div className="text-sm text-blue-500">FLIGHTS</div>
                </div>
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
