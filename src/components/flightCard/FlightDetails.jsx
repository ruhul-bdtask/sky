import { convertMinutesToHours } from "@/lib/formatMinutes";
import { formatShortDate } from "@/lib/formatShortDate";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { GiCommercialAirplane } from "react-icons/gi";
import IconDetails from "./IconDetails";
import { fetchAirlinesData, fetchAirportsData } from "@/utils/api";

const FlightDetails = ({ flight }) => {
  const {
    airline_logo,
    airline_name,
    airline_code,
    origin_airport_name,
    arrival_time,
    departure_time,
    schedules,
    destination_airport_name,
    flight_duration,
    departure_date,
  } = flight;

  const {
    data: airlinesData = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["airlines"],
    queryFn: fetchAirlinesData,
  });

  const {
    data: airportsData = [],
    error: airportError,
    isLoading: airportLoading,
  } = useQuery({
    queryKey: ["airports"],
    queryFn: fetchAirportsData,
  });

  const getAirline = (srtCode) => {
    const airline = airlinesData.find((airline) => airline?.iata === srtCode);
    return airline ? airline.name : "Unknown Airline";
  };

  const getAirport = (srtCode) => {
    const airport = airportsData.find((airport) => airport?.value === srtCode);
    return airport ? airport.label : "Unknown Airport";
  };

  const getChangingCity = (srtCode) => {
    const airport = airportsData.find((airport) => airport?.value === srtCode);
    return airport ? airport.label : "Unknown City";
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="m-5 border rounded-xl cursor-default "
    >
      <div className="flex justify-between border-b p-3">
        <strong className="font-semibold">
          Depart • {formatShortDate(departure_date)}
        </strong>
        <span>{flight_duration}</span>
      </div>

      {schedules.map((schedule) => {
        return (
          <div key={schedule.flight_number}>
            {/* Layover Information */}
            {schedule?.layover_time > 0 && (
              <div className="p-3 space-x-3 text-xs border-y m-4">
                <span>{convertMinutesToHours(schedule.layover_time)}</span>
                <span>•</span>
                <span>
                  Changes Planes in{" "}
                  {getChangingCity(schedule?.departure_airport)}
                </span>
                {schedule.layover_time > 180 && (
                  <span className="py-1 px-2 bg-red-100 rounded-md text-red-900 font-[500]">
                    Long layover
                  </span>
                )}
              </div>
            )}

            {/* Flight Schedule Information */}
            <div className="px-4 py-1 flex justify-between">
              <div>
                {/* Airline Information */}
                <div className="space-x-2 flex items-center text-sm text-gray-500">
                  {/* <Image src={airline_logo} width={50} height={50} alt="logo" /> */}
                  <Image
                    src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${schedule?.operating_code}.png`}
                    // src={`https://pics.avs.io/200/200/${stop?.operating_code}@2x.png`}
                    alt="airline logo"
                    height={30}
                    width={30}
                  />
                  <span>{getAirline(schedule.operating_code)}</span>

                  <div className="border border-gray-700 py-0.5 px-2 rounded focus:outline-none">
                    {schedule?.equipment}
                  </div>
                </div>

                {/* Departure, Duration, and Arrival Information */}
                <div className="my-3 text-sm  ">
                  {/* Departure */}
                  <div className="space-x-7 flex min-h-8 text-gray-800 ">
                    <div className="ml-2 relative">
                      <span className="h-2 w-2 bg-white border rounded-full border-gray-400 absolute top-0"></span>
                      <span className="h-full w-[1px] bg-gray-400 flex ml-[3px]"></span>
                    </div>
                    <strong className="font-semibold ">
                      {schedule?.departure_time}
                    </strong>
                    <span>{getAirport(schedule?.departure_airport)}</span>
                  </div>

                  {/* Flight Duration */}
                  <div className="flex space-x-4 text-xs">
                    <GiCommercialAirplane size={25} />
                    <span>{convertMinutesToHours(schedule?.elapsed_time)}</span>
                  </div>

                  {/* Arrival */}
                  <div className="space-x-7 flex min-h-8 text-gray-800">
                    <span className="ml-2 relative">
                      <span className="h-full w-[1px] bg-gray-400 flex ml-[3px]"></span>
                      <span className="h-2 w-2 bg-white border rounded-full border-gray-400 absolute bottom-0"></span>
                    </span>
                    <strong className="font-semibold">
                      {schedule?.arrival_time}
                    </strong>
                    <span>{getAirport(schedule?.arrival_airport)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Facilities */}
              <IconDetails schedule={schedule} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlightDetails;
