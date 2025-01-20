"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import BookingFormComp from "@/components/bookingFormComp/BookingFormComp";
import { ChevronLeft, Info, Timer } from "lucide-react";
import Link from "next/link";
import { isExpired, decodeToken } from "react-jwt";
import {
  ChevronDown,
  ChevronUp,
  Luggage,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import BookingConfirmationModal from "@/components/bookingConfirmationModal/BookingModal";
import { toast } from "react-toastify";
import useAirlineStore from "../../../stores/airlineStore";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Oval } from "react-loader-spinner";
import { formatFlightFare } from "@/lib/formatFlightFare";
import Image from "next/image";

export default function BookingForm() {
  const [activeTab, setActiveTab] = useState("passengers");
  const [isOpenContact, setIsOpenContact] = useState(false);
  const [showFareRules, setShowFareRules] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  const {
    searchData,
    OriginDestinationInformation,
    LegDescription,
    selectedFlight,
    setToken,
    token,
    contactInformation,
    setContactInformation,
    passengerInformation,
    setSearchData,
    setOriginDestinationInformation,
    setPassengerInformation,
    setLegDescription,
    setSelectedFlight,
    setUserData,
    timeLeft,
    startCountdown,
  } = useAirlineStore();

  useEffect(() => {
    if (timeLeft > 0) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      setMinutes(minutes);
      setSeconds(seconds);
    }
    if (timeLeft === 0) {
      setIsTimeModalOpen(true);
    }
  }, [timeLeft]);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    startCountdown();
  }, [startCountdown]);

  const isMyTokenExpired = isExpired(token);

  const { passengers } = searchData;
  const [passengerData, setPassengerData] = useState([]);

  // useEffect(() => {
  //   // Flatten passenger types into a single array of passenger objects
  //   const totalPassengers = passengers?.flatMap((p, index) =>
  //     Array.from({ length: p.quantity }, (_, i) => ({
  //       pxn_type: p.type,
  //       pxn_title_1: "Mr.", // Default title
  //       // [`pxn_title_${i + 1}`]: "Mr.", // Dynamically assigning pxn_title for each passenger
  //       firstName: "",
  //       lastName: "",
  //       documentType: "",
  //       country: "",
  //       dob: "",
  //       docNumber: "",
  //       doc_expire_date: "",
  //     }))
  //   );

  //   setPassengerData(totalPassengers);
  // }, [passengers]);

  // Generate pxn_title fields dynamically
  const passengerTitles = passengerData?.reduce((acc, _, index) => {
    acc[`pxn_title_${index + 1}`] = "Mr."; // Assign title, can adjust as needed
    return acc;
  }, {});

  const updatePassengerData = (index, field, value) => {
    setPassengerData((prevData) =>
      prevData.map((passenger, i) =>
        i === index
          ? {
              ...passenger,
              [field]: value, // Dynamically add the pxn_title field
            }
          : passenger
      )
    );
  };

  const tabs = [
    { id: "passengers", label: "Passengers" },
    { id: "payment", label: "Payment" },
    { id: "confirm", label: "Confirm" },
  ];

  const handleConfirmModal = () => {
    setActiveTab("confirm");
  };

  useEffect(() => {
    if (activeTab == "confirm") {
      setIsModalOpen(true);
    }
  }, [activeTab]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone);
  };

  const directFlightsOnly = false;
  const availableFlightsOnly = false; // Replace with actual value

  // const PassengerInformation = {
  //   email: contactInfo?.email,
  //   phone_no: contactInfo?.phone,
  //   pxn_type: passengerData?.map((p) => p.pxn_type),
  //   first_name: passengerData?.map((p) => p.firstName),
  //   last_name: passengerData?.map((p) => p.lastName),
  //   dob: passengerData?.map((p) => p.dob || ""),
  //   doc_type: passengerData?.map((p) => p.documentType || ""),
  //   doc_number: passengerData?.map((p) => p.docNumber || ""),
  //   doc_expire_date: passengerData?.map((p) => p.doc_expire_date),
  //   doc_issue_country: passengerData?.map((p) => p.country || ""),
  //   nationality: passengerData?.map((p) => p.country || ""),
  //   ...passengerData?.reduce((acc, passenger, index) => {
  //     const titleKey = `pxn_title_${index + 1}`;
  //     if (passenger[titleKey]) {
  //       acc[titleKey] = passenger[titleKey];
  //     }
  //     console.log(acc)
  //     return acc;
  //   }, {}),
  // };

  const PassengerInformation = {
    email: contactInfo?.email,
    phone_no: contactInfo?.phone,
    pxn_type: passengerData?.map((p) => p.pxn_type),
    first_name: passengerData?.map((p) => p.firstName),
    last_name: passengerData?.map((p) => p.lastName),
    dob: passengerData?.map((p) => p.dob || ""),
    doc_type: passengerData?.map((p) => p.documentType || ""),
    doc_number: passengerData?.map((p) => p.docNumber || ""),
    doc_expire_date: passengerData?.map((p) => p.doc_expire_date),
    doc_issue_country: passengerData?.map((p) => p.country || ""),
    nationality: passengerData?.map((p) => p.country || ""),
    ...passengerData?.reduce((acc, passenger, index) => {
      const titleKey = `pxn_title_${index + 1}`;
      acc[titleKey] = passenger[titleKey] || "Mr.";
      return acc;
    }, {}),
  };

  useEffect(() => {
    // Initialize passengers with default values
    const totalPassengers = passengers?.flatMap((p) =>
      Array.from({ length: p.quantity }, () => ({
        pxn_type: p.type,
        pxn_title: "Mr.", // Default title
        firstName: "",
        lastName: "",
        documentType: "",
        country: "",
        dob: "",
        docNumber: "",
        doc_expire_date: "",
      }))
    );

    // Set default title if not explicitly set
    setPassengerData((prevData) =>
      totalPassengers?.map((newPassenger, index) => ({
        ...newPassenger,
        pxn_title: prevData?.[index]?.pxn_title || "Mr.", // Persist the existing title or set default
      }))
    );
  }, [passengers]);

  const payload = {
    Amount: selectedFlight?.fare_details?.total_fare,
    Coupon: false,
    CouponCode: "",
    RequestLOG: true,
    RequireUTILS: false,
    RequestBody: {
      OriginDestinationInformation: OriginDestinationInformation,
      TargetItinerary: selectedFlight,
      LegDescription: LegDescription,
      DirectFlightsOnly: directFlightsOnly,
      AvailableFlightsOnly: availableFlightsOnly,
      PassengerInformation: PassengerInformation,
    },
  };
  const {
    data: bookingData,
    error: bookingError,
    isLoading: bookingLoading,
    refetch: refetchBookingData,
  } = useQuery({
    queryKey: ["bookingData", payload],
    queryFn: () => fetchData("/gds/make-booking", "POST", payload, token),
    enabled: false,
  });

  const registerPayload = {
    first_name: passengerInformation?.[0]?.firstName,
    last_name: passengerInformation?.[0]?.lastName,
    email: contactInformation?.email,
    phone: contactInformation?.phone,
    verify_by: "email",
  };
  const {
    data: registerData,
    error: registerError,
    isLoading: registerLoading,
    refetch: refetchRegister,
  } = useQuery({
    queryKey: ["register", registerPayload],
    queryFn: () => fetchData("/user/minimal-register", "POST", registerPayload),
    enabled: false,
  });

  const handleBooking = (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(
      contactInfo.email || contactInformation?.email
    );
    const isPhoneValid = validatePhone(
      contactInfo.phone || contactInformation?.phone
    );
    if (!isEmailValid) {
      toast.error("Please enter a valid email address");
    }
    if (!isPhoneValid) {
      toast.error("Please enter a valid phone number");
    }
    if (isEmailValid && isPhoneValid) {
      if (token == null || token == undefined || token == "") {
        refetchRegister();
      } else {
        if (isMyTokenExpired) {
          setToken(null);
          refetchRegister();
        } else {
          refetchBookingData();
          console.log(PassengerInformation);
        }
      }
    }
  };

  useEffect(() => {
    if (registerData?.success == true) {
      setToken(registerData?.authorization?.token);
      setUserData(registerData?.user);
      if (token) {
        refetchBookingData();
      }
    }
  }, [registerData, token]);

  useEffect(() => {
    if (bookingData?.success == true) {
      router.push(bookingData?.data?.redirect_url);
      setPassengerInformation([]);
      setContactInformation({});
      setOriginDestinationInformation([]);
      setSearchData([]);
      setLegDescription([]);
      setSelectedFlight({});
    }
  }, [bookingData]);

  const handleContactInfo = (e) => {
    e.preventDefault();
    if (contactInfo?.email == "") {
      toast.error("Please enter a valid email address");
      return;
    }
    if (contactInfo?.phone == "") {
      toast.error("Please enter a valid phone number");
      return;
    }
    setContactInformation(contactInfo);
    toast.success("Contact saved");
  };

  return (
    <div className="container_section_sm mx-auto p-4 max-w-7xl">
      {isTimeModalOpen && (
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
      <h1 className="text-2xl font-bold mb-6">Make A Booking</h1>
      <p className="flex items-center gap-1">
        {" "}
        <Timer size={20} />{" "}
        <span>
          Time left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
      </p>

      <div className="flex mb-8 gap-5">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`flex-1  py-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-b-8 border-orange-500 text-orange-500"
                : "border-b-8 border-gray-300 text-gray-500"
            }`}
          >
            <span className="mr-2 ">{index + 1}</span>
            {tab.label}
          </div>
        ))}
      </div>
      <div className=" mx-auto my-4">
        <div className="bg-white rounded-lg shadow-md py-6">
          <div className="flex items-center mb-4 border-b w-full px-12 pb-4 ">
            <Info className="w-5 h-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold ">Important information</h2>
          </div>
          <div className="bg-[#FBFBFB] ">
            <p className="text-sm px-12 ">
              <strong>1. Travel from Bangladesh:</strong> You can now pay for
              your flight in BDT. Use locally issued{" "}
              <strong>debit and credit cards</strong> at checkout to enjoy the
              convenience of paying in your currency without any limits.
            </p>
          </div>
        </div>
      </div>

      {activeTab === "passengers" && (
        <>
          <>
            <h2 className="text-[18px] font-[700] py-5">
              Enter Traveler Details
            </h2>
            <form className="flex flex-col gap-5" onSubmit={handleBooking}>
              <div className="py-6 px-16 shadow-custom_shadow">
                <label
                  className={`block text-sm font-medium ${
                    isOpenContact ? "text-black" : "text-[#9A9A9A]"
                  }   mb-1 cursor-pointer text-[18px] font-[600] rounded-[4px]`}
                  onClick={() => setIsOpenContact(!isOpenContact)}
                >
                  Contact Info
                </label>

                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                    <div>
                      <input
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            email: e.target.value,
                          })
                        }
                        type="text"
                        id={`email`}
                        name={`email`}
                        value={
                          contactInfo?.email
                            ? contactInfo?.email
                            : contactInformation?.email
                        }
                        placeholder="Email address"
                        className="border-2 border-[##9B9B9B] p-3 w-full rounded-[4px] focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <input
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              phone: e.target.value,
                            })
                          }
                          type="text"
                          id={`phone`}
                          value={
                            contactInfo?.phone
                              ? contactInfo?.phone
                              : contactInformation?.phone
                          }
                          name={`phone`}
                          placeholder="Phone Number"
                          className="border-2 border-[##9B9B9B] p-3 w-full rounded-[4px] focus:outline-none"
                        />
                      </div>
                      {Object.keys(contactInformation).length == 0 && (
                        <div className="flex justify-center  md:justify-end ">
                          <button
                            onClick={handleContactInfo}
                            className=" bg-[#FC660F] text-white py-3 font-semibold hover:bg-orange-600 transition duration-300 rounded-[4px] w-[200px] h-[49px]"
                          >
                            Save & Next
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {passengerData?.map((passenger, index) => (
                <BookingFormComp
                  passengerData={passengerData}
                  updatePassengerData={updatePassengerData}
                  passenger={passenger}
                  index={index}
                  key={index}
                />
              ))}
              {/* <pre>{JSON.stringify(passengerData, null, 2)}</pre> */}

              <div className="flex justify-between items-center">
                <div>
                  <Link
                    href={"/"}
                    className="text-[#626262] text-[18px] flex items-center gap-2"
                  >
                    <ChevronLeft />
                    Back to home
                  </Link>
                </div>
                {passengerInformation?.length > 0 && (
                  <div className="p-3 border rounded-[6px]">
                    <button
                      onClick={() => setActiveTab("payment")}
                      // type="submit"
                      className=" float-right bg-transparent text-[#717171] font-semibold  transition duration-300 rounded-[4px] py-1 px-8 "
                    >
                      Continue to Payment
                    </button>
                  </div>
                )}
              </div>
            </form>
          </>
        </>
      )}

      {activeTab === "payment" && (
        <form className="max-w-7xl mx-auto " onSubmit={handleBooking}>
          <h1 className="text-2xl font-bold p-5">Review Your Selection</h1>

          <div className="flex justify-between items-center bg-[#F6F6F6] px-10 py-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-[700]">Flights</h2>
              <span className="text-sm text-black underline">
                All Flight Details
              </span>
            </div>
            <div>
              <h2 className="text-[14px] ">
                For 1 Passenger (Include fare,taxes,carrier charges)
              </h2>
            </div>{" "}
            <div>
              <h2 className="text-[20px] font-[700]">
                {" "}
                Total : BDT{" "}
                {formatFlightFare(
                  selectedFlight?.fare_details?.total_fare
                )}{" "}
              </h2>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md px-10 py-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                For 1 Passenger (exclude fare,taxes,carrier charges)
              </span>
              <span className="font-bold">
                Total : BDT{" "}
                {formatFlightFare(selectedFlight?.fare_details?.base_fare)}
              </span>
            </div>

            <div className="py-4 shadow-lg relative ">
              <div className="flex items-center mb-4 border-b px-10 py-5">
                <Image
                  src={selectedFlight?.airline_logo}
                  alt="Air Asia Logo"
                  className="mr-4"
                  width={50}
                  height={50}
                />
                <div>
                  <h3 className="font-semibold">
                    {selectedFlight?.airline_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {" "}
                    {selectedFlight?.airline_code}
                    452 | Boeing 789
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-semibold">Class / Fare </p>
                  <p className="text-sm text-gray-500">
                    {" "}
                    {selectedFlight
                      ? selectedFlight?.passenger_infos?.[0]?.cabin_class
                      : ""}
                    / Saver
                  </p>
                </div>
              </div>

              <div className="flex justify-between mb-4 px-10 py-5">
                <div>
                  <p className="font-semibold">Sun, 14 Sep, 2024</p>
                  <p className="text-xl font-bold">
                    {selectedFlight?.departure_time}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedFlight?.origin_airport_name}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500">Non-stop</p>
                  <div className="w-24 h-px bg-gray-300 my-2"></div>
                  <p className="text-sm text-gray-500">
                    {selectedFlight?.flight_duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Sun, 14 Sep, 2024</p>
                  <p className="text-xl font-bold">
                    {" "}
                    {selectedFlight?.arrival_time}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedFlight?.destination_airport_name}
                  </p>
                </div>
              </div>

              {!showFareRules && (
                <div className="flex justify-center absolute right-[41%] ">
                  <button
                    type="button"
                    className="flex items-center text-black  rounded-full border py-2 px-5 bg-white z-10"
                    onClick={() => setShowFareRules(!showFareRules)}
                  >
                    Show fare rules
                    {showFareRules ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {showFareRules && (
              <div className="mt-4 p-12 bg-gray-50 rounded-md relative">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-start">
                    <Luggage className="w-5 h-5 mr-2 text-gray-600" />
                    <p className="text-sm">Checked baggage 40 kg</p>
                  </div>
                  <div className="flex items-start">
                    <RefreshCw className="w-5 h-5 mr-2 text-gray-600" />
                    <p className="text-sm">
                      Change fee: USD 55.00
                      <br />
                      No - Show penalty : USD 155.00
                    </p>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="w-5 h-5 mr-2 text-gray-600" />
                    <p className="text-sm">
                      Refund Fee : USD 80.00 before Departure
                      <br />
                      Not permitted after departure
                      <br />
                      No - Show penalty USD 180.00
                      <br />
                      Before Departure
                      <br />
                      Not Permitted after departure
                    </p>
                  </div>
                  <a
                    href="#"
                    className="text-[#343535] hover:text-blue-800 text-sm mt-2 flex items-end underline"
                  >
                    View detailed fare conditions
                  </a>
                </div>
                <div className="flex justify-center absolute right-[41%] -bottom-4 ">
                  <button
                    type="button"
                    className="flex items-center text-black  rounded-full border py-2 px-5 bg-white"
                    onClick={() => setShowFareRules(!showFareRules)}
                  >
                    Hide fare rules
                    {showFareRules ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-8">
              <h2 className="text-lg font-semibold mb-4 bg-[#F6F6F6] px-12 py-4">
                Passengers (1 Adult)
              </h2>
              <p className="mb-2 px-12 py-4">Mr. Alamin Sourav (Adult)</p>
            </div>
          </div>

          <div className="bg-[#333333] text-white px-12 py-4 mb-6 flex justify-between items-center">
            <span className="font-semibold text-[18px]">Total To be Paid</span>
            <span className="text-[18px] font-semibold">BDT 5678</span>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveTab("passengers")}
              className="text-[#626262] hover:text-blue-800 underline"
            >
              Back to Flight
            </button>
            <div className="flex justify-center  md:justify-end ">
              <button
                type="submit"
                // onClick={handleConfirmModal}
                className=" bg-[#FC660F] text-white py-3 font-semibold hover:bg-orange-600 transition duration-300 rounded-[4px] w-[200px] h-[49px]"
              >
                {registerLoading || bookingLoading ? (
                  <div className="flex justify-center items-center ">
                    <Oval
                      visible={true}
                      height="20"
                      width="20"
                      color="#fff"
                      ariaLabel="oval-loading"
                      secondaryColor="#fff"
                      wrapperStyle={{
                        backgroundColor: "transparent",
                      }}
                      wrapperClass=""
                    />
                  </div>
                ) : (
                  <span> Pay now</span>
                )}
              </button>
            </div>
          </div>
          <BookingConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </form>
      )}

      {activeTab === "confirm" && (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
          <p>Booking confirmation details would go here.</p>
          <Button onClick={() => setActiveTab("payment")} className="mt-4">
            Back to Payment
          </Button>
        </div>
      )}
    </div>
  );
}
