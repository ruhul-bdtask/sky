"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import BookingFormComp from "@/components/bookingFormComp/BookingFormComp";
import Select from "react-select";
import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";

import {
  ChevronDown,
  ChevronUp,
  Luggage,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import BookingConfirmationModal from "@/components/bookingConfirmationModal/BookingModal";
import { toast } from "react-toastify";

export default function BookingForm() {
  const [activeTab, setActiveTab] = useState("passengers");
  const [isOpenContact, setIsOpenContact] = useState(false);
  const [showFareRules, setShowFareRules] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });

  const [passengerData, setPassengerData] = useState([
    {
      firstName: "",
      lastName: "",
      documentType: "",
      country: "",
      dob: "",
      docNumber: "",
    },
    {
      firstName: "",
      lastName: "",
      documentType: "",
      country: "",
      dob: "",
      docNumber: "",
    },
  ]);

  // Function to update specific passenger data
  const updatePassengerData = (index, field, value) => {
    console.log(index, field, value);
    setPassengerData((prevData) =>
      prevData.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      )
    );
  };

  console.log("passengerData", passengerData);
  const tabs = [
    { id: "passengers", label: "Passengers" },
    { id: "payment", label: "Payment" },
    { id: "confirm", label: "Confirm" },
  ];

  const passengers = [
    { id: 1, name: "", age: "", gender: "", type: "Adult" },
    { id: 2, name: "", age: "", gender: "", type: "Child" },
  ];

  const handleConfirmModal = () => {
    setActiveTab("confirm");
  };

  useEffect(() => {
    if (activeTab == "confirm") {
      setIsModalOpen(true);
    }
  }, [activeTab, handleConfirmModal]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone);
  };

  // Validate all inputs on submit
  const handlePassengerContact = (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(contactInfo.email);
    const isPhoneValid = validatePhone(contactInfo.phone);

    if (!isEmailValid) {
      toast.error("Please enter a valid email address");
    }
    if (!isPhoneValid) {
      toast.error("Please enter a valid phone number");
    }

    if (isEmailValid && isPhoneValid) {
      toast.success("Form submitted successfully!");
    }
  };
  return (
    <div className="container_section_sm mx-auto p-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Make A Booking</h1>

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
            <div className="flex flex-col gap-5">
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
                  <form onSubmit={handlePassengerContact}>
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
                            name={`phone`}
                            placeholder="Phone Number"
                            className="border-2 border-[##9B9B9B] p-3 w-full rounded-[4px] focus:outline-none"
                          />
                        </div>

                        <div className="flex justify-center  md:justify-end ">
                          <button
                            type="submit"
                            className=" bg-[#FC660F] text-white py-3 font-semibold hover:bg-orange-600 transition duration-300 rounded-[4px] w-[200px] h-[49px]"
                          >
                            Save & Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {passengers?.map((passenger, index) => (
                <BookingFormComp
                  updatePassengerData={updatePassengerData}
                  passenger={passenger}
                  index={index}
                  key={index}
                />
              ))}
              <pre>{JSON.stringify(passengerData, null, 2)}</pre>

              {/* <div className="py-6 px-16 shadow-custom_shadow">
                <label
                  className={`block text-sm font-medium ${
                    isOpenPassport ? "text-black" : "text-[#9A9A9A]"
                  }   mb-1 cursor-pointer text-[18px] font-[600] rounded-[4px]`}
                  onClick={() => setIsOpenPassport(!isOpenPassport)}
                >
                  Passport information
                </label>
                <div className={`${isOpenPassport ? "block" : "hidden"}`}>
                  <p className="text-[14px] text-[#8696A1]">
                    Make sure the names you enter exactly match your passport,
                    and please use English characters only. Names can’t be
                    changed once you have completed your booking.
                  </p>
                  
                </div>
              </div> */}
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
                <div className="p-3 border rounded-[6px]">
                  <button
                    onClick={() => setActiveTab("payment")}
                    type="file"
                    className=" float-right bg-transparent text-[#717171] font-semibold  transition duration-300 rounded-[4px] py-1 px-8 "
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>
          </>
        </>
      )}

      {activeTab === "payment" && (
        <div className="max-w-7xl mx-auto  ">
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
              <h2 className="text-[20px] font-[700]"> Total : BDT 5467 </h2>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md px-10 py-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                For 1 Passenger (include fare,taxes,carrier charges)
              </span>
              <span className="font-bold">Total : BDT 5467</span>
            </div>

            <div className="py-4 shadow-lg relative ">
              <div className="flex items-center mb-4 border-b px-10 py-5">
                <img
                  src="https://cdn.airpaz.com/cdn-cgi/image/w=1024,h=1024,f=webp,fit=scale-down/rel-0275/airlines/201x201/AK.png"
                  alt="Air Asia Logo"
                  className="w-10 h-10 mr-4"
                />
                <div>
                  <h3 className="font-semibold">Air Asia Airlines</h3>
                  <p className="text-sm text-gray-500">BG 452 | Boeing 789</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-semibold">Class / Fare :</p>
                  <p className="text-sm text-gray-500">Economy / Saver</p>
                </div>
              </div>

              <div className="flex justify-between mb-4 px-10 py-5">
                <div>
                  <p className="font-semibold">Sun, 14 Sep, 2024</p>
                  <p className="text-xl font-bold">11:30</p>
                  <p className="text-sm text-gray-500">Dhaka (DAC)</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500">Non-stop</p>
                  <div className="w-24 h-px bg-gray-300 my-2"></div>
                  <p className="text-sm text-gray-500">1H</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Sun, 14 Sep, 2024</p>
                  <p className="text-xl font-bold">06:30</p>
                  <p className="text-sm text-gray-500">Dubai (DXB)</p>
                </div>
              </div>

              <div className="flex justify-center absolute right-[41%] ">
                <button
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
                onClick={handleConfirmModal}
                className=" bg-[#FC660F] text-white py-3 font-semibold hover:bg-orange-600 transition duration-300 rounded-[4px] w-[200px] h-[49px]"
              >
                Pay now
              </button>
            </div>
          </div>
          <BookingConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
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
