// src/hooks/useFlightData.js
import useSWR from "swr";
import { fetchData } from "../utils/api";

const swrFetcher = (endpoint) => (searchParams) =>
  fetchData(endpoint, "POST", searchParams);

export function useFlightData(searchParams) {
  const queryString = new URLSearchParams(searchParams).toString();
  const endpoint = `/flights?${queryString}`;


  console.log(endpoint)
  const { data, error, isLoading } = useSWR(
    [endpoint, searchParams],
    swrFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
    }
  );

  return { data, error, isLoading: !data && !error };
}
