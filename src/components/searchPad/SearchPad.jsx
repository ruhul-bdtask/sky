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
import DatePicker from "../datePicker/DatePicker";
import DatePickerOneWay from "../datePicker/DatePickerOneWay";
import useAirlineStore from "../../../stores/airlineStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import airportsData from "../../../public/utils/airports.json";
import moment from "moment";
import { FaTimes } from "react-icons/fa";
import airImg from "@/public/images/weather.png";
export default function SearchPad() {
  const [isPassengerOpen, setIsPassengerOpen] = useState(false);
  const [isWayOpen, setIsWayOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);
  const [selectedWay, setSelectedWay] = useState("one_way");
  const [selectedClass, setSelectedClass] = useState("Y");
  const [isOpenDestination, setIsOpenDestination] = useState(false);
  const [isOpenArrival, setIsOpenArrival] = useState(false);

  const [originalDate, setOriginalDate] = useState();
  const router = useRouter();

  const {
    setSearchData,
    setOriginDestinationInformation,
    setSelectedFlight,
    setPassengerInformation,
    setContactInformation,
    setRecentSearchData,
    recentSearchData,
    userData,
    originQuery,
    setOriginQuery,
    destinationQuery,
    setDestinationQuery,
    setTravelPlanningDate,
    travelPlanningDate,
  } = useAirlineStore();

  const [searchQueryArrival, setSearchQueryArrival] = useState();
  const [searchQueryDestination, setSearchQueryDestination] = useState();
  const [originAirport, setOriginAirport] = useState("");
  const [destinationAirport, setDestinationAirport] = useState("");

  const [cities, setCities] = useState([
    {
      id: 1,
      searchQueryDestination: "",
      searchQueryArrival: "",
      departureDate: null,
      isOpenOrigin: false,
      isOpenDestination: false,
      originAirport: "",
      destinationAirport: "",
    },
    {
      id: 2,
      searchQueryDestination: "",
      searchQueryArrival: "",
      departureDate: null,
      isOpenOrigin: false,
      isOpenDestination: false,
      originAirport: "",
      destinationAirport: "",
    },
    {
      id: 3,
      searchQueryDestination: "",
      searchQueryArrival: "",
      departureDate: null,
      isOpenOrigin: false,
      isOpenDestination: false,
      originAirport: "",
      destinationAirport: "",
    },
  ]);

  const transformedData = cities.map((item, index) => ({
    DepartureDateTime: item.departureDate,
    OriginLocation: {
      LocationCode: item.searchQueryDestination,
      LocationType: "A",
    },
    DestinationLocation: {
      LocationCode: item.searchQueryArrival,
      LocationType: "A",
    },
    RPH: 0,
  }));

  const [roundDate, setRoundDate] = useState(() => {
    const twoDaysAhead = new Date();
    twoDaysAhead.setDate(twoDaysAhead.getDate() + 2);

    const fourDaysAhead = new Date(twoDaysAhead);
    fourDaysAhead.setDate(fourDaysAhead.getDate() + 2);

    return {
      from: twoDaysAhead,
      to: fourDaysAhead,
    };
  });

  const [oneWayDate, setOneWayDate] = useState(() => {
    const twoDaysAhead = new Date();
    twoDaysAhead.setDate(twoDaysAhead.getDate() + 2);
    return twoDaysAhead;
  });

  useEffect(() => {
    if (originQuery && destinationQuery && travelPlanningDate !== "") {
      setOneWayDate(new Date(travelPlanningDate));
    }
  }, [originQuery, destinationQuery, travelPlanningDate]);

  const handleAddCity = () => {
    setCities([
      ...cities,
      {
        id: cities.length + 1,
        searchQueryDestination: "",
        searchQueryArrival: "",
        departureDate: null,
        originAirport: "",
        destinationAirport: "",
      },
    ]);
  };

  const updateCityData = (id, field, value) => {
    setCities((prevCities) =>
      prevCities.map((city) =>
        city.id === id ? { ...city, [field]: value } : city
      )
    );
  };
  const handleDeleteCity = () => {
    if (cities.length > 1) {
      setCities(cities.slice(0, -1));
    }
  };
  const toggleField = (id, field) => {
    setCities((prevCities) =>
      prevCities.map((city) =>
        city.id === id ? { ...city, [field]: true } : city
      )
    );
  };
  const toggleFieldClick = (id, field) => {
    setCities((prevCities) =>
      prevCities.map((city) =>
        city.id === id ? { ...city, [field]: !city[field] } : city
      )
    );
  };

  const filteredAirportsArrivalMulti = cities.map((city) =>
    airportsData.filter(
      (airport) =>
        (airport.name
          .toLowerCase()
          .includes(city.searchQueryArrival.toLowerCase()) ||
          airport.value
            .toLowerCase()
            .includes(city.searchQueryArrival.toLowerCase())) &&
        airport.value !== city.searchQueryDestination
    )
  );

  const filteredAirportsDestinationMulti = cities.map((city) =>
    airportsData.filter(
      (airport) =>
        (airport.name
          .toLowerCase()
          .includes(city.searchQueryDestination.toLowerCase()) ||
          airport.value
            .toLowerCase()
            .includes(city.searchQueryDestination.toLowerCase())) &&
        airport.value !== city.searchQueryArrival
    )
  );

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      setSearchQueryDestination(
        userData?.home_airport?.match(/\((.*?)\)/)?.[1]
      );
      setOriginAirport(userData?.home_airport);
      setSearchQueryArrival(
        userData?.secondary_airports?.[0]?.match(/\((.*?)\)/)?.[1]
      );
      setDestinationAirport(userData?.secondary_airports?.[0]);
    } else {
      setOriginAirport("Dhaka (DAC)");
      setDestinationAirport("Cox's Bazar (CXB)");
      setSearchQueryDestination("DAC");
      setSearchQueryArrival("CXB");
    }
  }, [userData]);

  const [ways, setWays] = useState([
    { name: "One-way", price: 50, shortCode: "one_way" },
    { name: "Return", price: 90, shortCode: "return" },
    { name: "Multi-city", price: 150, shortCode: "multi_city" },
  ]);
  const [categories, setCategories] = useState([
    { name: "Adults", ageRange: "18-64", count: 1 },
    { name: "Children", ageRange: "5-11", count: 0 },
    { name: "Kids", ageRange: "2-5", count: 0 },
    { name: "Infants on lap", ageRange: "under 2", count: 0 },
  ]);
  const [classes, setClasses] = useState([
    { name: "Economy", price: 50, shortCode: "Y" },
    { name: "Premium Economy", price: 70, shortCode: "P" },
    { name: "Business", price: 100, shortCode: "C" },
    { name: "First Class", price: 150, shortCode: "F" },
  ]);

  const filteredAirportsArrival = airportsData.filter(
    (airport) =>
      (airport.name.toLowerCase().includes(searchQueryArrival?.toLowerCase()) ||
        airport.value
          .toLowerCase()
          .includes(searchQueryArrival?.toLowerCase()) ||
        airport.label
          .toLowerCase()
          .includes(searchQueryArrival?.toLowerCase())) &&
      airport.name.toLowerCase() !== searchQueryDestination?.toLowerCase() &&
      airport.value.toLowerCase() !== searchQueryDestination?.toLowerCase()
  );

  const filteredAirportsDestination = airportsData.filter(
    (airport) =>
      (airport.name
        .toLowerCase()
        .includes(searchQueryDestination?.toLowerCase()) ||
        airport.value
          .toLowerCase()
          .includes(searchQueryDestination?.toLowerCase()) ||
        airport.label
          .toLowerCase()
          .includes(searchQueryDestination?.toLowerCase())) &&
      airport.name.toLowerCase() !== searchQueryArrival?.toLowerCase() &&
      airport.value.toLowerCase() !== searchQueryArrival?.toLowerCase()
  );

  const generatePassengersFromCategories = (categories) => {
    const passengers = [];

    const adults = categories.find((cat) => cat.name === "Adults");
    if (adults && adults.count > 0) {
      passengers.push({ type: "ADT", quantity: adults.count });
    }

    const children = categories.find((cat) => cat.name === "Children");
    if (children && children.count > 0) {
      passengers.push({ type: "C06", quantity: children.count });
    }
    const kids = categories.find((kid) => kid.name === "Kids");
    if (kids && kids.count > 0) {
      passengers.push({ type: "C04", quantity: kids.count });
    }

    const infants = categories.find((cat) => cat.name === "Infants on lap");
    if (infants && infants.count > 0) {
      passengers.push({ type: "INF", quantity: infants.count });
    }

    return passengers;
  };
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

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsPassengerOpen(false);
  //     }

  //     if (
  //       dropdownRefDestination.current &&
  //       !dropdownRefDestination.current.contains(event.target)
  //     ) {
  //       setIsOpenDestination(false);
  //     }
  //     if (
  //       dropdownRefArrival.current &&
  //       !dropdownRefArrival.current.contains(event.target)
  //     ) {
  //       setIsOpenArrival(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handling clicks outside the passenger, destination, and arrival dropdowns
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

      // Handling clicks outside city-specific dropdowns (origin, destination, arrival)
      setCities((prevCities) =>
        prevCities.map((city, index) => {
          const originDropdownRef = document.getElementById(
            `origin-dropdown-${index}`
          );
          const arrivalDropdownRef = document.getElementById(
            `arrival-dropdown-${index}`
          );

          let updatedCity = { ...city };

          // Close destination dropdown if clicked outside
          if (originDropdownRef && !originDropdownRef.contains(event.target)) {
            updatedCity.isOpenOrigin = false;
          }

          // Close arrival dropdown if clicked outside
          if (
            arrivalDropdownRef &&
            !arrivalDropdownRef.contains(event.target)
          ) {
            updatedCity.isOpenDestination = false;
          }
          return updatedCity;
        })
      );
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cities]);

  useEffect(() => {
    const dateToUse = selectedWay === "one_way" ? oneWayDate : roundDate?.from;
    const date = new Date(dateToUse);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDateTimeOrigin = `${year}-${month}-${day}T00:00:00`;

    setOriginalDate(formattedDateTimeOrigin);
  }, [oneWayDate, roundDate, selectedWay]);

  const [originalArrivalData, setOriginalArrivalDate] = useState();

  useEffect(() => {
    const dateToUse = selectedWay === "one_way" ? "" : roundDate?.to;
    const date = new Date(dateToUse);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDateTimeOrigin = `${year}-${month}-${day}T00:00:00`;

    setOriginalArrivalDate(formattedDateTimeOrigin);
  }, [oneWayDate, roundDate, selectedWay]);

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    setSelectedFlight({});
    setPassengerInformation([]);
    setContactInformation({});
    setOriginQuery("");
    setDestinationQuery("");
    setTravelPlanningDate("");

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
        RPH: "1",
      });
    }

    setOriginDestinationInformation(originDestinationInfo);

    const updatedRecentSearches = [searchData, ...recentSearchData].slice(0, 5);
    setRecentSearchData(updatedRecentSearches);

    if (selectedWay === "multi_city") {
      if (transformedData.length < 2) {
        toast.error("You must select at least 2 cities.");
        setError("City selection is too few.");
        setLoading(false);
        return;
      }

      const invalidTransformedData = transformedData.find(
        (item) =>
          !item.DepartureDateTime ||
          !item.OriginLocation?.LocationCode ||
          !item.DestinationLocation?.LocationCode
      );

      if (invalidTransformedData) {
        toast.error("One or more city data entries are invalid.");
        return;
      }
    }

    if (!originalDate) {
      toast.error("Please select a departure date.");

      return;
    }
    if (selectedWay !== "multi_city" && !originAirport) {
      toast.error("Please select a Departure airport.");

      return;
    }
    if (selectedWay !== "multi_city" && !destinationAirport) {
      toast.error("Please select a Arrival airport.");

      return;
    }

    if (selectedWay !== "multi_city" && !searchQueryDestination) {
      toast.error("Please select a Departure location.");

      return;
    }

    if (selectedWay !== "multi_city" && !searchQueryArrival) {
      toast.error("Please select a Destination location.");

      return;
    }

    if (selectedWay === "return" && !roundDate.to) {
      toast.error("Please select a return date.");

      return;
    }

    if (selectedWay === "multi_city") {
      if (transformedData.length < 2) {
        toast.error("You must select at least 2 cities.");

        return;
      }

      const invalidTransformedData = transformedData.find(
        (item) =>
          !item.DepartureDateTime ||
          !item.OriginLocation?.LocationCode ||
          !item.DestinationLocation?.LocationCode
      );

      if (invalidTransformedData) {
        toast.error("One or more city data entries are invalid.");

        return;
      }
    }

    setOriginQuery(searchQueryDestination);
    setDestinationQuery(searchQueryArrival);
    setTravelPlanningDate(originalDate);

    const queryString = new URLSearchParams({
      search: JSON.stringify(searchData),
      originDestinationInfo:
        selectedWay == "multi_city"
          ? JSON.stringify(transformedData)
          : JSON.stringify(originDestinationInfo),
    }).toString();

    router.push(`/search-result?${queryString}`);
  };
  const handleSwap = () => {
    const tempLocation = originAirport;
    const temp = searchQueryDestination;
    setSearchQueryDestination(searchQueryArrival);
    setOriginAirport(destinationAirport);
    setDestinationAirport(tempLocation);
    setSearchQueryArrival(temp);
  };
  const handleClear = () => {
    setSearchQueryDestination("");
    setOriginAirport("");
  };
  const handleClearMulti = (cityId) => {
    setCities((prevCities) =>
      prevCities.map((city) =>
        city.id === cityId
          ? {
              ...city,
              searchQueryDestination: "",
              originAirport: "",
            }
          : city
      )
    );
  };
  const handleClearMultiArrival = (cityId) => {
    setCities((prevCities) =>
      prevCities.map((city) =>
        city.id === cityId
          ? {
              ...city,
              searchQueryArrival: "",
              destinationAirport: "",
            }
          : city
      )
    );
  };

  const handleClearArrival = () => {
    setSearchQueryArrival("");
    setDestinationAirport("");
  };

  return (
    <div>
      <main >
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
                      {totalPassengers !== 1 ? "Travelers" : "Adult"}
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
                              disabled={
                                category?.name == "Adults"
                                  ? category.count === 1
                                  : category.count === 0
                              }
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
                              disabled={totalPassengers === 7}
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

              <div className="text-left">
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
                          : "First class"}
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
                          selectedClass == cls?.shortCode ? "bg-[#F0F3F5]" : ""
                        } cursor-pointer`}
                      >
                        {cls?.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {selectedWay == "multi_city" ? (
              <>
                {cities.map((row, index) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 items-center"
                  >
                    <div className="relative" id={`origin-dropdown-${index}`}>
                      <div onClick={() => toggleField(row.id, "isOpenOrigin")}>
                        <p
                          className={`text-[14px] absolute right-6 truncate left-[40px] top-1/2 transform -translate-y-1/2 ${
                            row?.originAirport == "" ||
                            row?.originAirport == undefined ||
                            row.searchQueryDestination == "" ||
                            row.searchQueryDestination == undefined
                              ? ""
                              : "border border-white bg-white px-1 py-0.5 hover:border-black rounded-md transition-all duration-300"
                          }`}
                        >
                          {row?.originAirport !== "" ? row?.originAirport : ""}
                          <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                            <FaTimes onClick={() => handleClearMulti(row.id)} />
                          </span>
                        </p>
                        <input
                          value={row.searchQueryDestination}
                          type="text"
                          onChange={(e) =>
                            updateCityData(
                              row.id,
                              "searchQueryDestination",
                              e.target.value
                            )
                          }
                          placeholder="From ?"
                          className="hover:bg-[#d9e2e8]  w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                        />

                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                          <Airplane />
                        </div>
                        {/* <input
                          value={row.searchQueryDestination}
                          type="text"
                          onChange={(e) =>
                            updateCityData(
                              row.id,
                              "searchQueryDestination",
                              e.target.value
                            )
                          }
                          placeholder="From ?"
                          className="w-full pl-10 pr-4 py-4  focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                          <Airplane />
                        </div> */}
                      </div>
                      {row?.isOpenOrigin ? (
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
                          <div className="p-6 ">
                            <ul className="space-y-4">
                              {filteredAirportsDestinationMulti[row.id - 1].map(
                                (destination, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center space-x-4 hover:bg-[#f0f3f5] p-3 rounded-md cursor-pointer"
                                    onClick={() => {
                                      toggleFieldClick(row.id, "isOpenOrigin"),
                                        updateCityData(
                                          row.id,
                                          "searchQueryDestination",
                                          destination.value
                                        );

                                      updateCityData(
                                        row.id,
                                        "originAirport",
                                        destination?.label
                                      );
                                    }}
                                  >
                                    <img
                                      src={destination.img}
                                      alt=""
                                      className="w-[60px] h-[60px]"
                                    />
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
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="relative" id={`arrival-dropdown-${index}`}>
                      <div
                        onClick={() => toggleField(row.id, "isOpenDestination")}
                      >
                        <p
                          className={`text-[14px] absolute right-6 truncate left-[40px] top-1/2 transform -translate-y-1/2 ${
                            row?.destinationAirport == "" ||
                            row?.destinationAirport == undefined ||
                            row.searchQueryArrival == "" ||
                            row.searchQueryArrival == undefined
                              ? ""
                              : "border border-white bg-white px-1 py-0.5 hover:border-black rounded-md transition-all duration-300"
                          }`}
                        >
                          {row?.destinationAirport !== ""
                            ? row?.destinationAirport
                            : ""}
                          <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                            <FaTimes
                              onClick={() => handleClearMultiArrival(row.id)}
                            />
                          </span>
                        </p>
                        <input
                          value={row.searchQueryArrival}
                          type="text"
                          onChange={(e) =>
                            updateCityData(
                              row.id,
                              "searchQueryArrival",
                              e.target.value
                            )
                          }
                          placeholder="From ?"
                          className="hover:bg-[#d9e2e8]  w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                        />

                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                          <Airplane />
                        </div>
                      </div>
                      {row?.isOpenDestination ? (
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
                          <div className="p-6 ">
                            <ul className="space-y-4">
                              {filteredAirportsArrivalMulti[row.id - 1].map(
                                (arrival, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center space-x-4 hover:bg-[#f0f3f5] p-3 rounded-md cursor-pointer"
                                    onClick={() => {
                                      toggleFieldClick(
                                        row.id,
                                        "isOpenDestination"
                                      ),
                                        updateCityData(
                                          row.id,
                                          "searchQueryArrival",
                                          arrival.value
                                        );

                                      updateCityData(
                                        row.id,
                                        "destinationAirport",
                                        arrival.label
                                      );
                                    }}
                                  >
                                    <img
                                      src={arrival.img}
                                      alt=""
                                      className="w-[60px] h-[60px]"
                                    />
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
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="col-span-2 flex gap-2 justify-between">
                      <DatePickerOneWay
                        className="w-[95%]"
                        oneWayDate={row.departureDate}
                        setOneWayDate={(date) =>
                          updateCityData(row.id, "departureDate", date)
                        }
                      />

                      <div className="flex items-center">
                        {/* <select
                        className="w-full pl-6 pr-4 py-4   focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                        value={row.class}
                        onChange={(e) =>
                          updateFlightRow(row.id, "class", e.target.value)
                        }
                      >
                        <option>Economy</option>
                        <option>Business</option>
                        <option>First Class</option>
                      </select> */}
                        {/* {index >= 2 && (
                        <button
                          className="ml-2 p-2 bg-gray-200 rounded-full"
                          onClick={() => removeFlightRow(row.id)}
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      )} */}
                        {index !== 0 && (
                          <div class="flex items-center overflow-hidden">
                            <button type="button" onClick={handleDeleteCity}>
                              <FaTimes size={20} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center w-[97.5%]">
                  <button
                    type="button"
                    className="text-blue-600 font-semibold"
                    onClick={handleAddCity}
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
                {/* <p className="text-gray-500 text-sm text-right mt-2">
                  Direct flights only
                </p> */}
              </>
            ) : selectedWay == "one_way" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4  gap-2 relative">
                  <div className="col-span-2 flex gap-1 ">
                    <div className="relative" ref={dropdownRefDestination}>
                      <div onClick={() => setIsOpenDestination(true)}>
                        <p
                          className={`text-[14px] absolute right-6 truncate left-[40px] top-1/2 transform -translate-y-1/2 ${
                            originAirport == "" ||
                            originAirport == undefined ||
                            searchQueryDestination == "" ||
                            searchQueryDestination == undefined
                              ? ""
                              : "border border-white bg-white px-1 py-0.5 hover:border-black rounded-md transition-all duration-300"
                          }`}
                        >
                          {originAirport !== "" ? originAirport : ""}
                          <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                            <FaTimes onClick={handleClear} />
                          </span>
                        </p>
                        <input
                          value={searchQueryDestination}
                          type="text"
                          onChange={(e) =>
                            setSearchQueryDestination(e.target.value)
                          }
                          placeholder="From ?"
                          className="hover:bg-[#d9e2e8]  w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                        />

                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                          <Airplane />
                        </div>
                      </div>
                      {isOpenDestination ? (
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md absolute top-16 w-[591px] max-h-[700px] z-10 ">
                          <div className="p-6 max-h-[300px] overflow-y-auto">
                            <ul className="space-y-4">
                              {filteredAirportsDestination.map(
                                (destination, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                    onClick={() => {
                                      setSearchQueryDestination(
                                        destination.value
                                      );
                                      setOriginAirport(destination.label);
                                      setIsOpenDestination(false);
                                    }}
                                  >
                                    <img
                                      src={destination.img}
                                      alt=""
                                      className="w-[60px] h-[60px]"
                                    />
                                    <div className="flex-grow">
                                      <p className="font-semibold">
                                        {destination.label}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {destination.name}, {destination.value}
                                      </p>
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                          {recentSearchData?.length > 0 ? (
                            <div className="p-8">
                              <h3 className="text-xl font-semibold mb-4 flex justify-between items-center">
                                Recent Searches
                                <button
                                  onClick={() => setRecentSearchData([])}
                                  className="text-orange-500 hover:text-orange-600"
                                >
                                  Clear
                                </button>
                              </h3>
                              <ul className="space-y-4 max-h-[200px] overflow-y-auto">
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
                      ) : (
                        ""
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="py-3 px-4 bg-[#F0F3F5] rounded-md hover:bg-[#d9e2e8]"
                    >
                      <ArrowLeftRightIcon
                        size={25}
                        strokeWidth={3}
                        className="text-black"
                      />
                    </button>
                    <div className="relative" ref={dropdownRefArrival}>
                      <div onClick={() => setIsOpenArrival(true)}>
                        <p
                          className={`text-[14px] absolute right-6 truncate left-[40px] top-1/2 transform -translate-y-1/2 ${
                            destinationAirport == "" ||
                            destinationAirport == undefined ||
                            searchQueryArrival == undefined ||
                            searchQueryArrival == ""
                              ? ""
                              : "border border-white bg-white px-1 py-0.5 hover:border-black rounded-md transition-all duration-300"
                          }`}
                        >
                          {destinationAirport !== "" ? destinationAirport : ""}
                          <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                            <FaTimes onClick={handleClearArrival} />
                          </span>
                        </p>
                        <input
                          value={searchQueryArrival}
                          type="text"
                          onChange={(e) =>
                            setSearchQueryArrival(e.target.value)
                          }
                          placeholder="To ?"
                          className="hover:bg-[#d9e2e8] w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                          <Airplane />
                        </div>
                      </div>
                      {isOpenArrival ? (
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[700px] z-10">
                          <div className="p-6 max-h-[300px] overflow-y-auto">
                            <ul className="space-y-4">
                              {filteredAirportsArrival.map((arrival, index) => (
                                <li
                                  key={index}
                                  className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                  onClick={() => {
                                    setSearchQueryArrival(arrival.value);
                                    setDestinationAirport(arrival.label);
                                    setIsOpenArrival(false);
                                  }}
                                >
                                  <img
                                    src={arrival.img}
                                    alt=""
                                    className="w-[60px] h-[60px]"
                                  />
                                  <div className="flex-grow">
                                    <p className="font-semibold">
                                      {arrival.label}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {arrival.name}, {arrival.value}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {recentSearchData?.length > 0 ? (
                            <div className="p-8">
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
                      className="rounded-[10px] bg-[#FC660F] w-full h-full hover:bg-[#d67136]"
                      type="submit"
                    >
                      <div className="flex justify-center items-center w-full gap-2">
                        {/* <SearchIcon /> */}
                        <p className="text-white font-bold">Search</p>
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
                        <div onClick={() => setIsOpenDestination(true)}>
                          <p
                            className={`text-[14px] absolute right-6 truncate left-[40px] top-1/2 transform -translate-y-1/2 ${
                              originAirport == "" ||
                              originAirport == undefined ||
                              searchQueryDestination == "" ||
                              searchQueryDestination == undefined
                                ? ""
                                : "border border-white bg-white px-1 py-0.5 hover:border-black rounded-md transition-all duration-300"
                            }`}
                          >
                            {originAirport !== "" ? originAirport : ""}

                            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                              <FaTimes onClick={handleClear} />
                            </span>
                          </p>
                          <input
                            value={searchQueryDestination}
                            type="text"
                            onChange={(e) =>
                              setSearchQueryDestination(e.target.value)
                            }
                            placeholder="From ?"
                            className="hover:bg-[#d9e2e8]  w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                          />

                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                            <Airplane />
                          </div>
                        </div>
                        {isOpenDestination ? (
                          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[700px] z-10 ">
                            <div className="p-6 max-h-[300px] overflow-y-auto">
                              <ul className="space-y-4">
                                {filteredAirportsDestination.map(
                                  (destination, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center space-x-4 hover:bg-[#f0f3f5] p-3 rounded-md cursor-pointer"
                                      onClick={() => {
                                        setSearchQueryDestination(
                                          destination.value
                                        );
                                        setOriginAirport(destination.name);
                                        setIsOpenDestination(false);
                                      }}
                                    >
                                      {" "}
                                      <img
                                        src={destination.img}
                                        alt=""
                                        className="w-[60px] h-[60px]"
                                      />
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
                            </div>
                            {recentSearchData?.length > 0 ? (
                              <div className="p-8 ">
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
                        ) : (
                          ""
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleSwap}
                        className="py-3 px-4 bg-[#F0F3F5] rounded-md hover:bg-[#d9e2e8] "
                      >
                        <ArrowLeftRightIcon
                          size={25}
                          strokeWidth={3}
                          className="text-black"
                        />
                      </button>
                      <div className="relative" ref={dropdownRefArrival}>
                        <div onClick={() => setIsOpenArrival(true)}>
                          <p
                            className={`text-[14px] absolute right-6 truncate left-[40px] top-1/2 transform -translate-y-1/2 ${
                              destinationAirport == "" ||
                              destinationAirport == undefined ||
                              searchQueryArrival == undefined ||
                              searchQueryArrival == ""
                                ? ""
                                : "border border-white bg-white px-1 py-0.5 hover:border-black rounded-md transition-all duration-300"
                            }`}
                          >
                            {destinationAirport !== ""
                              ? destinationAirport
                              : ""}
                            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                              <FaTimes onClick={handleClearArrival} />
                            </span>
                          </p>
                          <input
                            value={searchQueryArrival}
                            type="text"
                            onChange={(e) =>
                              setSearchQueryArrival(e.target.value)
                            }
                            placeholder="To ?"
                            className="hover:bg-[#d9e2e8]  w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                            <Airplane />
                          </div>
                        </div>
                        {isOpenArrival ? (
                          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
                            <div className="p-6 ">
                              <ul className="space-y-4">
                                {filteredAirportsArrival.map(
                                  (arrival, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center space-x-4 hover:bg-[#f0f3f5] p-3 rounded-md cursor-pointer"
                                      onClick={() => {
                                        setSearchQueryArrival(arrival.value);
                                        setDestinationAirport(arrival.name);
                                        setIsOpenArrival(false);
                                      }}
                                    >
                                      <img
                                        src={arrival.img}
                                        alt=""
                                        className="w-[60px] h-[60px]"
                                      />
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

                    <div className="col-span-2 flex gap-2 justify-between">
                      <div>
                        <DatePicker
                          setRoundDate={setRoundDate}
                          roundDate={roundDate}
                        />
                      </div>

                      <button
                        className="rounded-[10px] bg-[#FC660F] w-full h-full hover:bg-[#d67136]"
                        type="submit"
                      >
                        <div className="flex justify-center items-center w-full gap-2">
                          {/* <SearchIcon /> */}
                          <p className="text-white font-bold">Search</p>
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
