"use client";

import * as React from "react";
import { addDays, subDays, format } from "date-fns"; // Importing addDays and subDays

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Calender from "@/public/icons/Calender";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"; // Import left and right chevrons

export default function DatePicker({ className, setRoundDate, roundDate }) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const handlePrevFromDate = (e) => {
    e.stopPropagation();

    if (roundDate?.from) {
      setRoundDate((prevState) => ({
        ...prevState,
        from: subDays(prevState.from, 1),
      }));
    }
  };

  const handleNextFromDate = (e) => {
    e.stopPropagation();

    if (roundDate?.from) {
      setRoundDate((prevState) => ({
        ...prevState,
        from: addDays(prevState.from, 1),
      }));
    }
  };

  const handlePrevToDate = (e) => {
    e.stopPropagation();

    if (roundDate?.to) {
      setRoundDate((prevState) => ({
        ...prevState,
        to: subDays(prevState.to, 1),
      }));
    }
  };

  const handleNextToDate = (e) => {
    e.stopPropagation();
    if (roundDate?.to) {
      setRoundDate((prevState) => ({
        ...prevState,
        to: addDays(prevState.to, 1),
      }));
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="flex gap-2">
            {/* From Date Picker */}
            <button
              id="from-date"
              type="button"
              className={cn(
                "w-full md:w-[250px] justify-start text-left font-normal ",
                !roundDate?.from && "text-muted-foreground"
              )}
              onClick={() => setIsPopoverOpen(!isPopoverOpen)} // Toggle calendar popover for 'from' date
            >
              <div className="relative w-full pl-10 pr-4 py-4 cursor-pointer focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5] flex justify-between items-center hover:bg-[#d9e2e8] ">
                <div className="absolute left-3 text-gray-400 ">
                  <Calender />
                </div>
                {roundDate?.from ? (
                  format(roundDate.from, "LLL dd, y")
                ) : (
                  <span>Pick a date</span>
                )}
                <div className="flex">
                  <LuChevronLeft
                    size={20}
                    className="cursor-pointer"
                    onClick={handlePrevFromDate} // Navigate to previous date for 'from'
                  />
                  <LuChevronRight
                    size={20}
                    className="cursor-pointer"
                    onClick={handleNextFromDate} // Navigate to next date for 'from'
                  />
                </div>
              </div>
            </button>

            {/* To Date Picker */}
            <button
              id="to-date"
              type="button"
              className={cn(
                "w-full md:w-[250px] justify-start text-left font-normal ",
                !roundDate?.to && "text-muted-foreground"
              )}
              onClick={() => setIsPopoverOpen(!isPopoverOpen)} // Toggle calendar popover for 'to' date
            >
              <div className="relative w-full pl-10 pr-4 py-4 cursor-pointer focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5] flex justify-between items-center hover:bg-[#d9e2e8] ">
                <div className="absolute left-3 text-gray-400 ">
                  <Calender />
                </div>
                {roundDate?.to ? (
                  format(roundDate.to, "LLL dd, y")
                ) : (
                  <span>Pick a date</span>
                )}
                <div className="flex">
                  <LuChevronLeft
                    size={20}
                    className="cursor-pointer"
                    onClick={handlePrevToDate} // Navigate to previous date for 'to'
                  />
                  <LuChevronRight
                    size={20}
                    className="cursor-pointer"
                    onClick={handleNextToDate} // Navigate to next date for 'to'
                  />
                </div>
              </div>
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto bg-white p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={roundDate?.from}
            selected={roundDate}
            onSelect={setRoundDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
