import { toast } from "react-toastify";
import useAirlineStore from "../../stores/airlineStore";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import { useState } from "react";

const formatSavedFlight = (savedFlights) => {
  const formattedSavedFlights = savedFlights.map((flight) => {
    return {
      trip_data: flight,
    };
  });

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
  const { token, setToken, savedFlights, setSavedFlights } = useAirlineStore();
  const formattedSavedFlights = formatSavedFlight(savedFlights);

  const syncSavedFlights = async (token) => {
    try {
      // post existing local saved flights to the server
      const response = await fetchData(
        "/gds/save-trips",
        "POST",
        formattedSavedFlights,
        token
      );

      if (response.success) {
        const response = await fetchData(
          "/gds/get-user-saved-trips",
          "GET",
          null,
          token
        );

        // const trips = response.data.map((trip) => trip?.trip_data);

        // const uniqueFlights = removeDuplicateFlights([
        //   ...savedFlights,
        //   ...trips,
        // ]);
        if (response.success) {
          setSavedFlights(response.data);
        }
      } else {
        throw new Error("Failed to fetch updated saved flights.");
      }
    } catch (err) {
      console.error("Error syncing saved flights:", err);
      toast.error("Failed to sync saved flights.");
    }
  };

  return { syncSavedFlights };
};

export default useSyncSavedFlights;
