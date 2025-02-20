"use client";
import FlightCard from "@/components/flightCard/FlightCard";
import FlightFilter from "@/components/flightFilter/FlightFilter";
import TopFilter from "@/components/topFilter/TopFilter";
import { dateTimeToMilliseconds } from "@/lib/dateTimeToMilliseconds";
import ResultPageSkeleton from "@/skeletons/ResultPageSkeleton";
import { fetchData } from "@/utils/api";
import { getFilteredFlights } from "@/utils/getFilteredFlights";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import useAirlineStore from "../../../stores/airlineStore";
// import ticketingGif from "@/public/images/ticketing.gif";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import _ from "lodash";
import { FilterXIcon } from "lucide-react";
export default function Page({ searchParams }) {
  const [loadingRevalidate, setLoadingRevalidate] = useState(false);
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
    filteredData,
    setFilteredData,
    filterOptions,
  } = useAirlineStore();
  const [topSortedFlights, setTopSortedFlights] = useState({});
  const [sortCriteria, setSortCriteria] = useState("");
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
        Age: passenger?.age,
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

  const sortFlights = () => {
    if (!allFlights?.data?.sortedItineraries) return [];
    switch (sortCriteria) {
      case "cheapest":
        return [...allFlights.data.sortedItineraries].sort(
          (a, b) => a.fare_details?.total_fare - b.fare_details?.total_fare
        );

      case "quickest":
        return [...allFlights.data.sortedItineraries].sort((a, b) => {
          return (
            a.itinerary_leg_descs[0].duration -
            b.itinerary_leg_descs[0].duration
          );
        });

      case "best": {
        const itineraries = [...allFlights.data.sortedItineraries]; // Work with a copy

        // Step 1: Initialize min/max values
        let minFare = Infinity,
          maxFare = -Infinity,
          minDuration = Infinity,
          maxDuration = -Infinity,
          minLayover = Infinity,
          maxLayover = -Infinity;

        itineraries.forEach((flight) => {
          const fare = flight.fare_details?.total_fare || 0;
          const duration = flight.itinerary_leg_descs?.[0]?.duration || 0;
          const layover = flight.itinerary_leg_descs?.[0]?.schedules
            ?.map((s) => s.layover_time || 0)
            .reduce((a, b) => a + b, 0); // Sum up layover times

          minFare = Math.min(minFare, fare);
          maxFare = Math.max(maxFare, fare);
          minDuration = Math.min(minDuration, duration);
          maxDuration = Math.max(maxDuration, duration);
          minLayover = Math.min(minLayover, layover);
          maxLayover = Math.max(maxLayover, layover);
        });

        // Step 2: Compute best score in a single loop
        itineraries.forEach((flight) => {
          const fare = flight.fare_details?.total_fare || 0;
          const duration = flight.itinerary_leg_descs?.[0]?.duration || 0;
          const layover = flight.itinerary_leg_descs?.[0]?.schedules
            ?.map((s) => s.layover_time || 0)
            .reduce((a, b) => a + b, 0); // Sum up layover times

          // Normalize each parameter (Lower values are better)
          const normalizedFare = (fare - minFare) / (maxFare - minFare || 1);
          const normalizedDuration =
            (duration - minDuration) / (maxDuration - minDuration || 1);
          const normalizedLayover =
            (layover - minLayover) / (maxLayover - minLayover || 1);

          // Compute best score (Lower score is better)
          flight.bestScore =
            normalizedFare + normalizedDuration + normalizedLayover;
          flight.tags = []; // Initialize empty tags
        });

        // Step 3: Sort flights for ranking
        const sortByCheapest = [...itineraries].sort(
          (a, b) =>
            (a.fare_details?.total_fare || 0) -
            (b.fare_details?.total_fare || 0)
        );
        const sortByQuickest = [...itineraries].sort(
          (a, b) =>
            (a.itinerary_leg_descs?.[0]?.duration || 0) -
            (b.itinerary_leg_descs?.[0]?.duration || 0)
        );
        const sortByBest = [...itineraries].sort(
          (a, b) => a.bestScore - b.bestScore // Lower is better
        );

        // Step 4: Get top-ranked flights
        const cheapestFlight = sortByCheapest[0];
        const quickestFlight = sortByQuickest[0];
        const bestFlight = sortByBest[0];

        // Step 5: Assign tags (Allow multiple tags)
        itineraries.forEach((flight) => {
          if (
            flight.fare_details?.total_fare ===
            cheapestFlight.fare_details?.total_fare
          ) {
            flight.tags.push("Cheapest");
          }
          if (
            flight.itinerary_leg_descs?.[0]?.duration ===
            quickestFlight.itinerary_leg_descs?.[0]?.duration
          ) {
            flight.tags.push("Quickest");
          }
          if (flight === bestFlight) {
            flight.tags.push("Best");
          }
        });

        return itineraries;
      }

      case "earliestTakeOff":
        return [...allFlights.data.sortedItineraries].sort((a, b) => {
          return (
            dateTimeToMilliseconds(a.departure_date, a.departure_time) -
            dateTimeToMilliseconds(b.departure_date, b.departure_time)
          );
        });
      case "latestTakeOff":
        return [...allFlights.data.sortedItineraries].sort((a, b) => {
          return (
            dateTimeToMilliseconds(b.departure_date, b.departure_time) -
            dateTimeToMilliseconds(a.departure_date, a.departure_time)
          );
        });
      case "earliestLanding":
        return [...allFlights.data.sortedItineraries].sort((a, b) => {
          return (
            dateTimeToMilliseconds(a.arrival_date, a.arrival_time) -
            dateTimeToMilliseconds(b.arrival_date, b.arrival_time)
          );
        });
      case "latestLanding":
        return [...allFlights.data.sortedItineraries].sort((a, b) => {
          return (
            dateTimeToMilliseconds(b.arrival_date, b.arrival_time) -
            dateTimeToMilliseconds(a.arrival_date, a.arrival_time)
          );
        });
      case "highestPrice":
        return [...allFlights.data.sortedItineraries].sort((a, b) => {
          return b.fare_details.total_fare - a.fare_details.total_fare;
        });
      case "slowest":
        return [...allFlights.data.sortedItineraries].sort((a, b) => {
          return (
            b.itinerary_leg_descs[0].duration -
            a.itinerary_leg_descs[0].duration
          );
        });
      default:
        return allFlights.data.sortedItineraries;
    }
  };

  const sortedFlights = useMemo(() => sortFlights(), [sortCriteria]);

  const filteredFlights = useMemo(
    () => getFilteredFlights(sortedFlights, filterOptions),
    [sortedFlights, filterOptions]
  );
  // this effect for the counting length of filtered flights
  useEffect(() => {
    setFilteredData(filteredFlights);
  }, [filterOptions, filteredFlights.length]);

  const filterInfo = {
    departure_time: searchParams?.departure_time,
    arrival_time: searchParams?.arrival_time,
    flight_number: searchParams?.flight_number,
    operating_code: searchParams?.operating_code,
  };

  const matchingFlight = allFlights?.data.sortedItineraries.find((flight) => {
    // Check if any schedule inside the flight matches the given flight number and operating code
    const scheduleMatch = flight?.schedules?.some(
      (schedule) =>
        filterInfo.flight_number?.includes(String(schedule.flight_number)) &&
        filterInfo.operating_code?.includes(String(schedule.operating_code))
    );

    // Match departure and arrival times from the main flight object
    return (
      scheduleMatch &&
      flight.departure_time === filterInfo.departure_time &&
      flight.arrival_time === filterInfo.arrival_time
    );
  });

  // this effect for getting the cheapest, Best and Quickest flight
  useEffect(() => {
    if (!allFlights) return;
    // const itineraries = [...allFlights?.data?.sortedItineraries]; // Work with a copy
    let itineraries = _.cloneDeep(allFlights?.data?.sortedItineraries);

    // Step 1: Initialize min/max values
    let minFare = Infinity,
      maxFare = -Infinity,
      minDuration = Infinity,
      maxDuration = -Infinity,
      minLayover = Infinity,
      maxLayover = -Infinity;

    itineraries.forEach((flight) => {
      const fare = flight.fare_details?.total_fare || 0;
      const duration = flight.itinerary_leg_descs?.[0]?.duration || 0;
      const layover = flight.itinerary_leg_descs?.[0]?.schedules
        ?.map((s) => s.layover_time || 0)
        .reduce((a, b) => a + b, 0); // Sum up layover times

      minFare = Math.min(minFare, fare);
      maxFare = Math.max(maxFare, fare);
      minDuration = Math.min(minDuration, duration);
      maxDuration = Math.max(maxDuration, duration);
      minLayover = Math.min(minLayover, layover);
      maxLayover = Math.max(maxLayover, layover);
    });

    // Step 2: Compute best score in a single loop
    itineraries.forEach((flight) => {
      const fare = flight.fare_details?.total_fare || 0;
      const duration = flight.itinerary_leg_descs?.[0]?.duration || 0;
      const layover = flight.itinerary_leg_descs?.[0]?.schedules
        ?.map((s) => s.layover_time || 0)
        .reduce((a, b) => a + b, 0); // Sum up layover times

      // Normalize each parameter (Lower values are better)
      const normalizedFare = (fare - minFare) / (maxFare - minFare || 1);
      const normalizedDuration =
        (duration - minDuration) / (maxDuration - minDuration || 1);
      const normalizedLayover =
        (layover - minLayover) / (maxLayover - minLayover || 1);

      // Compute best score (Lower score is better)
      flight.bestScore =
        normalizedFare + normalizedDuration + normalizedLayover;
      flight.tags = []; // Initialize empty tags
    });

    // Step 3: Sort flights for ranking
    const sortByCheapest = [...itineraries].sort(
      (a, b) =>
        (a.fare_details?.total_fare || 0) - (b.fare_details?.total_fare || 0)
    );
    const sortByQuickest = [...itineraries].sort(
      (a, b) =>
        (a.itinerary_leg_descs?.[0]?.duration || 0) -
        (b.itinerary_leg_descs?.[0]?.duration || 0)
    );
    const sortByBest = [...itineraries].sort(
      (a, b) => a.bestScore - b.bestScore // Lower is better
    );

    // Step 4: Get top-ranked flights
    const cheapestFlight = sortByCheapest[0];
    const quickestFlight = sortByQuickest[0];
    const bestFlight = sortByBest[0];

    setTopSortedFlights({
      cheapest: cheapestFlight,
      best: bestFlight,
      quickest: quickestFlight,
    });
  }, [allFlights]);
  if (loadingRevalidate) {
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
    <>
      <div className="bg-[#F0F3F5] py-10">
        <LoadingBar color="#f11946" height={2} ref={ref} />
        {allFlightsLoading ? (
          <ResultPageSkeleton />
        ) : (
          <>
            <div className="block md:hidden">
              <div className=" flex md:hidden w-full md:w-[260px] h-[160px] bg-white rounded-lg border p-4 flex-col justify-between  ">
                <div className="p-4 flex justify-center flex-col gap-1 items-center">
                  <h2 className="text-xl font-bold text-gray-800">Time Left</h2>
                  <div className=" text-3xl font-mono text-[#FC660F]">
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                  </div>
                  <p className="text-[12px] text-center">
                    Make sure to book before this time.
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center my-5">
                <Drawer>
                  <DrawerTrigger className="bg-transparent border p-2 rounded-md mx-5 ">
                    <div className="flex items-center gap-2">
                      <FilterXIcon size={20} />
                      <p>Filter</p>
                    </div>
                  </DrawerTrigger>
                  <DrawerContent>
                    {/* <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>
                      This action cannot be undone.
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                    <button>Submit</button>
                   
                  </DrawerFooter> */}

                    <div className="overflow-auto max-h-screen w-full mx-auto">
                      <FlightFilter
                        timer={{
                          minutes,
                          seconds,
                        }}
                        allFlights={allFlights?.data?.sortedItineraries}
                      />
                    </div>
                    <DrawerClose>
                      <button className="bg-[#FC660F] py-1  px-2 rounded-md text-white ">
                        Submit
                      </button>
                    </DrawerClose>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center animate-fade-in">
                  <h2 className="text-2xl font-bold text-red-500 mb-4">
                    Time&apos;s Up!
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
              <div className="flex gap-0 md:gap-5">
                <div className="hidden md:block">
                  <FlightFilter
                    timer={{
                      minutes,
                      seconds,
                    }}
                    allFlights={allFlights?.data?.sortedItineraries}
                  />
                </div>

                <div className="flex-1">
                  {matchingFlight !== undefined && (
                    <FlightCard
                      type="shared"
                      setLoadingRevalidate={setLoadingRevalidate}
                      flight={matchingFlight}
                    />
                  )}
                  <div className="">
                    <TopFilter
                      setSortCriteria={setSortCriteria}
                      sortCriteria={sortCriteria}
                      topSortedFlights={topSortedFlights}
                    />
                  </div>

                  {/* {allFlights?.data?.sortedItineraries ? (
                    allFlights.data.sortedItineraries.map((flight) => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))
                  ) : (
                    <p>No flights available</p>
                  )} */}
                  {filteredFlights.length > 0 ? (
                    filteredFlights.map((flight) => (
                      <FlightCard
                        setLoadingRevalidate={setLoadingRevalidate}
                        key={flight.id}
                        flight={flight}
                        sortCriteria={sortCriteria}
                      />
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
      {/* {loadingRevalidate && (
        <div className="fixed left-0 top-0 w-full h-screen  z-50"></div>
      )} */}
    </>
  );
}
