import { fetchData } from "@/utils/api";
import { HiDotsHorizontal } from "react-icons/hi";
import { toast } from "react-toastify";
import useAirlineStore from "../../../stores/airlineStore";

const PopupBtn = ({ flight, isShowPopupBtn, setIsShowPopupBtn,handleRedirect }) => {
  const { token, savedTrips, selectedSavedTrip, setSavedTrips } =
    useAirlineStore();

  const uniqueFlightString =
    flight?.flight_data?.airline_code +
    flight?.flight_data?.destination_code +
    flight?.flight_data?.origin_code +
    flight?.flight_data?.departure_date +
    flight?.flight_data?.arrival_date +
    flight?.flight_data?.arrival_time +
    flight?.flight_data?.departure_time;

  const handleRemoveFlight = async (flight) => {
    let filteredData = [];

    if (token) {
      filteredData = selectedSavedTrip.flights.filter(
        (f) => f.uid !== flight.uid
      );
      const payload = { flight_uid: flight.uid };
      const response = await fetchData(
        "/gds/remove-flight",
        "POST",
        payload,
        token
      );
      if (response.success) {
        toast.success("Flight removed successfully");
        setIsShowPopupBtn(null);
        // Update the state with the modified savedTrips array

        // setSavedTrips(updatedSavedTrips);
        // setSelectedSavedTrip({
        //   ...selectedSavedTrip,
        //   flights: filteredData,
        // });

        setSavedTrips(
          savedTrips.map((trip) => {
            if (trip.name === selectedSavedTrip.name) {
              return { ...trip, flights: filteredData };
            }
            return trip;
          })
        );

        return;
      } else {
        console.error(response);
        toast.error(response?.errors?.[0] ?? "An unexpected error occurred.");
        return;
      }
    }

    // remove local if not logged in
    filteredData = selectedSavedTrip.flights.filter(
      (fl) =>
        !(
          fl?.flight_data?.airline_code === flight?.flight_data?.airline_code &&
          fl?.flight_data?.destination_code ===
            flight?.flight_data?.destination_code &&
          fl?.flight_data?.origin_code === flight?.flight_data?.origin_code &&
          fl?.flight_data?.departure_date ===
            flight?.flight_data?.departure_date &&
          fl?.flight_data?.arrival_date === flight?.flight_data?.arrival_date &&
          fl?.flight_data?.arrival_time === flight?.flight_data?.arrival_time &&
          fl?.flight_data?.departure_time ===
            flight?.flight_data?.departure_time
        )
    );

    // setSelectedSavedTrip({
    //   ...selectedSavedTrip,
    //   flights: filteredData,
    // });
    setSavedTrips(
      savedTrips.map((trip) => {
        if (trip.name === selectedSavedTrip.name) {
          return { ...trip, flights: filteredData };
        }
        return trip;
      })
    );
  };

  return (
    <div className="font-medium text-gray-800 relative">
      <button
        className={`w-6 h-5 flex justify-center items-center rounded ${
          isShowPopupBtn === uniqueFlightString ? "bg-gray-200" : "bg-gray-100"
        }`}
        onClick={() =>
          setIsShowPopupBtn((isShow) =>
            isShow === uniqueFlightString ? null : uniqueFlightString
          )
        }
      >
        <HiDotsHorizontal />
      </button>
      {isShowPopupBtn === uniqueFlightString && (
        <div
          className="rounded-md border text-center absolute top-6 right-0 bg-white shadow-md"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleRedirect(flight?.flight_data)}
            className="block p-2 border-b w-full hover:text-[#0C7C99] transition-all"
          >
            Search
          </button>
          {/* {token && ( */}
          <button
            className="block p-2 w-full text-red-400 hover:text-[#0C7C99] transition-all"
            onClick={() => handleRemoveFlight(flight)}
          >
            Remove
          </button>
          {/* )} */}
        </div>
      )}
    </div>
  );
};

export default PopupBtn;
