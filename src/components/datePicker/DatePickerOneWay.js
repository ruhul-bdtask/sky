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
import { formatLongDataToShort } from "@/lib/formatLongDataToShort";

export default function DatePickerOneWay({
  className,
  setOneWayDate,
  oneWayDate,
}) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const handlePrevDate = (e) => {
    e.stopPropagation(); // Prevent popover from opening
    if (oneWayDate) {
      setOneWayDate(subDays(oneWayDate, 1));
    }
  };

  const handleNextDate = (e) => {
    e.stopPropagation(); // Prevent popover from opening
    if (oneWayDate) {
      setOneWayDate(addDays(oneWayDate, 1));
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            id="date"
            className={cn(
              `justify-start text-left font-normal`,
              !oneWayDate && "text-muted-foreground"
            )}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            <div className="relative w-full pl-10 pr-4 py-4 cursor-pointer focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5] flex  justify-between items-center hover:bg-[#d9e2e8] ">
              <div className="absolute left-3 text-gray-400">
                <Calender />
              </div>
              {oneWayDate ? (
                formatLongDataToShort(oneWayDate)
              ) : (
                <span>Pick a date</span>
              )}
              <div className="flex ">
                <LuChevronLeft
                  size={20}
                  className="cursor-pointer"
                  onClick={handlePrevDate}
                />
                <LuChevronRight
                  size={20}
                  className="cursor-pointer"
                  onClick={handleNextDate}
                />
              </div>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto bg-white p-0" align="start">
          <Calendar
            mode="single"
            selected={oneWayDate}
            onSelect={(date) => {
              setOneWayDate(date);
              setIsPopoverOpen(!isPopoverOpen);
            }}
            initialFocus
            numberOfMonths={2}
            className="p-3"
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 ",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center ",
              caption_label: "text-[16px] font-bold ",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border",
                "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-[300px] border-collapse space-y-1",
              head_row: "flex ml-4 mt-4",
              head_cell:
                "text-muted-foreground rounded-md w-10 font-bold text-[16px]",
              row: "flex w-full px-4 py-3",
              cell: cn(
                "relative p-0 text-center text-[16px] focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-green-200 [&:has([aria-selected].day-outside)]:bg-green-200/50",
                "[&:has([aria-selected])]:rounded-md"
              ),
              day: cn(
                "h-8 w-10 p-0 font-bold aria-selected:opacity-100",
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
