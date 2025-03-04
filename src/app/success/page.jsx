"use client";
import BookingSuccess from "@/components/bookingSuccess/BookingSuccess";
import Loading from "@/components/loader/Loading";
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
    queryFn: () => fetchData("/gds/reservation-info", "POST", payload, token),
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

  // if (loading) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-[#FF6810] z-50">
  //       <img
  //         src={"/ticketing.gif"}
  //         alt="Loading..."
  //         className="w-48 md:w-64 h-full object-contain"
  //       />
  //     </div>
  //   );
  // }

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
      <Loading loading={loading} />
      <BookingSuccess
        data={bookingData?.data}
        slack={searchParams?.slack}
        message={searchParams?.ticket_issue}
      />
    </>
  );
}
