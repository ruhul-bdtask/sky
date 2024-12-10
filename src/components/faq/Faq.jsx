"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
export default function Faq() {
  const {
    data: faqData,
    error: faqDataError,
    isLoading: faqDataLoading,
    refetch: refetchFaqData,
  } = useQuery({
    queryKey: ["faq"],
    queryFn: () => fetchData("/all-faqs", "GET"),
    enabled: true,
  });

  return (
    <div className="py-10">
      <div className="pb-6">
        <h2 className="text-[24px] font-bold text-black">
          Start your travel planning here
        </h2>
        <p className="text-[16px]">Search Flights</p>
      </div>
      <div className="w-full  py-4 gap-10 ">
        <Accordion
          type="single"
          collapsible
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 "
        >
          {faqData?.data.map((destination, index) => (
            <AccordionItem value={destination.question} key={index}>
              <AccordionTrigger className="text-left py-1">
                <div className="text-[16ox] font-semibold py-3">
                  {destination.question}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p>{destination?.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
