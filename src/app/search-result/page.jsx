"use client";
import FlightCard from "@/components/flightCard/FlightCard";
import FlightFilter from "@/components/flightFilter/FlightFilter";
import TopFilter from "@/components/topFilter/TopFilter";
import ResultPageSkeleton from "@/skeletons/ResultPageSkeleton";
import LoadingBar from "react-top-loading-bar";
import { notFound, useRouter } from "next/navigation";
import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useAirlineStore from "../../../stores/airlineStore";
import { dateTimeToMilliseconds } from "@/lib/dateTimeToMilliseconds";
export default function Page({ searchParams }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.continuousStart();

    setTimeout(() => {
      ref.current?.complete();
    }, 2000);
  }, []);

  const {
    OriginDestinationInformation,
    setLegDescription,
    setMinPrice,
    setMaxPrice,
    minPrice,
    maxPrice,
    timeLeft,
    startCountdown,
    resetTime,
  } = useAirlineStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [timeLeft]);

  useEffect(() => {
    // Reset time first
    resetTime();

    // Then start countdown after a small delay (e.g., 50ms)
    const timer = setTimeout(() => {
      startCountdown();
    }, 50);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timer);
  }, [resetTime, startCountdown]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Modal handler
  const handleGoHome = () => {
    window.location.href = "/";
  };
  const { search, originDestinationInfo } = searchParams;
  let parsedSearchData;
  try {
    parsedSearchData = JSON.parse(search);
  } catch (error) {
    console.error("Error parsing searchData:", error);
    notFound();
  }

  const ticketClass = parsedSearchData?.class;
  const directFlightsOnly = false;
  const availableFlightsOnly = true;

  const payload = {
    RequestLOG: true,
    RequireUTILS: false,
    RequestBody: {
      OriginDestinationInformation: JSON.parse(originDestinationInfo),
      PassengerTypeQuantity: parsedSearchData?.passengers?.map((passenger) => ({
        Code: passenger.type,
        Quantity: passenger.quantity,
        TPA_Extensions: {
          VoluntaryChanges: {
            Match: "Info",
          },
        },
      })),

      TicketClass: ticketClass,
      DirectFlightsOnly: directFlightsOnly,
      AvailableFlightsOnly: availableFlightsOnly,
    },
  };

  const {
    data: allFlights,
    error: allFlightsError,
    isLoading: allFlightsLoading = true,
    refetch: refetchAllFlights,
  } = useQuery({
    queryKey: ["flights", payload],
    queryFn: () => fetchData("/gds/search", "POST", payload),
    retry: 2,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    setLegDescription(allFlights?.data?.LegDescription);
    setMinPrice(
      allFlights?.data?.sortedItineraries[0]?.fare_details?.total_fare
    );
    setMaxPrice(
      allFlights?.data?.sortedItineraries[
        allFlights?.data?.sortedItineraries?.length - 1
      ]?.fare_details?.total_fare
    );
  }, [allFlights]);

  const [sortCriteria, setSortCriteria] = useState("cheapest");

  const durationToMinutes = (duration) => {
    const [hours, minutes] = duration.match(/\d+/g).map(Number);
    return hours * 60 + minutes;
  };
  const sortedFlights = () => {
    if (!allFlights?.data?.sortedItineraries) return [];

    switch (sortCriteria) {
      case "cheapest":
        return allFlights.data.sortedItineraries.filter(
          (flight) =>
            flight.fare_details?.total_fare >= minPrice &&
            flight.fare_details?.total_fare <= maxPrice
        );
      // .sort(
      //   (a, b) => a.fare_details?.total_fare - b.fare_details?.total_fare
      // );
      case "quick":
        return [...allFlights.data.sortedItineraries].sort((a, b) => {
          return (
            durationToMinutes(a.flight_duration) -
            durationToMinutes(b.flight_duration)
          );
        });

      case "best":
        return [...allFlights.data.sortedItineraries].sort((a, b) => {
          const aScore =
            a.fare_details?.total_fare * 0.4 +
            durationToMinutes(a.flight_duration) * 0.4 +
            (a.total_stop || 0) * 0.2;

          const bScore =
            b.fare_details?.total_fare * 0.4 +
            durationToMinutes(b.flight_duration) * 0.4 +
            (b.total_stop || 0) * 0.2;

          return aScore - bScore;
        });
      default:
        return allFlights.data.sortedItineraries;
    }
  };

  const filterOptions = useAirlineStore((state) => state.filterOptions);
  const sortFlights = sortedFlights();

  const filterFlightData = (sortFlights, filterOptions) => {
    const stopMapping = {
      Nonstop: 0,
      "1 stop": 1,
      "2+ stops": Infinity, // Represents 2 or more stops
    };

    // Map the stop labels from filterOptions to their corresponding stop counts
    const stopCountsToFilter = filterOptions.stops?.length
      ? filterOptions.stops.map((stop) => stopMapping[stop])
      : null;

    // Check if the airline filter is applied
    const airlinesToFilter = filterOptions.airlines?.length
      ? filterOptions.airlines
      : null;

    // Check if the airport filter is applied
    const airportsToFilter = filterOptions.airports?.length
      ? filterOptions.airports
      : null;

    // Check if the takeOffRange filter is applied
    const [takeOffStart, takeOffEnd] = filterOptions.takeOffRange || [0, 0];

    // Filter the flights based on the conditions
    return sortFlights.filter((flight) => {
      // const matchesStopCount = !stopCountsToFilter || stopCountsToFilter.includes(flight.total_stop);
      const matchesStopCount =
        !stopCountsToFilter ||
        stopCountsToFilter.some((stopCount) =>
          stopCount === Infinity
            ? flight.total_stop >= 2
            : flight.total_stop === stopCount
        );

      const matchesAirline =
        !airlinesToFilter || airlinesToFilter.includes(flight.airline_name);

      const matchesAirport =
        !airportsToFilter ||
        flight.schedules.some((schedule) =>
          airportsToFilter.includes(schedule.arrival_airport)
        );

      const matchesTakeOffRange =
        filterOptions.takeOffRange[0] === 0 &&
        filterOptions.takeOffRange[1] === 100
          ? true // If range is [0, 0], include all flights
          : flight.schedules.some((schedule) => {
              const departureTime = dateTimeToMilliseconds(
                schedule.departure_date,
                schedule.departure_time
              );

              // Extract start and end range from filterOptions
              const [takeOffStart, takeOffEnd] = filterOptions.takeOffRange;

              // Check if departureTime is within the range
              return (
                departureTime >= takeOffStart && departureTime <= takeOffEnd
              );
            });

      const matchesLandingRange =
        filterOptions.landingRange[0] === 0 &&
        filterOptions.landingRange[1] === 100
          ? true // If range is [0, 0], include all flights
          : flight.schedules.some((schedule) => {
              const arrivalTime = dateTimeToMilliseconds(
                schedule.arrival_date,
                schedule.arrival_time
              );
              // Extract start and end range from filterOptions
              const [landingStart, landingEnd] = filterOptions.landingRange;

              // Check if arrivalTime is within the range
              return arrivalTime >= landingStart && arrivalTime <= landingEnd;
            });

      return (
        matchesStopCount &&
        matchesAirline &&
        matchesAirport &&
        matchesTakeOffRange &&
        matchesLandingRange
      );
    });
  };

  const filteredFlights = filterFlightData(sortFlights, filterOptions);

  return (
    <>
      <div className="bg-[#F0F3F5] py-10">
        <LoadingBar color="#f11946" height={2} ref={ref} />
        {allFlightsLoading ? (
          <ResultPageSkeleton />
        ) : (
          <>
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center animate-fade-in">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">
                    Time's Up!
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Your session has expired. Please go back to the homepage.
                  </p>
                  <button
                    onClick={handleGoHome}
                    className="bg-[#FC660F] text-white px-4 py-2 rounded-md hover:bg-[#d8743a] transition"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            )}
            <div className="container_search max-w-5xl">
              <div className="flex gap-5">
                <FlightFilter
                  timer={{
                    minutes,
                    seconds,
                  }}
                  allFlights={allFlights?.data?.sortedItineraries}
                  sortedFlights={sortedFlights()}
                />
                <div className="flex-1">
                  <TopFilter
                    setSortCriteria={setSortCriteria}
                    sortCriteria={sortCriteria}
                  />
                  {/* {allFlights?.data?.sortedItineraries ? (
                    allFlights.data.sortedItineraries.map((flight) => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))
                  ) : (
                    <p>No flights available</p>
                  )} */}
                  {filteredFlights.length > 0 ? (
                    filteredFlights.map((flight) => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-[500px]">
                      <div className="flex flex-col gap-2 items-center">
                        <p className="text-red-400 ">No flights available</p>
                        <Link href={"/"}>
                          <button className="p-3 text-white  bg-[#FC660F] rounded-lg mt-2 hover:bg-[#dd773b] ease-in-out duration-300 transition-all">
                            Search again
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
                  {/* <button className="w-full p-5 rounded-[10px] bg-[#5F6D77] text-white my-3 text-[14px] font-semibold">
                  Show More Results
                </button> */}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
