"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plane,
  User,
  Calendar,
  Clock,
  Luggage,
  CheckCircle2,
} from "lucide-react";

export default function BookingSuccess({ data }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-2 mb-8">
          <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your flight has been booked successfully
          </p>
        </div>

        {/* Booking Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Reservation Code</p>
                <p className="font-medium">{data.reservation_code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prepared For</p>
                <p className="font-medium">{data.prepared_for}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flight Details */}
        {data?.flights_info?.map((flight, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Flight Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4 md:gap-0">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Airline</p>
                  <div className="font-medium">
                    {flight.airline_details} ({flight.airline_code}-
                    {flight.flight_number})
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Aircraft</div>
                  <p className="font-medium">
                    {flight.aircraft_type_name} • {flight.cabin_class}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="">
                  <div className="text-sm text-gray-500">From</div>
                  <p className="font-medium">{flight.from_location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {formatDate(flight.departure_date)}
                    </span>
                    <Clock className="w-4 h-4 text-gray-500 ml-2" />
                    <span className="text-sm text-gray-600">
                      {formatTime(flight.departure_time)}
                    </span>
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-sm text-gray-500">
                      {flight.duration_minutes} mins
                    </div>
                    <div className="w-32 h-px bg-gray-300 relative">
                      <Plane className="absolute top-1/2 right-14 w-4 h-4 -translate-y-1/2 text-primary" />
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.distance_miles} miles
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className="text-sm text-gray-500">To</div>
                  <div className="font-medium">{flight.to_location}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {formatDate(flight.arrival_date)}
                    </span>
                    <Clock className="w-4 h-4 text-gray-500 ml-2" />
                    <span className="text-sm text-gray-600">
                      {formatTime(flight.arrival_time)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Passenger Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Passenger Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.pxn_list?.map((passenger, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <p className="text-sm text-gray-500">Passenger Name</p>
                    <p className="font-medium">{passenger.pxn_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Match Name</p>
                    <p className="font-medium">{passenger.match_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Baggage Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Luggage className="w-5 h-5" />
              Baggage Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.baggage_info?.map((baggage, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {baggage.checked_weight_kg && (
                  <div>
                    <p className="text-sm text-gray-500">Checked Baggage</p>
                    <p className="font-medium">
                      {baggage.checked_weight_kg} kg
                    </p>
                  </div>
                )}
                {baggage.cabin_weight_kg && (
                  <div>
                    <p className="text-sm text-gray-500">Cabin Baggage</p>
                    <p className="font-medium">{baggage.cabin_weight_kg} kg</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
