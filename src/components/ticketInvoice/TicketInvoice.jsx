"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import {
  Plane,
  Download,
  Calendar,
  Clock,
  User,
  CreditCard,
  Mail,
  Phone,
  CircleUser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import logo from "@/public/images/logo.png";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import useAirlineStore from "../../../stores/airlineStore";
import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { formatDateForTicketCopy } from "@/lib/formatDateForTicketCopy";
import { formatMinutesToHours } from "@/lib/formatMinutesToHours";
import Loading from "../loader/Loading";

export default function TicketInvoice({ searchParams, authToken }) {
  const invoiceRef = useRef(null);
  const {
    token,
    setToken,
    userData,
    savedTrips,
    setSavedTrips,
    setSelectedSavedTrip,
  } = useAirlineStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const printFn = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: "Invoice",
  });

  const handlePrint = useCallback(() => {
    printFn();
  }, [printFn]);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = Cookies.get("auth-token");

      if (!authToken) {
        Cookies.remove("auth-token");
        setToken(null);
        if (savedTrips?.length > 0 && savedTrips[0]?.id) {
          setSavedTrips([]);
          setSelectedSavedTrip({});
        }
        router.push("/login");
        return;
      }
    };

    checkAuth();
  }, [token]);

  const payload = {
    tran_id: searchParams.slack,
  };

  const {
    data: bookingData,
    error: bookingError,
    isLoading: bookingLoading = true,
    refetch: refetchBookingData,
  } = useQuery({
    queryKey: ["reservation-info", payload],
    queryFn: () => fetchData("/gds/reservation-info", "POST", payload, token),
    enabled: false,
  });

  useEffect(() => {
    if (token) {
      refetchBookingData();
    }
  }, [token]);

  useEffect(() => {
    if (bookingData) {
      setLoading(false);
    }
  }, [bookingData]);

  // useEffect(() => {
  //   if (bookingLoading) {
  //     setLoading(true);
  //   }
  // }, [bookingLoading]);

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

  const base_fare = Number(bookingData?.data?.base_fare);
  const taxFare = Number(bookingData?.data?.tax_fare);
  const vatAmount = Number(bookingData?.data?.vat_amount);
  const adminCharge = Number(bookingData?.data?.admin_charge);

  const totalTax =
    (isNaN(taxFare) ? 0 : taxFare) +
    (isNaN(vatAmount) ? 0 : vatAmount) +
    (isNaN(adminCharge) ? 0 : adminCharge);

  const totalAmount =
    (isNaN(taxFare) ? 0 : taxFare) +
    (isNaN(vatAmount) ? 0 : vatAmount) +
    (isNaN(adminCharge) ? 0 : adminCharge) +
    (isNaN(base_fare) ? 0 : base_fare);

  const formattedAmount = totalTax.toLocaleString("en-BD");
  const formattedTotalAmount = totalAmount.toLocaleString("en-BD");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Format time
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  return (
    <>
      <Loading loading={loading} />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Download Button */}
          <div className="flex justify-end mb-6">
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#FC660F] text-white"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>

          {/* Invoice Card */}
          <Card ref={invoiceRef} className="bg-white p-6 md:p-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start md:items-center mb-8 border-b pb-6">
              <div>
                {/* <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Plane className="w-8 h-8 text-primary" />
                Travel Invoice
              </h1> */}
                <Image src={logo} width={150} height={150} alt="" />
                <p className="text-muted-foreground mt-1">
                  Invoice #{bookingData?.data?.reservation_code}
                </p>
              </div>
              {/* <div className="mt-4 md:mt-0 text-right">
              <p className="font-semibold">Date Issued</p>
              <p className="text-muted-foreground">February 9, 2024</p>
            </div> */}
            </div>

            {/* Customer Info */}
            <div className="flex justify-between items-center flex-wrap gap-5 mb-8">
              <div>
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Details
                </h2>
                <div className="space-y-1 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CircleUser className="w-4 h-4" />
                    {userData?.first_name + userData?.last_name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {userData?.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />

                    {userData?.phone}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Info
                </h2>
                <div className="space-y-1 text-muted-foreground">
                  <p>Payment gateway: SSL commerz</p>
                  <p>Transaction ID: {searchParams.slack}</p>
                  <p>Status: Paid</p>
                </div>
              </div>
            </div>

            {/* Flight Details */}
            <div className="mb-8">
              <h2 className="font-semibold mb-4">Flight Details</h2>
              {bookingData?.data?.flights_info?.map((flight, index) => (
                // <div
                //   key={index}
                //   className="bg-slate-100 p-4 rounded-lg space-y-4 my-4"
                // >
                //   <div className="flex justify-between items-center flex-wrap gap-5">
                //     <div className="flex items-center gap-3">
                //       <Calendar className="w-4 h-4 text-muted-foreground" />
                //       <div>
                //         <p className="text-sm text-muted-foreground">
                //           Departure Date
                //         </p>
                //         <p className="font-medium">
                //           {formatDateForTicketCopy(flight?.departure_date)}
                //         </p>
                //       </div>
                //     </div>
                //     <div className="flex items-center gap-3">
                //       <Clock className="w-4 h-4 text-muted-foreground" />
                //       <div>
                //         <p className="text-sm text-muted-foreground">
                //           Flight Time
                //         </p>
                //         <p className="font-medium">{flight?.departure_time}</p>
                //       </div>
                //     </div>
                //   </div>
                //   <div className="flex items-center justify-between flex-wrap border-t pt-4">
                //     <div>
                //       <p className="font-medium">{flight?.from_location}</p>
                //       <p className="text-sm text-muted-foreground">
                //         {flight?.from_airport}
                //       </p>
                //     </div>
                //     <div className="flex-1 mx-4">
                //       <div className="relative w-2/3 mx-auto">
                //         <div className="border-t-2 border-dashed border-gray-300 w-full absolute top-1/2 -translate-y-1/2"></div>
                //         <div className="text-center text-sm text-gray-500">
                //           {flight?.cabin_class}
                //         </div>
                //         <div className="text-center text-xs text-gray-400">
                //           {formatMinutesToHours(flight?.duration_minutes)}
                //         </div>
                //       </div>
                //     </div>
                //     <div className="text-right">
                //       <p className="font-medium">{flight?.to_location}</p>
                //       <p className="text-sm text-muted-foreground">
                //         {flight?.to_airport}
                //       </p>
                //     </div>
                //   </div>
                // </div>
                <div key={index} className="p-2 ">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Calendar className="text-[#FC660F] mr-2" size={20} />
                      <span className="text-gray-700 font-medium">
                        {formatDate(flight.departure_date)}
                      </span>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      Flight {index + 1} of{" "}
                      {bookingData?.data?.flights_info.length}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row  md:items-center justify-between">
                    <div className="flex flex-col items-start mb-4 md:mb-0">
                      <span className="text-sm text-gray-500">Departure</span>
                      <span className="text-xl font-bold">
                        {formatTime(flight.departure_time)}
                      </span>
                      <span className="text-gray-700">
                        {flight.from_location}
                      </span>
                    </div>

                    <div className="flex flex-col items-center mb-4 md:mb-0">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-[#FC660F]"></div>
                        <div className="w-24 md:w-32 h-0.5 bg-[#FC660F]"></div>
                        <Plane className="text-[#FC660F] mx-1" size={20} />
                        <div className="w-24 md:w-32 h-0.5 bg-[#FC660F]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#FC660F]"></div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatMinutesToHours(flight.duration_minutes)}
                      </div>
                      <div className="text-sm text-[#FC660F] font-medium">
                        {flight.cabin_class}
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-sm text-gray-500">Arrival</span>
                      <span className="text-xl font-bold">
                        {formatTime(flight.arrival_time)}
                      </span>
                      <span className="text-gray-700 text-right">
                        {flight.to_location}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">
                          {flight.airline_details}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {flight.airline_code}-{flight.flight_number}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Aircraft: {flight.aircraft_type_name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-2">
              <h2 className="font-semibold mb-4">Price Breakdown</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fare</span>
                  <span>
                    BDT{" "}
                    {Number(bookingData?.data?.base_fare).toLocaleString(
                      "en-BD"
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & Fees</span>
                  <span>BDT {formattedAmount}</span>
                </div>
                {/* <div className="flex justify-between">
                <span className="text-muted-foreground">Travel Insurance</span>
                <span>$30.00</span>
              </div> */}
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>BDT {formattedTotalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6  text-center text-sm text-muted-foreground">
              <p>Thank you for choosing our service!</p>
              <p>For any queries, please contact our Ticketing support team.</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
