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
export default function Page() {
  const { token, setToken, savedTrips } = useAirlineStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = Cookies.get("auth-token");

      if (!authToken) {
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

  useEffect(() => {
    if (token) {
      allPnrDataRefetch();
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

  if (allPnrData?.success == false) {
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
      <div className=" bg-white shadow-custom_shadow grid grid-cols-10 p-5 rounded-[7px]">
        <div className="col-span-3">
          <p className="text-[24px] font-[500]">0</p>
          <span className="text-[14px]">Days on the road</span>
        </div>
        <div className="col-span-3">
          <p className="text-[24px] font-[500]">0</p>
          <span className="text-[14px]">Miles flown</span>
        </div>
        <div className="col-span-3">
          <p className="text-[24px] font-[500]">0</p>
          <span className="text-[14px]">Cities visited</span>
        </div>
        <button className="col-span-1 flex justify-end items-center">
          <RightIcon />
        </button>
      </div>
      <h2 className="text-[20px] font-[600] w-[160px] my-10 ml-2 pb-1  border-b-2 border-black">
        Ticket List <span className="">({allPnrData?.data?.length})</span>
      </h2>

      <div className="w-full max-w-5xl mx-auto  ">
        <Tabs defaultValue="list" className="w-full ">
          <TabsList className="grid w-full grid-cols-3 gap-2">
            <TabsTrigger value="list" className="border">
              All
            </TabsTrigger>
            <TabsTrigger value="saved" className="border">
              Saved
            </TabsTrigger>
            <TabsTrigger value="trips" className="border">
              Trips
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <div className="">
              <ScrollArea className="max-h-screen overflow-y-scroll">
                <div className="mt-10 p-4 ">
                  {allPnrData?.data?.map((booking, index) => (
                    <TripsList booking={booking} key={index} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="saved">
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Saved tab content goes here
              </p>
            </div>
          </TabsContent>
          <TabsContent value="trips">
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Trips tab content goes here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
