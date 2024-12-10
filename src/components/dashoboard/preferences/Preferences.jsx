"use client";
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Cookies from "js-cookie";
import { fetchData } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import airportsData from "../../../../public/utils/airports.json";
import { toast } from "react-toastify";

export default function Preferences() {
  const token = Cookies.get("auth-token");
  const [homeAirport, setHomeAirport] = useState();
  const [tempSecondaryAir, setTempSecondaryAir] = useState("");
  const [tempHomeAirport, setTempHomeAirport] = useState("");
  const [secondaryAirports, setSecondaryAirports] = useState([]);
  const [homeOpen, setHomeOpen] = useState(false);
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const dropdownRefHome = useRef(null);
  const dropdownRefSecondary = useRef(null);

  const userToken = {
    document_type: "NID",
  };

  const {
    data: userData,
    error: userDataError,
    isLoading: userDataLoading,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: ["user", userToken],
    queryFn: () => fetchData("/user/me", "POST", userToken, token),
    enabled: true,
  });

  const mutation = useMutation({
    mutationFn: (payload) =>
      fetchData("/user/update-user-preferences", "POST", payload, token),
    onSuccess: (data) => {
      console.log("Mutation successful", data);
      toast.success(data?.message);
    },
    onError: (error) => {
      console.error("Mutation failed", error);
      toast.error(error?.message);
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefHome.current &&
        !dropdownRefHome.current.contains(event.target)
      ) {
        setHomeOpen(false);
      }
      if (
        dropdownRefSecondary.current &&
        !dropdownRefSecondary.current.contains(event.target)
      ) {
        setSecondaryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      home_airport: homeAirport,
      secondary_airports: secondaryAirports,
    };

    if (
      !payload?.home_airport ||
      payload?.secondary_airports.length === 0 ||
      payload?.home_airport == ""
    ) {
      toast.error(
        "Please provide home airport and at least one secondary airport"
      );
      return;
    } else {
      mutation.mutate(payload);
    }
  };

  const removeSecondaryAir = (airport) => {
    setSecondaryAirports(secondaryAirports.filter((item) => item != airport));
  };

  const [homeAirportsSuggestions, setHomeAirportsSuggestions] = useState();
  const [secondaryAirportsSuggestions, setSecondaryAirportsSuggestions] =
    useState();

  useEffect(() => {
    const filter = airportsData.filter(
      (item) =>
        item.label.toLowerCase().includes(tempHomeAirport?.toLowerCase()) ||
        item.name.toLowerCase().includes(tempHomeAirport?.toLowerCase())
    );

    setHomeAirportsSuggestions(filter);
  }, [tempHomeAirport]);

  useEffect(() => {
    const filter = airportsData.filter(
      (item) =>
        item.label.toLowerCase().includes(tempSecondaryAir.toLowerCase()) ||
        item.name.toLowerCase().includes(tempSecondaryAir.toLowerCase())
    );

    setSecondaryAirportsSuggestions(filter);
  }, [tempSecondaryAir]);

  return (
    <section>
      {userDataLoading ? (
        <>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2">Loading...</p>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full mx-auto flex flex-col gap-10 ">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-10"
          >
            <h2 className="text-[20px] font-semibold text-black mb-2">
              Airports
            </h2>
            <p className="text-[14px] text-black mb-6">
              Search for flights more easily by saving your home airport and
              other airports you travel through often.
            </p>

            <div className="mb-6">
              <div className="inline-flex items-center bg-[#363F45] text-white text-[16px] font-semibold rounded px-2 py-3 mb-4">
                <span>
                  {homeAirport ? homeAirport : userData?.data?.home_airport}
                </span>
                {/* <button
                  type="button"
                  className="ml-2 focus:outline-none"
                  onClick={() => (setHomeAirport(""), setTempHomeAirport(""))}
                >
                  <X size={16} />
                </button> */}
              </div>

              <div className="relative" ref={dropdownRefHome}>
                <div onClick={() => setHomeOpen(!homeOpen)}>
                  <input
                    type="text"
                    onChange={(e) => setTempHomeAirport(e.target.value)}
                    placeholder="Search for alternative airports"
                    className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none "
                  />
                </div>
                {homeOpen ? (
                  <div className="max-w-md mx-auto bg-white rounded-xl shadow-md absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
                    <div className="p-8 ">
                      <ul className="space-y-4">
                        {homeAirportsSuggestions.map((destination, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-4 cursor-pointer"
                            onClick={() => {
                              setHomeAirport(destination.label);
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
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="w-full">
              <h3 className="text-[16px] font-medium text-black mb-2">
                Secondary airports
              </h3>
              <div className="flex gap-4 mb-2 overflow-x-auto w-full flex-wrap">
                {secondaryAirports?.length > 0
                  ? secondaryAirports?.map((airport, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-[#363F45] text-white text-[16px] font-semibold rounded px-2 py-3 "
                      >
                        <span>{airport}</span>
                      </div>
                    ))
                  : userData?.data?.secondary_airports?.map(
                      (airport, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-[#363F45] text-white text-[16px] font-semibold rounded px-2 py-3"
                        >
                          <span>{airport}</span>
                          {/* <button
                      type="button"
                      className="ml-2 focus:outline-none"
                      onClick={() => removeSecondaryAir(airport)}
                    >
                      <X size={16} />
                    </button> */}
                        </div>
                      )
                    )}
              </div>
              {/* <input
              type="text"
              value={tempSecondaryAir}
              onChange={(e) => setTempSecondaryAir(e.target.value)}
              placeholder="Search for alternative airports"
              className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none "
            /> */}
              <div className="relative" ref={dropdownRefSecondary}>
                <div onClick={() => setSecondaryOpen(!secondaryOpen)}>
                  <input
                    type="text"
                    disabled={secondaryAirports?.length > 2}
                    onChange={(e) => setTempSecondaryAir(e.target.value)}
                    placeholder="Search for alternative airports"
                    className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none "
                  />
                </div>
                {secondaryOpen ? (
                  <div className="max-w-md mx-auto bg-white rounded-xl shadow-md   absolute top-16 w-[591px] max-h-[600px] z-10 overflow-y-auto">
                    <div className="p-8 ">
                      <ul className="space-y-4">
                        {secondaryAirportsSuggestions.map(
                          (destination, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-4 cursor-pointer"
                              onClick={() => {
                                if (secondaryAirports.length == 0) {
                                  setSecondaryAirports([destination?.label]);
                                  setSecondaryOpen(false);
                                } else {
                                  setSecondaryAirports([
                                    ...secondaryAirports,
                                    destination?.label,
                                  ]);
                                  setSecondaryOpen(false);
                                }
                                setTempSecondaryAir("");
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
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <button
              className="rounded-[5px] bg-[#FC660F]  hover:bg-[#d67136] text-white p-3 mt-4"
              type="submit"
            >
              Submit
            </button>
          </form>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
            <h2 className="text-[16px] font-semibold text-black mb-2">
              Airlines
            </h2>
            <p className="text-[14px] text-[#686868] mb-6">
              Get better search results by adding your airlines preferences.
            </p>

            <div>
              <h3 className="text-[16px] font-semibold text-black mb-2">
                Avoid
              </h3>
              <p className="text-[14px] text-[#686868]">
                These will show up lower in the results
              </p>
              <input
                type="text"
                placeholder="Search airlines"
                className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none "
              />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
            <h2 className="text-[16px] font-semibold text-black mb-2">
              Hotel chains
            </h2>
            <p className="text-[14px] text-[#686868] mb-6">
              Get better search results by adding your hotel chains preferences.
            </p>

            <div>
              <h3 className="text-[16px] font-semibold text-black mb-2">
                Preferred
              </h3>
              <p className="text-[14px] text-[#686868] ">
                These will show up higher in the results
              </p>
              <input
                type="text"
                placeholder="Search Hotel Chains"
                className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none "
              />
            </div>
            <div className="pt-6">
              <h3 className="text-[16px] font-semibold text-black mb-2">
                Avoid
              </h3>
              <p className="text-[14px] text-[#686868] ">
                These will show up lower in the results
              </p>
              <input
                type="text"
                placeholder="Search Hotel Chains"
                className="w-full md:w-[50%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none "
              />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
            <h2 className="text-[16px]  font-semibold text-black mb-2">
              Saved places
            </h2>
            <p className="text-[14px] text-[#686868] mb-6">
              Choose from your saved places to narrow your search to nearby
              hotels and hire
            </p>

            <p className="text-[#007799] text-[14px] font-semibold cursor-pointer">
              Add a place
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
