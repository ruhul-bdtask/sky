import SearchPad from "../searchPad/SearchPad";
import Services from "../services/Services";
import TravelPlanning from "../travelPlanning/TravelPlanning";
import Travels from "../travels/Travels";
import WishlistTravels from "../wishlistTravels/WishlistTravels";
export default function HomePage() {
  return (
    <div className="container mx-auto  max-w-7xl">
      <SearchPad />
      <Services />
      <Travels />
      <WishlistTravels />
      <TravelPlanning />
    </div>
  );
}
