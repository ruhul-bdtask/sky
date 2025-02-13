"use client";
import BookingSuccess from "@/components/bookingSuccess/BookingSuccess";
import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page({ searchParams }) {
  const token = Cookies.get("auth-token");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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
    tran_id: searchParams?.slack,
  };
  const {
    data: bookingData,
    error: bookingError,
    isLoading: bookingLoading = true,
    refetch: refetchBookingData,
  } = useQuery({
    queryKey: ["ticketData", payload],
    queryFn: () => fetchData("/gds/reservation-info", "POST", payload),
    enabled: false,
  });

  useEffect(() => {
    if (searchParams?.slack) {
      refetchBookingData();
    }
  }, [searchParams?.slack]);

  useEffect(() => {
    if (bookingData) {
      setLoading(false);
    }
  }, [bookingData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (bookingData?.success == false || !searchParams?.slack) {
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
      <BookingSuccess data={bookingData?.data} slack={searchParams?.slack} />
    </>
  );
}
