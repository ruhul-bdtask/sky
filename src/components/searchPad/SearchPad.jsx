"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { addDays, set } from "date-fns";
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
import formatLabel from "@/lib/formatLabel";
import { Checkbox } from "../ui/checkbox";
import UserAvatar from "@/public/icons/UserAvatar";
import { useMutation } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import Loading from "../loader/Loading";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

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
    token,
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
    setOriginAirportName,
    setDestinationAirportName,
  } = useAirlineStore();

  const [searchQueryDestination, setSearchQueryDestination] = useState();
  const [searchQueryOrigin, setSearchQueryOrigin] = useState();
  const [originAirport, setOriginAirport] = useState("");
  const [destinationAirport, setDestinationAirport] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [cities, setCities] = useState([
    {
      id: 1,
      searchQueryOrigin: "",
      searchQueryDestination: "",
      departureDate: null,
      isOpenOrigin: false,
      isOpenDestination: false,
      originAirport: "",
      destinationAirport: "",
    },
    {
      id: 2,
      searchQueryOrigin: "",
      searchQueryDestination: "",
      departureDate: null,
      isOpenOrigin: false,
      isOpenDestination: false,
      originAirport: "",
      destinationAirport: "",
    },
    {
      id: 3,
      searchQueryOrigin: "",
      searchQueryDestination: "",
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
      LocationCode: item.searchQueryOrigin,
      LocationType: "A",
    },
    DestinationLocation: {
      LocationCode: item.searchQueryDestination,
      LocationType: "A",
    },
    RPH: 0,
  }));

  function transformMultiCityToArrayStructure(
    multiCityData,
    passengers,
    travelClass
  ) {
    return {
      destination: multiCityData.map((leg) => leg.OriginLocation.LocationCode),
      arrival: multiCityData.map((leg) => leg.DestinationLocation.LocationCode),
      tripType: "multi_city",
      class: travelClass,
      passengers: passengers,
      journeyDate: multiCityData.map((leg) => leg.DepartureDateTime),
      returnDate: "", // Not applicable for multi-city trips
    };
  }

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
        searchQueryOrigin: "",
        searchQueryDestination: "",
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

  // const filteredAirportsArrivalMulti = cities.map((city) =>
  //   airportsData.filter(
  //     (airport) =>
  //       (airport.name
  //         .toLowerCase()
  //         .includes(city.searchQueryDestination.toLowerCase()) ||
  //         airport.value
  //           .toLowerCase()
  //           .includes(city.searchQueryDestination.toLowerCase())) &&
  //       airport.value !== city.searchQueryOrigin
  //   )
  // );

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

  // const filteredAirportsDestinationMulti = cities.map((city) =>
  //   airportsData.filter(
  //     (airport) =>
  //       (airport.name
  //         .toLowerCase()
  //         .includes(city.searchQueryOrigin.toLowerCase()) ||
  //         airport.value
  //           .toLowerCase()
  //           .includes(city.searchQueryOrigin.toLowerCase())) &&
  //       airport.value !== city.searchQueryDestination
  //   )
  // );
  useEffect(() => {
    if (Object?.keys(userData)?.length > 0 && userData?.home_airport) {
      setSearchQueryOrigin(userData?.home_airport?.match(/\((.*?)\)/)?.[1]);
      setOriginAirport(formatLabel(userData?.home_airport));
      setSearchQueryDestination(
        userData?.secondary_airports?.[0]?.match(/\((.*?)\)/)?.[1]
      );
      setDestinationAirport(formatLabel(userData?.secondary_airports?.[0]));
    } else {
      setOriginAirport("Dhaka (DAC)");
      setDestinationAirport("Cox's Bazar (CXB)");
      setSearchQueryOrigin("DAC");
      setSearchQueryDestination("CXB");
    }
  }, [userData]);

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
  const [classes, setClasses] = useState([
    { name: "Economy", price: 50, shortCode: "Y" },
    { name: "Premium Economy", price: 70, shortCode: "P" },
    { name: "Business", price: 100, shortCode: "C" },
    { name: "First Class", price: 150, shortCode: "F" },
  ]);

  // const filteredAirportsArrival = airportsData.filter(
  //   (airport) =>
  //     (airport.name
  //       .toLowerCase()
  //       .includes(searchQueryDestination?.toLowerCase()) ||
  //       airport.value
  //         .toLowerCase()
  //         .includes(searchQueryDestination?.toLowerCase()) ||
  //       airport.label
  //         .toLowerCase()
  //         .includes(searchQueryDestination?.toLowerCase())) &&
  //     airport.name.toLowerCase() !== searchQueryOrigin?.toLowerCase() &&
  //     airport.value.toLowerCase() !== searchQueryOrigin?.toLowerCase()
  // );

  // const filteredAirportsArrival = airportsData.filter((airport) => {
  //   const destinationQuery = searchQueryDestination?.toLowerCase() || "";
  //   const originQuery = searchQueryOrigin?.toLowerCase() || "";

  //   // If no destination query is provided, return no airports
  //   if (!destinationQuery) {
  //     return false;
  //   }

  //   return (
  //     airport.name.toLowerCase().includes(destinationQuery) ||
  //     airport.value.toLowerCase().includes(destinationQuery) ||
  //     airport.label.toLowerCase().includes(destinationQuery)
  //   );
  // });

  const [filteredAirportsArrival, setFilteredAirportsArrival] = useState([]);

  // const airDestinationData = airportsData.filter(
  //   (airport) =>
  //     airport.value.toLowerCase().includes(destinationQuery) || // Check short code
  //     airport.label.toLowerCase().includes(destinationQuery) || // Check label
  //     airport.name.toLowerCase().includes(destinationQuery) // Check name
  // );

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

  const handleSubmitRecentSearch = (item) => {
    if (item?.type === "multi") {
      // Handle multi-city search
      const updatedCities = item.legs.map((leg, index) => ({
        id: index + 1,
        searchQueryOrigin: leg.from,
        searchQueryDestination: leg.to,
        departureDate: leg.departure_date,
        isOpenOrigin: false,
        isOpenDestination: false,
        originAirport: leg.origin_airport || "",
        destinationAirport: leg.destination_airport || "",
      }));

      setCities(updatedCities); // Update the multi-city state
    } else {
      // Handle one-way and round-trip
      setOneWayDate(item?.legs[0]?.departure_date);
      setRoundDate({
        from: item?.legs[0]?.departure_date,
        to: item?.legs[0]?.arrival_date || null,
      });

      setSearchQueryOrigin(item?.legs[0]?.from);
      setSearchQueryDestination(item?.legs[0]?.to);
      setOriginAirport(item?.legs[0]?.origin_airport || "");
      setDestinationAirport(item?.legs[0]?.destination_airport || "");
    }

    // Update trip type, class, and passengers
    setSelectedWay(
      item?.type === "multi"
        ? "multi_city"
        : item?.type == "single"
        ? "one_way"
        : "return"
    );
    setSelectedClass(item?.legs[0]?.class);
    setPassengerInformation(item?.passengers);

    // Close dropdowns
    setIsOpenDestination(false);
    setIsOpenArrival(false);

    // Sync categories based on passengers
    if (item?.passengers && Array.isArray(item.passengers)) {
      const updatedCategories = categories.map((category) => {
        const matchingPassenger = item.passengers.find(
          (passenger) => passenger.type === category.type
        );
        return {
          ...category,
          count: matchingPassenger ? matchingPassenger.quantity : 0,
        };
      });
      setCategories(updatedCategories);
    }
  };

  const mutation = useMutation({
    mutationFn: (payload) =>
      fetchData("/gds/recent-searches", "POST", payload, token),
    onSuccess: (data) => {
      // toast.success(data?.message);
      setRecentSearchData(data?.data);
    },
    onError: (error) => {
      console.error("Mutation failed", error);
      // toast.error(error?.message);
    },
  });

  const mutationDelete = useMutation({
    mutationFn: () =>
      fetchData("/gds/recent-searches", "DELETE", undefined, token),
    onSuccess: (data) => {
      toast.success(data?.message);
      setRecentSearchData([]);
    },
    onError: (error) => {
      console.error("Mutation failed", error);
      toast.error(error?.message);
    },
  });

  const handleRecentSearchDelete = () => {
    if (token) {
      mutationDelete.mutate();
    } else {
      setRecentSearchData([]);
      toast.success("Recent searches data deleted successfully");
    }
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    setSelectedFlight({});
    setPassengerInformation([]);
    setContactInformation({});
    setOriginQuery("");
    setDestinationQuery("");
    setTravelPlanningDate("");
    setIsLoading(true);

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

    setOriginDestinationInformation(originDestinationInfo);

    // if (selectedWay === "multi_city") {
    //   if (transformedData.length < 2) {
    //     toast.error("You must select at least 2 cities.");
    //     setError("City selection is too few.");
    //     setLoading(false);
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

    if (!originalDate || isNaN(new Date(originalDate).getTime())) {
      toast.error("Please select a valid departure date.");
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

    if (selectedWay !== "multi_city" && !searchQueryOrigin) {
      toast.error("Please select a Origin location.");

      return;
    }

    if (selectedWay !== "multi_city" && !searchQueryDestination) {
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
      // const multi_cityData = transformMultiCityToArrayStructure(
      //   transformedData,
      //   passengers,
      //   selectedClass
      // );

      // setSearchData(multi_cityData);
    }

    const searchData = {
      origin: searchQueryOrigin,
      destination: searchQueryDestination,
      tripType: selectedWay,
      class: selectedClass,
      passengers: passengers,
      journeyDate: originalDate,
      returnDate: selectedWay == "one_way" ? "" : originalArrivalData,
    };
    setSearchData(searchData);

    const recentSearch =
      selectedWay === "multi_city"
        ? {
            type: "multi",
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
            type: selectedWay === "one_way" ? "single" : "round",
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

    const isDuplicate = recentSearchData?.some((search) => {
      // Check the type and the "from" and "to" values of the first leg (index 0)
      const legsMatch =
        search.type === recentSearch.type &&
        search.legs[0]?.from === recentSearch.legs[0]?.from &&
        search.legs[0]?.to === recentSearch.legs[0]?.to &&
        search?.legs[0]?.departure_date ===
          recentSearch?.legs[0]?.departure_date;

      return legsMatch;
    });

    if (!isDuplicate) {
      if (token) {
        mutation.mutate(recentSearch);
      } else {
        const updatedRecentSearches = [recentSearch, ...recentSearchData].slice(
          0,
          5
        );
        setRecentSearchData(updatedRecentSearches);
      }
    }

    setOriginQuery(searchQueryOrigin);
    setDestinationQuery(searchQueryDestination);
    // setTravelPlanningDate(originalDate);
    setDestinationAirportName(destinationAirport);
    setOriginAirportName(originAirport);

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
    const temp = searchQueryOrigin;
    setSearchQueryOrigin(searchQueryDestination);
    setOriginAirport(destinationAirport);
    setDestinationAirport(tempLocation);
    setSearchQueryDestination(temp);
  };
  const handleClear = () => {
    setSearchQueryOrigin("");
    setOriginAirport("");
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

  const handleClearArrival = () => {
    setSearchQueryDestination("");
    setDestinationAirport("");
  };

  const handleClearAllMultiCity = () => {
    setCities([
      {
        id: 1,
        searchQueryOrigin: "",
        searchQueryDestination: "",
        departureDate: null,
        isOpenOrigin: false,
        isOpenDestination: false,
        originAirport: "",
        destinationAirport: "",
      },
      {
        id: 2,
        searchQueryOrigin: "",
        searchQueryDestination: "",
        departureDate: null,
        isOpenOrigin: false,
        isOpenDestination: false,
        originAirport: "",
        destinationAirport: "",
      },
      {
        id: 3,
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


  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#FF6810] z-50">
        <img
          src={"/ticketing.gif"}
          alt="Loading..."
          className="w-48 md:w-64 h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div>
      {/* <Loading loading={isLoading} /> */}
      <main>
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
                        className={`px-5 py-2 hover:bg-[#F0F3F5] ${
                          selectedWay == way?.shortCode
                            ? "bg-[#F0F3F5] font-bold"
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
                        className={`px-5 py-2 hover:bg-[#F0F3F5] ${
                          selectedClass == cls?.shortCode
                            ? "bg-[#F0F3F5] font-bold"
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
                    <div className="relative" id={`origin-dropdown-${index}`}>
                      <div onClick={() => toggleField(row.id, "isOpenOrigin")}>
                        {/* <p
                          className={`text-[14px] absolute right-6 truncate left-[40px] top-1/2 transform -translate-y-1/2 ${
                            row?.originAirport == "" ||
                            row?.originAirport == undefined ||
                            row.searchQueryOrigin == "" ||
                            row.searchQueryOrigin == undefined
                              ? ""
                              : "border border-white bg-white px-1 py-0.5 hover:border-black rounded-md transition-all duration-300"
                          }`}
                        >
                          {row?.originAirport !== "" ? row?.originAirport : ""}
                          <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer">
                            <FaTimes onClick={() => handleClearMulti(row.id)} />
                          </span>
                        </p> */}
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
                                  onClick={() => handleClearMulti(row.id)}
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
                        originalDate={row.departureDate}
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
                  <button
                    type="button"
                    className="text-gray-500"
                    onClick={handleClearAllMultiCity}
                  >
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
                      className="relative w-full"
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
                                <FaTimes onClick={handleClear} />
                              </span>
                            </>
                          )}
                        </p>

                        <input
                          value={searchQueryOrigin}
                          type="text"
                          onChange={(e) => setSearchQueryOrigin(e.target.value)}
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
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md absolute top-16 w-[591px] max-h-[700px] z-10 ">
                          <div className="p-6 max-h-[300px] overflow-y-auto">
                            <ul className="space-y-4">
                              {filteredAirportsDestination.map(
                                (destination, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-lg"
                                    onClick={() => {
                                      setSearchQueryOrigin(destination.value);
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

                          {recentSearchData?.length > 0 ? (
                            <div className="p-8">
                              <h3 className="text-xs font-semibold mb-4 flex justify-between items-center">
                                Recent Searches
                                <button
                                  type="button"
                                  onClick={() => handleRecentSearchDelete()}
                                  className="text-[#4A8DBB] hover:text-[#3b7aa3] font-bold"
                                >
                                  Clear
                                </button>
                              </h3>
                              <ul className="space-y-4 max-h-[200px] overflow-y-auto">
                                {recentSearchData?.map((recent, index) => (
                                  <li
                                    key={index}
                                    onClick={() =>
                                      handleSubmitRecentSearch(recent)
                                    }
                                    className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                  >
                                    <div className="bg-[#FFF3EB] p-4 rounded-lg">
                                      <Airplane />
                                    </div>
                                    <div>
                                      {/* <p className="font-semibold capitalize">
                                        {recent?.type} Trip
                                      </p> */}
                                      {recent?.legs.map((leg, legIndex) => (
                                        <div key={legIndex}>
                                          <p className="font-semibold text-[14px]">
                                            {leg?.from} → {leg?.to}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {moment(leg?.departure_date).format(
                                              "MMMM Do, YYYY"
                                            )}

                                            {leg?.arrival_date && (
                                              <>
                                                <span> - </span>

                                                {moment(
                                                  leg?.arrival_date
                                                ).format("MMMM Do, YYYY")}
                                              </>
                                            )}
                                          </p>
                                        </div>
                                      ))}
                                      {/* <p className="text-sm text-gray-500">
                                        {recent?.passengers
                                          ?.map(
                                            (pax) =>
                                              `${pax.quantity} ${pax.type}`
                                          )
                                          .join(", ")}
                                      </p> */}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            ""
                          )}

                          {!token && (
                            <div className="px-8 pb-8 ">
                              <div className="space-y-4 max-h-[200px] overflow-y-auto">
                                <Link
                                  href={"/login"}
                                  // onClick={() =>
                                  //   handleSubmitRecentSearch(recent)
                                  // }

                                  className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                >
                                  <div className="bg-[#FFF3EB] p-4 rounded-lg">
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
                      className="py-3 px-4 bg-[#F0F3F5] rounded-md hover:bg-[#d9e2e8]"
                    >
                      <ArrowLeftRightIcon
                        size={25}
                        strokeWidth={3}
                        className="text-black"
                      />
                    </button>
                    <div className="relative w-full" ref={dropdownRefArrival}>
                      <div onClick={() => setIsOpenArrival(true)}>
                        {/* <p
                          className={`text-[14px] absolute right-6 truncate  top-1/2 transform -translate-y-1/2  max-w-fit pe-6 ${
                            destinationAirport == "" ||
                            destinationAirport == undefined
                              ? // ||
                                // searchQueryDestination == undefined ||
                                // searchQueryDestination == ""
                                ""
                              : "border border-white bg-white px-1 py-0.5 left-[20px] hover:border-black rounded-[3px] transition-all duration-300 leading-[20px]"
                          }`}
                        >
                          {destinationAirport !== "" ? destinationAirport : ""}
                          <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer px-1 py-3 ">
                            <FaTimes onClick={handleClearArrival} />
                          </span>
                        </p> */}

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
                                <FaTimes onClick={handleClearArrival} />
                              </span>
                            </>
                          )}
                        </p>
                        <input
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
                        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[700px] z-10">
                          <div className="p-6 max-h-[300px] overflow-y-auto">
                            <ul className="space-y-4">
                              {filteredAirportsArrival.map((arrival, index) => (
                                <li
                                  key={index}
                                  className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-lg"
                                  onClick={() => {
                                    setSearchQueryDestination(arrival.value);
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
                              ))}
                            </ul>
                          </div>
                          {recentSearchData?.length > 0 ? (
                            <div className="p-8">
                              <h3 className="text-xs font-semibold mb-4 flex justify-between items-center">
                                Recent Searches
                                <button
                                  type="button"
                                  onClick={() => handleRecentSearchDelete()}
                                  className="text-[#4A8DBB] hover:text-[#3b7aa3] font-bold"
                                >
                                  Clear
                                </button>
                              </h3>
                              <ul className="space-y-4 max-h-[200px] overflow-y-auto">
                                {recentSearchData?.map((recent, index) => (
                                  <li
                                    key={index}
                                    onClick={() =>
                                      handleSubmitRecentSearch(recent)
                                    }
                                    className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                  >
                                    <div className="bg-[#FFF3EB] p-4 rounded-lg">
                                      <Airplane />
                                    </div>
                                    <div>
                                      {/* <p className="font-semibold capitalize">
                                        {recent?.type} Trip
                                      </p> */}
                                      {recent?.legs?.map((leg, legIndex) => (
                                        <div key={legIndex}>
                                          <p className="font-semibold text-[14px]">
                                            {leg?.from} → {leg?.to}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {moment(leg?.departure_date).format(
                                              "MMMM Do, YYYY"
                                            )}

                                            {leg?.arrival_date && (
                                              <>
                                                <span> - </span>

                                                {moment(
                                                  leg?.arrival_date
                                                ).format("MMMM Do, YYYY")}
                                              </>
                                            )}
                                          </p>
                                        </div>
                                      ))}
                                      {/* <p className="text-sm text-gray-500">
                                        {recent?.passengers
                                          ?.map(
                                            (pax) =>
                                              `${pax.quantity} ${pax.type}`
                                          )
                                          .join(", ")}
                                      </p> */}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            ""
                          )}
                          {!token && (
                            <div className="px-8 pb-8 ">
                              <div className="space-y-4 max-h-[200px] overflow-y-auto">
                                <Link
                                  href={"/login"}
                                  // onClick={() =>
                                  //   handleSubmitRecentSearch(recent)
                                  // }

                                  className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                >
                                  <div className="bg-[#FFF3EB] p-4 rounded-lg">
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

                  <div className="col-span-2 flex gap-2 justify-between">
                    <DatePickerOneWay
                      className={"w-full"}
                      originalDate={originalDate}
                      setOneWayDate={setOneWayDate}
                      oneWayDate={oneWayDate}
                    />

                    {/* <Link href={"/search-result"}> */}
                    <button
                      className="rounded-[10px] bg-[#FC660F] p-4 h-full hover:bg-[#d67136]"
                      type="submit"
                    >
                      <div className="flex justify-center items-center w-full gap-2">
                        <SearchIcon />
                        {/* <p className="text-white font-bold">Search</p> */}
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
                        className="relative w-full"
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
                                  <FaTimes onClick={handleClear} />
                                </span>
                              </>
                            )}
                          </p>
                          <input
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
                          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[700px] z-10 ">
                            <div className="p-6 max-h-[300px] overflow-y-auto">
                              <ul className="space-y-4">
                                {filteredAirportsDestination.map(
                                  (destination, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center space-x-4 hover:bg-[#f0f3f5] p-3 rounded-md cursor-pointer"
                                      onClick={() => {
                                        setSearchQueryOrigin(destination.value);
                                        setOriginAirport(destination.label);
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
                                      <Checkbox className="bg-white rounded-[4px] shadow-none border border-gray-400" />
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                            {recentSearchData?.length > 0 ? (
                              <div className="p-8">
                                <h3 className="text-xs font-semibold mb-4 flex justify-between items-center">
                                  Recent Searches
                                  <button
                                    type="button"
                                    onClick={() => handleRecentSearchDelete()}
                                    className="text-[#4A8DBB] hover:text-[#3b7aa3] font-bold"
                                  >
                                    Clear
                                  </button>
                                </h3>
                                <ul className="space-y-4 max-h-[200px] overflow-y-auto">
                                  {recentSearchData?.map((recent, index) => (
                                    <li
                                      key={index}
                                      onClick={() =>
                                        handleSubmitRecentSearch(recent)
                                      }
                                      className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                    >
                                      <div className="bg-[#FFF3EB] p-4 rounded-lg">
                                        <Airplane />
                                      </div>
                                      <div>
                                        {/* <p className="font-semibold capitalize">
                                        {recent?.type} Trip
                                      </p> */}
                                        {recent?.legs.map((leg, legIndex) => (
                                          <div key={legIndex}>
                                            <p className="font-semibold text-[14px]">
                                              {leg?.from} → {leg?.to}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {moment(
                                                leg?.departure_date
                                              ).format("MMMM Do, YYYY")}

                                              {leg?.arrival_date && (
                                                <>
                                                  <span> - </span>

                                                  {moment(
                                                    leg?.arrival_date
                                                  ).format("MMMM Do, YYYY")}
                                                </>
                                              )}
                                            </p>
                                          </div>
                                        ))}
                                        {/* <p className="text-sm text-gray-500">
                                        {recent?.passengers
                                          ?.map(
                                            (pax) =>
                                              `${pax.quantity} ${pax.type}`
                                          )
                                          .join(", ")}
                                      </p> */}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              ""
                            )}
                            {!token && (
                              <div className="px-8 pb-8 ">
                                <div className="space-y-4 max-h-[200px] overflow-y-auto">
                                  <Link
                                    href={"/login"}
                                    // onClick={() =>
                                    //   handleSubmitRecentSearch(recent)
                                    // }

                                    className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                  >
                                    <div className="bg-[#FFF3EB] p-4 rounded-lg">
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
                        className="py-3 px-4 bg-[#F0F3F5] rounded-md hover:bg-[#d9e2e8] "
                      >
                        <ArrowLeftRightIcon
                          size={25}
                          strokeWidth={3}
                          className="text-black"
                        />
                      </button>
                      <div className="relative w-full" ref={dropdownRefArrival}>
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
                                  <FaTimes onClick={handleClearArrival} />
                                </span>
                              </>
                            )}
                          </p>
                          <input
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
                          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
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

                              {recentSearchData?.length > 0 ? (
                                <div className="p-8">
                                  <h3 className="text-xs font-semibold mb-4 flex justify-between items-center">
                                    Recent Searches
                                    <button
                                      type="button"
                                      onClick={() => handleRecentSearchDelete()}
                                      className="text-[#4A8DBB] hover:text-[#3b7aa3] font-bold"
                                    >
                                      Clear
                                    </button>
                                  </h3>
                                  <ul className="space-y-4 max-h-[200px] overflow-y-auto">
                                    {recentSearchData?.map((recent, index) => (
                                      <li
                                        key={index}
                                        onClick={() =>
                                          handleSubmitRecentSearch(recent)
                                        }
                                        className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                      >
                                        <div className="bg-[#FFF3EB] p-4 rounded-lg">
                                          <Airplane />
                                        </div>
                                        <div>
                                          {/* <p className="font-semibold capitalize">
                                        {recent?.type} Trip
                                      </p> */}
                                          {recent?.legs.map((leg, legIndex) => (
                                            <div key={legIndex}>
                                              <p className="font-semibold text-[14px]">
                                                {leg?.from} → {leg?.to}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                {moment(
                                                  leg?.departure_date
                                                ).format("MMMM Do, YYYY")}

                                                {leg?.arrival_date && (
                                                  <>
                                                    <span> - </span>

                                                    {moment(
                                                      leg?.arrival_date
                                                    ).format("MMMM Do, YYYY")}
                                                  </>
                                                )}
                                              </p>
                                            </div>
                                          ))}
                                          {/* <p className="text-sm text-gray-500">
                                        {recent?.passengers
                                          ?.map(
                                            (pax) =>
                                              `${pax.quantity} ${pax.type}`
                                          )
                                          .join(", ")}
                                      </p> */}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                ""
                              )}
                              {!token && (
                                <div className="px-8 pb-8 ">
                                  <div className="space-y-4 max-h-[200px] overflow-y-auto">
                                    <Link
                                      href={"/login"}
                                      // onClick={() =>
                                      //   handleSubmitRecentSearch(recent)
                                      // }

                                      className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 rounded-md"
                                    >
                                      <div className="bg-[#FFF3EB] p-4 rounded-lg">
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
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-span-2 flex gap-2 justify-between">
                      <div>
                        <DatePicker
                          originalDate={originalDate}
                          originalArrivalData={originalArrivalData}
                          setRoundDate={setRoundDate}
                          roundDate={roundDate}
                        />
                      </div>

                      <button
                        className="rounded-[10px] bg-[#FC660F] p-4 h-full hover:bg-[#d67136]"
                        type="submit"
                      >
                        <div className="flex justify-center items-center w-full gap-2">
                          <SearchIcon />
                          {/* <p className="text-white font-bold">Search</p> */}
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
