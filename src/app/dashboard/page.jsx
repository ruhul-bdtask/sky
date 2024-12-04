"use client";
import TravelDashboard from "@/components/dashoboard/travelDashboard/TravelDashboard";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function page() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("auth-token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        Cookies.remove("auth-token");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <TravelDashboard />
      <div className="leading-10 text-[14px] max-w-[1300px] mx-auto py-8">
        <p className="text-[#0B7C9E] hover:underline cursor-pointer">
          Top International Flight Routes.
        </p>
        <p className="text-[#565656]">
          Cheap flights,
          <span className="text-[#0B7C9E] hover:underline cursor-pointer">
             hotels
          </span>
          , hire cars and travel deals:
        </p>
        <p className="text-[#565656]">
          Ticketing searches hundreds of other travel sites at once to find the
          best deals on airline tickets, cheap hotels, holidays and hire cars.
        </p>
        <p className="text-[#565656]">
          Not what you’re looking for? Find thousands of other
          <span className="text-[#0B7C9E] hover:underline cursor-pointer">
             hotels, flights
          </span>
          , car hires and package deals with Ticketing.
        </p>
      </div>
    </div>
  );
}
