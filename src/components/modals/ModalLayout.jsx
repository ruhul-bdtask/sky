import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import logo from "@/public/images/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import travelBg from "@/public/images/wishlist-travel-2.png";
import { ArrowLeftRightIcon } from "lucide-react";
import Airplane from "@/public/icons/Airplane";
import SearchIcon from "@/public/icons/SearchIcon";
import useAirlineStore from "../../../stores/airlineStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import airportsData from "../../../public/utils/airports.json";
import moment from "moment";
import { FaTimes } from "react-icons/fa";
import DatePickerOneWay from "@/components/datePicker/DatePickerOneWay";
import DatePicker from "@/components/datePicker/DatePicker";

export default function ModalLayout({ children, isModalOpen, setIsModalOpen }) {
  const [isPassengerOpen, setIsPassengerOpen] = useState(false);

  const [isOpenDestination, setIsOpenDestination] = useState(false);
  const [isOpenArrival, setIsOpenArrival] = useState(false);
  const [isWayOpen, setIsWayOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);
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
    travelPlanningDate,
    originQuery,
    destinationQuery,
    searchData,
    setOriginQuery,
    setDestinationQuery,
    setTravelPlanningDate,
  } = useAirlineStore();
  const { destination, arrival, journeyDate, tripType, returnDate } =
    searchData;

  console.log(tripType);

  const [selectedWay, setSelectedWay] = useState("one_way");
  const [selectedClass, setSelectedClass] = useState("Y");
  const [searchQueryArrival, setSearchQueryArrival] = useState();
  const [searchQueryDestination, setSearchQueryDestination] = useState();
  const [originAirport, setOriginAirport] = useState("");
  const [destinationAirport, setDestinationAirport] = useState("");

  useEffect(() => {
    if (tripType && searchData?.class) {
      setSelectedWay(tripType);
      setSelectedClass(searchData?.class);
    }
  }, [searchData]);
  console.log(selectedWay);

  const [cities, setCities] = useState([
    {
      id: 1,
      searchQueryDestination: "",
      searchQueryArrival: "",
      departureDate: null,
      isOpenOrigin: false,
      isOpenDestination: false,
    },
    {
      id: 2,
      searchQueryDestination: "",
      searchQueryArrival: "",
      departureDate: null,
      isOpenOrigin: false,
      isOpenDestination: false,
    },
    {
      id: 3,
      searchQueryDestination: "",
      searchQueryArrival: "",
      departureDate: null,
      isOpenOrigin: false,
      isOpenDestination: false,
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
    if (destination && arrival && journeyDate !== "") {
      setOneWayDate(new Date(journeyDate));
    }
    if (destination && arrival && journeyDate && returnDate !== "") {
      setRoundDate({
        from: new Date(journeyDate),
        to: new Date(returnDate),
      });
    }
    setSearchQueryDestination(destination !== "" ? destination : "DAC");
    setSearchQueryArrival(arrival !== "" ? arrival : "CXB");
  }, [destination, arrival, journeyDate]);

  const handleAddCity = () => {
    setCities([
      ...cities,
      {
        id: cities.length + 1,
        searchQueryDestination: "",
        searchQueryArrival: "",
        departureDate: null,
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

  const totalPassengers = searchData?.passengers.reduce(
    (sum, category) => sum + category.quantity,
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
    } else {
      console.log(
        "Return trip not added, check if selectedWay is 'return' and roundDate?.to is valid"
      );
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

    if (!searchQueryDestination) {
      toast.error("Please select a departure location.");

      return;
    }

    if (!searchQueryArrival) {
      toast.error("Please select a destination location.");

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

    const queryString = new URLSearchParams({
      search: JSON.stringify(searchData),
      originDestinationInfo:
        selectedWay == "multi_city"
          ? JSON.stringify(transformedData)
          : JSON.stringify(originDestinationInfo),
    }).toString();

    // router.push(`/search-result?${queryString}`);
    window.location.href = `/search-result?${queryString}`;
  };

  const handleSwap = () => {
    const temp = searchQueryDestination;
    setSearchQueryDestination(searchQueryArrival);
    setSearchQueryArrival(temp);
  };

  const handleClear = () => {
    setSearchQueryDestination("");
    setOriginAirport("");
  };

  const handleClearArrival = () => {
    setSearchQueryArrival("");
    setDestinationAirport("");
  };
  useEffect(() => {
    if (isModalOpen) {
      document.querySelector("body").style.overflow = "hidden";
    } else {
      document.querySelector("body").style.overflow = "auto";
    }
  }, [isModalOpen, setIsModalOpen]);

  return (
    <div>
      <div
        className={`${
          isModalOpen ? "block" : "hidden"
        } bg-black bg-opacity-70 w-full fixed top-0 left-0 right-0 h-screen z-[99999] transition-all duration-500`}
      >
        <div
          className={`${
            isModalOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          } flex flex-col h-full transform transition-all duration-1000 ease-in-out`}
        >
          <div className="p-8 bg-[#ffffff] min-h-[320px] shadow-md ">
            <Link href={"/"} onClick={() => setIsModalOpen(false)}>
              <Image className="mx-4 md:mx-0 " alt="logo" src={logo}></Image>
            </Link>

            <main
              className={`container_section_home mx-auto  max-w-7xl h-full`}
            >
              <div className=" mx-auto  p-5 rounded-lg">
                <form className="" onSubmit={handleSubmitSearch}>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className=" text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <span
                            onClick={() => setIsWayOpen(!isWayOpen)}
                            className=" flex justify-between items-center w-full py-2 text-sm  text-gray-700 cursor-pointer "
                          >
                            <span className="w-full border p-2 rounded-lg hover:bg-gray-200 transition-all duration-300">
                              {selectedWay === "one_way"
                                ? "One way"
                                : selectedWay === "return"
                                ? "Round-trip"
                                : "Multi city"}
                            </span>
                            {/* <svg
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
                            </svg> */}
                          </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {ways?.map((way, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={() => setSelectedWay(way?.shortCode)}
                              className={`px-5 py-2 ${
                                selectedWay == way?.shortCode
                                  ? "bg-[#F0F3F5]"
                                  : ""
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
                          className="flex justify-between items-center w-full  py-2 text-sm  text-gray-700 cursor-pointer "
                        >
                          <span className="border p-2 rounded-lg hover:bg-gray-200 transition-all duration-300">
                            {totalPassengers}{" "}
                            {totalPassengers !== 1 ? "Travelers" : "Adult"}
                          </span>
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
                            className="flex justify-between items-center w-full py-2 text-sm  text-gray-700 cursor-pointer "
                          >
                            <span className="border p-2 rounded-lg hover:bg-gray-200 transition-all duration-300">
                              {selectedClass == "Y"
                                ? "Economy"
                                : selectedClass == "P"
                                ? "Premium Economy"
                                : selectedClass == "C"
                                ? "Business"
                                : "First class"}
                            </span>
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
                  </div>
                  {selectedWay == "multi_city" ? (
                    <>
                      {cities.map((row, index) => (
                        <div
                          key={row.id}
                          className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 items-center"
                        >
                          <div
                            className="relative"
                            ref={dropdownRefDestination}
                          >
                            <div
                              onClick={() =>
                                toggleField(row.id, "isOpenOrigin")
                              }
                            >
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
                                className="w-full pl-10 pr-4 py-4  focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                                <Airplane />
                              </div>
                            </div>
                            {row?.isOpenOrigin ? (
                              <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
                                <div className="p-6 ">
                                  <ul className="space-y-4">
                                    {filteredAirportsDestinationMulti[
                                      row.id - 1
                                    ].map((destination, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center space-x-4 hover:bg-[#f0f3f5] p-3 rounded-md"
                                        onClick={() => {
                                          toggleField(row.id, "isOpenOrigin"),
                                            updateCityData(
                                              row.id,
                                              "searchQueryDestination",
                                              destination.value
                                            );
                                          setIsOpenDestination(false);
                                          updateCityData(
                                            row.id,
                                            "originAirport",
                                            {
                                              label: destination.label,
                                              value: destination.value,
                                              code: destination.name,
                                            }
                                          );
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
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>

                          <div className="relative" ref={dropdownRefArrival}>
                            <div
                              onClick={() =>
                                toggleField(row.id, "isOpenDestination")
                              }
                            >
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
                                placeholder="To ?"
                                className="w-full pl-10 pr-4 py-4 focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Airplane />
                              </div>
                            </div>
                            {row?.isOpenDestination ? (
                              <div className="max-w-md mx-auto bg-white rounded-xl shadow-md absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
                                <div className="p-6 ">
                                  <ul className="space-y-4">
                                    {filteredAirportsArrivalMulti[
                                      row.id - 1
                                    ].map((arrival, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center space-x-4 hover:bg-[#f0f3f5] p-3 rounded-md"
                                        onClick={() => {
                                          toggleField(
                                            row.id,
                                            "isOpenDestination"
                                          ),
                                            updateCityData(
                                              row.id,
                                              "searchQueryArrival",
                                              arrival.value
                                            );
                                          setIsOpenArrival(false);
                                          updateCityData(
                                            row.id,
                                            "destinationAirport",
                                            {
                                              code: arrival.name,
                                              value: arrival.value,
                                              label: arrival.label,
                                            }
                                          );
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
                                  <button
                                    type="button"
                                    onClick={handleDeleteCity}
                                  >
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
                          <div
                            className="relative"
                            ref={dropdownRefDestination}
                          >
                            <div
                              onClick={() =>
                                setIsOpenDestination(!isOpenDestination)
                              }
                            >
                              <p className="absolute right-5 truncate left-[40px] top-1/2 transform -translate-y-1/2  ">
                                {originAirport !== ""
                                  ? originAirport + " " + searchQueryDestination
                                  : searchQueryDestination}
                              </p>
                              <input
                                value={
                                  originAirport !== ""
                                    ? ""
                                    : searchQueryDestination
                                }
                                type="text"
                                onChange={(e) =>
                                  setSearchQueryDestination(e.target.value)
                                }
                                // placeholder="From ?"
                                className="w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                              />

                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                                <Airplane />
                              </div>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                                <FaTimes onClick={handleClear} />
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
                                            setOriginAirport(destination.name);
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
                                      {recentSearchData?.map(
                                        (recent, index) => (
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
                                                {moment(
                                                  recent?.journeyDate
                                                ).format("MMMM Do, YYYY")}
                                              </p>
                                            </div>
                                          </li>
                                        )
                                      )}
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
                            className="py-3 px-4 bg-gray-100 rounded-md"
                          >
                            <ArrowLeftRightIcon
                              size={25}
                              className="text-gray-600"
                            />
                          </button>
                          <div className="relative" ref={dropdownRefArrival}>
                            <div
                              onClick={() => setIsOpenArrival(!isOpenArrival)}
                            >
                              {/* <input
                          value={searchQueryArrival}
                          type="text"
                          onChange={(e) =>
                            setSearchQueryArrival(e.target.value)
                          }
                          placeholder="To ?"
                          className="w-full pl-10 pr-4 py-4 focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                        /> */}
                              <p className="absolute right-5 truncate left-[40px] top-1/2 transform -translate-y-1/2  ">
                                {destinationAirport !== ""
                                  ? destinationAirport +
                                    " " +
                                    searchQueryArrival
                                  : searchQueryArrival}
                              </p>
                              <input
                                value={
                                  destinationAirport !== ""
                                    ? ""
                                    : searchQueryArrival
                                }
                                type="text"
                                onChange={(e) =>
                                  setSearchQueryArrival(e.target.value)
                                }
                                // placeholder="To ?"
                                className="w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                                <Airplane />
                              </div>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                                <FaTimes onClick={handleClearArrival} />
                              </div>
                            </div>
                            {isOpenArrival ? (
                              <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[700px] z-10">
                                <div className="p-6 max-h-[300px] overflow-y-auto">
                                  <ul className="space-y-4">
                                    {filteredAirportsArrival.map(
                                      (arrival, index) => (
                                        <li
                                          key={index}
                                          className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                          onClick={() => {
                                            setSearchQueryArrival(
                                              arrival.value
                                            );
                                            setDestinationAirport(arrival.name);
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
                                      {recentSearchData?.map(
                                        (recent, index) => (
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
                                                {moment(
                                                  recent?.journeyDate
                                                ).format("MMMM Do, YYYY")}
                                              </p>
                                            </div>
                                          </li>
                                        )
                                      )}
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
                            className="rounded-[10px] bg-[#FC660F] w-[130px] h-full hover:bg-[#d67136]"
                            type="submit"
                          >
                            <div className="flex justify-center items-center w-full gap-1">
                              <SearchIcon />
                              <p className="text-white font-bold">Update</p>
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
                            <div
                              className="relative"
                              ref={dropdownRefDestination}
                            >
                              <div
                                onClick={() =>
                                  setIsOpenDestination(!isOpenDestination)
                                }
                              >
                                <p className="absolute right-5 truncate left-[40px] top-1/2 transform -translate-y-1/2  ">
                                  {originAirport !== ""
                                    ? originAirport +
                                      " " +
                                      searchQueryDestination
                                    : searchQueryDestination}
                                </p>
                                <input
                                  value={
                                    originAirport !== ""
                                      ? ""
                                      : searchQueryDestination
                                  }
                                  type="text"
                                  onChange={(e) =>
                                    setSearchQueryDestination(e.target.value)
                                  }
                                  // placeholder="From ?"
                                  className="w-full pl-10 pr-4 py-4   focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none  bg-[#F0F3F5]"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                                  <Airplane />
                                </div>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                                  <FaTimes onClick={handleClear} />
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
                                            className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                            onClick={() => {
                                              setSearchQueryDestination(
                                                destination.value
                                              );
                                              setOriginAirport(
                                                destination.name
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
                                  </div>
                                  {recentSearchData?.length > 0 ? (
                                    <div className="p-8 ">
                                      <h3 className="text-xl font-semibold mb-4 flex justify-between items-center">
                                        Recent Searches
                                        <button
                                          onClick={() =>
                                            setRecentSearchData([])
                                          }
                                          className="text-orange-500 hover:text-orange-600"
                                        >
                                          Clear
                                        </button>
                                      </h3>
                                      <ul className="space-y-4">
                                        {recentSearchData?.map(
                                          (recent, index) => (
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
                                                  {moment(
                                                    recent?.journeyDate
                                                  ).format("MMMM Do, YYYY")}
                                                </p>
                                              </div>
                                            </li>
                                          )
                                        )}
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
                              <div
                                onClick={() => setIsOpenArrival(!isOpenArrival)}
                              >
                                <p className="absolute right-5 truncate left-[40px] top-1/2 transform -translate-y-1/2  ">
                                  {destinationAirport !== ""
                                    ? destinationAirport +
                                      " " +
                                      searchQueryArrival
                                    : searchQueryArrival}
                                </p>
                                <input
                                  value={
                                    destinationAirport !== ""
                                      ? ""
                                      : searchQueryArrival
                                  }
                                  type="text"
                                  onChange={(e) =>
                                    setSearchQueryArrival(e.target.value)
                                  }
                                  // placeholder="To ?"
                                  className="w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                                  <Airplane />
                                </div>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                                  <FaTimes onClick={handleClearArrival} />
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
                                            className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                            onClick={() => {
                                              setSearchQueryArrival(
                                                arrival.value
                                              );
                                              setDestinationAirport(
                                                arrival.name
                                              );
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
                                            onClick={() =>
                                              setRecentSearchData([])
                                            }
                                            className="text-orange-500 hover:text-orange-600"
                                          >
                                            Clear
                                          </button>
                                        </h3>
                                        <ul className="space-y-4">
                                          {recentSearchData?.map(
                                            (recent, index) => (
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
                                                    {moment(
                                                      recent?.journeyDate
                                                    ).format("MMMM Do, YYYY")}
                                                  </p>
                                                </div>
                                              </li>
                                            )
                                          )}
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
          k
          <div
            className="flex-grow w-full h-fit"
            onClick={() => setIsModalOpen(false)}
          ></div>
        </div>
      </div>
    </div>
  );
}
