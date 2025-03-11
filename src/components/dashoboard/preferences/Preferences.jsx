"use client";
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Cookies from "js-cookie";
import { fetchData } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import airportsData from "../../../../public/utils/airports.json";
import airlinesData from "../../../../public/utils/airlines.json";

import { toast } from "react-toastify";
import useAirlineStore from "../../../../stores/airlineStore";
import Loading from "@/components/loader/Loading";
import LoadingFixed from "@/components/loader/LoadingFixed";
import Select from "react-select";
import { useRouter } from "next/navigation";
export default function Preferences({ userDataLoading }) {
  const token = Cookies.get("auth-token");
  const { setUserData, userData } = useAirlineStore();
  const router = useRouter();
  const [homeAirport, setHomeAirport] = useState("");
  const [secondaryAirports, setSecondaryAirports] = useState([]);
  const [avoidAirlines, setAvoidAirlines] = useState([]);

  const [tempInput, setTempInput] = useState("");
  const [tempInputHome, setTempInputHome] = useState("");
  const [tempInputAvoid, setTempInputAvoid] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [avoidSuggestions, setAvoidSuggestions] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const [avoidDropdownOpen, setAvoidDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const dropdownRefHome = useRef(null);
  const dropdownRefAvoid = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setHomeAirport(userData?.home_airport);
      setSecondaryAirports(
        userData?.secondary_airports !== null
          ? userData?.secondary_airports
          : []
      );
      setAvoidAirlines(
        userData?.avoid_airports !== null ? userData?.avoid_airports : []
      );
    }
  }, [userData]);


  const mutation = useMutation({
    mutationFn: (payload) =>
      fetchData("/user/update-user-preferences", "POST", payload, token),
    onSuccess: (data) => {
      setIsLoading(false);
      toast.success(data?.message);
      setUserData(data?.data);
      if (data?.error == 30001) {
        router.push("/login");
      }
    },
    onError: (error) => {
      setIsLoading(false);

      console.error("Mutation failed", error);
      toast.error(error?.message);
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        dropdownRefHome.current &&
        !dropdownRefHome.current.contains(event.target)
      ) {
        setHomeDropdownOpen(false);
      }
      if (
        dropdownRefAvoid.current &&
        !dropdownRefAvoid.current.contains(event.target)
      ) {
        setAvoidDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // {
  //   "id": "2183",
  //   "name": "Emirates",
  //   "alias": "Emirates Airlines",
  //   "iata": "EK",
  //   "icao": "UAE",
  //   "callsign": "EMIRATES",
  //   "country": "United Arab Emirates",
  //   "active": "Y"
  // },

  useEffect(() => {
    if (tempInput) {
      const filtered = airportsData.filter(
        (item) =>
          item.label.toLowerCase().includes(tempInput.toLowerCase()) ||
          item.name.toLowerCase().includes(tempInput.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [tempInput]);

  useEffect(() => {
    if (tempInputAvoid) {
      const filtered = airlinesData.filter(
        (item) =>
          item.iata.toLowerCase().includes(tempInputAvoid.toLowerCase()) ||
          item.name.toLowerCase().includes(tempInputAvoid.toLowerCase())
      );
      setAvoidSuggestions(filtered);
    } else {
      setAvoidSuggestions([]);
    }
  }, [tempInputAvoid]);


  useEffect(() => {
    if (tempInputHome) {
      const filtered = airportsData.filter(
        (item) =>
          item.label.toLowerCase().includes(tempInput.toLowerCase()) ||
          item.name.toLowerCase().includes(tempInput.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [tempInputHome]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!homeAirport) {
      toast.error("Please select a home airport");
      return;
    }
    if (secondaryAirports?.length === 0) {
      toast.error("Please add at least one secondary airport");
      return;
    }
    setIsLoading(true);
    mutation.mutate({
      home_airport: homeAirport,
      secondary_airports: secondaryAirports,
      avoid_airports: avoidAirlines,
    });
  };

  const handleSelection = (airport) => {
    const isDuplicate = secondaryAirports.some((a) => a === airport.label);

    if (!isDuplicate) {
      setSecondaryAirports([...secondaryAirports, airport.label]);
    }

    setTempInput("");
    setDropdownOpen(false);
  };
  const handleSelectionAvoid = (airline) => {
    // Check if the airline already exists in the avoidAirlines array
    const isDuplicate = avoidAirlines.some((a) => a.value === airline.iata);

    if (!isDuplicate) {
      setAvoidAirlines([
        ...avoidAirlines,
        {
          value: airline.iata,
          label: airline.name,
        },
      ]);
    }

    setTempInputAvoid("");
    setAvoidDropdownOpen(false);
  };

  const handleSelectionHome = (airport) => {
    setHomeAirport(airport.label);

    setTempInputHome("");
    setHomeDropdownOpen(false);
  };

  const removeSecondaryAirport = (airport) => {
    setSecondaryAirports(secondaryAirports?.filter((item) => item !== airport));
  };
  const removeAirlines = (airline) => {
    setAvoidAirlines(avoidAirlines?.filter((item) => item?.value !== airline));
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
    <section className="flex flex-col gap-5">
      {/* {isLoading && <LoadingFixed />} */}
      <div className="w-full mx-auto flex flex-col gap-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-10"
        >
          <h2 className="text-[20px] font-semibold text-black mb-2">
            Airports
          </h2>
          <p className="text-[14px] text-black mb-6">
            Save your preferred airports for easier flight searches.
          </p>

          <div className="">
            <h3 className="text-[16px] font-medium text-black mb-2">
              Home Airport
            </h3>
            {homeAirport && (
              <div className="inline-flex items-center bg-[#363F45] text-white text-[16px] font-semibold rounded px-2 py-3 mb-4">
                <span>{homeAirport}</span>
              </div>
            )}
          </div>
          <div className="relative" ref={dropdownRefHome}>
            <input
              type="text"
              value={tempInputHome}
              onChange={(e) => setTempInputHome(e.target.value)}
              onFocus={() => setHomeDropdownOpen(true)}
              placeholder="Search for airports eg. DAC, DXB"
              className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
            />
            {homeDropdownOpen && suggestions.length > 0 && (
              <div className="max-w-md mx-auto bg-white rounded-xl shadow-md absolute top-12 w-[591px] max-h-[300px] z-10 overflow-y-auto">
                <ul className="p-4 space-y-2">
                  {suggestions.map((airport, index) => (
                    <li
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={() => handleSelectionHome(airport)}
                    >
                      <p className="font-semibold">
                        {airport.name}, {airport.value}
                      </p>
                      <p className="text-sm text-gray-500">{airport.label}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <h3 className="text-[16px] font-medium text-black mt-4 mb-2">
            Secondary Airports
          </h3>
          <div className="flex gap-4 mb-4 overflow-x-auto w-full flex-wrap">
            {secondaryAirports?.map((airport, index) => (
              <div
                key={index}
                className="flex items-center bg-[#363F45] text-white text-[16px] font-semibold rounded px-2 py-3"
              >
                <span>{airport}</span>
                <button
                  type="button"
                  className="ml-2"
                  onClick={() => removeSecondaryAirport(airport)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              value={tempInput}
              onChange={(e) => setTempInput(e.target.value)}
              onFocus={() => setDropdownOpen(true)}
              placeholder="Search for airports eg. DAC, DXB"
              className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
            />
            {dropdownOpen && suggestions.length > 0 && (
              <div className="max-w-md mx-auto bg-white rounded-xl shadow-md absolute top-12 w-[591px] max-h-[300px] z-10 overflow-y-auto">
                <ul className="p-4 space-y-2">
                  {suggestions.map((airport, index) => (
                    <li
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={() => handleSelection(airport)}
                    >
                      <p className="font-semibold">
                        {airport.name}, {airport.value}
                      </p>
                      <p className="text-sm text-gray-500">{airport.label}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            className="rounded-[5px] bg-[#FC660F] hover:bg-[#d67136] text-white p-3 mt-4"
            type="submit"
          >
            Save
          </button>
        </form>
      </div>
      <div className="w-full mx-auto flex flex-col gap-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-10"
        >
          <h2 className="text-[20px] font-semibold text-black mb-2">
            Avoid airlines
          </h2>
          {/* <p className="text-[14px] text-black mb-6">
            Save your preferred airports for easier flight searches.
          </p> */}

          <h3 className="text-[16px] font-medium text-black mt-4 mb-2">
            Airlines names
          </h3>
          <div className="flex gap-4 mb-4 overflow-x-auto w-full flex-wrap">
            {avoidAirlines?.map((airline, index) => (
              <div
                key={index}
                className="flex items-center bg-[#363F45] text-white text-[16px] font-semibold rounded px-2 py-3"
              >
                <span>{airline?.label + ` (${airline?.value})`} </span>
                <button
                  type="button"
                  className="ml-2"
                  onClick={() => removeAirlines(airline?.value)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="relative" ref={dropdownRefAvoid}>
            <input
              type="text"
              value={tempInputAvoid}
              onChange={(e) => setTempInputAvoid(e.target.value)}
              onFocus={() => setAvoidDropdownOpen(true)}
              placeholder="Search for airlines eg. EK, BG"
              className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
            />
            {avoidDropdownOpen && avoidSuggestions.length > 0 && (
              <div className="max-w-md mx-auto bg-white rounded-xl shadow-md absolute top-12 w-[591px] max-h-[300px] z-10 overflow-y-auto">
                <ul className="p-4 space-y-2">
                  {avoidSuggestions.map((airline, index) => (
                    <li
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={() => handleSelectionAvoid(airline)}
                    >
                      <p className="font-semibold">
                        {airline.name}, {airline.value}
                      </p>
                      <p className="text-sm text-gray-500">{airline.label}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            className="rounded-[5px] bg-[#FC660F] hover:bg-[#d67136] text-white p-3 mt-4"
            type="submit"
          >
            Save
          </button>
        </form>
      </div>
    </section>
  );
}
