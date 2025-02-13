"use client";
import TripsList from "@/components/tripsList/TripsList";
import RightIcon from "@/public/icons/RightIcon";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import useAirlineStore from "../../../stores/airlineStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import SavedTripsList from "@/components/tripsList/SavedTripLits";
import { useAirlines } from "@/hooks/useAirlines";
export default function Page() {
  const { token, setToken, savedTrips, setSavedTrips, setSelectedSavedTrip } =
    useAirlineStore();
  const router = useRouter();
  const { airlinesData } = useAirlines();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = Cookies.get("auth-token");

      if (!authToken) {
        if (savedTrips?.length > 0 && savedTrips[0]?.id) {
          setSavedTrips([]);
          setSelectedSavedTrip([]);
        }
        Cookies.remove("auth-token");
        setToken(null);
        router.push("/login");
        return;
      }
    };

    checkAuth();
  }, [token]);

  const {
    data: allPnrData,
    error: allPnrDataError,
    isLoading: allPnrDataLoading = true,
    refetch: allPnrDataRefetch,
  } = useQuery({
    queryKey: ["user-pnr-list", token],
    queryFn: () => fetchData("/gds/get-user-pnr-list", "GET", undefined, token),
    enabled: false,
  });

  const {
    data: allSavedFlights,
    error: allSavedFlightsError,
    isLoading: allSavedFlightsLoading = true,
    refetch: allSavedFlightsRefetch,
  } = useQuery({
    queryKey: ["saved-list", token],
    queryFn: () => fetchData("/gds/get-saved-trips", "GET", undefined, token),
    enabled: false,
  });

  const allFlights = savedTrips?.flatMap((trip) =>
    trip.flights?.map((flight) => ({
      type: "saved",
      ...flight.flight_data,
    }))
  );
  const mergedArray = allPnrData?.data.reduce(
    (acc, obj) => {
      acc.push(obj);
      return acc;
    },
    [...allFlights]
  );
  // const mergedArray = allPnrData?.data.concat(allFlights);

  useEffect(() => {
    if (token) {
      allPnrDataRefetch();
      // allSavedFlightsRefetch();
    }
  }, [token]);

  useEffect(() => {
    if (allPnrData?.success == true) {
      setLoading(false);
    }
  }, [allPnrData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (allPnrData?.success == false || allPnrData?.data?.length == 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>
          <p className="text-center text-red-500">
            {allPnrData?.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-[36px] font-[700] py-8">Trips</h2>
      <div className=" bg-white shadow-custom_shadow flex items-center justify-between flex-wrap gap-5 py-5 px-5 sm:px-20 rounded-[7px]">
        <div className="col-span-3">
          <p className="text-[24px] font-[500]">{mergedArray?.length}</p>
          <span className="text-[14px]">All</span>
        </div>
        <div className="col-span-3">
          <p className="text-[24px] font-[500]">{allFlights?.length}</p>
          <span className="text-[14px]">Saved flights</span>
        </div>
        <div className="col-span-3">
          <p className="text-[24px] font-[500]">{allPnrData?.data?.length}</p>
          <span className="text-[14px]">Booked Trips</span>
        </div>
        {/* <button className="col-span-1 flex justify-end items-center">
          <RightIcon />
        </button> */}
      </div>
      {/* <h2 className="text-[20px] font-[600] w-[160px] my-10 ml-2 pb-1  border-b-2 border-black">
        Ticket List <span className="">({allPnrData?.data?.length})</span>
      </h2> */}

      <div className="w-full max-w-5xl mx-auto my-10 ">
        <Tabs defaultValue="list" className="w-full ">
          <TabsList className="grid w-full grid-cols-3 gap-2">
            <TabsTrigger value="list" className="border">
              All
            </TabsTrigger>
            <TabsTrigger value="saved" className="border">
              Saved flights
            </TabsTrigger>
            <TabsTrigger value="trips" className="border">
              Booked Trips
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <div className="">
              <ScrollArea className="max-h-screen overflow-y-scroll">
                {mergedArray?.length == 0 && (
                  <div className=" mt-10 ">
                    <div>
                      <p className="text-center text-red-500">
                        No trips or flights found
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-10 p-4">
                  {mergedArray?.map((booking, index) => (
                    <TripsList
                      airlinesData={airlinesData}
                      booking={booking}
                      key={index}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="saved">
            <div className="">
              <ScrollArea className="max-h-screen overflow-y-scroll">
                {allFlights?.length == 0 && (
                  <div className=" mt-10 ">
                    <div>
                      <p className="text-center text-red-500">
                        No saved flights found
                      </p>
                    </div>
                  </div>
                )}
                <div className="mt-10 p-4 ">
                  {allFlights?.map((booking, index) => (
                    <SavedTripsList
                      airlinesData={airlinesData}
                      booking={booking}
                      key={index}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="trips">
            <div className="">
              <ScrollArea className="max-h-screen overflow-y-scroll">
                {allPnrData?.data?.length == 0 && (
                  <div className=" mt-10 ">
                    <div>
                      <p className="text-center text-red-500">No trips found</p>
                    </div>
                  </div>
                )}
                <div className="mt-10 p-4 ">
                  {allPnrData?.data?.map((booking, index) => (
                    <TripsList
                      airlinesData={airlinesData}
                      booking={booking}
                      key={index}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
