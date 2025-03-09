"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateForTicketCopy } from "@/lib/formatDateForTicketCopy";
import { formatMinutesToHours } from "@/lib/formatMinutesToHours";
import {
  Plane,
  User,
  Calendar,
  Clock,
  Luggage,
  CheckCircle2,
  Download,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BookingSuccess({ data, slack, message }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log(message);

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 py-20 ">
      <div className="w-full max-w-[700px] bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center p-6">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-[#FF5B00] rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Confirmation Message */}
          <h2 className="text-xl font-semibold mb-6 text-center text-green-500">
            You have Successfully Booked ticket
          </h2>

          {/* Booking Details */}
          <div className="w-full grid grid-cols-4 gap-2 text-sm mb-6 text-center">
            <div>
              <p className="text-gray-500">Reservation Code</p>
              <p className="font-medium">{data?.reservation_code}</p>
            </div>
            <div>
              <p className="text-gray-500">Airline PNR</p>
              <p className="font-medium">{data?.airline_pnr}</p>
            </div>
            <div>
              <p className="text-gray-500">Journey Start Date</p>
              <p className="font-medium">
                {formatDateForTicketCopy(data?.journey_start)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Journey End Date</p>
              <p className="font-medium">
                {formatDateForTicketCopy(data?.journey_end)}
              </p>
            </div>
          </div>

          {/* Flight Details */}
          {data?.flights_info?.map((flight, index) => (
            <>
              <div
                key={index}
                className="w-full border border-dashed p-4 rounded-lg mb-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${flight?.airline_code}.png`}
                    alt="Air Asia Airlines"
                    className="rounded-full w-12 h-12"
                  />
                  <div>
                    <p className="font-medium">{flight?.airline_details}</p>
                    <p className="text-sm text-gray-500">
                      {flight?.flight_number} | {flight?.aircraft_type_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="text-center">
                    <p className="text-xl font-bold">
                      {flight?.departure_time}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateForTicketCopy(flight?.departure_date)}
                    </p>
                    <p className="text-sm font-medium">
                      {flight?.from_location}
                    </p>
                  </div>

                  <div className="flex-1 mx-4">
                    <div className="relative">
                      <div className="border-t-2 border-gray-300 w-full absolute top-1/2 -translate-y-1/2"></div>
                      <div className="text-center text-sm text-gray-500">
                        {flight?.cabin_class}
                      </div>
                      <div className="text-center text-xs text-gray-400">
                        {formatMinutesToHours(flight?.duration_minutes)}
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xl font-bold">{flight?.arrival_time}</p>
                    <p className="text-sm text-gray-500">
                      {formatDateForTicketCopy(flight?.arrival_date)}
                    </p>
                    <p className="text-sm font-medium">{flight?.to_location}</p>
                  </div>
                </div>
                {/* 
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{flight?.cabin_class}</span>
                <span className="font-bold">Tk.14,345</span>
              </div> */}
              </div>
            </>
          ))}
          <p className="mb-2 text-sm">
            <span>*</span>{" "}
            {message == "0" ? "Your booking is issued automatically" : message}
          </p>
          {/* Download Button */}
          <Link
            href={`/ticket-copy?status=success&slack=${slack}`}
            className="w-[201px] font-[700] text-[18px] h-[55px] bg-[#FF5B00] hover:bg-[#E65100] text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Ticket Copy
          </Link>
        </div>
      </div>
    </div>
    // <div className="min-h-screen bg-gray-50 p-4 md:p-8">
    //   <div className="max-w-3xl mx-auto space-y-6">
    //     {/* Success Header */}
    //     <div className="text-center space-y-2 mb-8">
    //       <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
    //       <h1 className="text-2xl font-bold text-gray-900">
    //         Booking Confirmed!
    //       </h1>
    //       <p className="text-gray-600">
    //         Your flight has been booked successfully
    //       </p>
    //     </div>

    //     {/* Booking Reference */}
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Booking Reference</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //           <div>
    //             <p className="text-sm text-gray-500">Reservation Code</p>
    //             <p className="font-medium">{data?.reservation_code}</p>
    //           </div>
    //           <div>
    //             <p className="text-sm text-gray-500">Prepared For</p>
    //             <p className="font-medium">{data?.prepared_for}</p>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>

    //     {/* Flight Details */}
    //     {data?.flights_info?.map((flight, index) => (
    //       <Card key={index}>
    //         <CardHeader>
    //           <CardTitle className="flex items-center gap-2">
    //             <Plane className="w-5 h-5" />
    //             Flight Details
    //           </CardTitle>
    //         </CardHeader>
    //         <CardContent className="space-y-6">
    //           <div className="flex justify-between items-center flex-wrap gap-4 md:gap-0">
    //             <div className="space-y-1">
    //               <p className="text-sm text-gray-500">Airline</p>
    //               <div className="font-medium">
    //                 {flight.airline_details} ({flight.airline_code}-
    //                 {flight.flight_number})
    //               </div>
    //             </div>
    //             <div className="space-y-1">
    //               <div className="text-sm text-gray-500">Aircraft</div>
    //               <p className="font-medium">
    //                 {flight.aircraft_type_name} • {flight.cabin_class}
    //               </p>
    //             </div>
    //           </div>

    //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    //             <div className="">
    //               <div className="text-sm text-gray-500">From</div>
    //               <p className="font-medium">{flight.from_location}</p>
    //               <div className="flex items-center gap-2 mt-1">
    //                 <Calendar className="w-4 h-4 text-gray-500" />
    //                 <span className="text-sm text-gray-600">
    //                   {formatDate(flight.departure_date)}
    //                 </span>
    //                 <Clock className="w-4 h-4 text-gray-500 ml-2" />
    //                 <span className="text-sm text-gray-600">
    //                   {formatTime(flight.departure_time)}
    //                 </span>
    //               </div>
    //             </div>

    //             <div className="hidden md:block">
    //               <div className="flex flex-col items-center gap-2">
    //                 <div className="text-sm text-gray-500">
    //                   {flight.duration_minutes} mins
    //                 </div>
    //                 <div className="w-32 h-px bg-gray-300 relative">
    //                   <Plane className="absolute top-1/2 right-14 w-4 h-4 -translate-y-1/2 text-primary" />
    //                 </div>
    //                 <div className="text-xs text-gray-500">
    //                   {flight.distance_miles} miles
    //                 </div>
    //               </div>
    //             </div>

    //             <div className="">
    //               <div className="text-sm text-gray-500">To</div>
    //               <div className="font-medium">{flight.to_location}</div>
    //               <div className="flex items-center gap-2 mt-1">
    //                 <Calendar className="w-4 h-4 text-gray-500" />
    //                 <span className="text-sm text-gray-600">
    //                   {formatDate(flight.arrival_date)}
    //                 </span>
    //                 <Clock className="w-4 h-4 text-gray-500 ml-2" />
    //                 <span className="text-sm text-gray-600">
    //                   {formatTime(flight.arrival_time)}
    //                 </span>
    //               </div>
    //             </div>
    //           </div>
    //         </CardContent>
    //       </Card>
    //     ))}

    //     {/* Passenger Details */}
    //     <Card>
    //       <CardHeader>
    //         <CardTitle className="flex items-center gap-2">
    //           <User className="w-5 h-5" />
    //           Passenger Details
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-4">
    //           {data?.pxn_list?.map((passenger, index) => (
    //             <div
    //               key={index}
    //               className="grid grid-cols-1 md:grid-cols-2 gap-4"
    //             >
    //               <div>
    //                 <p className="text-sm text-gray-500">Passenger Name</p>
    //                 <p className="font-medium">{passenger.pxn_name}</p>
    //               </div>
    //               <div>
    //                 <p className="text-sm text-gray-500">Match Name</p>
    //                 <p className="font-medium">{passenger.match_name}</p>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </CardContent>
    //     </Card>

    //     {/* Baggage Information */}
    //     <Card>
    //       <CardHeader>
    //         <CardTitle className="flex items-center gap-2">
    //           <Luggage className="w-5 h-5" />
    //           Baggage Information
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         {data?.baggage_info?.map((baggage, index) => (
    //           <div
    //             key={index}
    //             className="grid grid-cols-1 md:grid-cols-2 gap-4"
    //           >
    //             {baggage.checked_weight_kg && (
    //               <div>
    //                 <p className="text-sm text-gray-500">Checked Baggage</p>
    //                 <p className="font-medium">
    //                   {baggage.checked_weight_kg} kg
    //                 </p>
    //               </div>
    //             )}
    //             {baggage.cabin_weight_kg && (
    //               <div>
    //                 <p className="text-sm text-gray-500">Cabin Baggage</p>
    //                 <p className="font-medium">{baggage.cabin_weight_kg} kg</p>
    //               </div>
    //             )}
    //           </div>
    //         ))}
    //       </CardContent>
    //     </Card>
    //   </div>
    // </div>
  );
}
