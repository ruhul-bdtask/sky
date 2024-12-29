// app/components/Header.js
import { useSidebar } from "@/context/sidebar-context";
import { formatFlightFare } from "@/lib/formatFlightFare";
import { unifyTimeFormat } from "@/lib/unifyTimeFormat";
import ActiveIcon from "@/public/icons/ActiveIcon";
import AvatarIcon from "@/public/icons/AvatarIcon";
import HeartIcon from "@/public/icons/HeartIcon";
import logo from "@/public/images/logo.png";
import verify from "@/public/images/verify.png";
import weather from "@/public/images/weather.png";
import Cookies from "js-cookie";
import { Menu, Pencil, SearchIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { HiDotsHorizontal } from "react-icons/hi";
import { isExpired } from "react-jwt";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaExchangeAlt } from "react-icons/fa";
import useAirlineStore from "../../../stores/airlineStore";
import ModalLayout from "../modals/ModalLayout";
import { LuChevronsLeftRight } from "react-icons/lu";
import { fetchData, saveSingleTrip } from "@/utils/api";
export default function Header() {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalPage, setModalPage] = useState("google");
  const router = useRouter();
  const pathname = usePathname();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(null);
  const [isOpenSaved, setIsOpenSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowPopupBtn, setIsShowPopupBtn] = useState(null);
  const dropdownRef = useRef();
  const {
    token,
    savedTrips,
    selectedSavedTrip,
    isChangeTrip,
    isOpenSavedDialog,
    isCreateTrip,
    setIsCreateTrip,
    setIsChangeTrip,
    setToken,
    setIsOpenSavedDialog,
    setSearchData,
    setUserData,
    userData,
    setSavedTrips,
    setSelectedSavedTrip,
    searchData,
  } = useAirlineStore();

  const { destination, arrival, journeyDate, returnDate, tripType } =
    searchData;

  const [tripError, setTripError] = useState("");
  const [formData, setFormData] = useState({
    destination: "",
    name: "",
    start_date: "",
    end_date: "",
    flights: [],
  });

  const [renameTripTerm, setRenameTripTerm] = useState("");
  const [isRenameTrip, setIsRenameTrip] = useState(false);

  // useEffect(() => {
  //   const authToken = Cookies.get("auth-token");
  //   setToken(authToken);
  // }, []);
  const handleLogOut = () => {
    setIsOpenProfile(false);
    Cookies.remove("auth-token");
    if (savedTrips?.length > 0 && savedTrips[0]?.id) {
      setSavedTrips([]);
      setSelectedSavedTrip([]);
    }
    setToken(null);
    router.push("/login");
    setUserData({});
  };

  // useEffect(() => {
  //   if (!selectedSavedTrip.name) {
  //     setIsChangeTrip(true);
  //   }
  // }, [selectedSavedTrip.name]);

  useEffect(() => {
    savedTrips.forEach((trip) => {
      if (trip.name === selectedSavedTrip.name) {
        setSelectedSavedTrip(trip);
      }
    });
  }, [savedTrips]);

  const isMyTokenExpired = isExpired(token);
  const handleChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value;

    // Move focus to the next input field
    if (e.target.value.length === 1 && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }

    setCode(newCode);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    setIsOpen(false);
    setIsLoggedIn(true);
    localStorage.setItem("logged_in", true);

    toast.success("Login successful");
    router.push("/dashboard");
  };

  const toggleMenu = () => {
    setIsOpenProfile(!isOpenProfile);
  };

  const handleSaved = () => {
    setIsOpenSavedDialog(!isOpenSavedDialog);
  };

  const handleRoute = () => {
    router.push("/dashboard");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleChangeTrip = () => {
    setIsChangeTrip(!isChangeTrip);
    setIsShowPopupBtn(null);
  };

  const handleOnTripChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData };
    nextFormData[name] = value;
    setFormData(nextFormData);
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    const newTripName = e.target.name.value;
    if (formData.name.trim().length === 0) {
      setTripError(`Please give a valid trip name`);
      return;
    }

    const tripExists = savedTrips.some(
      (trip) =>
        trip.name.toLowerCase().trim() === newTripName.toLowerCase().trim()
    );

    if (tripExists) {
      setTripError(`${newTripName} is already taken`);
      return;
    }

    if (token) {
      const response = await fetchData(
        "/gds/create-trip",
        "POST",
        formData,
        token
      );
      if (response.success) {
        setSavedTrips([...savedTrips, { ...response.data, flights: [] }]);
        setSelectedSavedTrip(response.data);
        setIsCreateTrip(false);
        setIsChangeTrip(false);
        setFormData({
          destination: "",
          name: "",
          start_date: "",
          end_date: "",
          flights: [],
        });
        setTripError("");
      }
    } else {
      setSavedTrips([...savedTrips, formData]);
      setSelectedSavedTrip(formData);
      setIsCreateTrip(false);
      setIsChangeTrip(false);
      setFormData({
        destination: "",
        name: "",
        start_date: "",
        end_date: "",
        flights: [],
      });
      setTripError("");
    }
  };

  const onSelectSavedTrip = (trip) => {
    setSelectedSavedTrip(trip);
    setIsChangeTrip(false);
  };

  const handleRemoveFlight = async (flight) => {
    let filteredData = [];

    if (token) {
      filteredData = selectedSavedTrip.flights.filter(
        (f) => f.uid !== flight.uid
      );
      const payload = { flight_uid: flight.uid };
      const response = await fetchData(
        "/gds/remove-flight",
        "POST",
        payload,
        token
      );
      if (response.success) {
        toast.success("Flight deleted successfully");
        setIsShowPopupBtn(false);
        // Update the state with the modified savedTrips array
        // setSavedTrips(updatedSavedTrips);
        // setSelectedSavedTrip({
        //   ...selectedSavedTrip,
        //   flights: filteredData,
        // });

        setSavedTrips(
          savedTrips.map((trip) => {
            if (trip.name === selectedSavedTrip.name) {
              return { ...trip, flights: filteredData };
            }
            return trip;
          })
        );

        return;
      } else {
        toast.error("Unable to delete the flight.");
      }
    }

    // remove local if not loggedin

    // filteredData = selectedSavedTrip.flights.filter(
    //   (f) =>
    //     f.flight_data.air_pricing_solution_key !==
    //       flight.flight_data.air_pricing_solution_key &&
    //     f.flight_data.departure_time !== flight.flight_data.departure_time &&
    //     f.flight_data.arrival_time !== flight.flight_data.arrival_time
    // );

    // setSelectedSavedTrip({
    //   ...selectedSavedTrip,
    //   flights: filteredData,
    // });
    // setSavedTrips(
    //   savedTrips.map((trip) => {
    //     if (trip.name === selectedSavedTrip.name) {
    //       return { ...trip, flights: filteredData };
    //     }
    //     return trip;
    //   })
    // );
  };

  // handle rename trip
  const onEditTrip = (trip) => {
    setIsRenameTrip(true);
    setRenameTripTerm(trip.name);
  };

  const onChangeTrip = (e) => {
    setRenameTripTerm(e.target.value);
  };

  const handleRenameTrip = async () => {
    try {
      if (token) {
        const payload = {
          trip_id: selectedSavedTrip?.id,
          name: renameTripTerm,
        };

        const response = await fetchData(
          "/gds/rename-trip",
          "POST",
          payload,
          token
        );

        if (response.success) {
          toast.success("Trip renamed successfully");

          // Update the saved trips list
          setSavedTrips(
            savedTrips.map((trip) => {
              if (trip?.id === response?.data?.id) {
                return { ...trip, name: response?.data?.name };
              }
              return trip;
            })
          );

          // Update the selected trip
          setSelectedSavedTrip({
            ...selectedSavedTrip,
            name: response?.data?.name,
          });

          // Close the rename modal
          setIsRenameTrip(false);
        } else {
          toast.error("Unable to rename the trip");
        }
      } else {
        // toast.error("Authentication token is missing. Please log in again.");
        setSavedTrips(
          savedTrips.map((trip) => {
            if (trip.name === selectedSavedTrip?.name) {
              return { ...trip, name: renameTripTerm };
            }
            return trip;
          })
        );

        // Update the selected trip
        setSelectedSavedTrip({
          ...selectedSavedTrip,
          name: renameTripTerm,
        });

        setIsRenameTrip(false);
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error("Error renaming trip:", error);
      toast.error(
        "An error occurred while renaming the trip. Please try again."
      );
    }
  };

  const totalPassengers = searchData?.passengers?.reduce(
    (sum, category) => sum + category.quantity,
    0
  );

  const formatDate = (journeyDate) => {
    const date = new Date(journeyDate);

    // Format: 2024-12-25T00:00:00
    const isoFormat = date.toISOString().split("T")[0] + "T00:00:00";

    // Format: Wed12/25
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dayOfMonth = String(date.getDate()).padStart(2, "0");
    const shortFormat = `${day} ${month}/${dayOfMonth}`;

    // Return the desired format
    return ` ${shortFormat}`; // Combine or use as needed
  };
  return (
    <header className={`bg-white  fixed left-0 z-50 right-0 h-20 border-b  `}>
      <ModalLayout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        sjfhfdgv
      </ModalLayout>
      <div className="max-w-full sm:px-6 lg:px-2 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-black hover:bg-gray-100 focus:outline-none  hidden md:block "
            >
              <span className="sr-only">Open sidebar</span>
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <Link href={"/"} onClick={() => setSearchData({})}>
              <Image className="mx-4 md:mx-0" alt="logo" src={logo}></Image>
            </Link>
          </div>
          <div>
            {pathname == "/search-result" && searchData?.tripType && (
              <div
                className="w-full flex items-center  gap-1"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="bg-[#f0f3f5] px-2 py-3 rounded-lg text-sm cursor-pointer hover:bg-gray-300 transition-all border-[#d9e2e8] border">
                  {tripType == "one_way"
                    ? "One way"
                    : tripType == "return"
                    ? "Return"
                    : "Multi city"}
                </div>

                <div className="bg-[#f0f3f5] px-4 py-3 rounded-lg text-sm cursor-pointer  transition-all flex items-center gap-4 border-[#d9e2e8] border">
                  <div>{destination}</div>
                  <FaExchangeAlt
                    className="hover:bg-gray-300 p-1 rounded-md"
                    size={20}
                  />
                  <div>{arrival}</div>
                </div>

                <div className="bg-[#f0f3f5] px-2 py-3 rounded-lg text-sm cursor-pointer  transition-all border-[#d9e2e8] border flex items-center gap-3">
                  {formatDate(journeyDate)} <LuChevronsLeftRight size={20} />
                  {tripType == "return" && (
                    <>
                      <div class="border-l-2 border-gray-100 h-5"></div>
                      {formatDate(returnDate)} <LuChevronsLeftRight size={20} />
                    </>
                  )}
                </div>

                <div className="bg-[#f0f3f5] px-2 py-3 rounded-lg text-sm cursor-pointer  transition-all border-[#d9e2e8] border flex items-center gap-4">
                  <span>
                    {totalPassengers}{" "}
                    {totalPassengers !== 1 ? "Travelers" : "Adult"}
                  </span>{" "}
                  <span>
                    {searchData?.class == "Y"
                      ? "Economy"
                      : searchData?.class == "P"
                      ? "Premium Economy"
                      : searchData?.class == "C"
                      ? "Business"
                      : "First class"}
                  </span>
                </div>
                <button
                  className="rounded-[10px] bg-[#FC660F] w-[50px] h-[50px] hover:bg-[#d67136]"
                  type="submit"
                >
                  <div className="flex justify-center items-center w-full text-white">
                    <SearchIcon />
                  </div>
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                className="p-2 rounded-full text-gray-400 hover:text-black focus:outline-none "
                onClick={handleSaved}
              >
                <span className="sr-only">View favorites</span>
                <HeartIcon />
              </button>
              {isOpenSavedDialog && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                  <div
                    className="absolute inset-0 "
                    onClick={handleSaved}
                  ></div>
                  <div className="absolute right-0 top-0 h-full w-full max-w-[421px] overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out">
                    <div className="sticky top-0 z-10 border-b bg-white p-4">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={handleSaved}
                          className="text-black hover:text-gray-700 "
                        >
                          <X className="h-6 w-6" />
                        </button>

                        {isRenameTrip ? (
                          <button
                            onClick={() => setIsRenameTrip(false)}
                            className="text-[16px] font-semibold text-[#0C7C99]"
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            onClick={handleToggleChangeTrip}
                            className="text-[16px] font-semibold text-[#0C7C99]"
                          >
                            {isChangeTrip ? "Cancel" : "Change Trip"}
                          </button>
                        )}
                      </div>
                    </div>
                    {!isChangeTrip &&
                      selectedSavedTrip?.name &&
                      !isRenameTrip && (
                        <div className="p-4">
                          <div className="mb-6 flex items-start justify-between ">
                            <div className="flex items-center gap-4">
                              <Image
                                alt="image"
                                width={80}
                                height={80}
                                src={weather}
                              ></Image>
                              <div>
                                <h2 className="text-lg font-bold">
                                  {selectedSavedTrip.name}
                                </h2>
                                <p className="text-sm text-black">
                                  {selectedSavedTrip.start_date} -{" "}
                                  {selectedSavedTrip.end_date}
                                </p>
                                <p className="text-sm text-black">
                                  {selectedSavedTrip.destination}
                                </p>
                              </div>
                            </div>
                            <button className="text-black">
                              <Pencil
                                className="h-5 w-5"
                                onClick={() => onEditTrip(selectedSavedTrip)}
                              />
                            </button>
                          </div>

                          <div className="mb-4">
                            <h3 className="text-lg font-semibold">Flights</h3>
                          </div>
                          <div className="mb-4">
                            {savedTrips?.length > 0 && (
                              <h4 className="mb-2 text-sm font-semibold">
                                Saved Flights (
                                {selectedSavedTrip?.flights?.length})
                              </h4>
                            )}

                            <div class="w-[373px]  shadow-xl ">
                              <div class="flex justify-between items-center bg-[#F0F3F5]  rounded-t-[20px] p-6">
                                <div class="text-left">
                                  <div class="text-lg font-semibold text-gray-800">
                                    {savedTrips[0]?.origin_code} -{" "}
                                    {savedTrips[0]?.destination_code}
                                  </div>
                                  <div class="text-sm text-black">
                                    12/9 - 15/9
                                  </div>
                                </div>
                                <div class="text-right">
                                  <span class="text-xs font-medium text-black">
                                    Economy
                                  </span>
                                </div>
                              </div>

                              {selectedSavedTrip?.flights?.map(
                                (flight, index) => (
                                  <div
                                    class="flex flex-col gap-4 mt-4 p-4 border-b"
                                    key={index}
                                  >
                                    <div className="flex items-center justify-between text-sm">
                                      <span class="font-medium text-gray-800">
                                        {flight?.flight_data?.airline_name}
                                      </span>
                                      <div className="font-medium text-gray-800 relative">
                                        <button
                                          className={`w-6 h-5 flex justify-center items-center rounded ${
                                            isShowPopupBtn === index
                                              ? "bg-gray-200"
                                              : "bg-gray-100"
                                          }`}
                                          onClick={() =>
                                            setIsShowPopupBtn(
                                              isShowPopupBtn === index
                                                ? null
                                                : index
                                            )
                                          }
                                        >
                                          <HiDotsHorizontal />
                                        </button>
                                        {isShowPopupBtn === index && (
                                          <div className="rounded-md border text-center absolute top-6 right-0 bg-white shadow-md">
                                            <button className="block p-3 border-b w-full hover:text-[#0C7C99] transition-all">
                                              Search
                                            </button>
                                            {token && (
                                              <button
                                                className="block p-3 w-full text-red-400 hover:text-[#0C7C99] transition-all"
                                                onClick={() =>
                                                  handleRemoveFlight(flight)
                                                }
                                              >
                                                Remove
                                              </button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 justify-between ">
                                      <div className="">
                                        {flight?.flight_data?.schedules?.map(
                                          (schedule, index) => (
                                            <div
                                              class="mt-3 py-3 px-1  rounded-lg"
                                              key={index}
                                            >
                                              <div class="text-xs text-black border px-2 py-1 inline-block rounded-full mb-2">
                                                {
                                                  flight?.flight_data
                                                    ?.departure_date
                                                }
                                              </div>

                                              <div class="flex items-center justify-between">
                                                <Image
                                                  width={50}
                                                  height={50}
                                                  src={
                                                    flight?.flight_data
                                                      ?.airline_logo
                                                  }
                                                  alt="Air line Logo"
                                                  class="h-8 w-8 object-contain"
                                                />
                                                <div class="flex flex-col text-center">
                                                  <span class="text-lg font-semibold">
                                                    {unifyTimeFormat(
                                                      flight?.flight_data
                                                        ?.departure_time
                                                    )}
                                                  </span>
                                                  <span class="text-xs text-black">
                                                    {
                                                      flight?.flight_data
                                                        ?.origin_code
                                                    }
                                                  </span>
                                                </div>
                                                <div class="flex flex-col items-center text-xs text-black border-b">
                                                  <span>
                                                    {" "}
                                                    {
                                                      flight?.flight_data
                                                        ?.flight_duration
                                                    }
                                                  </span>
                                                </div>
                                                <div class="flex flex-col text-center">
                                                  <span class="text-lg font-semibold">
                                                    {unifyTimeFormat(
                                                      flight?.flight_data
                                                        ?.arrival_time
                                                    )}
                                                  </span>
                                                  <span class="text-xs text-black">
                                                    {
                                                      flight?.flight_data
                                                        ?.destination_code
                                                    }
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                      <div class="me-2">
                                        <div class="text-[18px] font-semibold text-black">
                                          Tk .
                                          {formatFlightFare(
                                            flight?.flight_data?.fare_details
                                              ?.total_fare
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    {/* ======== Rename Trip ============= */}
                    {isRenameTrip && (
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-2">
                          Rename trip
                        </h4>
                        <span className="text-gray-400 block text-sm mb-6">
                          Organize, manage and plan where you're going— no
                          matter where you book.
                        </span>
                        <label htmlFor="rename-trip" className="text-sm">
                          Trip name
                        </label>
                        <input
                          className={`w-full rounded p-2 hover:bg-gray-100 transition-all duration-500 outline-none border focus:border-gray-500 ${
                            renameTripTerm === selectedSavedTrip.name &&
                            "border-red-500 focus:border-red-500"
                          }`}
                          id="rename-trip"
                          type="text"
                          value={renameTripTerm}
                          onChange={(e) => onChangeTrip(e)}
                        />
                        <span className="block mt-2 mb-10 text-xs text-gray-400">
                          50 characters maximum
                        </span>
                        <hr className="my-5" />
                        <button
                          onClick={handleRenameTrip}
                          disabled={renameTripTerm === selectedSavedTrip.name}
                          className={`w-full rounded py-2 px-3 font-semibold text-sm ${
                            renameTripTerm !== selectedSavedTrip.name
                              ? "bg-gray-700 text-white"
                              : "bg-gray-300 text-gray-400"
                          }`}
                        >
                          Rename trip
                        </button>
                      </div>
                    )}

                    {/* ============ Create a new trip show trip lists   ============*/}
                    <div className="">
                      <div className="p-4">
                        {isChangeTrip && !isCreateTrip && (
                          <div>
                            <div className="">
                              <h2 className="border-b-2 pb-3">Choose Trip</h2>
                              <button
                                onClick={() => setIsCreateTrip(true)}
                                className="flex space-x-2 justify-center items-center py-3"
                              >
                                <span className="p-3 bg-slate-200 rounded-md">
                                  <AiOutlinePlus size={20} />
                                </span>
                                <span className="font-semibold text-sm">
                                  Create New Trip
                                </span>
                              </button>
                            </div>
                            {/* Show trip lists */}
                            {savedTrips.length > 0 &&
                              savedTrips.map((trip) => (
                                <div key={trip.name} className="my-2 ">
                                  <button
                                    className="flex space-x-2 items-center"
                                    onClick={() => onSelectSavedTrip(trip)}
                                  >
                                    <Image
                                      className="rounded-md"
                                      width={45}
                                      height={45}
                                      src={weather}
                                      alt="place"
                                    />
                                    <div className="text-start flex items-start justify-between">
                                      <div>
                                        <div>
                                          <span className="font-semibold text-sm">
                                            {trip.name}
                                          </span>
                                          {trip.name ===
                                            selectedSavedTrip.name && (
                                            <span className="ml-3 border border-green-400 shadow-md px-2 py-0 bg-green-100 text-green-600 rounded-full text-xs">
                                              Selected
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-sm">
                                          {trip.start_date} - {trip.end_date}
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* Create a new trip form */}
                        {isChangeTrip && isCreateTrip && (
                          <div>
                            <form
                              onSubmit={handleCreateTrip}
                              className="space-y-5"
                            >
                              <h2 className="font-semibold text-2xl">
                                Create a new Trip
                              </h2>

                              <div>
                                <label className="block">
                                  Add a destination
                                </label>
                                <input
                                  className="block border rounded w-full outline-none p-1.5 hover:bg-gray-100"
                                  type="text"
                                  name="destination"
                                  onChange={handleOnTripChange}
                                  value={formData.destination}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block">Name your Trip</label>
                                <input
                                  className="block border rounded w-full outline-none p-1.5 hover:bg-gray-100"
                                  type="text"
                                  name="name"
                                  onChange={handleOnTripChange}
                                  value={formData.name}
                                  required
                                />
                                {tripError && (
                                  <p className="text-red-500">{tripError}*</p>
                                )}
                              </div>
                              <div className="flex justify-between">
                                <span>
                                  <label className="block">Start Date</label>
                                  <input
                                    className="border rounded outline-none p-1.5 hover:bg-gray-100"
                                    type="date"
                                    name="start_date"
                                    onChange={handleOnTripChange}
                                    value={formData.start_date}
                                    required
                                  />
                                </span>
                                <span>
                                  <label className="block">End Date</label>
                                  <input
                                    className="border rounded outline-none p-1.5 hover:bg-gray-100"
                                    type="date"
                                    name="end_date"
                                    onChange={handleOnTripChange}
                                    value={formData.end_date}
                                    required
                                  />
                                </span>
                              </div>
                              <div className="flex space-x-5">
                                <button
                                  className={` px-3 py-2 rounded ${
                                    !formData.name
                                      ? "bg-gray-100 text-gray-400 "
                                      : "bg-gray-600 text-gray-50 hover:bg-gray-700 transition-all"
                                  }`}
                                  type="submit"
                                  disabled={!formData.name}
                                  required
                                >
                                  Create
                                </button>
                                <button
                                  onClick={() => setIsCreateTrip(false)}
                                  className="bg-gray-300 px-3 py-2 rounded"
                                  type="button"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <ToastContainer closeOnClick={true} />
            {token ? (
              <>
                <div
                  className="relative inline-block text-left"
                  ref={dropdownRef}
                >
                  <div onClick={toggleMenu}>
                    {/* <button className="flex items-center focus:outline-none">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                        M
                      </div>
                    </button> */}

                    <div className="w-[40px] h-[40px] cursor-pointer">
                      <img
                        className="rounded-full h-full w-full object-cover"
                        src={userData?.profile_pic}
                        alt=""
                      />
                    </div>
                  </div>

                  {isOpenProfile && (
                    <div className="absolute right-0 z-10 w-80 mt-2 bg-white rounded-md shadow-lg border border-gray-200">
                      <div className="py-2 px-4 flex items-center gap-2">
                        <div className="w-[40px] h-[40px] ">
                          <img
                            className="rounded-full h-full w-full object-cover"
                            src={userData?.profile_pic}
                            alt=""
                          />
                        </div>
                        <div className="flex flex-1 justify-between items-center">
                          <div>
                            <p className="text-[16px] font-[500] text-black">
                              {userData?.first_name + " " + userData?.last_name}
                            </p>
                            <p className="text-[10px] text-black">
                              {userData?.email}
                            </p>
                          </div>
                          <ActiveIcon />
                        </div>
                      </div>
                      <div className="border-t border-gray-200">
                        <div className="flex flex-col gap-3 py-2 px-4">
                          {/* <button className="flex items-center gap-2 t  w-full ">
                            <div className="w-10 h-10 rounded-full bg-[#0E0E0E] flex items-center justify-center  text-white">
                              <UserIcon />
                            </div>
                            <span className="text-[16px] font-[500]">
                              Add user
                            </span>
                          </button> */}
                          <p className="py-1 text-sm text-black cursor-pointer">
                            Trips
                          </p>
                          <p className="py-1 text-sm text-black cursor-pointer">
                            Help/FAQ
                          </p>
                          <Link
                            onClick={() => setIsOpenProfile(false)}
                            href={"/dashboard"}
                            className="py-1 text-sm text-black cursor-pointer"
                          >
                            Your account
                          </Link>
                        </div>
                      </div>
                      <div className="py-2 px-4">
                        <button
                          onClick={handleLogOut}
                          className="w-full text-center text-black border border-black  py-1.5 rounded"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href={"/login"}>
                <button
                  className="flex items-center gap-2 p-3 border border-[#9BA8B0] justify-center rounded-[10px] "
                  onClick={handleRoute}
                >
                  <AvatarIcon />
                  Sign in
                </button>
              </Link>
            )}
            {/* {token ? (
              <>
                <button
                  className="flex items-center gap-2 p-3 border border-[#9BA8B0] justify-center rounded-[10px] "
                  onClick={handleLogOut}
                >
                  <AvatarIcon />
                  Logout
                </button>
              </>
            ) : (
              <Link href={"/login"}>
                <button
                  className="flex items-center gap-2 p-3 border border-[#9BA8B0] justify-center rounded-[10px] "
                  onClick={handleRoute}
                >
                  <AvatarIcon />
                  Sign in
                </button>
              </Link>
            )} */}
          </div>
        </div>

        {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[490px] top-[12%] translate-y-0 px-8 py-4 rounded-[11px] bg-white">
            {modalPage == "google" && (
              <>
                <DialogHeader>
                  <Image alt="logo" className="w-24" src={logo}></Image>
                </DialogHeader>
                <div className="grid w-full items-center gap-4">
                  <div className="bg-[#FFECE0] p-8 flex justify-center items-center rounded-[16px] mt-5">
                    <Image
                      alt="device"
                      className="w-[147px] h-[182px]"
                      src={device}
                    ></Image>
                  </div>
                  <div className="py-2">
                    <h2 className="text-[20px] font-[500]">
                      Sign in or create an account
                    </h2>
                    <p className="text-[12px] ">
                      Track prices, organize travel plans and access member-only
                      deals with your ticketing account.
                    </p>
                  </div>
                  <button
                    className="bg-[#D9E2E8] p-2 w-full rounded-[10px] border border-[#9BA8B0]"
                    onClick={() => setModalPage("emailInput")}
                  >
                    <div className="flex justify-center items-center gap-3">
                      <MessageIcon />
                      <p className="text-[14px] font-[500]">
                        Continue with email
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center justify-center ">
                    <div className="w-full h-px bg-gray-300"></div>
                    <span className="mx-3 text-black">or</span>
                    <div className="w-full h-px bg-gray-300"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <button
                      className="flex items-center gap-2 p-3 border border-[#9BA8B0] justify-center rounded-[10px]"
                      onClick={handleClick}
                    >
                      <Image alt="google" src={google}></Image>
                      Google
                    </button>
                    <button
                      className="flex items-center gap-2 p-3 border border-[#9BA8B0] justify-center rounded-[10px]"
                      onClick={handleClick}
                    >
                      <Image alt="apple" src={apple}></Image>
                      Apple
                    </button>
                  </div>
                  <p className="text-[10px]">
                    By signing up you accept our terms of use and privacy
                    policy.
                  </p>
                </div>
              </>
            )}
            {modalPage == "emailInput" && (
              <>
                <div>
                  <button
                    className="text-[14px] flex items-center gap-[4px]"
                    onClick={() => setModalPage("google")}
                  >
                    <LeftArrowIcon />
                    Back
                  </button>
                  <form action="">
                    <h2 className="text-[18px] font-[500] pb-5 pt-4">
                      What&apos;s your email address?
                    </h2>
                    <input
                      type="text"
                      className="border w-full p-2 focus:outline-none border-black"
                    />
                    <button
                      className="w-full bg-[#FE6510] text-white text-[16px] font-[500] p-2 mt-2"
                      onClick={() => setModalPage("verify")}
                    >
                      Continue
                    </button>
                  </form>
                </div>
              </>
            )}
            {modalPage == "verify" && (
              <div className="flex items-center justify-center ">
                <div className="bg-white rounded-lg  w-full">
                  <button
                    className="text-[14px] flex items-center gap-[4px]"
                    onClick={() => setModalPage("emailInput")}
                  >
                    <LeftArrowIcon />
                    Back
                  </button>
                  <div className="flex flex-col ">
                    <div className="flex justify-center items-center">
                      <Image src={verify} alt="verify" className="mb-4 w-48 " />
                    </div>
                    <h2 className="text-[18px] font-[500] mb-2">
                      Please verify your email address
                    </h2>
                    <p className="text-left  text-[14px]">
                      We just sent a 6-digit verification code to your email:
                      <strong>myname123456@gmail.com</strong>. Please enter the
                      code within 10 minutes.
                    </p>
                    <Link
                      href={"#"}
                      className="text-[#0B7C9E] text-[18px] my-5 flex items-center gap-2"
                    >
                      Open Gmail
                      <LinkIcon />
                    </Link>
                    <div className="flex space-x-2 mb-4">
                      {code.map((digit, index) => (
                        <input
                          key={index}
                          id={`code-input-${index}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleChange(e, index)}
                          className="w-12 h-12 border border-gray-300 rounded text-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ))}
                    </div>

                    <p className="text-[10px]  mt-4">
                      Can’t find the email? Try checking your spam folder, or{" "}
                      <a href="#" className="text-[#0B7C9E] hover:underline">
                        send a new code
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog> */}
      </div>
    </header>
  );
}
