"use client";
import * as React from "react";
import { format, addDays, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Calender from "@/public/icons/Calender";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function TripDatePicker({
  date,
  setDate,
  numberOfMonths = 1,
  triggerStyles,
  triggerWrapperStyles,
}) {
  const handlePrevDate = (e) => {
    e.stopPropagation(); // Prevent popover from opening
    if (date) {
      setDate(subDays(date, 1));
    }
  };
  const handleNextDate = (e) => {
    e.stopPropagation(); // Prevent popover from opening
    if (date) {
      setDate(addDays(date, 1));
    }
  };

  return (
    <div className={cn("grid gap-2", triggerWrapperStyles)}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            id="date"
            className={cn(
              `justify-start text-left font-normal`,
              !date && "text-muted-foreground"
            )}
          >
            <div
              className={`relative w-full pl-10 flex items-center justify-between cursor-pointer focus:ring-1 focus:ring-black focus:bg-transparent rounded focus:outline-none border border-gray-400 p-2 text-sm ${triggerStyles}`}
            >
              <div className="absolute left-3 top-2 text-gray-400">
                <Calender />
              </div>
              {date ? format(date, "EEE M/d") : <span>Pick date</span>}
              <div className="flex space-x-0">
                <LuChevronLeft
                  size={18}
                  className="cursor-pointer"
                  onClick={handlePrevDate} // Navigate to previous date for 'from'
                />
                <LuChevronRight
                  size={18}
                  className="cursor-pointer"
                  onClick={handleNextDate} // Navigate to next date for 'from'
                />
              </div>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto bg-white p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            numberOfMonths={numberOfMonths}
            className="p-3"
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-[300px] border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-green-200 [&:has([aria-selected].day-outside)]:bg-green-200/50",
                "[&:has([aria-selected])]:rounded-md"
              ),
              day: cn(
                "h-8 w-10 p-0 font-normal aria-selected:opacity-100",
                "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              ),
              day_selected: "bg-primary text-primary-foreground",
              day_today: "bg-gray-100 text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_hidden: "invisible",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
