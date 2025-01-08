import { fetchAirlinesData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useAirlines = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["airlines"],
    queryFn: fetchAirlinesData,
  });

  return {
    airlinesData: data || [],
    airlineError: error,
    airlineLoading: isLoading,
  };
};
