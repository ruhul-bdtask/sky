import { fetchData } from "@/utils/api";
import { toast } from "react-toastify";
import useAirlineStore from "../../stores/airlineStore";

const formatSavedFlight = (savedTrips) => {
  let formattedSavedFlights = [];
  if (savedTrips.length > 0) {
    formattedSavedFlights = savedTrips.map((flight) => {
      return {
        flight_data: flight,
      };
    });
  }
  return {
    data: formattedSavedFlights,
  };
};

// Utility function to remove duplicates
const removeDuplicateFlights = (flights) => {
  return flights.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id) // Replace `id` with the unique key
  );
};

const useSyncSavedFlights = () => {
  const { token, setToken, savedTrips, setSavedTrips } = useAirlineStore();
  const formattedSavedFlights = formatSavedFlight(savedTrips);
  const syncSavedFlights = async (token) => {
    try {
      if (formattedSavedFlights.data.length > 0) {
        console.log("post called");
        // post existing local saved flights to the server
        const response = await fetchData(
          "/gds/save-trips",
          "POST",
          formattedSavedFlights,
          token
        );
        if (response.success) {
          console.log("get called");
          const response = await fetchData(
            "/gds/get-saved-trips",
            "GET",
            null,
            token
          );
          if (response.success && response.data) {
            setSavedTrips(response.data);
          }
        } else {
          throw new Error("Failed to fetch updated saved flights.");
        }
      } else {
        console.log("get called only");
        const response = await fetchData(
          "/gds/get-saved-trips",
          "GET",
          null,
          token
        );
        console.log(response);
        if (response.success && response.data) {
          setSavedTrips(response.data);
        } else {
          throw new Error("Failed to fetch updated saved flights.");
        }
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  };

  return { syncSavedFlights };
};

export default useSyncSavedFlights;
