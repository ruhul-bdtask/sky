"use client";
import { useQuery } from "@tanstack/react-query";
import Faq from "../faq/Faq";
import SearchPad from "../searchPad/SearchPad";
import Services from "../services/Services";
import TravelPlanning from "../travelPlanning/TravelPlanning";
import Travels from "../travels/Travels";
import WishlistTravels from "../wishlistTravels/WishlistTravels";
import { fetchData } from "@/utils/api";
import useAirlineStore from "../../../stores/airlineStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
export default function HomePage({ searchParams }) {
  const { stopCountdown, resetTime } = useAirlineStore();
  const [hasErrorShown, setHasErrorShown] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (searchParams.status === "failed" && !hasErrorShown) {
      toast.error(searchParams?.message);
      setHasErrorShown(true);
    }
  }, [searchParams, hasErrorShown]);
  useEffect(() => {
    stopCountdown();
    resetTime();
  }, [stopCountdown, resetTime]);

  const {
    data: homeData,
    isLoading: homeDataLoading,
    refetch: refetchHomeData,
  } = useQuery({
    queryKey: ["home-data"],
    queryFn: () => fetchData("/getDashboardElement", "GET"),
    enabled: true,
  });

  const {
    data: latestFlights,
    isLoading: latestFlightsLoading,
    refetch: refetchLatestFlights,
  } = useQuery({
    queryKey: ["latest-flights"],
    queryFn: () => fetchData("/latest-flight-list", "GET"),
    enabled: true,
  });

  useEffect(() => {
    // Mock API request
    setTimeout(() => {
      setLoading(false); // Set loading to false once data is fetched
    }, 1000); // Simulate 2 seconds of loading time
  }, []);
  if (loading) {
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
    <div className={`container_section_home mx-auto max-w-7xl py-10`}>
      <SearchPad />
      <Services
        servicesData={homeData?.data?.benifits}
        homeDataLoading={homeDataLoading}
      />
      <Travels
        travelsData={latestFlights?.data}
        latestFlightsLoading={latestFlightsLoading}
      />
      <WishlistTravels
        wishlistData={homeData?.data?.wishlist}
        homeDataLoading={homeDataLoading}
      />
      <TravelPlanning />
      <Faq />
    </div>
  );
}
