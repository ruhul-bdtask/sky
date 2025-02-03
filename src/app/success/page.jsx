"use client";
import BookingSuccess from "@/components/bookingSuccess/BookingSuccess";
import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page({ searchParams }) {
  const token = Cookies.get("auth-token");
  const router = useRouter();

  // useEffect(() => {
  //   const checkAuth = () => {

  //     if (!token) {
  //       router.push("/login");
  //       return;
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  const payload = {
    tran_id: searchParams?.tran_id,
  };
  const {
    data: bookingData,
    error: bookingError,
    isLoading: bookingLoading,
    refetch: refetchBookingData,
  } = useQuery({
    queryKey: ["ticketData", payload],
    queryFn: () => fetchData("/gds/reservation-info", "POST", payload, token),
    enabled: true,
  });

  useEffect(() => {
    if (searchParams?.tran_id && token) {
      refetchBookingData();
    }
  }, []);

  if (!token || !searchParams?.tran_id || bookingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (bookingData?.success == false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>
          <p className="text-center text-red-500">
            {bookingData?.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BookingSuccess data={bookingData?.data} />
    </>
  );
}
