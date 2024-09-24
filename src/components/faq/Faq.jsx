"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function Faq() {
  const destinations = [
    {
      city: "How do I find travel deals on TICKETING?",
      expanded: false,
      description:
        "Instead of manually checking back in on the price of your next flight or stay, let TICKETING do the hard work for you with KAYAK Price Alerts. Once you’ve saved your search, our data will determine how the price will rise or fluctuate over the coming days. You’ll then get a push notification letting you know when’s the perfect time to book.",
    },
    {
      city: "How can I use TICKETING to manage my travel bookings?",
      expanded: true,
      description:
        "Instead of manually checking back in on the price of your next flight or stay, let TICKETING do the hard work for you with KAYAK Price Alerts. Once you’ve saved your search, our data will determine how the price will rise or fluctuate over the coming days. You’ll then get a push notification letting you know when’s the perfect time to book.",
    },
  ];
  const destinations2 = [
    {
      city: "What makes KAYAK a great travel app?",
      expanded: false,
      description:
        "Instead of manually checking back in on the price of your next flight or stay, let TICKETING do the hard work for you with KAYAK Price Alerts. Once you’ve saved your search, our data will determine how the price will rise or fluctuate over the coming days. You’ll then get a push notification letting you know when’s the perfect time to book.",
    },
    {
      city: "What are TICKETING Price Alerts?",
      expanded: true,
      description:
        "Instead of manually checking back in on the price of your next flight or stay, let TICKETING do the hard work for you with KAYAK Price Alerts. Once you’ve saved your search, our data will determine how the price will rise or fluctuate over the coming days. You’ll then get a push notification letting you know when’s the perfect time to book.",
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
      <div className="w-full grid grid-cols-1 md:grid-cols-2  py-4 gap-10 ">
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
                <p>{destination?.description}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Accordion type="single" collapsible className="w-full">
          {destinations2.map((destination, index) => (
            <AccordionItem value={destination.city} key={index}>
              <div className="text-[16ox] font-semibold py-3">
                {destination.city}
              </div>
              <AccordionTrigger className="text-left py-1">
                <div className="text-[12px]  text-[#0C7C99]">FLIGHTS</div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-[#647582] text-[14px]">
                  {destination?.description}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
