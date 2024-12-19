"use client";
import Faq from "../faq/Faq";
import SearchPad from "../searchPad/SearchPad";
import Services from "../services/Services";
import TravelPlanning from "../travelPlanning/TravelPlanning";
import Travels from "../travels/Travels";
import WishlistTravels from "../wishlistTravels/WishlistTravels";
export default function HomePage() {
  return (
    <div className={`container_section_home mx-auto  max-w-7xl py-10 `}>
      <SearchPad />
      <Services />
      <Travels />
      <WishlistTravels />
      <TravelPlanning />
      <Faq />
    </div>
  );
}
