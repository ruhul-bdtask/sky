"use client";
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Cookies from "js-cookie";
import { fetchData } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import airportsData from "../../../../public/utils/airports.json";
import { toast } from "react-toastify";
import useAirlineStore from "../../../../stores/airlineStore";

export default function Preferences({ userDataLoading }) {
  const token = Cookies.get("auth-token");
  const { setUserData, userData } = useAirlineStore();

  const [homeAirport, setHomeAirport] = useState("");
  const [secondaryAirports, setSecondaryAirports] = useState([]);
  const [tempInput, setTempInput] = useState("");
  const [tempInputHome, setTempInputHome] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRefHome = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setHomeAirport(userData?.home_airport);
      setSecondaryAirports(userData?.secondary_airports);
    }
  }, [userData]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      fetchData("/user/update-user-preferences", "POST", payload, token),
    onSuccess: (data) => {
      setIsLoading(false);
      toast.success(data?.message);
      setUserData(data?.data);
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    });
  };

  const handleSelection = (airport) => {
    if (
      secondaryAirports?.length < 3 &&
      !secondaryAirports?.includes(airport.label)
    ) {
      setSecondaryAirports([...secondaryAirports, airport.label]);
    } else {
      toast.error("You can only select up to 3 secondary airports");
    }
    setTempInput("");
    setDropdownOpen(false);
  };

  const handleSelectionHome = (airport) => {
    console.log(airport);
    setHomeAirport(airport.label);

    setTempInputHome("");
    setHomeDropdownOpen(false);
  };

  const removeSecondaryAirport = (airport) => {
    setSecondaryAirports(secondaryAirports?.filter((item) => item !== airport));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#FC660F] z-50">
        <img
          src={"/ticketing.gif"}
          alt="Loading..."
          className="w-48 md:w-64 h-full object-contain"
        />
      </div>
    );
  }

  return (
    <section>
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
              placeholder="Search for airports"
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
              placeholder="Search for airports"
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
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
