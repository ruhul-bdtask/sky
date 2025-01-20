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

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("auth-token");

      if (!token) {
        router.push("/login");
        return;
      }
    };

    checkAuth();
  }, [router]);

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
    enabled: false,
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
  const successData = {
    success: true,
    message: "Reservation found",
    data: {
      journey_start: "2024-06-21",
      journey_end: "2024-06-21",
      last_airport: "JSR",
      prepared_for: "OMAR/GDFGFG",
      pxn_list: [
        {
          pxn_name: "OMAR/GDFGFG",
          match_name: "GDFGFG OMAR",
        },
        {
          pxn_name: "OMAR/GDFGFG",
          match_name: "GDFGFG OMAR",
        },
      ],
      reservation_code: "T1718011957DULLiY",
      flights_info: [
        {
          airline_code: "BS",
          airline_details: "US-Bangla Airlines",
          flight_number: 121,
          departure_date: "2024-06-21",
          departure_time: "07:30",
          arrival_date: "2024-06-21",
          arrival_time: "08:15",
          cabin_class: "ECONOMY",
          aircraft_type_name: "AT7",
          meals: "",
          duration_minutes: 27,
          distance_miles: 88,
          from_airport: "DAC",
          to_airport: "JSR",
          from_location: "Dhaka, Bangladesh (DAC)",
          to_location: "Jessore, Bangladesh (JSR)",
        },
      ],
      baggage_info: [
        {
          cabin_max_pcs: null,
          checked_weight_kg: 7,
          cabin_weight_kg: null,
          checked_bag_pcs: null,
        },
      ],
      airline_pnr: null,
    },
  };
  return (
    <>
      <BookingSuccess data={bookingData?.data} />
    </>
  );
}
