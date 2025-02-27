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
    formattedSavedFlights,
  };
};

// Utility function to remove duplicates
const removeDuplicateFlights = (flights) => {
  return flights.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id) // Replace `id` with the unique key
  );
};

const useSyncSavedFlights = () => {
  const { token, setToken, savedTrips, setSavedTrips, setSelectedSavedTrip } =
    useAirlineStore();
  // const formattedSavedFlights = formatSavedFlight(savedTrips);
  const payloadData = savedTrips?.map((trip) => {
    return {
      ...trip,
      flights: trip?.flights?.map((flight) => flight?.flight_data),
    };
  });

  const payload = {
    data: payloadData,
  };

  const syncSavedFlights = async (token) => {
    try {
      if (savedTrips.length > 0) {
        // token expired but if still saved trips exist in local storage
        const isExist = savedTrips.some((trip) => trip.id);
        if (savedTrips?.length > 0 && isExist) {
          setSavedTrips([]);
          setSelectedSavedTrip({});
          const response = await fetchData(
            "/gds/get-saved-trips",
            "GET",
            null,
            token
          );
          if (response.success && response.data) {
            setSavedTrips(response.data);
            setSelectedSavedTrip({});
          } else {
            throw new Error("Failed to sync saved flights.");
          }
        } else {
          // post existing local saved flights to the server
          const response = await fetchData(
            "/gds/save-bulk-trips",
            "POST",
            payload,
            token
          );
          if (response.success) {
            const response = await fetchData(
              "/gds/get-saved-trips",
              "GET",
              null,
              token
            );
            if (response.success && response.data) {
              setSavedTrips(response.data);
              setSelectedSavedTrip({});
            }
          } else {
            throw new Error(response.errors[0]);
          }
        }
      } else {
        const response = await fetchData(
          "/gds/get-saved-trips",
          "GET",
          null,
          token
        );
        if (response.success && response.data) {
          setSavedTrips(response.data);
          setSelectedSavedTrip({});
        } else {
          throw new Error("Failed to sync saved flights.");
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return { syncSavedFlights };
};

export default useSyncSavedFlights;
