"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { addDays } from "date-fns";
import { ArrowLeftRightIcon } from "lucide-react";
import Image from "next/image";
import Airplane from "@/public/icons/Airplane";
import Calender from "@/public/icons/Calender";
import SearchIcon from "@/public/icons/SearchIcon";
import Link from "next/link";
import descriptImage from "@/public/images/bangkok.png";
import DatePicker from "../datePicker/DatePicker";
import DatePickerOneWay from "../datePicker/DatePickerOneWay";
import useAirlineStore from "../../../stores/airlineStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import airportsData from "../../../public/utils/airports.json";
import moment from "moment";
export default function SearchPad() {
  const [isPassengerOpen, setIsPassengerOpen] = useState(false);
  const [isWayOpen, setIsWayOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);
  const [selectedWay, setSelectedWay] = useState("one_way");
  const [selectedClass, setSelectedClass] = useState("Y");
  const [isCalenderShow, setIsCalenderShow] = useState(false);
  const [isOpenDestination, setIsOpenDestination] = useState(false);
  const [isOpenArrival, setIsOpenArrival] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedArrival, setSelectedArrival] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 1)); // November 2024
  const [tripType, setTripType] = useState("round-trip");
  const [destination, setDestination] = useState("");
  const [arrival, setArrival] = useState("");
  const [originalDate, setOriginalDate] = useState();
  const router = useRouter();
  const [flightRows, setFlightRows] = useState([
    { id: 1, from: "", to: "", date: "", class: "Economy" },
    { id: 2, from: "", to: "", date: "", class: "Economy" },
  ]);

  const {
    setSearchData,
    OriginDestinationInformation,
    setOriginDestinationInformation,
    setSelectedFlight,
    setPassengerInformation,
    setContactInformation,
    setRecentSearchData,
    recentSearchData,
  } = useAirlineStore();

  const [roundDate, setRoundDate] = useState(() => {
    const twoDaysAhead = new Date();
    twoDaysAhead.setDate(twoDaysAhead.getDate() + 2); // Increment by 2 days

    const fourDaysAhead = new Date(twoDaysAhead);
    fourDaysAhead.setDate(fourDaysAhead.getDate() + 2); // Increment by 4 days

    return {
      from: twoDaysAhead,
      to: fourDaysAhead,
    };
  });

  const [oneWayDate, setOneWayDate] = useState(() => {
    const twoDaysAhead = new Date();
    twoDaysAhead.setDate(twoDaysAhead.getDate() + 2); // Increment the day by 2
    return twoDaysAhead;
  });

  const addFlightRow = () => {
    const newId = Math.max(...flightRows.map((row) => row.id), 0) + 1;
    setFlightRows([
      ...flightRows,
      { id: newId, from: "", to: "", date: "", class: "Economy" },
    ]);
  };

  const removeFlightRow = (id) => {
    if (flightRows.length > 2) {
      setFlightRows(flightRows.filter((row) => row.id !== id));
    }
  };

  const updateFlightRow = (id, field, value) => {
    setFlightRows(
      flightRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };
  const [searchQueryArrival, setSearchQueryArrival] = useState("CXB");
  const [searchQueryDestination, setSearchQueryDestination] = useState("DAC");
  const [ways, setWays] = useState([
    { name: "One-way", price: 50, shortCode: "one_way" },
    { name: "Return", price: 90, shortCode: "return" },
    { name: "Multi-city", price: 150, shortCode: "multi_city" },
  ]);
  const [categories, setCategories] = useState([
    { name: "Adults", ageRange: "18-64", count: 1 },
    { name: "Children", ageRange: "2-11", count: 0 },
    { name: "Infants on lap", ageRange: "under 2", count: 0 },
  ]);
  const [classes, setClasses] = useState([
    { name: "Economy", price: 50, shortCode: "Y" },
    { name: "Premium Economy", price: 70, shortCode: "P" },
    { name: "Business", price: 100, shortCode: "C" },
    { name: "First Class", price: 150, shortCode: "F" },
  ]);

  const [fromAirports, setFromAirports] = useState();
  const [toAirports, setToAirports] = useState();

  const destinations = [
    {
      name: "Dhaka, Bangladesh",
      code: "DAC",
      airport: "Hazrat Shajalal Intl.",
      image: descriptImage,
    },
    {
      name: "Dharmasala, India",
      code: "DHM",
      airport: "Kangra",
      image: descriptImage,
    },
    {
      name: "Dharavandhoo, Maldives",
      code: "DRV",
      airport: "Dharavandhoo",
      image: descriptImage,
    },
    {
      name: "Abu Dhabi, Arab Emirates",
      code: "AUH",
      airport: "Zayed Intl",
      image: descriptImage,
    },
  ];
  const arrivals = [
    {
      name: "Dhaka, Bangladesh",
      code: "DAC",
      airport: "Hazrat Shajalal Intl.",
      image: descriptImage,
    },
    {
      name: "Dharmasala, India",
      code: "DHM",
      airport: "Kangra",
      image: descriptImage,
    },
    {
      name: "Dharavandhoo, Maldives",
      code: "DRV",
      airport: "Dharavandhoo",
      image: descriptImage,
    },
    {
      name: "Abu Dhabi, Arab Emirates",
      code: "AUH",
      airport: "Zayed Intl",
      image: descriptImage,
    },
    {
      name: "Cox bazar",
      code: "CXB",
      airport: "Cox bazar",
      image: descriptImage,
    },
  ];

  const filteredAirportsArrival = airportsData.filter(
    (airport) =>
      (airport.name.toLowerCase().includes(searchQueryArrival.toLowerCase()) ||
        airport.value
          .toLowerCase()
          .includes(searchQueryArrival.toLowerCase())) &&
      airport.name.toLowerCase() !== searchQueryDestination.toLowerCase() &&
      airport.value.toLowerCase() !== searchQueryDestination.toLowerCase()
  );

  const filteredAirportsDestination = airportsData.filter(
    (airport) =>
      (airport.name
        .toLowerCase()
        .includes(searchQueryDestination.toLowerCase()) ||
        airport.value
          .toLowerCase()
          .includes(searchQueryDestination.toLowerCase())) &&
      airport.name.toLowerCase() !== searchQueryArrival.toLowerCase() &&
      airport.value.toLowerCase() !== searchQueryArrival.toLowerCase()
  );

  const generatePassengersFromCategories = (categories) => {
    const passengers = [];

    // Adding adults
    const adults = categories.find((cat) => cat.name === "Adults");
    if (adults && adults.count > 0) {
      passengers.push({ type: "ADT", quantity: adults.count });
    }

    // Adding children (2-11 years)
    const children = categories.find((cat) => cat.name === "Children");
    if (children && children.count > 0) {
      passengers.push({ type: "C02", quantity: children.count });
    }

    // Adding infants on lap (under 2 years)
    const infants = categories.find((cat) => cat.name === "Infants on lap");
    if (infants && infants.count > 0) {
      passengers.push({ type: "INF", quantity: infants.count });
    }

    return passengers;
  };
  // Generate passengers array from current categories state
  const passengers = generatePassengersFromCategories(categories);

  const dropdownRef = useRef(null);
  const dropdownRefDestination = useRef(null);
  const dropdownRefArrival = useRef(null);

  const totalPassengers = categories.reduce(
    (sum, category) => sum + category.count,
    0
  );

  const updateCount = (index, increment) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, i) =>
        i === index
          ? { ...category, count: Math.max(0, category.count + increment) }
          : category
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPassengerOpen(false);
      }

      if (
        dropdownRefDestination.current &&
        !dropdownRefDestination.current.contains(event.target)
      ) {
        setIsOpenDestination(false);
      }
      if (
        dropdownRefArrival.current &&
        !dropdownRefArrival.current.contains(event.target)
      ) {
        setIsOpenArrival(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const dateToUse = selectedWay === "one_way" ? oneWayDate : roundDate.from;
    const date = new Date(dateToUse);

    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Format the date string
    const formattedDateTimeOrigin = `${year}-${month}-${day}T00:00:00`;

    setOriginalDate(formattedDateTimeOrigin);
  }, [oneWayDate, roundDate, selectedWay]);
  const [originalArrivalData, setOriginalArrivalDate] = useState();
  useEffect(() => {
    const dateToUse = selectedWay === "one_way" ? "" : roundDate.to;
    const date = new Date(dateToUse);

    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Format the date string
    const formattedDateTimeOrigin = `${year}-${month}-${day}T00:00:00`;

    setOriginalArrivalDate(formattedDateTimeOrigin);
  }, [oneWayDate, roundDate, selectedWay]);

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    setSelectedFlight({});
    setPassengerInformation([]);
    setContactInformation({});

    if (
      /^[A-Z]{3}$/.test(searchQueryDestination) &&
      /^[A-Z]{3}$/.test(searchQueryArrival) &&
      selectedWay &&
      passengers[0] &&
      selectedClass &&
      originalDate
    ) {
      const searchData = {
        destination: searchQueryDestination,
        arrival: searchQueryArrival,
        tripType: selectedWay,
        class: selectedClass,
        passengers: passengers,
        journeyDate: originalDate,
        returnDate: selectedWay == "one_way" ? "" : originalArrivalData,
      };

      setSearchData(searchData);

      const originDestinationInfo = [
        {
          DepartureDateTime: originalDate,
          OriginLocation: {
            LocationCode: searchQueryDestination,
            LocationType: "A",
          },
          DestinationLocation: {
            LocationCode: searchQueryArrival,
            LocationType: "A",
          },
          RPH: "0",
        },
      ];

      // If the trip is a return trip, add the return leg
      if (selectedWay === "return" && roundDate?.to) {
        originDestinationInfo.push({
          DepartureDateTime: originalArrivalData,
          OriginLocation: {
            LocationCode: searchQueryArrival,
            LocationType: "A",
          },
          DestinationLocation: {
            LocationCode: searchQueryDestination,
            LocationType: "A",
          },
          RPH: "1", // Different RPH for return leg
        });
      } else {
        console.log(
          "Return trip not added, check if selectedWay is 'return' and roundDate?.to is valid"
        );
      }

      setOriginDestinationInformation(originDestinationInfo);

      const updatedRecentSearches = [searchData, ...recentSearchData].slice(
        0,
        5
      );
      setRecentSearchData(updatedRecentSearches);

      const queryString = new URLSearchParams({
        search: JSON.stringify(searchData),
        originDestinationInfo: JSON.stringify(originDestinationInfo),
      }).toString();

      router.push(`/search-result?${queryString}`);
    } else {
      toast.error("Please fill up all the required fields");
    }
  };

  const handleSwap = () => {
    const temp = searchQueryDestination;
    setSearchQueryDestination(searchQueryArrival);
    setSearchQueryArrival(temp);
  };

  return (
    <div>
      <main className={``}>
        {/* Search form */}
        <div className=" mx-auto ">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Where do you want to go?
          </h1>
          <form className="" onSubmit={handleSubmitSearch}>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className=" text-left">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <span
                      onClick={() => setIsWayOpen(!isWayOpen)}
                      className=" flex justify-between items-center w-full px-2 py-2 text-sm  text-gray-700 cursor-pointer "
                    >
                      <span className="w-full">
                        {selectedWay == "one_way"
                          ? "One way"
                          : selectedWay == "return"
                          ? "Return"
                          : "Multi city"}
                      </span>
                      <svg
                        className="w-5 h-5 ml-2 -mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {ways?.map((way, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => setSelectedWay(way?.shortCode)}
                        className={`px-5 py-2 ${
                          selectedWay == way?.shortCode ? "bg-[#F0F3F5]" : ""
                        } cursor-pointer`}
                      >
                        {way?.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="relative  text-left" ref={dropdownRef}>
                <div className="flex items-center ">
                  <span
                    onClick={() => setIsPassengerOpen(!isPassengerOpen)}
                    className="flex justify-between items-center w-full px-2 py-2 text-sm  text-gray-700 cursor-pointer "
                  >
                    <span>
                      {totalPassengers}{" "}
                      {totalPassengers !== 1 ? "travelers" : "Adult"}
                    </span>
                    <svg
                      className="w-5 h-5 ml-2 -mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>

                {isPassengerOpen && (
                  <div className="absolute w-80 right-0 left-0 origin-top-right bg-white rounded-[11px] shadow-xl z-10">
                    <div className="py-5 px-3">
                      {categories.map((category, index) => (
                        <div
                          key={category.name}
                          className="px-4 py-2 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <p className="text-sm  text-gray-900">
                              {category.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {category.ageRange}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => updateCount(index, -1)}
                              disabled={category.count === 0}
                              className="inline-flex items-center justify-center w-5 h-5 text-black bg-white border  rounded-[6px] hover:bg-gray-50 focus:outline-none hover:border hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label={`Decrease ${category.name}`}
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <span className="text-gray-900 w-8 text-center">
                              {category.count}
                            </span>
                            <button
                              onClick={() => updateCount(index, 1)}
                              type="button"
                              className="inline-flex items-center justify-center w-5 h-5 text-black bg-white border  rounded-[6px] hover:bg-gray-50 focus:outline-none hover:border hover:border-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              aria-label={`Increase ${category.name}`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedWay !== "multi_city" && (
                <div className=" text-left">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <span
                        onClick={() => setIsClassOpen(!isClassOpen)}
                        className="flex justify-between items-center w-full px-2 py-2 text-sm  text-gray-700 cursor-pointer "
                      >
                        <span>
                          {selectedClass == "Y"
                            ? "Economy"
                            : selectedClass == "P"
                            ? "Premium Economy"
                            : selectedClass == "C"
                            ? "Business"
                            : "F"}
                        </span>
                        <svg
                          className="w-5 h-5 ml-2 -mr-1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {classes?.map((cls, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => setSelectedClass(cls?.shortCode)}
                          className={`px-5 py-2 ${
                            selectedClass == cls?.shortCode
                              ? "bg-[#F0F3F5]"
                              : ""
                          } cursor-pointer`}
                        >
                          {cls?.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            {selectedWay == "multi_city" ? (
              <>
                {flightRows.map((row, index) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 items-center"
                  >
                    <div className="relative" ref={dropdownRefDestination}>
                      <div
                        onClick={() => setIsOpenDestination(!isOpenDestination)}
                      >
                        <input
                          value={searchQueryDestination}
                          type="text"
                          onChange={(e) =>
                            setSearchQueryDestination(e.target.value)
                          }
                          placeholder="From ?"
                          className="w-full pl-10 pr-4 py-4  focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                          <Airplane />
                        </div>
                      </div>
                      {isOpenDestination ? (
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
                          <div className="p-8 ">
                            <ul className="space-y-4">
                              {filteredAirportsDestination.map(
                                (destination, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center space-x-4 cursor-pointer"
                                    onClick={() => {
                                      setSearchQueryDestination(
                                        destination.value
                                      );
                                      setIsOpenDestination(false);
                                    }}
                                  >
                                    <div className="flex-grow">
                                      <p className="font-semibold">
                                        {destination.name}, {destination.value}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {destination.label}
                                      </p>
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>

                            {recentSearchData?.length > 0 ? (
                              <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4 flex justify-between items-center">
                                  Recent Searches
                                  <button
                                    onClick={() => setRecentSearchData([])}
                                    className="text-orange-500 hover:text-orange-600"
                                  >
                                    Clear
                                  </button>
                                </h3>
                                <ul className="space-y-4">
                                  {recentSearchData?.map((recent, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center space-x-4"
                                    >
                                      <div className="bg-gray-100 p-2 rounded-full">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-gray-600"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                      </div>
                                      <div>
                                        <p className="font-semibold">
                                          {recent?.destination} -{" "}
                                          {recent?.arrival}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {moment(recent?.journeyDate).format(
                                            "MMMM Do, YYYY"
                                          )}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="relative" ref={dropdownRefArrival}>
                      <div onClick={() => setIsOpenArrival(!isOpenArrival)}>
                        <input
                          value={searchQueryArrival}
                          type="text"
                          onChange={(e) =>
                            setSearchQueryArrival(e.target.value)
                          }
                          placeholder="To ?"
                          className="w-full pl-10 pr-4 py-4 focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Airplane />
                        </div>
                      </div>
                      {isOpenArrival ? (
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
                          <div className="p-8 ">
                            <ul className="space-y-4">
                              {filteredAirportsArrival.map((arrival, index) => (
                                <li
                                  key={index}
                                  className="flex items-center space-x-4 cursor-pointer"
                                  onClick={() => {
                                    setSearchQueryArrival(arrival.value);
                                    setIsOpenArrival(false);
                                  }}
                                >
                                  <div className="flex-grow">
                                    <p className="font-semibold">
                                      {arrival.name}, {arrival.value}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {arrival.label}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>

                            {recentSearchData?.length > 0 ? (
                              <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4 flex justify-between items-center">
                                  Recent Searches
                                  <button
                                    onClick={() => setRecentSearchData([])}
                                    className="text-orange-500 hover:text-orange-600"
                                  >
                                    Clear
                                  </button>
                                </h3>
                                <ul className="space-y-4">
                                  {recentSearchData?.map((recent, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center space-x-4"
                                    >
                                      <div className="bg-gray-100 p-2 rounded-full">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-gray-600"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                      </div>
                                      <div>
                                        <p className="font-semibold">
                                          {recent?.destination} -{" "}
                                          {recent?.arrival}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {moment(recent?.journeyDate).format(
                                            "MMMM Do, YYYY"
                                          )}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="col-span-1 flex gap-2 justify-between">
                      <DatePickerOneWay
                        className={"w-full"}
                        oneWayDate={oneWayDate}
                        setOneWayDate={setOneWayDate}
                      />
                    </div>
                    <div className="flex items-center">
                      <select
                        className="w-full pl-6 pr-4 py-4   focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                        value={row.class}
                        onChange={(e) =>
                          updateFlightRow(row.id, "class", e.target.value)
                        }
                      >
                        <option>Economy</option>
                        <option>Business</option>
                        <option>First Class</option>
                      </select>
                      {index >= 2 && (
                        <button
                          className="ml-2 p-2 bg-gray-200 rounded-full"
                          onClick={() => removeFlightRow(row.id)}
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    className="text-blue-600 font-semibold"
                    onClick={addFlightRow}
                  >
                    + Add another flight
                  </button>
                  <button type="button" className="text-gray-500">
                    clear all
                  </button>

                  <button
                    className="rounded-[10px] bg-[#FC660F] w-[54px] h-[50px] hover:bg-[#d67136]"
                    type="submit"
                  >
                    <div className="flex justify-center items-center w-full">
                      <SearchIcon />
                    </div>
                  </button>
                </div>
                <p className="text-gray-500 text-sm text-right mt-2">
                  Direct flights only
                </p>
              </>
            ) : selectedWay == "one_way" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4  gap-2 relative">
                  <div className="col-span-2 flex gap-1 ">
                    <div className="relative" ref={dropdownRefDestination}>
                      <div
                        onClick={() => setIsOpenDestination(!isOpenDestination)}
                      >
                        <input
                          value={searchQueryDestination}
                          type="text"
                          onChange={(e) =>
                            setSearchQueryDestination(e.target.value)
                          }
                          placeholder="From ?"
                          className="w-full pl-10 pr-4 py-4   focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                          <Airplane />
                        </div>
                      </div>
                      {isOpenDestination ? (
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
                          <div className="p-8 ">
                            <ul className="space-y-4">
                              {filteredAirportsDestination.map(
                                (destination, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center space-x-4 cursor-pointer"
                                    onClick={() => {
                                      setSearchQueryDestination(
                                        destination.value
                                      );
                                      setIsOpenDestination(false);
                                    }}
                                  >
                                    <div className="flex-grow">
                                      <p className="font-semibold">
                                        {destination.name}, {destination.value}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {destination.label}
                                      </p>
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>

                            {recentSearchData?.length > 0 ? (
                              <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4 flex justify-between items-center">
                                  Recent Searches
                                  <button
                                    onClick={() => setRecentSearchData([])}
                                    className="text-orange-500 hover:text-orange-600"
                                  >
                                    Clear
                                  </button>
                                </h3>
                                <ul className="space-y-4">
                                  {recentSearchData?.map((recent, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center space-x-4"
                                    >
                                      <div className="bg-gray-100 p-2 rounded-full">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-gray-600"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                      </div>
                                      <div>
                                        <p className="font-semibold">
                                          {recent?.destination} -{" "}
                                          {recent?.arrival}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {moment(recent?.journeyDate).format(
                                            "MMMM Do, YYYY"
                                          )}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="py-3 px-4 bg-gray-100 rounded-md"
                    >
                      <ArrowLeftRightIcon size={25} className="text-gray-600" />
                    </button>
                    <div className="relative" ref={dropdownRefArrival}>
                      <div onClick={() => setIsOpenArrival(!isOpenArrival)}>
                        <input
                          value={searchQueryArrival}
                          type="text"
                          onChange={(e) =>
                            setSearchQueryArrival(e.target.value)
                          }
                          placeholder="To ?"
                          className="w-full pl-10 pr-4 py-4 focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                          <Airplane />
                        </div>
                      </div>
                      {isOpenArrival ? (
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
                          <div className="p-8 ">
                            <ul className="space-y-4">
                              {filteredAirportsArrival.map((arrival, index) => (
                                <li
                                  key={index}
                                  className="flex items-center space-x-4 cursor-pointer"
                                  onClick={() => {
                                    setSearchQueryArrival(arrival.value);
                                    setIsOpenArrival(false);
                                  }}
                                >
                                  <div className="flex-grow">
                                    <p className="font-semibold">
                                      {arrival.name}, {arrival.value}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {arrival.label}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>

                            {recentSearchData?.length > 0 ? (
                              <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4 flex justify-between items-center">
                                  Recent Searches
                                  <button
                                    onClick={() => setRecentSearchData([])}
                                    className="text-orange-500 hover:text-orange-600"
                                  >
                                    Clear
                                  </button>
                                </h3>
                                <ul className="space-y-4">
                                  {recentSearchData?.map((recent, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center space-x-4"
                                    >
                                      <div className="bg-gray-100 p-2 rounded-full">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-gray-600"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                      </div>
                                      <div>
                                        <p className="font-semibold">
                                          {recent?.destination} -{" "}
                                          {recent?.arrival}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {moment(recent?.journeyDate).format(
                                            "MMMM Do, YYYY"
                                          )}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="col-span-2 flex gap-2 justify-between">
                    <DatePickerOneWay
                      className={"w-full"}
                      setOneWayDate={setOneWayDate}
                      oneWayDate={oneWayDate}
                    />

                    {/* <Link href={"/search-result"}> */}
                    <button
                      className="rounded-[10px] bg-[#FC660F] w-[54px] h-full hover:bg-[#d67136]"
                      type="submit"
                    >
                      <div className="flex justify-center items-center w-full">
                        <SearchIcon />
                      </div>
                    </button>
                    {/* </Link> */}
                  </div>
                </div>
              </>
            ) : (
              <>
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4  gap-2 relative">
                    <div className="col-span-2 flex gap-1 ">
                      <div className="relative" ref={dropdownRefDestination}>
                        <div
                          onClick={() =>
                            setIsOpenDestination(!isOpenDestination)
                          }
                        >
                          <input
                            value={searchQueryDestination}
                            type="text"
                            onChange={(e) =>
                              setSearchQueryDestination(e.target.value)
                            }
                            placeholder="From ?"
                            className="w-full pl-10 pr-4 py-4   focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                            <Airplane />
                          </div>
                        </div>
                        {isOpenDestination ? (
                          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
                            <div className="p-8 ">
                              <ul className="space-y-4">
                                {filteredAirportsDestination.map(
                                  (destination, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center space-x-4 cursor-pointer"
                                      onClick={() => {
                                        setSearchQueryDestination(
                                          destination.value
                                        );
                                        setIsOpenDestination(false);
                                      }}
                                    >
                                      <div className="flex-grow">
                                        <p className="font-semibold">
                                          {destination.name},{" "}
                                          {destination.value}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {destination.label}
                                        </p>
                                      </div>
                                    </li>
                                  )
                                )}
                              </ul>

                              {recentSearchData?.length > 0 ? (
                                <div className="mt-8">
                                  <h3 className="text-xl font-semibold mb-4 flex justify-between items-center">
                                    Recent Searches
                                    <button
                                      onClick={() => setRecentSearchData([])}
                                      className="text-orange-500 hover:text-orange-600"
                                    >
                                      Clear
                                    </button>
                                  </h3>
                                  <ul className="space-y-4">
                                    {recentSearchData?.map((recent, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center space-x-4"
                                      >
                                        <div className="bg-gray-100 p-2 rounded-full">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-gray-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        </div>
                                        <div>
                                          <p className="font-semibold">
                                            {recent?.destination} -{" "}
                                            {recent?.arrival}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {moment(recent?.journeyDate).format(
                                              "MMMM Do, YYYY"
                                            )}
                                          </p>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <button
                        onClick={handleSwap}
                        type="button"
                        className="py-3 px-4 bg-gray-100 rounded-md"
                      >
                        <ArrowLeftRightIcon
                          size={25}
                          className="text-gray-600"
                        />
                      </button>
                      <div className="relative" ref={dropdownRefArrival}>
                        <div onClick={() => setIsOpenArrival(!isOpenArrival)}>
                          <input
                            value={searchQueryArrival}
                            type="text"
                            onChange={(e) =>
                              setSearchQueryArrival(e.target.value)
                            }
                            placeholder="To ?"
                            className="w-full pl-10 pr-4 py-4 focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                            <Airplane />
                          </div>
                        </div>
                        {isOpenArrival ? (
                          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
                            <div className="p-8 ">
                              <ul className="space-y-4">
                                {filteredAirportsArrival.map(
                                  (arrival, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center space-x-4 cursor-pointer"
                                      onClick={() => {
                                        setSearchQueryArrival(arrival.value);
                                        setIsOpenArrival(false);
                                      }}
                                    >
                                      <div className="flex-grow">
                                        <p className="font-semibold">
                                          {arrival.name}, {arrival.value}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {arrival.label}
                                        </p>
                                      </div>
                                    </li>
                                  )
                                )}
                              </ul>

                              {recentSearchData?.length > 0 ? (
                                <div className="mt-8">
                                  <h3 className="text-xl font-semibold mb-4 flex justify-between items-center">
                                    Recent Searches
                                    <button
                                      onClick={() => setRecentSearchData([])}
                                      className="text-orange-500 hover:text-orange-600"
                                    >
                                      Clear
                                    </button>
                                  </h3>
                                  <ul className="space-y-4">
                                    {recentSearchData?.map((recent, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center space-x-4"
                                      >
                                        <div className="bg-gray-100 p-2 rounded-full">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-gray-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        </div>
                                        <div>
                                          <p className="font-semibold">
                                            {recent?.destination} -{" "}
                                            {recent?.arrival}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {moment(recent?.journeyDate).format(
                                              "MMMM Do, YYYY"
                                            )}
                                          </p>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    {/* <div className="col-span-1 flex gap-2">
                      <div
                        className="relative w-full pl-10 pr-4 py-4 cursor-pointer focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                        onClick={() => setIsCalenderShow(!isCalenderShow)}
                      >
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                          <Calender />
                        </div>
                        {selectedDate && formatDate(selectedDate)}
                        {isCalenderShow ? (
                          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl mx-auto absolute w-full md:w-[834px] right-2 z-10 top-14">
                            <div className="flex justify-end items-center mb-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">Departure</span>
                                <span className="text-xs text-[#007799]">
                                  Exact
                                </span>
                              </div>
                            </div>

                            {renderTwoMonths()}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="col-span-1 flex gap-2">
                      <div
                        className="relative w-full pl-10 pr-4 py-4 cursor-pointer focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                        onClick={() => setIsCalenderShow(!isCalenderShow)}
                      >
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                          <Calender />
                        </div>
                        {selectedDate && formatDate(selectedDate)}
                        {isCalenderShow ? (
                          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl mx-auto absolute w-full md:w-[834px] right-2 z-10 top-14">
                            <div className="flex justify-end items-center mb-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">Departure</span>
                                <span className="text-xs text-[#007799]">
                                  Exact
                                </span>
                              </div>
                            </div>

                            {renderTwoMonths()}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <Link href={"/search-result"}>
                        <button
                          className="rounded-[10px] bg-[#FC660F] w-[54px] h-full hover:bg-[#d67136]"
                          type="submit"
                        >
                          <div className="flex justify-center items-center w-full">
                            <SearchIcon />
                          </div>
                        </button>
                      </Link>
                    </div> */}
                    <div className="col-span-2 flex gap-2 justify-between">
                      <div>
                        <DatePicker
                          setRoundDate={setRoundDate}
                          roundDate={roundDate}
                        />
                      </div>

                      <button
                        className="rounded-[10px] bg-[#FC660F] w-[54px] h-full hover:bg-[#d67136]"
                        type="submit"
                      >
                        <div className="flex justify-center items-center w-full">
                          <SearchIcon />
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              </>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
