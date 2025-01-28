"use client";

import * as React from "react";
import { addDays, subDays } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Calender from "@/public/icons/Calender";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { formatLongDataToShort } from "@/lib/formatLongDataToShort";

export default function DatePicker({
  className,
  setRoundDate,
  roundDate,
  originalArrivalData,
  originalDate,
}) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [activeButton, setActiveButton] = React.useState(null); // 'from' or 'to'

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

  const handleFromClick = (e) => {
    e.stopPropagation();
    setActiveButton("from");
    setIsPopoverOpen(true);
  };

  const handleToClick = (e) => {
    e.stopPropagation();
    setActiveButton("to");
    setIsPopoverOpen(true);
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
                "w-full md:w-[280px] justify-start text-left font-normal",
                !roundDate.from && "text-muted-foreground"
              )}
              onClick={handleFromClick}
            >
              <div className="relative w-full pl-10 pr-4 py-4 cursor-pointer focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5] flex justify-between items-center hover:bg-[#d9e2e8]">
                <div className="absolute left-3 text-gray-400">
                  <Calender />
                </div>
                {roundDate.from ? formatLongDataToShort(roundDate.from) : ""}
                <div className="flex">
                  <LuChevronLeft
                    size={20}
                    className="cursor-pointer"
                    onClick={handlePrevFromDate}
                  />
                  <LuChevronRight
                    size={20}
                    className="cursor-pointer"
                    onClick={handleNextFromDate}
                  />
                </div>
              </div>
            </button>

            {/* To Date Picker */}
            <button
              id="to-date"
              type="button"
              className={cn(
                "w-full md:w-[280px] justify-start text-left font-normal",
                !roundDate.to && "text-muted-foreground"
              )}
              onClick={handleToClick}
            >
              <div className="relative w-full pl-10 pr-4 py-4 cursor-pointer focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5] flex justify-between items-center hover:bg-[#d9e2e8]">
                <div className="absolute left-3 text-gray-400">
                  <Calender />
                </div>
                {roundDate.to ? formatLongDataToShort(roundDate.to) : ""}
                <div className="flex">
                  <LuChevronLeft
                    size={20}
                    className="cursor-pointer"
                    onClick={handlePrevToDate}
                  />
                  <LuChevronRight
                    size={20}
                    className="cursor-pointer"
                    onClick={handleNextToDate}
                  />
                </div>
              </div>
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto bg-white p-0"
          align="start"
          visible={isPopoverOpen}
          onVisibleChange={setIsPopoverOpen}
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={
              activeButton === "from" ? roundDate?.from : roundDate?.to
            }
            selected={roundDate}
            onSelect={(date) => {
              if (activeButton === "from") {
                // Directly set the from date without affecting the to date
                setRoundDate((prev) => ({
                  ...prev,
                  from: date?.from || date,
                }));
                setActiveButton("to");
              } else {
                setRoundDate((prev) => ({
                  ...prev,
                  to: date?.to || date,
                }));
                if (date?.to) {
                  setIsPopoverOpen(false);
                }
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
        {/* <PopoverContent className="w-auto bg-white p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={
              activeButton === "from" ? roundDate?.from : roundDate?.to
            }
            selected={roundDate}
            onSelect={(date) => {
              // If selecting "from" date
              if (activeButton === "from") {
                // Get the clicked date, whether it's before or after existing dates
                const clickedDate = date?.from || date?.to || date;
                setRoundDate((prev) => ({
                  ...prev,
                  from: clickedDate,
                }));
                setActiveButton("to");
              }
              // If selecting "to" date
              else {
                const clickedDate = date?.from || date?.to || date;
                setRoundDate((prev) => ({
                  ...prev,
                  to: clickedDate,
                }));
                setIsPopoverOpen(false);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent> */}
      </Popover>
    </div>
  );
}
