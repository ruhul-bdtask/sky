import { toast } from "react-toastify";
import useAirlineStore from "../../stores/airlineStore";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import { useState } from "react";

const formatSavedFlight = (savedFlights) => {
  let formattedSavedFlights = [];
  if (savedFlights.length > 0) {
    formattedSavedFlights = savedFlights.map((flight) => {
      return {
        trip_data: flight,
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
  const { token, setToken, savedFlights, setSavedFlights } = useAirlineStore();
  const formattedSavedFlights = formatSavedFlight(savedFlights);
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
            "/gds/get-user-saved-trips",
            "GET",
            null,
            token
          );
          if (response.success && response.data) {
            setSavedFlights(response.data);
          }
        } else {
          throw new Error("Failed to fetch updated saved flights.");
        }
      } else {
        console.log("get called only");
        const response = await fetchData(
          "/gds/get-user-saved-trips",
          "GET",
          null,
          token
        );
        console.log(response);
        if (response.success && response.data) {
          setSavedFlights(response.data);
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
