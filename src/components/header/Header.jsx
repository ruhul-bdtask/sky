// app/components/Header.js
import { Menu, X, Heart } from "lucide-react";
import logo from "@/public/images/logo.png";
import device from "@/public/images/device.png";
import google from "@/public/images/google.png";
import apple from "@/public/images/apple.png";
import verify from "@/public/images/verify.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSidebar } from "@/context/sidebar-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import AvatarIcon from "@/public/icons/AvatarIcon";
import HeartIcon from "@/public/icons/HeartIcon";
import { useRouter } from "next/navigation";
import MessageIcon from "@/public/icons/MessageIcon";
import LeftArrowIcon from "@/public/icons/LeftArrowIcon";
import LinkIcon from "@/public/icons/LinkIcon";
import ActiveIcon from "@/public/icons/ActiveIcon";
import UserIcon from "@/public/icons/UserIcon";
import { Pencil, MoreVertical } from "lucide-react";
import weather from "@/public/images/weather.png";
import useAirlineStore from "../../../stores/airlineStore";
import { isExpired } from "react-jwt";
import { unifyTimeFormat } from "@/lib/unifyTimeFormat";
import { formatFlightFare } from "@/lib/formatFlightFare";
export default function Header() {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalPage, setModalPage] = useState("google");
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(null);
  const [isOpenSaved, setIsOpenSaved] = useState(false);
  const {
    savedFlights,
    token,
    setToken,
    setIsOpenSavedDialog,
    isOpenSavedDialog,
    setSearchData,
  } = useAirlineStore();

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

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setToken(null);
    setIsOpenProfile(false);
    toast.success("User signed out");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isMyTokenExpired) {
        setToken(null);
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    }
  }, []);

  const handleSaved = () => {
    setIsOpenSavedDialog(!isOpenSavedDialog);
  };

  return (
    <header className={`bg-white  fixed left-0 z-50 right-0 h-20 border-b  `}>
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
          <div className="flex items-center gap-6">
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
                        <h2 className="text-[16px] font-semibold text-[#0C7C99]">
                          Change Trip
                        </h2>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-6 flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Image width={80} height={80} src={weather}></Image>
                          <div>
                            <h2 className="text-lg font-bold">
                              Kuala Lumpur Trip
                            </h2>
                            <p className="text-sm text-black">
                              Thu, 3 Oct - Sun, 6 Oct
                            </p>
                            <p className="text-sm text-black">
                              Kuala Lumpur, Malaysia
                            </p>
                          </div>
                        </div>
                        <button className="text-black">
                          <Pencil className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold">Flights</h3>
                      </div>
                      <div className="mb-4">
                        {savedFlights?.length > 0 && (
                          <h4 className="mb-2 text-sm font-semibold">
                            Saved Flights ({savedFlights?.length})
                          </h4>
                        )}

                        <div class="w-[373px]  shadow-xl ">
                          <div class="flex justify-between items-center bg-[#F0F3F5]  rounded-t-[20px] p-6">
                            <div class="text-left">
                              <div class="text-lg font-semibold text-gray-800">
                                {savedFlights[0]?.origin_code} -{" "}
                                {savedFlights[0]?.destination_code}
                              </div>
                              <div class="text-sm text-black">12/9 - 15/9</div>
                            </div>
                            <div class="text-right">
                              <span class="text-xs font-medium text-black">
                                Economy
                              </span>
                            </div>
                          </div>

                          {savedFlights?.map((flight, index) => (
                            <div
                              class="flex flex-col gap-4 mt-4 p-4 border-b"
                              key={index}
                            >
                              <div class="flex items-center justify-between text-sm">
                                <span class="font-medium text-gray-800">
                                  {flight?.airline_name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 justify-between ">
                                <div className="">
                                  {flight?.schedules?.map((schedule, index) => (
                                    <div
                                      class="mt-3 py-3 px-1  rounded-lg"
                                      key={index}
                                    >
                                      <div class="text-xs text-black border px-2 py-1 inline-block rounded-full mb-2">
                                        {flight?.departure_date}
                                      </div>

                                      <div class="flex items-center justify-between">
                                        <Image
                                          width={50}
                                          height={50}
                                          src={flight?.airline_logo}
                                          alt="Air line Logo"
                                          class="h-8 w-8 object-contain"
                                        />
                                        <div class="flex flex-col text-center">
                                          <span class="text-lg font-semibold">
                                            {unifyTimeFormat(
                                              flight?.departure_time
                                            )}
                                          </span>
                                          <span class="text-xs text-black">
                                            {flight?.origin_code}
                                          </span>
                                        </div>
                                        <div class="flex flex-col items-center text-xs text-black border-b">
                                          <span>
                                            {" "}
                                            {flight?.flight_duration}
                                          </span>
                                        </div>
                                        <div class="flex flex-col text-center">
                                          <span class="text-lg font-semibold">
                                            {unifyTimeFormat(
                                              flight?.arrival_time
                                            )}
                                          </span>
                                          <span class="text-xs text-black">
                                            {flight?.destination_code}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  {/* <div class="mt-1 py-3 px-1   rounded-lg">
                                    <div class="text-xs text-black border px-2 py-1 inline-block rounded-full mb-2">
                                      Thu, 6 Oct
                                    </div>
                                    <div class="flex items-center gap-2 justify-between">
                                      <Image
                                        src={airAsia}
                                        alt="Air Asia Logo"
                                        class="h-8 w-8 object-contain"
                                      />

                                      <div class="flex flex-col text-center">
                                        <span class="text-lg font-semibold">
                                          00:50
                                        </span>
                                        <span class="text-xs text-black">
                                          DAC
                                        </span>
                                      </div>
                                      <div class="flex flex-col items-center text-xs text-black border-b">
                                        <span>3H 50M</span>
                                      </div>
                                      <div class="flex flex-col text-center">
                                        <span class="text-lg font-semibold">
                                          06:55
                                        </span>
                                        <span class="text-xs text-black">
                                          KUL
                                        </span>
                                      </div>
                                    </div>
                                  </div> */}
                                </div>
                                <div class="me-2">
                                  <div class="text-[18px] font-semibold text-black">
                                    Tk .
                                    {formatFlightFare(
                                      flight?.fare_details?.total_fare
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <ToastContainer />
            {loggedIn ? (
              <>
                <div className="relative inline-block text-left">
                  <div>
                    <button
                      onClick={toggleMenu}
                      className="flex items-center focus:outline-none"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                        M
                      </div>
                    </button>
                  </div>

                  {isOpenProfile && (
                    <div className="absolute right-0 z-10 w-80 mt-2 bg-white rounded-md shadow-lg border border-gray-200">
                      <div className="py-2 px-4 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                          M
                        </div>
                        <div className="flex flex-1 justify-between items-center">
                          <div>
                            <p className="text-[16px] font-[500] text-black">
                              Myname12345
                            </p>
                            <p className="text-[10px] text-black">
                              myname123456@gmail.com
                            </p>
                          </div>
                          <ActiveIcon />
                        </div>
                      </div>
                      <div className="border-t border-gray-200">
                        <div className="flex flex-col gap-3 py-2 px-4">
                          <button className="flex items-center gap-2 t  w-full ">
                            <div className="w-10 h-10 rounded-full bg-[#0E0E0E] flex items-center justify-center  text-white">
                              <UserIcon />
                            </div>
                            <span className="text-[16px] font-[500]">
                              Add user
                            </span>
                          </button>
                          <p className="py-1 text-sm text-black cursor-pointer">
                            Trips
                          </p>
                          <p className="py-1 text-sm text-black cursor-pointer">
                            Help/FAQ
                          </p>
                          <Link
                            href={"/dashboard"}
                            className="py-1 text-sm text-black cursor-pointer"
                          >
                            Your account
                          </Link>
                        </div>
                      </div>
                      <div className="py-2 px-4">
                        <button
                          onClick={handleSignOut}
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
              <>
                <button
                  className="flex items-center gap-2 p-3 border border-[#9BA8B0] justify-center rounded-[10px] "
                  onClick={() => setIsOpen(true)}
                >
                  <AvatarIcon />
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                      Track prices, organise travel plans and access member-only
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
        </Dialog>
      </div>
    </header>
  );
}
