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
import formatLabel from "@/lib/formatLabel";
import { Checkbox } from "../ui/checkbox";
import UserAvatar from "@/public/icons/UserAvatar";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export default function ModalLayout({ children, isModalOpen, setIsModalOpen }) {
  const [isPassengerOpen, setIsPassengerOpen] = useState(false);

  const [isOpenDestination, setIsOpenDestination] = useState(false);
  const [isOpenArrival, setIsOpenArrival] = useState(false);
  const [isWayOpen, setIsWayOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);
  const [originalDate, setOriginalDate] = useState();
  const [isOpenClassPassenger, setIsOpenClassPassenger] = useState(false);
  const router = useRouter();
  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const {
    token,
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
    originAirportName,
    destinationAirportName,
    setDestinationAirportName,
    setOriginAirportName,
  } = useAirlineStore();
  // const { origin, destination, journeyDate, tripType, returnDate } = searchData;

  const tripType = searchData?.type; // "one_way", "return", or "multi_city"
  const passengerDetails = searchData?.passengers || [];

  // For one-way and return, we use the first leg
  const firstLeg = searchData?.legs?.[0] || {};
  const {
    from: origin,
    to: destination,
    departure_date: journeyDate,
    arrival_date: returnDate,
    origin_airport: origin_airport,
    destination_airport: destination_airport,
  } = firstLeg;

  const cabinClass = firstLeg?.class;

  // For multi-city, extract all legs
  const multiCityLegs = searchData?.legs || [];

  const [selectedWay, setSelectedWay] = useState("one_way");
  const [selectedClass, setSelectedClass] = useState("Y");
  const [searchQueryDestination, setSearchQueryDestination] = useState();
  const [searchQueryOrigin, setSearchQueryOrigin] = useState();
  const [originAirport, setOriginAirport] = useState("");
  const [destinationAirport, setDestinationAirport] = useState("");
  const [error, setError] = useState();
  const [singleWayError, setSingleWayError] = useState("");

  useEffect(() => {
    if (tripType && cabinClass) {
      setSelectedWay(tripType);
      setSelectedClass(cabinClass);
    }
  }, [searchData]);

  const [cities, setCities] = useState([]);

  // const [cities, setCities] = useState(() => {
  //   return tripType === "multi_city"
  //     ? searchData.legs.map((leg, index) => ({
  //         id: index + 1,
  //         searchQueryOrigin: leg.from || "",
  //         searchQueryDestination: leg.to || "",
  //         departureDate: leg.departure_date
  //           ? new Date(leg.departure_date)
  //           : null,
  //         isOpenOrigin: false,
  //         isOpenDestination: false,
  //         originAirport: leg?.origin_airport,
  //         destinationAirport: leg?.destination_airport,
  //       }))
  //     : [];
  // });


  useEffect(() => {
    if (selectedWay === "one_way" || selectedWay === "return") {
      if (journeyDate) {
        setOneWayDate(new Date(journeyDate));
      }

      if (selectedWay === "return" && journeyDate && returnDate) {
        setRoundDate({
          from: new Date(journeyDate),
          to: new Date(returnDate),
        });
      }

      setSearchQueryOrigin(origin || "DAC");
      setSearchQueryDestination(destination || "CXB");
    } else if (selectedWay === "multi_city" && multiCityLegs?.length > 0) {
      // Handle multiple legs dynamically
      const updatedCities = multiCityLegs.map((leg, index) => ({
        id: index + 1,
        searchQueryOrigin: leg.from || "",
        searchQueryDestination: leg.to || "",
        departureDate: leg.departure_date ? new Date(leg.departure_date) : null,
        isOpenOrigin: false,
        isOpenDestination: false,
        originAirport: leg.origin_airport || "",
        destinationAirport: leg.destination_airport || "",
      }));

      setCities(updatedCities);
    }
  }, [searchData, selectedWay, journeyDate, returnDate, multiCityLegs]);

  const transformedData = cities.map((item, index) => ({
    DepartureDateTime: item.departureDate,
    OriginLocation: {
      LocationCode: item.searchQueryOrigin,
      LocationType: "A",
    },
    DestinationLocation: {
      LocationCode: item.searchQueryDestination,
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

  // useEffect(() => {
  //   if (origin && destination && journeyDate !== "") {
  //     setOneWayDate(new Date(journeyDate));
  //   }
  //   if (origin && destination && journeyDate && returnDate !== "") {
  //     setRoundDate({
  //       from: new Date(journeyDate),
  //       to: new Date(returnDate),
  //     });
  //   }
  //   setSearchQueryOrigin(origin !== "" ? origin : "DAC");
  //   setSearchQueryDestination(destination !== "" ? destination : "CXB");
  // }, [origin, destination, journeyDate]);

  const handleAddCity = () => {
    setCities([
      ...cities,
      {
        id: cities.length + 1,
        searchQueryOrigin: "",
        searchQueryDestination: "",
        departureDate: null,
        isOpenOrigin: false,
        isOpenDestination: false,
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
        city.id === id ? { ...city, [field]: !city[field] } : city
      )
    );
  };

  const [filteredAirportsArrivalMulti, setFilteredAirportsArrivalMulti] =
    useState([]);

  useEffect(() => {
    const debouncedFilter = debounce(() => {
      const updatedArrivalMultiCityAirports = cities.map((city) =>
        city.searchQueryDestination.length >= 2
          ? airportsData
              .filter(
                (airport) =>
                  (airport.name
                    .toLowerCase()
                    .includes(city.searchQueryDestination.toLowerCase()) ||
                    airport.value
                      .toLowerCase()
                      .includes(city.searchQueryDestination.toLowerCase())) &&
                  airport.value !== city.searchQueryOrigin
              )
              .sort((a, b) => {
                const aMatchesValue =
                  a.value.toLowerCase() ===
                  city.searchQueryDestination.toLowerCase();
                const bMatchesValue =
                  b.value.toLowerCase() ===
                  city.searchQueryDestination.toLowerCase();

                if (aMatchesValue && !bMatchesValue) return -1;
                if (!aMatchesValue && bMatchesValue) return 1;
                return 0;
              })
          : []
      );

      setFilteredAirportsArrivalMulti(updatedArrivalMultiCityAirports);
    }, 300);

    debouncedFilter();

    return () => clearTimeout(debouncedFilter);
  }, [cities, airportsData]);

  const [
    filteredAirportsDestinationMulti,
    setFilteredAirportsDestinationMulti,
  ] = useState([]);

  useEffect(() => {
    const debouncedFilter = debounce(() => {
      const updatedMultiCityAirports = cities?.map((city) =>
        city.searchQueryOrigin.length >= 2
          ? airportsData
              .filter(
                (airport) =>
                  airport.name
                    .toLowerCase()
                    .includes(city.searchQueryOrigin.toLowerCase()) ||
                  airport.value
                    .toLowerCase()
                    .includes(city.searchQueryOrigin.toLowerCase())
              )
              .sort((a, b) => {
                const aMatchesValue =
                  a.value.toLowerCase() ===
                  city.searchQueryOrigin.toLowerCase();
                const bMatchesValue =
                  b.value.toLowerCase() ===
                  city.searchQueryOrigin.toLowerCase();

                if (aMatchesValue && !bMatchesValue) return -1;
                if (!aMatchesValue && bMatchesValue) return 1;
                return 0;
              })
          : []
      );

      setFilteredAirportsDestinationMulti(updatedMultiCityAirports);
    }, 300);

    debouncedFilter();

    return () => clearTimeout(debouncedFilter);
  }, [cities, airportsData]);

  const [ways, setWays] = useState([
    { name: "One-way", price: 50, shortCode: "one_way" },
    { name: "Return", price: 90, shortCode: "return" },
    { name: "Multi-city", price: 150, shortCode: "multi_city" },
  ]);
  const [categories, setCategories] = useState([
    { name: "Adults", ageRange: "11-64", count: 1, type: "ADT" },
    { name: "Children", ageRange: "5-11", count: 0, type: "C06" },
    { name: "Kids", ageRange: "2-5", count: 0, type: "C04" },
    { name: "Infants on lap", ageRange: "under 2", count: 0, type: "INF" },
  ]);
  useEffect(() => {
    // const passengerData = [
    //   { type: "ADT", quantity: 2, age: "18" },
    //   { type: "C06", quantity: 2, age: "11" },
    //   { type: "INF", quantity: 1, age: "1" },
    // ];

    const categoryMapping = {
      ADT: "Adults",
      C06: "Children",
      C04: "Kids",
      INF: "Infants on lap",
    };

    const updatedCategories = categories.map((category) => {
      const matchingPassenger = searchData?.passengers?.find(
        (passenger) => categoryMapping[passenger.type] === category.name
      );

      return matchingPassenger
        ? { ...category, count: matchingPassenger.quantity }
        : category;
    });

    setCategories(updatedCategories);
  }, [searchData]);

  const [classes, setClasses] = useState([
    { name: "Economy", price: 50, shortCode: "Y" },
    { name: "Premium Economy", price: 70, shortCode: "P" },
    { name: "Business", price: 100, shortCode: "C" },
    { name: "First Class", price: 150, shortCode: "F" },
  ]);

  const [filteredAirportsDestination, setFilteredAirportsDestination] =
    useState([]);

  const airOriginData = airportsData
    .filter(
      (airport) =>
        airport.value
          .toLowerCase()
          .includes(searchQueryOrigin?.toLowerCase()) ||
        airport.label
          .toLowerCase()
          .includes(searchQueryOrigin?.toLowerCase()) ||
        airport.name.toLowerCase().includes(searchQueryOrigin?.toLowerCase())
    )
    .sort((a, b) => {
      // Check if the value matches the searchQueryOrigin
      const aMatchesValue =
        a.value.toLowerCase() === searchQueryOrigin?.toLowerCase();
      const bMatchesValue =
        b.value.toLowerCase() === searchQueryOrigin?.toLowerCase();

      // Objects with matching value should come first
      if (aMatchesValue && !bMatchesValue) return -1;
      if (!aMatchesValue && bMatchesValue) return 1;
      return 0; // Keep the same order for other cases
    });

  useEffect(() => {
    const debouncedFilter = debounce(() => {
      if (searchQueryOrigin?.length >= 2) {
        setFilteredAirportsDestination(airOriginData);
      } else {
        setFilteredAirportsDestination([]);
      }
    }, 300);
    debouncedFilter();

    return () => clearTimeout(debouncedFilter);
  }, [searchQueryOrigin, airportsData]);

  const [filteredAirportsArrival, setFilteredAirportsArrival] = useState([]);

  const airDestinationData = airportsData
    .filter(
      (airport) =>
        airport.value
          .toLowerCase()
          .includes(searchQueryDestination?.toLowerCase()) ||
        airport.label
          .toLowerCase()
          .includes(searchQueryDestination?.toLowerCase()) ||
        airport.name
          .toLowerCase()
          .includes(searchQueryDestination?.toLowerCase())
    )
    .sort((a, b) => {
      // Check if the value matches the searchQueryDestination
      const aMatchesValue =
        a.value.toLowerCase() === searchQueryDestination?.toLowerCase();
      const bMatchesValue =
        b.value.toLowerCase() === searchQueryDestination?.toLowerCase();

      // Objects with matching value should come first
      if (aMatchesValue && !bMatchesValue) return -1;
      if (!aMatchesValue && bMatchesValue) return 1;
      return 0; // Keep the same order for other cases
    });
  useEffect(() => {
    const debouncedFilter = debounce(() => {
      if (searchQueryDestination?.length >= 2) {
        setFilteredAirportsArrival(airDestinationData);
      } else {
        setFilteredAirportsArrival([]);
      }
    }, 300);

    debouncedFilter();

    return () => clearTimeout(debouncedFilter);
  }, [searchQueryDestination, airportsData]);

  const generatePassengersFromCategories = (categories) => {
    const passengers = [];

    const adults = categories.find((cat) => cat.name === "Adults");
    if (adults && adults.count > 0) {
      passengers.push({ type: "ADT", quantity: adults.count, age: "18" });
    }

    const children = categories.find((cat) => cat.name === "Children");
    if (children && children.count > 0) {
      passengers.push({ type: "C06", quantity: children.count, age: "6" });
    }
    const kids = categories.find((kid) => kid.name === "Kids");
    if (kids && kids.count > 0) {
      passengers.push({ type: "C04", quantity: kids.count, age: "4" });
    }

    const infants = categories.find((cat) => cat.name === "Infants on lap");
    if (infants && infants.count > 0) {
      passengers.push({ type: "INF", quantity: infants.count, age: "1" });
    }

    return passengers;
  };
  const passengers = generatePassengersFromCategories(categories);

  const dropdownRef = useRef(null);
  const dropdownRefDestination = useRef(null);
  const dropdownRefArrival = useRef(null);

  const totalPassengers = categories?.reduce(
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

    // const searchData = {
    //   origin: searchQueryOrigin,
    //   destination: searchQueryDestination,
    //   tripType: selectedWay,
    //   class: selectedClass,
    //   passengers: passengers,
    //   journeyDate: originalDate,
    //   returnDate: selectedWay == "one_way" ? "" : originalArrivalData,
    // };

    const originDestinationInfo = [
      {
        DepartureDateTime: originalDate,
        OriginLocation: {
          LocationCode: searchQueryOrigin,
          LocationType: "A",
        },
        DestinationLocation: {
          LocationCode: searchQueryDestination,
          LocationType: "A",
        },
        RPH: "0",
      },
    ];

    if (selectedWay === "return" && roundDate?.to) {
      originDestinationInfo.push({
        DepartureDateTime: originalArrivalData,
        OriginLocation: {
          LocationCode: searchQueryDestination,
          LocationType: "A",
        },
        DestinationLocation: {
          LocationCode: searchQueryOrigin,
          LocationType: "A",
        },
        RPH: "1",
      });
    }

    // if (selectedWay !== "multi_city") {
    //   const recentSearch = {
    //     origin: searchQueryOrigin,
    //     destination: searchQueryDestination,
    //     tripType: selectedWay,
    //     class: selectedClass,
    //     passengers: passengers,
    //     journeyDate: originalDate,
    //     returnDate: selectedWay == "one_way" ? "" : originalArrivalData,
    //     originAirport: originAirport,
    //     destinationAirport: destinationAirport,
    //   };

    //   const updatedRecentSearches = [recentSearch, ...recentSearchData].slice(
    //     0,
    //     5
    //   );
    //   setRecentSearchData(updatedRecentSearches);
    // }

    setOriginDestinationInformation(originDestinationInfo);

    // const updatedRecentSearches = [searchData, ...recentSearchData].slice(0, 5);
    // setRecentSearchData(updatedRecentSearches);

    if (selectedWay === "multi_city") {
      if (transformedData.length < 2) {
        // toast.error("You must select at least 2 cities.");
        setError("You must select at least 2 cities.");

        return;
      }

      const invalidTransformedData = transformedData.find(
        (item) =>
          !item.DepartureDateTime ||
          !item.OriginLocation?.LocationCode ||
          !item.DestinationLocation?.LocationCode
      );

      if (invalidTransformedData) {
        // toast.error("One or more city data entries are invalid.");
        setError("City data entries are invalid.");
        return;
      }
    } else {
      if (!originalDate) {
        // toast.error("Please select a departure date.");
        setSingleWayError("Please select a departure date.");
        return;
      }
      if (!originAirport) {
        // toast.error("Please select a departure date.");
        setSingleWayError("Please select a origin location.");
        return;
      }
      if (!destinationAirport) {
        // toast.error("Please select a departure date.");
        setSingleWayError("Please select a destination location.");
        return;
      }

      if (!searchQueryOrigin) {
        // toast.error("Please select a departure location.");
        setSingleWayError("Please select a origin location.");

        return;
      }

      if (!searchQueryDestination) {
        // toast.error("Please select a origin location.");
        setSingleWayError("Please select a destination location.");

        return;
      }

      if (selectedWay === "return" && !roundDate.to) {
        // toast.error("Please select a return date.");
        setSingleWayError("Please select a return date.");

        return;
      }
    }

    const searchData =
      selectedWay === "multi_city"
        ? {
            type: selectedWay,
            legs: cities.map((city) => ({
              from: city.searchQueryOrigin,
              to: city.searchQueryDestination,
              origin_airport: city.originAirport,
              destination_airport: city.destinationAirport,
              class: selectedClass,
              departure_date: city.departureDate,
              arrival_date: null, // Multi-city usually doesn't have return dates per leg
            })),
            passengers: passengers.map((pax) => ({
              age: pax.age.toString(),
              type: pax.type,
              quantity: pax.quantity,
            })),
          }
        : {
            type: selectedWay,
            legs: [
              {
                from: searchQueryOrigin,
                to: searchQueryDestination,
                origin_airport: originAirport,
                destination_airport: destinationAirport,
                class: selectedClass,
                departure_date: originalDate,
                arrival_date:
                  selectedWay === "return" ? originalArrivalData : null,
              },
            ],
            passengers: passengers.map((pax) => ({
              age: pax.age.toString(),
              type: pax.type,
              quantity: pax.quantity,
            })),
          };

    setSearchData(searchData);

    // if (selectedWay === "multi_city") {
    //   if (transformedData.length < 2) {
    //     toast.error("You must select at least 2 cities.");

    //     return;
    //   }

    //   const invalidTransformedData = transformedData.find(
    //     (item) =>
    //       !item.DepartureDateTime ||
    //       !item.OriginLocation?.LocationCode ||
    //       !item.DestinationLocation?.LocationCode
    //   );

    //   if (invalidTransformedData) {
    //     toast.error("One or more city data entries are invalid.");

    //     return;
    //   }
    // }
    setDestinationAirportName(destinationAirport);
    setOriginAirportName(originAirport);
    setOriginQuery(searchQueryOrigin);
    setDestinationQuery(searchQueryDestination);

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
    const tempLocation = originAirport;
    const temp = searchQueryOrigin;
    setSearchQueryOrigin(searchQueryDestination);
    setOriginAirport(destinationAirport);
    setDestinationAirport(tempLocation);
    setSearchQueryDestination(temp);
  };

  useEffect(() => {
    if (originAirportName && destinationAirportName) {
      setOriginAirport(originAirportName);

      setDestinationAirport(destinationAirportName);
    } else {
      setOriginAirport("Dhaka (DAC)");
      setDestinationAirport("Cox's Bazar (CXB)");
    }
  }, [originAirportName, destinationAirportName]);
  const handleClear = () => {
    setSearchQueryOrigin("");
    setOriginAirport("");

    setTimeout(() => {
      if (originInputRef.current) {
        originInputRef.current.focus();
      }
    }, 0);
  };

  const handleClearArrival = () => {
    setSearchQueryDestination("");
    setDestinationAirport("");

    setTimeout(() => {
      if (destinationInputRef.current) {
        destinationInputRef.current.focus();
      }
    }, 0);
  };
  useEffect(() => {
    if (isModalOpen) {
      document.querySelector("body").style.overflow = "hidden";
    } else {
      document.querySelector("body").style.overflow = "auto";
    }
  }, [isModalOpen, setIsModalOpen]);

  const toggleFieldClick = (id, field) => {
    setCities((prevCities) =>
      prevCities.map((city) =>
        city.id === id ? { ...city, [field]: !city[field] } : city
      )
    );
  };

  const handleClearMulti = (cityId) => {
    setCities((prevCities) =>
      prevCities.map((city) =>
        city.id === cityId
          ? {
              ...city,
              searchQueryOrigin: "",
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
              searchQueryDestination: "",
              destinationAirport: "",
            }
          : city
      )
    );
  };

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
          } flex flex-col  h-full transform transition-all duration-1000 ease-in-out overflow-y-scroll`}
        >
          <div className="p-2 md:p-8 bg-[#ffffff] min-h-fit md:min-h-[320px] shadow-md ">
            <Link href={"/"} onClick={() => setIsModalOpen(false)}>
              <Image
                className="mx-4 md:mx-0 w-24"
                alt="logo"
                src={logo}
              ></Image>
            </Link>

            <main
              className={`container_section_home mx-auto  max-w-7xl h-full`}
            >
              <div className=" mx-auto  p-1 md:p-5 rounded-lg">
                <form className="" onSubmit={handleSubmitSearch}>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="w-[300px] text-center flex justify-between items-center py-2 text-sm  text-gray-700 cursor-pointer gap-2">
                      <span
                        className={`${
                          selectedWay == "one_way" && "bg-gray-200"
                        } w-full border p-1 md:p-2 rounded-lg hover:bg-gray-200 transition-all duration-300 text-xs md:text-sm`}
                        onClick={() => setSelectedWay("one_way")}
                      >
                        One way
                      </span>
                      <span
                        className={`${
                          selectedWay == "return" && "bg-gray-200"
                        } w-full border p-1  md:p-2 rounded-lg hover:bg-gray-200 transition-all duration-300 text-xs md:text-sm`}
                        onClick={() => setSelectedWay("return")}
                      >
                        Round-trip
                      </span>
                      <span
                        className={`${
                          selectedWay == "multi_city" && "bg-gray-200"
                        } w-full border p-1 md:p-2 rounded-lg hover:bg-gray-200 transition-all duration-300 text-xs md:text-sm`}
                        onClick={() => setSelectedWay("multi_city")}
                      >
                        Multi city
                      </span>
                    </div>
                  </div>
                  {selectedWay == "multi_city" ? (
                    <>
                      {cities.map((row, index) => (
                        <>
                          <div class="flex">
                            <p className="text-sm py-1 text-[#FC660F]">
                              Flight {`${" "}  ${index + 1}`}
                            </p>
                          </div>
                          <div
                            key={row.id}
                            className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 items-center"
                          >
                            <div
                              className="relative "
                              id={`origin-dropdown-${index}`}
                            >
                              <div
                                onClick={() =>
                                  toggleField(row.id, "isOpenOrigin")
                                }
                              >
                                <p
                                  className={`text-[14px] absolute right-6 left-[40px]  top-1/2 transform -translate-y-1/2 max-w-fit flex items-center justify-between group ${
                                    row?.originAirport
                                      ? "border border-transparent bg-white left-[20px] rounded-[3px] leading-[20px] transition-all duration-300 hover:border-black"
                                      : ""
                                  }`}
                                >
                                  {row?.originAirport && (
                                    <>
                                      <span className="px-1.5 py-0.5 truncate">
                                        {row?.originAirport}
                                      </span>
                                      <span
                                        className="text-gray-400 cursor-pointer p-1  border border-white rounded-sm  hover:border-black transition-all duration-300"
                                        onMouseEnter={(e) =>
                                          e.currentTarget.parentElement.classList.replace(
                                            "hover:border-black",
                                            "border-white"
                                          )
                                        }
                                        onMouseLeave={(e) =>
                                          e.currentTarget.parentElement.classList.replace(
                                            "border-white",
                                            "hover:border-black"
                                          )
                                        }
                                      >
                                        <FaTimes
                                          onClick={() =>
                                            handleClearMulti(row.id)
                                          }
                                        />
                                      </span>
                                    </>
                                  )}
                                </p>
                                <input
                                  value={row.searchQueryOrigin}
                                  type="text"
                                  onChange={(e) =>
                                    updateCityData(
                                      row.id,
                                      "searchQueryOrigin",
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
                              {row?.isOpenOrigin ? (
                                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md  absolute top-16 w-full md:w-[591px] max-h-[600px] z-10 overflow-y-auto">
                                  <div className="p-6 ">
                                    <ul className="space-y-4">
                                      {filteredAirportsDestinationMulti[
                                        row.id - 1
                                      ]?.map((destination, index) => (
                                        <li
                                          key={index}
                                          className="flex items-center space-x-4 hover:bg-[#f0f3f5] p-3 rounded-md cursor-pointer"
                                          onClick={() => {
                                            toggleFieldClick(
                                              row.id,
                                              "isOpenOrigin"
                                            ),
                                              updateCityData(
                                                row.id,
                                                "searchQueryOrigin",
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
                                            <div className="flex items-center gap-3">
                                              <p className="font-semibold text-[16px]">
                                                {destination.label.replace(
                                                  /\s\([^)]*\)/,
                                                  ""
                                                )}
                                              </p>
                                              <span className="text-[14px]">
                                                {destination.value}
                                              </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                              {destination.name}
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

                            <div
                              className="relative"
                              id={`arrival-dropdown-${index}`}
                            >
                              <div
                                onClick={() =>
                                  toggleField(row.id, "isOpenDestination")
                                }
                              >
                                <p
                                  className={`text-[14px] absolute right-6 left-[40px]  top-1/2 transform -translate-y-1/2 max-w-fit flex items-center justify-between group ${
                                    row?.destinationAirport
                                      ? "border border-transparent bg-white left-[20px] rounded-[3px] leading-[20px] transition-all duration-300 hover:border-black"
                                      : ""
                                  }`}
                                >
                                  {row?.destinationAirport && (
                                    <>
                                      <span className="px-1.5 py-0.5 truncate">
                                        {row?.destinationAirport}
                                      </span>
                                      <span
                                        className="text-gray-400 cursor-pointer p-1  border border-white rounded-sm  hover:border-black transition-all duration-300"
                                        onMouseEnter={(e) =>
                                          e.currentTarget.parentElement.classList.replace(
                                            "hover:border-black",
                                            "border-white"
                                          )
                                        }
                                        onMouseLeave={(e) =>
                                          e.currentTarget.parentElement.classList.replace(
                                            "border-white",
                                            "hover:border-black"
                                          )
                                        }
                                      >
                                        <FaTimes
                                          onClick={() =>
                                            handleClearMultiArrival(row.id)
                                          }
                                        />
                                      </span>
                                    </>
                                  )}
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
                                  placeholder="To ?"
                                  className="hover:bg-[#d9e2e8]  w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                                />

                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                                  <Airplane />
                                </div>
                              </div>
                              {row?.isOpenDestination ? (
                                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md absolute top-16 w-full md:w-[591px] max-h-[600px] z-10 overflow-y-auto">
                                  <div className="p-6 ">
                                    <ul className="space-y-4">
                                      {filteredAirportsArrivalMulti[
                                        row.id - 1
                                      ].map((arrival, index) => (
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
                                                "searchQueryDestination",
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
                                            <div className="flex items-center gap-3">
                                              <p className="font-semibold text-[16px]">
                                                {arrival.label.replace(
                                                  /\s\([^)]*\)/,
                                                  ""
                                                )}
                                              </p>
                                              <span className="text-[14px]">
                                                {arrival.value}
                                              </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                              {arrival.name}
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

                            <div className="col-span-1 md:col-span-2 flex gap-0 md:gap-2 justify-between w-full">
                              <DatePickerOneWay
                                className="w-[95%]"
                                originalDate={row.departureDate}
                                oneWayDate={row.departureDate}
                                setOneWayDate={(date) =>
                                  updateCityData(row.id, "departureDate", date)
                                }
                              />

                              <div className="flex items-center">
                                {index !== 0 && (
                                  <div className="flex items-center overflow-hidden">
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
                        </>
                      ))}
                      <div className="flex justify-between items-center w-full flex-wrap">
                        <button
                          type="button"
                          className="text-blue-600 font-semibold"
                          onClick={handleAddCity}
                        >
                          + Add another flight
                        </button>
                        {/* <button type="button" className="text-gray-500">
                          clear all
                        </button> */}
                        {/* {error && (
                          <>
                            <p className="text-red-400 text-sm">{error}</p>
                          </>
                        )} */}
                        <div className="flex items-center gap-2 w-full md:w-auto mt-5 md:mt-0 ">
                          <div className="col-span-2 w-[70%]">
                            <div className="relative" ref={dropdownRef}>
                              <div
                                onClick={() =>
                                  setIsOpenClassPassenger(!isOpenClassPassenger)
                                }
                              >
                                <div className="hover:bg-[#d9e2e8] w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black  focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5] cursor-pointer">
                                  {totalPassengers}{" "}
                                  {totalPassengers !== 1
                                    ? "Travelers"
                                    : "Adult"}
                                  ,{" "}
                                  {selectedClass == "Y"
                                    ? "Economy"
                                    : selectedClass == "P"
                                    ? "Premium Economy"
                                    : selectedClass == "C"
                                    ? "Business"
                                    : "First class"}
                                </div>
                              </div>
                              {isOpenClassPassenger ? (
                                <div className="absolute min-w-56 md:w-80 right-0 left-0 origin-top-right bg-white rounded-[11px] shadow-xl z-10">
                                  <div className=" ">
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
                                              onClick={() =>
                                                updateCount(index, -1)
                                              }
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
                                              onClick={() =>
                                                updateCount(index, 1)
                                              }
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
                                  <div className="flex gap-2 w-full flex-wrap p-4">
                                    {classes?.map((cls, index) => (
                                      <div
                                        key={index}
                                        onClick={() =>
                                          setSelectedClass(cls?.shortCode)
                                        }
                                        className={`border p-2 rounded-lg hover:bg-gray-200 transition-all duration-300 ${
                                          selectedClass == cls?.shortCode
                                            ? "bg-[#F0F3F5]"
                                            : ""
                                        } cursor-pointer`}
                                      >
                                        <span className="">{cls?.name}</span>
                                      </div>
                                    ))}{" "}
                                    <div className="flex justify-end w-full mt-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setIsOpenClassPassenger(false)
                                        }
                                        className="text-white bg-[#FC660F] text-sm py-1.5 px-3  hover:bg-[#da7b44] w-fit  rounded-lg "
                                      >
                                        Ok
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>

                          <button
                            className="rounded-[10px] bg-[#FC660F] p-4 w-full md:w-[54px] h-full md:h-[50px] hover:bg-[#d67136]"
                            type="submit"
                          >
                            <div className="flex justify-center items-center w-full">
                              <SearchIcon />
                            </div>
                          </button>
                        </div>
                      </div>
                      {/* <p className="text-gray-500 text-sm text-right mt-2">
                  Direct flights only
                </p> */}
                    </>
                  ) : selectedWay == "one_way" ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-5  gap-2 relative">
                        <div className="col-span-2 flex gap-1 flex-col md:flex-row">
                          <div
                            className="relative  w-full"
                            ref={dropdownRefDestination}
                          >
                            <div onClick={() => setIsOpenDestination(true)}>
                              <p
                                className={`text-[14px] absolute right-6  top-1/2 transform -translate-y-1/2 max-w-fit flex items-center justify-between group ${
                                  originAirport
                                    ? "border border-transparent bg-white left-[20px] rounded-[3px] leading-[20px] transition-all duration-300 hover:border-black"
                                    : ""
                                }`}
                              >
                                {originAirport && (
                                  <>
                                    <span className="px-1.5 py-0.5 truncate">
                                      {originAirport}
                                    </span>
                                    <span
                                      onClick={handleClear}
                                      className="text-gray-400 cursor-pointer p-1  border border-white rounded-sm  hover:border-black transition-all duration-300"
                                      onMouseEnter={(e) =>
                                        e.currentTarget.parentElement.classList.replace(
                                          "hover:border-black",
                                          "border-white"
                                        )
                                      }
                                      onMouseLeave={(e) =>
                                        e.currentTarget.parentElement.classList.replace(
                                          "border-white",
                                          "hover:border-black"
                                        )
                                      }
                                    >
                                      <FaTimes />
                                    </span>
                                  </>
                                )}
                              </p>
                              <input
                                ref={originInputRef}
                                value={searchQueryOrigin}
                                type="text"
                                onChange={(e) =>
                                  setSearchQueryOrigin(e.target.value)
                                }
                                placeholder="From ?"
                                className="hover:bg-[#d9e2e8]  w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                              />

                              {!originAirport && (
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                                  <Airplane />
                                </div>
                              )}
                            </div>
                            {isOpenDestination ? (
                              <div className="max-w-md mx-auto bg-white rounded-xl shadow-md absolute top-16 w-full md:w-[591px] max-h-[700px] z-10 ">
                                <div className="p-6 max-h-[300px] overflow-y-auto">
                                  <ul className="space-y-4">
                                    {filteredAirportsDestination.map(
                                      (destination, index) => (
                                        <li
                                          key={index}
                                          className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-lg"
                                          onClick={() => {
                                            setSearchQueryOrigin(
                                              destination.value
                                            );
                                            setOriginAirport(destination.label);
                                            setIsOpenDestination(false);
                                          }}
                                        >
                                          <img
                                            src={destination.img}
                                            alt=""
                                            className="w-[60px] h-[60px] hidden md:block"
                                          />
                                          <div className="flex-grow">
                                            <div className="flex items-center gap-3">
                                              <p className="font-semibold text-[16px]">
                                                {destination.label.replace(
                                                  /\s\([^)]*\)/,
                                                  ""
                                                )}
                                              </p>
                                              <span className="text-[14px]">
                                                {destination.value}
                                              </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                              {destination.name}
                                            </p>
                                          </div>
                                          <Checkbox className="bg-white rounded-[4px] shadow-none border border-gray-400" />
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>

                                {!token && (
                                  <div className="px-1 md:px-8 pb-8  ">
                                    <div className="space-y-4 max-h-[200px] overflow-y-auto">
                                      <Link
                                        href={"/login"}
                                        // onClick={() =>
                                        //   handleSubmitRecentSearch(recent)
                                        // }

                                        className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                      >
                                        <div className="bg-[#FFF3EB] p-4 rounded-lg hidden md:block">
                                          <UserAvatar />
                                        </div>
                                        <div>
                                          <p className="font-semibold text-[#FC660F]">
                                            {/* {recent?.origin} - {recent?.destination} */}
                                            Sign In / Sign Up
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            Access your searches on any device
                                          </p>
                                        </div>
                                      </Link>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={handleSwap}
                            className="py-3 px-4 bg-gray-100 rounded-md hidden md:block"
                          >
                            <ArrowLeftRightIcon
                              size={25}
                              className="text-gray-600"
                            />
                          </button>
                          <div
                            className="relative  w-full"
                            ref={dropdownRefArrival}
                          >
                            <div onClick={() => setIsOpenArrival(true)}>
                              <p
                                className={`text-[14px] absolute right-6  top-1/2 transform -translate-y-1/2 max-w-fit flex items-center justify-between group ${
                                  destinationAirport
                                    ? "border border-transparent bg-white left-[20px] rounded-[3px] leading-[20px] transition-all duration-300 hover:border-black"
                                    : ""
                                }`}
                              >
                                {destinationAirport && (
                                  <>
                                    <span className="px-1.5 py-0.5 truncate">
                                      {destinationAirport}
                                    </span>
                                    <span
                                      onClick={handleClearArrival}
                                      className="text-gray-400 cursor-pointer p-1  border border-white rounded-sm  hover:border-black transition-all duration-300"
                                      onMouseEnter={(e) =>
                                        e.currentTarget.parentElement.classList.replace(
                                          "hover:border-black",
                                          "border-white"
                                        )
                                      }
                                      onMouseLeave={(e) =>
                                        e.currentTarget.parentElement.classList.replace(
                                          "border-white",
                                          "hover:border-black"
                                        )
                                      }
                                    >
                                      <FaTimes />
                                    </span>
                                  </>
                                )}
                              </p>
                              <input
                                ref={destinationInputRef}
                                value={searchQueryDestination}
                                type="text"
                                onChange={(e) =>
                                  setSearchQueryDestination(e.target.value)
                                }
                                placeholder="To ?"
                                className="hover:bg-[#d9e2e8] w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                              />
                              {!destinationAirport && (
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                                  <Airplane />
                                </div>
                              )}
                            </div>
                            {isOpenArrival ? (
                              <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-full md:w-[591px] max-h-[700px] z-10">
                                <div className="p-6 max-h-[300px] overflow-y-auto">
                                  <ul className="space-y-4">
                                    {filteredAirportsArrival.map(
                                      (arrival, index) => (
                                        <li
                                          key={index}
                                          className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-lg"
                                          onClick={() => {
                                            setSearchQueryDestination(
                                              arrival.value
                                            );
                                            setDestinationAirport(
                                              arrival.label
                                            );
                                            setIsOpenArrival(false);
                                          }}
                                        >
                                          <img
                                            src={arrival.img}
                                            alt=""
                                            className="w-[60px] h-[60px] hidden md:block"
                                          />
                                          <div className="flex-grow">
                                            <div className="flex items-center gap-3 ">
                                              <p className="font-semibold text-[16px]">
                                                {arrival.label.replace(
                                                  /\s\([^)]*\)/,
                                                  ""
                                                )}
                                              </p>
                                              <span className="text-[14px]">
                                                {arrival.value}
                                              </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                              {arrival.name}
                                            </p>
                                          </div>
                                          <Checkbox className="bg-white rounded-[4px] shadow-none border border-gray-400" />
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>

                                {!token && (
                                  <div className="px-1 md:px-8 pb-8  ">
                                    <div className="space-y-4 max-h-[200px] overflow-y-auto">
                                      <Link
                                        href={"/login"}
                                        // onClick={() =>
                                        //   handleSubmitRecentSearch(recent)
                                        // }

                                        className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                      >
                                        <div className="bg-[#FFF3EB] p-4 rounded-lg hidden md:block">
                                          <UserAvatar />
                                        </div>
                                        <div>
                                          <p className="font-semibold text-[#FC660F]">
                                            {/* {recent?.origin} - {recent?.destination} */}
                                            Sign In / Sign Up
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            Access your searches on any device
                                          </p>
                                        </div>
                                      </Link>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>

                        <div className="col-span-3 flex-col md:flex-row gap-2 justify-between  md:grid grid-cols-7 ">
                          <DatePickerOneWay
                            originalDate={originalDate}
                            className={"w-full col-span-1 md:col-span-4"}
                            setOneWayDate={setOneWayDate}
                            oneWayDate={oneWayDate}
                          />
                          <div className="col-span-1  md:col-span-2 my-2 md:my-0">
                            <div className="relative" ref={dropdownRef}>
                              <div
                                onClick={() =>
                                  setIsOpenClassPassenger(!isOpenClassPassenger)
                                }
                              >
                                <div className="hover:bg-[#d9e2e8] w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black  focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5] cursor-pointer">
                                  {totalPassengers}{" "}
                                  {totalPassengers !== 1
                                    ? "Travelers"
                                    : "Adult"}
                                  ,{" "}
                                  {selectedClass == "Y"
                                    ? "Economy"
                                    : selectedClass == "P"
                                    ? "Premium Economy"
                                    : selectedClass == "C"
                                    ? "Business"
                                    : "First class"}
                                </div>
                              </div>
                              {isOpenClassPassenger ? (
                                <div className="absolute w-80 right-0 left-0 origin-top-right bg-white rounded-[11px] shadow-xl z-10">
                                  <div className=" ">
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
                                              onClick={() =>
                                                updateCount(index, -1)
                                              }
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
                                              onClick={() =>
                                                updateCount(index, 1)
                                              }
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
                                  <div className="flex gap-2 w-full flex-wrap p-4">
                                    {classes?.map((cls, index) => (
                                      <div
                                        key={index}
                                        onClick={() =>
                                          setSelectedClass(cls?.shortCode)
                                        }
                                        className={`px-2 py-2 border p-2 rounded-lg hover:bg-gray-200 transition-all duration-300 ${
                                          selectedClass == cls?.shortCode
                                            ? "bg-[#F0F3F5]"
                                            : ""
                                        } cursor-pointer`}
                                      >
                                        <span className="">{cls?.name}</span>
                                      </div>
                                    ))}
                                    <div className="flex justify-end w-full mt-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setIsOpenClassPassenger(false)
                                        }
                                        className="text-white bg-[#FC660F] text-sm py-1.5 px-3  hover:bg-[#da7b44] w-fit  rounded-lg "
                                      >
                                        Ok
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>

                          {/* <Link href={"/search-result"}> */}
                          <button
                            className="rounded-[10px] bg-[#FC660F] w-full md:w-[130px] py-5 md:py-0 h-fit md:h-full hover:bg-[#d67136] col-span-1"
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
                        <div className="grid grid-cols-1 md:grid-cols-5  gap-0 md:gap-2 relative">
                          <div className="col-span-1 md:col-span-2 flex gap-1 flex-col md:flex-row">
                            <div
                              className="relative w-full "
                              ref={dropdownRefDestination}
                            >
                              <div onClick={() => setIsOpenDestination(true)}>
                                <p
                                  className={`text-[14px] absolute right-6  top-1/2 transform -translate-y-1/2 max-w-fit flex items-center justify-between group ${
                                    originAirport
                                      ? "border border-transparent bg-white left-[20px] rounded-[3px] leading-[20px] transition-all duration-300 hover:border-black"
                                      : ""
                                  }`}
                                >
                                  {originAirport && (
                                    <>
                                      <span className="px-1.5 py-0.5 truncate">
                                        {originAirport}
                                      </span>
                                      <span
                                        onClick={handleClear}
                                        className="text-gray-400 cursor-pointer p-1  border border-white rounded-sm  hover:border-black transition-all duration-300"
                                        onMouseEnter={(e) =>
                                          e.currentTarget.parentElement.classList.replace(
                                            "hover:border-black",
                                            "border-white"
                                          )
                                        }
                                        onMouseLeave={(e) =>
                                          e.currentTarget.parentElement.classList.replace(
                                            "border-white",
                                            "hover:border-black"
                                          )
                                        }
                                      >
                                        <FaTimes />
                                      </span>
                                    </>
                                  )}
                                </p>
                                <input
                                  ref={originInputRef}
                                  value={searchQueryOrigin}
                                  type="text"
                                  onChange={(e) =>
                                    setSearchQueryOrigin(e.target.value)
                                  }
                                  placeholder="From ?"
                                  className="hover:bg-[#d9e2e8]  w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                                />

                                {!originAirport && (
                                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                                    <Airplane />
                                  </div>
                                )}
                              </div>
                              {isOpenDestination ? (
                                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-full md:w-[591px] max-h-[700px] z-10 ">
                                  <div className="p-6 max-h-[300px] overflow-y-auto">
                                    <ul className="space-y-4">
                                      {filteredAirportsDestination.map(
                                        (destination, index) => (
                                          <li
                                            key={index}
                                            className="flex items-center space-x-4 hover:bg-[#f0f3f5] p-3 rounded-md cursor-pointer"
                                            onClick={() => {
                                              setSearchQueryOrigin(
                                                destination.value
                                              );
                                              setOriginAirport(
                                                destination.label
                                              );
                                              setIsOpenDestination(false);
                                            }}
                                          >
                                            {" "}
                                            <img
                                              src={destination.img}
                                              alt=""
                                              className="w-[60px] h-[60px] hidden md:block"
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
                                            <Checkbox className="bg-white rounded-[4px] shadow-none border border-gray-400" />
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>

                                  {!token && (
                                    <div className="px-1 md:px-8 pb-8 ">
                                      <div className="space-y-4 max-h-[200px] overflow-y-auto">
                                        <Link
                                          href={"/login"}
                                          // onClick={() =>
                                          //   handleSubmitRecentSearch(recent)
                                          // }

                                          className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                        >
                                          <div className="bg-[#FFF3EB] p-4 rounded-lg hidden md:block">
                                            <UserAvatar />
                                          </div>
                                          <div>
                                            <p className="font-semibold text-[#FC660F]">
                                              {/* {recent?.origin} - {recent?.destination} */}
                                              Sign In / Sign Up
                                            </p>
                                            <p className="text-sm text-gray-500">
                                              Access your searches on any device
                                            </p>
                                          </div>
                                        </Link>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                            <button
                              onClick={handleSwap}
                              type="button"
                              className="py-3 px-4 bg-gray-100 rounded-md hidden md:block"
                            >
                              <ArrowLeftRightIcon
                                size={25}
                                className="text-gray-600"
                              />
                            </button>
                            <div
                              className="relative  w-full"
                              ref={dropdownRefArrival}
                            >
                              <div onClick={() => setIsOpenArrival(true)}>
                                <p
                                  className={`text-[14px] absolute right-6  top-1/2 transform -translate-y-1/2 max-w-fit flex items-center justify-between group ${
                                    destinationAirport
                                      ? "border border-transparent bg-white left-[20px] rounded-[3px] leading-[20px] transition-all duration-300 hover:border-black"
                                      : ""
                                  }`}
                                >
                                  {destinationAirport && (
                                    <>
                                      <span className="px-2 py-0.5 truncate">
                                        {destinationAirport}
                                      </span>
                                      <span
                                        onClick={handleClearArrival}
                                        className="text-gray-400 cursor-pointer p-1  border border-white rounded-sm  hover:border-black transition-all duration-300"
                                        onMouseEnter={(e) =>
                                          e.currentTarget.parentElement.classList.replace(
                                            "hover:border-black",
                                            "border-white"
                                          )
                                        }
                                        onMouseLeave={(e) =>
                                          e.currentTarget.parentElement.classList.replace(
                                            "border-white",
                                            "hover:border-black"
                                          )
                                        }
                                      >
                                        <FaTimes />
                                      </span>
                                    </>
                                  )}
                                </p>
                                <input
                                  ref={destinationInputRef}
                                  value={searchQueryDestination}
                                  type="text"
                                  onChange={(e) =>
                                    setSearchQueryDestination(e.target.value)
                                  }
                                  placeholder="To ?"
                                  className="hover:bg-[#d9e2e8]  w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5]"
                                />
                                {!destinationAirport && (
                                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ">
                                    <Airplane />
                                  </div>
                                )}
                              </div>
                              {isOpenArrival ? (
                                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-full md:w-[591px] max-h-[600px] z-10 overflow-y-auto">
                                  <div className="p-6 ">
                                    <ul className="space-y-4">
                                      {filteredAirportsArrival.map(
                                        (arrival, index) => (
                                          <li
                                            key={index}
                                            className="flex items-center space-x-4 hover:bg-[#f0f3f5] p-3 rounded-md cursor-pointer"
                                            onClick={() => {
                                              setSearchQueryDestination(
                                                arrival.value
                                              );
                                              setDestinationAirport(
                                                arrival.label
                                              );
                                              setIsOpenArrival(false);
                                            }}
                                          >
                                            <img
                                              src={arrival.img}
                                              alt=""
                                              className="w-[60px] h-[60px] hidden md:block"
                                            />
                                            <div className="flex-grow">
                                              <p className="font-semibold">
                                                {arrival.name}, {arrival.value}
                                              </p>
                                              <p className="text-sm text-gray-500">
                                                {arrival.label}
                                              </p>
                                            </div>
                                            <Checkbox className="bg-white rounded-[4px] shadow-none border border-gray-400" />
                                          </li>
                                        )
                                      )}
                                    </ul>

                                    {!token && (
                                      <div className="px-1 md:px-8 pb-8  ">
                                        <div className="space-y-4 max-h-[200px] overflow-y-auto">
                                          <Link
                                            href={"/login"}
                                            // onClick={() =>
                                            //   handleSubmitRecentSearch(recent)
                                            // }

                                            className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                          >
                                            <div className="bg-[#FFF3EB] p-4 rounded-lg hidden md:block">
                                              <UserAvatar />
                                            </div>
                                            <div>
                                              <p className="font-semibold text-[#FC660F]">
                                                {/* {recent?.origin} - {recent?.destination} */}
                                                Sign In / Sign Up
                                              </p>
                                              <p className="text-sm text-gray-500">
                                                Access your searches on any
                                                device
                                              </p>
                                            </div>
                                          </Link>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>

                          <div className="col-span-3 flex  flex-col md:flex-row gap-2 justify-between">
                            <div>
                              <DatePicker
                                setRoundDate={setRoundDate}
                                roundDate={roundDate}
                              />
                            </div>
                            <div className="flex items-center gap-2 w-full">
                              <div className="col-span-2">
                                <div className="relative" ref={dropdownRef}>
                                  <div
                                    onClick={() =>
                                      setIsOpenClassPassenger(
                                        !isOpenClassPassenger
                                      )
                                    }
                                  >
                                    <div className="hover:bg-[#d9e2e8] w-full pl-10 pr-6 py-4 truncate focus:ring-1 focus:ring-black  focus:bg-transparent rounded-[10px] focus:outline-none bg-[#F0F3F5] cursor-pointer">
                                      {totalPassengers}{" "}
                                      {totalPassengers !== 1
                                        ? "Travelers"
                                        : "Adult"}
                                      ,{" "}
                                      {selectedClass == "Y"
                                        ? "Economy"
                                        : selectedClass == "P"
                                        ? "Premium Economy"
                                        : selectedClass == "C"
                                        ? "Business"
                                        : "First class"}
                                    </div>
                                  </div>
                                  {isOpenClassPassenger ? (
                                    <div className="absolute min-w-56 md:w-80 right-0 left-0 origin-top-right bg-white rounded-[11px] shadow-xl z-10">
                                      <div className=" ">
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
                                                  onClick={() =>
                                                    updateCount(index, -1)
                                                  }
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
                                                  onClick={() =>
                                                    updateCount(index, 1)
                                                  }
                                                  type="button"
                                                  disabled={
                                                    totalPassengers === 7
                                                  }
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
                                      <div className="flex gap-2 w-full flex-wrap p-4">
                                        {classes?.map((cls, index) => (
                                          <div
                                            key={index}
                                            onClick={() =>
                                              setSelectedClass(cls?.shortCode)
                                            }
                                            className={`px-2 py-2 border p-2 rounded-lg hover:bg-gray-200 transition-all duration-300 ${
                                              selectedClass == cls?.shortCode
                                                ? "bg-[#F0F3F5]"
                                                : ""
                                            } cursor-pointer`}
                                          >
                                            <span className="">
                                              {cls?.name}
                                            </span>
                                          </div>
                                        ))}
                                        <div className="flex justify-end w-full mt-2">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setIsOpenClassPassenger(false)
                                            }
                                            className="text-white bg-[#FC660F] text-sm py-1.5 px-3  hover:bg-[#da7b44] w-fit  rounded-lg "
                                          >
                                            Ok
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
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
                        </div>
                      </>
                    </>
                  )}
                </form>
                {singleWayError && (
                  <>
                    <p className="text-red-400 text-sm">{singleWayError}</p>
                  </>
                )}
              </div>
            </main>
          </div>

          <div
            className="flex-grow w-full h-fit"
            onClick={() => setIsModalOpen(false)}
          ></div>
        </div>
      </div>
    </div>
  );
}
