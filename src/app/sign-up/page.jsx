"use client";
import LeftArrowIcon from "@/public/icons/LeftArrowIcon";
import { LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import logo from "@/public/images/logo.png";
import device from "@/public/images/device.png";
import google from "@/public/images/google.png";
import apple from "@/public/images/apple.png";
import verify from "@/public/images/verify.png";
import MessageIcon from "@/public/icons/MessageIcon";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { fetchData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Oval } from "react-loader-spinner";
import Cookies from "js-cookie";
import useAirlineStore from "../../../stores/airlineStore";
export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [payload, setPayload] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const { token, setToken } = useAirlineStore();
  const handleClick = () => {};

  const {
    data: registerData,
    error: registerDataError,
    isLoading: registerDataLoading,
    refetch: registerDataRefetch,
  } = useQuery({
    queryKey: ["register", payload],
    queryFn: () => fetchData("/user/register", "POST", payload),

    enabled: false,
  });

  const handleSignup = (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedPhone = phone.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedFirstName) {
      toast.error("First Name is required.");
      return;
    }
    if (!trimmedLastName) {
      toast.error("Last Name is required.");
      return;
    }
    if (!trimmedEmail) {
      toast.error("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!trimmedPhone) {
      toast.error("Phone number is required.");
      return;
    }
    const phoneRegex = /^[0-9]{10,15}$/; // Accepts 10 to 15 digits
    if (!phoneRegex.test(trimmedPhone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (!trimmedPassword) {
      toast.error("Password is required.");
      return;
    }
    if (trimmedPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (trimmedPassword !== trimmedConfirmPassword) {
      toast.error("Confirm passwords do not match.");
      return;
    }
    const newPayload = {
      email: trimmedEmail,
      password: trimmedPassword,
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
      phone: trimmedPhone,
      confirm_password: trimmedConfirmPassword,
      user_type: "user",
      login_medium: "email",
      verify_by: "email",
      ip_address: "192.0.0.10",
    };

    setPayload(newPayload);

    if (payload) {
      registerDataRefetch();
    }

    console.log("Payload:", payload);
  };

  useEffect(() => {
    if (registerData?.success) {
      toast.success("Registration successful.");
      Cookies.set("auth-token", registerData?.authorization?.token);
      setPayload(null);
      setToken(registerData?.authorization?.token);
      router.push("/dashboard");
    } else if (registerDataError) {
      const errorMessage =
        registerDataError.message || "An error occurred during registration.";
      toast.error(errorMessage);
      console.log("Registration failed", registerDataError);
    }
  }, [registerData, registerDataError]);

  return (
    <div className="max-w-[400px] sm:max-w-[490px] top-[12%] px-8 py-4 rounded-[11px] bg-white mx-auto">
      <div>
        <Image
          alt="Company logo"
          className="w-24"
          src={logo}
          width={96}
          height={96}
        ></Image>
      </div>
      <div className="grid items-center gap-4 w-full">
        <div className="bg-[#FFECE0] p-8 flex justify-center items-center rounded-[16px] mt-5">
          <Image
            alt="Device preview"
            className="h-[182px]"
            src={device}
            width={200}
            height={182}
          ></Image>
        </div>
        <div className="py-2">
          <h2 className="text-[20px] font-medium">
            Sign in or create an account
          </h2>
          <p className="text-[12px]">
            Track prices, organise travel plans, and access member-only deals
            with your ticketing account.
          </p>
        </div>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="grid gap-4">
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                id="firstname"
                name="firstname"
                placeholder="Enter your first name"
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Enter your last name"
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter your phone"
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="confirmpassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                id="confirmpassword"
                name="confirmpassword"
                placeholder="Confirm your password"
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
              />
            </div>
          </div>
          <div>
            <button
              disabled={registerDataLoading}
              type="submit"
              className="w-full bg-[#f06a3d] text-white font-medium py-2 px-4 rounded-md hover:bg-[#f06a3d] focus:outline-none  focus:ring-0"
            >
              {registerDataLoading ? (
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
                <span> Submit</span>
              )}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center my-4">
          <div className="w-full h-px bg-gray-300"></div>
          <span className="mx-3 text-black">or</span>
          <div className="w-full h-px bg-gray-300"></div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <button
            className="flex items-center gap-2 p-3 border border-gray-400 justify-center rounded-[10px]"
            type="button"
            onClick={handleClick}
          >
            <Image
              alt="Sign in with Google"
              src={google}
              width={20}
              height={20}
            ></Image>
            Google
          </button>
          <button
            className="flex items-center gap-2 p-3 border border-gray-400 justify-center rounded-[10px]"
            type="button"
            onClick={handleClick}
          >
            <Image
              alt="Sign in with Apple"
              src={apple}
              width={20}
              height={20}
            ></Image>
            Facebook
          </button>
        </div>
        <p className="text-[12px] mt-2 text-center">
          Do you have an account ?{" "}
          <Link href="/login" className="text-[#f06a3d]">
            Login
          </Link>{" "}
        </p>
        <p className="text-[10px] mt-2 text-center">
          By signing up, you accept our{" "}
          <a href="#" className="text-blue-500">
            terms of use
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-500">
            privacy policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
