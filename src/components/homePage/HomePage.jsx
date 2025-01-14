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
import { useEffect } from "react";
export default function HomePage() {
  const { stopCountdown, resetTime } = useAirlineStore();

  useEffect(() => {
    stopCountdown();
    resetTime();
  }, [stopCountdown, resetTime]);

  const {
    data: homeData,
    error: homeDataError,
    isLoading: homeDataLoading,
    refetch: refetchHomeData,
  } = useQuery({
    queryKey: ["home-data"],
    queryFn: () => fetchData("/getDashboardElement", "GET"),
    enabled: true,
  });

  return (
    <div className={`container_section_home mx-auto max-w-7xl py-10`}>
      <SearchPad />
      <Services
        servicesData={homeData?.data?.benifits}
        homeDataLoading={homeDataLoading}
      />
      <Travels
        travelsData={homeData?.data?.hopList}
        homeDataLoading={homeDataLoading}
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
