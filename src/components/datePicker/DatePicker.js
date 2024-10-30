"use client";

import * as React from "react";
import { addDays, format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Calender from "@/public/icons/Calender";

export default function DatePicker({ className, setRoundDate, roundDate }) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex gap-2">
            <button
              id="date"
              className={cn(
                "w-full md:w-[280px] justify-start text-left font-normal ",
                !roundDate && "text-muted-foreground"
              )}
            >
              <div className="relative w-full pl-10 pr-4 py-4 cursor-pointer focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]">
                <div className="absolute left-3 text-gray-400 ">
                  <Calender />
                </div>
                {roundDate?.from ? (
                  roundDate.to ? (
                    format(roundDate.from, "LLL dd, y")
                  ) : (
                    format(roundDate.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </div>
            </button>
            <button
              id="date"
              className={cn(
                "w-full md:w-[280px] justify-start text-left font-normal ",
                !roundDate && "text-muted-foreground"
              )}
            >
              <div className="relative w-full pl-10 pr-4 py-4 cursor-pointer focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]">
                <div className="absolute left-3 text-gray-400 ">
                  <Calender />
                </div>
                {roundDate?.from ? (
                  roundDate.to ? (
                    format(roundDate.to, "LLL dd, y")
                  ) : (
                    format(roundDate.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
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
