import { fetchAirportsData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useAirports = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["airports"],
    queryFn: fetchAirportsData,
  });

  return {
    airportsData: data || [],
    airportError: error,
    airportLoading: isLoading,
  };
};
