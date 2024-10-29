// src/utils/api.js
const API_BASE_URL = "/api"; // Set your API base URL here

const fetchData = async (endpoint, method = "GET", payload = null) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  try {
    const response = await fetch(url, options);

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "An error occurred during the fetch operation"
      );
    }

    // Return the response data if the request was successful
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Rethrow the error to be handled where fetchData is called
  }
};

export default fetchData;
