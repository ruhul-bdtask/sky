// src/utils/api.js

export const fetchData = async (
  endpoint,
  method = "GET",
  payload = null,
  token = null
) => {
  const API_BASE_URL =
    process.env.API_BASE_URL || "https://subah.bdtask-demo.com/b2c/api";

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

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "An error occurred during the fetch operation"
    );
  }

  return response.json();
};
