"use client";
import TravelDashboard from "@/components/dashoboard/travelDashboard/TravelDashboard";
import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useAirlineStore from "../../../stores/airlineStore";

export default function Page() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const authToken = Cookies.get("auth-token");

  const {
    setUserData,
    setToken,
    token,
    savedTrips,
    setSavedTrips,
    setSelectedSavedTrip,
  } = useAirlineStore();

  // useEffect(() => {
  //   const checkAuth = () => {
  //     const token = Cookies.get("auth-token");

  //     try {
  //       const decodedToken = jwtDecode(token);
  //       setUser(decodedToken);
  //     } catch (error) {
  //       Cookies.remove("auth-token");
  //       router.push("/login");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = Cookies.get("auth-token");

      if (!authToken) {
        Cookies.remove("auth-token");
        setToken(null);

        router.push("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(authToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          Cookies.remove("auth-token");
          setToken(null);
          if (savedTrips?.length > 0 && savedTrips[0]?.id) {
            setSavedTrips([]);
            setSelectedSavedTrip({});
          }
          router.push("/login");
        } else {
          setUser(decodedToken);
        }
      } catch (error) {
        Cookies.remove("auth-token");
        setToken(null);
        if (savedTrips?.length > 0 && savedTrips[0]?.id) {
          setSavedTrips([]);
          setSelectedSavedTrip({});
        }
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, token]);

  const lastLogin = new Date(user?.iat * 1000).toLocaleString();
  const expiration = new Date(user?.exp * 1000).toLocaleString();

  const loginDetails = {
    lastLogin,
    expiration,
  };

  const userPayload = {
    document_type: "NID",
  };

  const {
    data: userData,
    error: userDataError,
    isLoading: userDataLoading = true,
    refetch: refetchUserData,
  } = useQuery({
    queryKey: ["user", token],
    queryFn: () => fetchData("/user/me", "POST", userPayload, token),
    enabled: true,
    retry: false,
  });

  if (userDataLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#FC660F] z-50">
        <img
          src={"/ticketing.gif"}
          alt="Loading..."
          className="w-48 md:w-64 h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div>
      <TravelDashboard
        userData={userData}
        userDataLoading={userDataLoading}
        loginDetails={loginDetails}
      />
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
