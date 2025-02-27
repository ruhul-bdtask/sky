"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import BookingFormComp from "@/components/bookingFormComp/BookingFormComp";
import { ChevronLeft, Info, Timer } from "lucide-react";
import Link from "next/link";
import { isExpired } from "react-jwt";
import "react-phone-input-2/lib/style.css";
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
import { formatMinutesToHours } from "@/lib/formatMinutesToHours";
import { formatDateTimeForGalileo } from "@/lib/formatDateTimeForGalileo";
import { getAirline } from "@/utils/getAirline";
import { useAirlines } from "@/hooks/useAirlines";
import Cookies from "js-cookie";
import { duration } from "moment";
import PhoneInput from "react-phone-input-2";

export default function BookingForm() {
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
    userData,
  } = useAirlineStore();
  const [activeTab, setActiveTab] = useState("passengers");
  const [isOpenContact, setIsOpenContact] = useState(false);
  const [showFareRules, setShowFareRules] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const router = useRouter();
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [paymentFlight, setPaymentFlight] = useState({
    origin_airport: "",
    destination_airport: "",
    departure_date: "",
    arrival_date: "",
    departure_time: "",
    arrival_time: "",
    airline: "",
    airline_logo: "",
    flight_number: "",
    cabin_class: "",
    flight_duration: "",
  });
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });

  useEffect(() => {
    setContactInfo({
      email: userData?.email || "",
      phone: userData?.phone || "",
    });
  }, [userData]);
  useEffect(() => {
    setPaymentFlight({
      origin_airport: selectedFlight?.origin_airport_name,
      destination_airport: selectedFlight?.destination_airport_name,
      departure_date: selectedFlight?.departure_date,
      arrival_date: selectedFlight?.arrival_date,
      departure_time: selectedFlight?.departure_time,
      arrival_time: selectedFlight?.arrival_time,
      airline: selectedFlight?.airline_code,
      airline_logo: selectedFlight?.airline_logo,
      cabin_class: selectedFlight?.passenger_infos?.[0]?.cabin_class,
      flight_duration: selectedFlight?.flight_duration,
    });
  }, [selectedFlight]);

  const [openFareRules, setOpenFareRules] = useState({});

  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const { airlinesData } = useAirlines();

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
    acc[`pxn_title_${index + 1}`] = "Mr"; // Assign title, can adjust as needed
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

  // const fillPassengerData = (index, value) => {
  //   setPassengerData((prevData) =>
  //     prevData.map((passenger, i) =>
  //       i === index
  //         ? {
  //             ...passenger,
  //             ...value,
  //           }
  //         : passenger
  //     )
  //   );
  // };

  const getDateLimits = (passengerType) => {
    const today = new Date();
    const currentYear = today.getFullYear();

    switch (passengerType) {
      case "ADT": // Adult (11-64 years old)
        return {
          maxDate: new Date(currentYear - 11, 11, 31), // Latest DOB: 11 years ago
          minDate: new Date(currentYear - 99, 0, 1), // Earliest DOB: 99 years ago
        };

      case "C04": // Kids (2-5 years old)
        return {
          minDate: new Date(currentYear - 5, 0, 1), // Earliest DOB: 5 years ago
          maxDate: new Date(currentYear - 2, 11, 31), // Latest DOB: 2 years ago
        };

      case "C06": // Children (5-11 years old)
        return {
          minDate: new Date(currentYear - 11, 0, 1), // Earliest DOB: 11 years ago
          maxDate: new Date(currentYear - 5, 11, 31), // Latest DOB: 5 years ago
        };

      case "INF": // Infant (under 2 years old)
        return {
          minDate: new Date(currentYear - 2, 0, 1), // Earliest DOB: 2 years ago
          maxDate: today, // Latest DOB: today (newborns)
        };

      default:
        return {
          minDate: new Date(1900, 0, 1),
          maxDate: today,
        };
    }
  };

  // const fillPassengerData = (index, value) => {
  //   setPassengerData((prevData) =>
  //     prevData.map((passenger, i) => {
  //       if (i !== index) return passenger; // Only update the target passenger

  //       // Extract new DOB (if available) or keep the existing one
  //       let newDob = value?.dob || passenger?.dob;

  //       // Get age range for this passenger type
  //       const { minDate, maxDate } = getDateLimits(passenger.type);

  //       // Convert existing/new DOB to Date object
  //       let dobDate = new Date(newDob);

  //       // Validate DOB range
  //       if (dobDate < minDate) {
  //         dobDate = new Date(minDate);
  //         dobDate.setDate(dobDate.getDate() + 1); // Add 1 day
  //       } else if (dobDate > maxDate) {
  //         dobDate = new Date(maxDate);
  //         dobDate.setDate(dobDate.getDate() + 1); // Add 1 day
  //       }

  //       return {
  //         ...passenger,
  //         ...value,
  //         dob: dobDate?.toISOString(), // Store as string (ISO format)
  //       };
  //     })
  //   );
  // };

  const formatDateString = (date) => {
    if (!date) return "";

    // Get year, month, and day components and create a date string in YYYY-MM-DD format
    // This avoids timezone issues that can occur with toISOString()
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const fillPassengerData = (index, value) => {
    setPassengerData((prevData) =>
      prevData.map((passenger, i) => {
        if (i !== index) return passenger; // Only update the target passenger

        // Extract new DOB (if available) or keep the existing one
        let newDob = value?.dob || passenger?.dob;

        // Ensure newDob is a valid date
        let dobDate = newDob ? new Date(newDob) : null;

        if (isNaN(dobDate?.getTime())) {
          console.warn("Invalid DOB:", newDob); // Debugging log
          dobDate = null; // Avoid passing invalid date
        } else {
          // Get age range for this passenger type
          const { minDate, maxDate } = getDateLimits(passenger.type);

          // Validate DOB range if dobDate is valid
          if (dobDate < minDate) {
            dobDate = new Date(minDate);
            dobDate.setDate(dobDate.getDate()); // Add 1 day
          } else if (dobDate > maxDate) {
            dobDate = new Date(maxDate);
            dobDate.setDate(dobDate.getDate()); // Add 1 day
          }
        }

        return {
          ...passenger,
          ...value,
          dob: dobDate ? dobDate.toISOString() : null, // Ensure valid ISO string or null
        };
      })
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

  const formatDate = (inputDate) => {
    if (!inputDate) return null;

    // Check if the input is already in the short format
    const shortFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (shortFormatRegex.test(inputDate)) return inputDate;

    // Convert full timestamp to short format
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) return null; // Invalid date check

    return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
  };
  // // const formattedDate = formatDate("Sun Feb 02 2025 00:00:00 GMT+0600");
  // console.log(formattedDate); // "2025-02-02"

  // console.log(formatDate("2001-01-18T18:00:00.000Z")); // Output: "2001-01-18"
  // console.log(formatDate("2001-01-01")); // Output: "2001-01-01"

  const customersInfo = {
    email: contactInfo?.email,
    phone_no: contactInfo?.phone,
    pxn_type: passengerData?.map((p) => p.pxn_type),
    first_name: passengerData?.map((p) => p.first_name),
    last_name: passengerData?.map((p) => p.last_name),
    dob: passengerData?.map((p) => formatDate(p.dob) || ""),
    doc_type: passengerData?.map((p) => p.document_type || ""),
    doc_number: passengerData?.map((p) => p.document_number || ""),
    doc_expire_date: passengerData?.map((p) =>
      formatDate(p.document_expiration_date)
    ),
    doc_issue_country: passengerData?.map(
      (p) => p.document_nationality_country || ""
    ),
    nationality: passengerData?.map(
      (p) => p.document_nationality_country || ""
    ),
  };
  passengerData?.forEach((p, index) => {
    customersInfo[`pxn_title_${index + 1}`] = p.pxn_title;
  });

  useEffect(() => {
    // Initialize passengers with default values
    const totalPassengers = passengers?.flatMap((p) =>
      Array.from({ length: p.quantity }, () => ({
        pxn_type: p.type === "ADT" || p.type == "INF" ? p.type : "CNN",
        pxn_title: "Mr", // Default title
        first_name: "",
        type: p.type,
        last_name: "",
        document_type: "",
        document_nationality_country: "",
        dob: "",
        document_number: "",
        document_expiration_date: "",
      }))
    );

    // Set default title if not explicitly set
    setPassengerData((prevData) =>
      totalPassengers?.map((newPassenger, index) => ({
        ...newPassenger,
        pxn_title: prevData?.[index]?.pxn_title || "Mr", // Persist the existing title or set default
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
      PassengerInformation: customersInfo,
    },
  };

  // const {
  //   data: bookingData,
  //   error: bookingError,
  //   isLoading: bookingLoading,
  //   refetch: refetchBookingData,
  // } = useQuery({
  //   queryKey: ["bookingData", payload],
  //   queryFn: () => fetchData("/gds/make-booking", "POST", payload, token),
  //   enabled: false,
  //
  // });

  const {
    data: bookingData,
    error: bookingError,
    isLoading: bookingLoading,
    refetch: refetchBookingData,
  } = useQuery({
    queryKey: ["bookingData", payload],
    queryFn: async () => {
      const response = await fetchData(
        "/gds/make-booking",
        "POST",
        payload,
        token
      );
      if (response?.success == true) {
        router.push(response?.data?.redirect_url);
        setPassengerInformation([]);
        setContactInformation({});
        setOriginDestinationInformation([]);
        setSearchData([]);
        setLegDescription([]);
        setSelectedFlight({});
      } else {
        setIsBookingLoading(false);
      }
      return response;
    },
    enabled: false,
  });

  const registerPayload = {
    first_name: passengerInformation?.[0]?.first_name,
    last_name: passengerInformation?.[0]?.last_name,
    email: contactInfo?.email,
    phone: contactInfo?.phone,
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
    setIsBookingLoading(true);

    if (token == null || token == undefined || token == "") {
      refetchRegister();
    } else {
      if (isMyTokenExpired) {
        setToken(null);
        refetchRegister();
      } else {
        refetchBookingData();
      }
    }
  };

  useEffect(() => {
    if (registerData?.success == true) {
      setToken(registerData?.authorization?.token);
      Cookies.set("auth-token", token);
      setUserData(registerData?.user);
      if (token) {
        refetchBookingData();
      }
    }
  }, [registerData, token]);

  // useEffect(() => {
  //   if (bookingData?.success == true) {
  //     // router.push(bookingData?.data?.redirect_url);
  //     // setPassengerInformation([]);
  //     // setContactInformation({});
  //     // setOriginDestinationInformation([]);
  //     // setSearchData([]);
  //     // setLegDescription([]);
  //     // setSelectedFlight({});
  //     console.log(bookingData);
  //   } else {
  //     setIsBookingLoading(false);
  //   }
  // }, [bookingData]);

  // console.log(bookingData, payload, registerData);

  const validatePassengers = (passengers) => {
    const nameRegex = /^[A-Za-z\s]+$/; // Regex to allow only letters and spaces
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];

      if (!passenger.first_name || passenger.first_name.trim() === "") {
        toast.error(`Passenger ${i + 1}: Please fill up First Name`);
        return false;
      }
      if (!nameRegex.test(passenger.first_name)) {
        toast.error(
          `Passenger ${i + 1}: First Name should not contain special characters`
        );
        return false;
      }
      if (!passenger.last_name || passenger.last_name.trim() === "") {
        toast.error(`Passenger ${i + 1}: Please fill up Last Name`);
        return false;
      }
      if (!nameRegex.test(passenger.last_name)) {
        toast.error(
          `Passenger ${i + 1}: Last Name should not contain special characters`
        );
        return false;
      }

      if (!passenger.document_type || passenger.document_type.trim() === "") {
        toast.error(`Passenger ${i + 1}: Please select Document Type`);
        return false;
      }

      if (
        !passenger.document_nationality_country ||
        passenger.document_nationality_country.trim() === ""
      ) {
        toast.error(`Passenger ${i + 1}: Please select Country`);
        return false;
      }
      if (
        !passenger.document_number ||
        passenger.document_number.trim() === ""
      ) {
        toast.error(`Passenger ${i + 1}: Please fill up Document Number`);
        return false;
      }
    }

    return true;
  };

  const handleChangeTab = (arg) => {
    if (contactInfo?.email == "") {
      toast.error("Please enter a valid email address");
      return;
    }
    if (contactInfo?.phone == "") {
      toast.error("Please enter a valid phone number");
      return;
    }
    const isEmailValid = validateEmail(contactInfo.email);
    // const isPhoneValid = validatePhone(contactInfo.phone);

    if (!isEmailValid) {
      toast.error("Please enter a valid email address");
      return;
    }
    // if (!isPhoneValid) {
    //   toast.error("Please enter a valid phone number");
    // }

    const isValid = validatePassengers(passengerData);
    if (!isValid) {
      return;
    }

    console.log(passengerData, customersInfo);
    setPassengerInformation(passengerData);
    setContactInformation(contactInfo);
    setActiveTab(arg);
  };

  const toggleFareRule = (index) => {
    setOpenFareRules((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle only the clicked item
    }));
  };

  if (isBookingLoading) {
    return (
      <div className="fixed  inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-full md:w-[750px]">
          <div className="w-full bg-white rounded-lg shadow-lg min-h-[450px] p-4">
            <div className="flex flex-col items-center p-6">
              <img
                src={"/ticketing.gif"}
                alt="Loading..."
                className="w-36 md:w-56 h-full object-contain"
              />
            </div>

            {/* Confirmation Message */}
            {/* <h2 className="text-xl font-semibold mb-6 text-center text-green-500">
                You have Successfully Booked ticket
              </h2> */}

            {/* Booking Details */}

            {/* Flight Details */}
            {/* {data?.flights_info?.map((flight, index) => ( */}
            <div className="w-full border border-dashed p-4 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${paymentFlight?.airline}.png`}
                  alt="Air Asia Airlines"
                  className="rounded-full w-12 h-12"
                />
                {/* <div>
                  <p className="font-medium">{flight?.airline_details}</p>
                  <p className="text-sm text-gray-500">
                    {paymentFlight?.flight_number}
                  </p>
                </div> */}
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="text-center">
                  <p className="text-xl font-bold">
                    {paymentFlight?.departure_time}
                  </p>
                  <p className="text-sm text-gray-500">
                    {paymentFlight?.departure_date}
                  </p>
                  <p className="text-sm font-medium">
                    {paymentFlight?.origin_airport}
                  </p>
                </div>

                <div className="flex-1 mx-4">
                  <div className="relative">
                    <div className="border-t-2 border-gray-300 w-full absolute top-1/2 -translate-y-1/2"></div>
                    <div className="text-center text-sm text-gray-500">
                      {paymentFlight?.cabin_class}
                    </div>
                    <div className="text-center text-xs text-gray-400">
                      {paymentFlight?.flight_duration}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xl font-bold">
                    {paymentFlight?.arrival_time}
                  </p>
                  <p className="text-sm text-gray-500">
                    {paymentFlight?.arrival_date}
                  </p>
                  <p className="text-sm font-medium">
                    {paymentFlight?.destination_airport}
                  </p>
                </div>
              </div>
              {/* 
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{flight?.cabin_class}</span>
                <span className="font-bold">Tk.14,345</span>
              </div> */}
            </div>
            {/* ))} */}

            {/* Download Button */}
            <div className="my-5">
              <button
                // href={`/ticket-copy?status=success&slack=${slack}`}
                disabled
                className="w-fit font-[700] text-[18px] m-auto h-[55px] bg-[#FF5B00] hover:bg-[#E65100] text-white py-2 px-4 rounded-md block"
              >
                {/* <Download className="w-5 h-5" /> */}
                Ticket Copy is processing ...
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                      value={contactInfo?.email ? contactInfo?.email : ""}
                      placeholder="Email address"
                      className="border-2 border-[##9B9B9B] p-3 w-full rounded-[4px] focus:outline-none"
                    />
                  </div>
                  {/* <div className="flex flex-col gap-4">
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
                          value={contactInfo?.phone ? contactInfo?.phone : ""}
                          name={`phone`}
                          placeholder="Phone Number"
                          className="border-2 border-[##9B9B9B] p-3 w-full rounded-[4px] focus:outline-none"
                        />
                      </div>
                      
                    </div> */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <PhoneInput
                        country={"bd"} // Default country (Bangladesh)
                        value={contactInfo?.phone || ""}
                        onChange={(phone) =>
                          setContactInfo({
                            ...contactInfo,
                            phone: phone,
                          })
                        }
                        inputProps={{
                          name: "phone",
                          required: true,
                          className:
                            "border pl-10 border-[#9B9B9B] p-3 w-full rounded-[4px] focus:outline-none",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {timeLeft > 0 &&
                passengerData?.map((passenger, index) => (
                  <BookingFormComp
                    // handlePassengerInfo={handlePassengerInfo}
                    passengerData={passengerData}
                    fillPassengerData={fillPassengerData}
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
                {/* {passengerInformation?.length > 0 && ( */}
                <div className="p-3 bg-[#FC660F] text-white py-3 font-semibold hover:bg-orange-600 transition duration-300 rounded-[4px]">
                  <button
                    onClick={() => handleChangeTab("payment")}
                    type="button"
                    className=" float-right  text-white font-semibold  transition duration-300 rounded-[4px] py-1 px-8 "
                  >
                    Save & Continue to Payment
                  </button>
                </div>
                {/* )} */}
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
              {/* <span className="text-sm text-black underline">
                All Flight Details
              </span> */}
            </div>
            <div>
              <h2 className="text-[14px] ">
                For All Passenger (Exclude taxes, AIT charges)
              </h2>
            </div>{" "}
            <div>
              <h2 className="text-[20px] font-[700]">
                {" "}
                BDT {formatFlightFare(
                  selectedFlight?.fare_details?.base_fare
                )}{" "}
              </h2>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md px-10 py-6 mb-6 flex flex-col gap-10">
            {selectedFlight?.schedules?.map((shd, index) => (
              <div className="" key={index}>
                {/* <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                For 1 Passenger (exclude fare,taxes,carrier charges)
              </span>
              <span className="font-bold">
                Total : BDT{" "}
                {formatFlightFare(selectedFlight?.fare_details?.base_fare)}
              </span>
            </div> */}

                <div className="py-4 shadow-lg relative ">
                  <div className="flex items-center mb-4 border-b px-10 py-5">
                    {/* <Image
                    src={selectedFlight?.airline_logo}
                    alt="Air Asia Logo"
                    className="mr-4"
                    width={50}
                    height={50}
                  /> */}
                    <img
                      src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${shd?.operating_code}.png`}
                      alt="Air Asia Airlines"
                      className="rounded-full w-10 h-10 me-2"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {getAirline(airlinesData, shd?.operating_code)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {" "}
                        {shd?.operating_code + " " + shd?.flight_number} |{" "}
                        {shd?.equipment}
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="font-semibold">Class </p>
                      <p className="text-sm text-gray-500">
                        {" "}
                        {selectedFlight
                          ? selectedFlight?.passenger_infos?.[0]?.cabin_class
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between mb-4 px-10 py-5">
                    <div>
                      <p className="font-semibold">
                        {" "}
                        {formatDateTimeForGalileo(shd?.g_departure_datetime)}
                      </p>
                      <p className="text-xl font-bold">{shd?.departure_time}</p>
                      <p className="text-sm text-gray-500">
                        {shd?.departure_airport}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-500">
                        {/* {selectedFlight?.total_stop == 0
                          ? "Non-stop"
                          : selectedFlight?.total_stop == 1
                          ? "1 Stop"
                          : selectedFlight?.total_stop + " " + "Stops"}{" "} */}
                        {selectedFlight
                          ? selectedFlight?.passenger_infos?.[0]?.cabin_class
                          : ""}
                      </p>
                      <div className="w-24 h-px bg-gray-300 my-2"></div>
                      <p className="text-sm text-gray-500">
                        {formatMinutesToHours(shd?.travel_time)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatDateTimeForGalileo(shd?.g_arrival_datetime)}
                      </p>
                      <p className="text-xl font-bold"> {shd?.arrival_time}</p>
                      <p className="text-sm text-gray-500">
                        {shd?.arrival_airport}
                      </p>
                    </div>
                  </div>

                  {!openFareRules[index] && (
                    <div className="flex justify-center absolute right-[41%] ">
                      <button
                        type="button"
                        className="flex items-center text-black  rounded-full border py-2 px-5 bg-white z-10"
                        onClick={() => toggleFareRule(index)}
                      >
                        Show fare rules
                        {openFareRules[index] ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {openFareRules[index] && (
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
                        onClick={() => toggleFareRule(index)}
                      >
                        Hide fare rules
                        {openFareRules[index] ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="pt-8">
              <h2 className="text-lg font-semibold mb-4 bg-[#F6F6F6] px-12 py-4">
                Passengers
              </h2>
              {passengerInformation?.map((passenger, index) => (
                <div key={index}>
                  <p className="mb-2 px-12 py-4">
                    {passenger?.pxn_title} {passenger?.first_name}{" "}
                    {passenger?.last_name} ({passenger?.pxn_type})
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#333333] text-white px-12 py-4 mb-6 flex justify-between items-center">
            <span className="font-semibold text-[18px]">Tax</span>
            <span className="text-[18px] font-semibold">
              BDT {formatFlightFare(selectedFlight?.fare_details?.tax_fare)}
            </span>
          </div>
          <div className="bg-[#333333] text-white px-12 py-4 mb-6 flex justify-between items-center">
            <span className="font-semibold text-[18px]">Total To be Paid</span>
            <span className="text-[18px] font-semibold">
              Total : BDT{" "}
              {formatFlightFare(selectedFlight?.fare_details?.total_fare)}
            </span>
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
