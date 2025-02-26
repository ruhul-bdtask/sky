import { useAirlines } from "@/hooks/useAirlines";
import { useAirports } from "@/hooks/useAirports";
import { formatMinutesToHours } from "@/lib/formatMinutesToHours";
import { formatShortDate } from "@/lib/formatShortDate";
import { getAirline } from "@/utils/getAirline";
import { getAirlineLogo } from "@/utils/getAirlineLogo";
import { getAirport } from "@/utils/getAirport";
import { getChangingCity } from "@/utils/getChangingCity";
import { GiCommercialAirplane } from "react-icons/gi";
import IconDetails from "./IconDetails";

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

  const { airportsData } = useAirports();
  const { airlinesData } = useAirlines();

  const totalFlightsDuration = flight.itinerary_leg_descs.reduce(
    (total, current) => total + (current.duration || 0),
    0
  );

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
        <span>{formatMinutesToHours(totalFlightsDuration)}</span>
      </div>

      {schedules.map((schedule) => {
        return (
          <div key={schedule.flight_number}>
            {/* Layover Information */}
            {schedule?.layover_time > 0 && (
              <div className="p-3 space-x-3 text-xs border-y m-4">
                <span>{formatMinutesToHours(schedule.layover_time)}</span>
                <span>•</span>
                <span>
                  Changes Planes in{" "}
                  {getChangingCity(airportsData, schedule?.departure_airport)}
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
                  <img
                    src={getAirlineLogo(schedule?.operating_code)}
                    // src={`https://pics.avs.io/200/200/${stop?.operating_code}@2x.png`}
                    alt="airline logo"
                    className="w-[30px] h-[30px]"
                  />
                  <span className="text-xs  md:text-sm">
                    {getAirline(airlinesData, schedule?.operating_code)}
                  </span>

                  <div className="border border-gray-700 py-0.5 px-2 rounded focus:outline-none text-xs  md:text-sm">
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
                    <span className="text-xs  md:text-sm">
                      {getAirport(airportsData, schedule?.departure_airport) +
                        " " +
                        "(" +
                        schedule?.departure_airport +
                        ")"}
                    </span>
                  </div>

                  {/* Flight Duration */}
                  <div className="flex space-x-4 text-xs">
                    <GiCommercialAirplane size={25} />
                    <span>{formatMinutesToHours(schedule?.elapsed_time)}</span>
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
                    <span className="text-xs  md:text-sm">
                      {getAirport(airportsData, schedule?.arrival_airport) +
                        " " +
                        "(" +
                        schedule?.arrival_airport +
                        ")"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Facilities */}
              <div className="hidden md:block">
                <IconDetails schedule={schedule} />
              </div>
            </div>
            <div className="flex md:hidden py-5 px-10 justify-center">
              <IconDetails schedule={schedule} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlightDetails;
