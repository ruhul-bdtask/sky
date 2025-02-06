import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchBlogs = (endpoint) => {
  return useQuery({
    queryKey: ["blogs", endpoint],
    queryFn: () => fetchData(`/articles${endpoint}`, "GET"),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    onError: (error) => {
      console.log("Error fetching blogs:", error);
    },
  });
};
