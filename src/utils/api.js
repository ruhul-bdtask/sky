// src/utils/api.js

import { toast } from "react-toastify";

export const fetchData = async (
  endpoint,
  method = "GET",
  payload = null,
  token = null
) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  // const response = await fetch(url, options);
  // if (!response.ok) {
  //   const errorData = await response.json();
  //   throw new Error(
  //     errorData.message ||
  //       errorData.errors?.[0] ||
  //       "An error occurred during the fetch operation"
  //   );
  // }
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.error?.message;

    const errorM = errorData?.error;

    const errorG = errorData?.message;
    // Show the error in a toast

    if (errorMessage) {
      toast.error(errorMessage);
    } else if (errorM) {
      toast.error(errorM);
    } else {
      toast.error(errorG);
    }

    throw new Error(
      errorMessage ||
        errorM ||
        errorG ||
        "An error occurred during the fetch operation"
    );
  }

  return response.json();
};

const fetchJsonData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from ${url}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const fetchAirlinesData = () => fetchJsonData("/utils/airlines.json");
export const fetchAirportsData = () => fetchJsonData("/utils/airports.json");

// save single trip for logged in user
// export const saveSingleTrip = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}${"/gds/create-trip"}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return await response.json();
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };
