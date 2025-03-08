"use client";

import React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Oval } from "react-loader-spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import logo from "@/public/images/logo.png";
import LoginWithGoogle from "@/components/login/LoginWithGoogle";
import LoginWithFacebook from "@/components/login/LoginWithFacebook";
import useAirlineStore from "../../../stores/airlineStore";
import { toast } from "react-toastify";
import useSyncSavedFlights from "@/hooks/useSyncSavedFlights";
import { fetchData } from "@/utils/api";
import Cookies from "js-cookie";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function LoginModal({
  open,
  setOpen,
  setPassengerInformation,
  passengerData,
  setContactInformation,
  contactInfo,
  setActiveTab,
  arg,
  defaultMail,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, setUserData } = useAirlineStore();
  //   const [open, setOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const trimmedEmail = defaultMail.trim();
    const trimmedPassword = password.trim();
    // Basic validations
    if (!trimmedEmail) {
      setIsLoading(false);
      toast.error("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setIsLoading(false);
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!trimmedPassword) {
      setIsLoading(false);
      toast.error("Password is required.");
      return;
    }
    if (trimmedPassword.length < 8) {
      setIsLoading(false);
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    const payload = {
      email: trimmedEmail,
      password: trimmedPassword,
    };

    if (trimmedEmail && trimmedPassword) {
      try {
        setIsLoading(true);
        const data = await fetchData("/user/login", "POST", payload);
        const token = data?.authorization?.token;

        if (!token) throw new Error("No token received from the server.");

        Cookies.set("auth-token", token);
        setToken(token);
        setUserData(data?.user);
        // useSyncSavedFlights(token);
        // const redirectPath = router?.back || "/";
        setPassengerInformation(passengerData);
        setContactInformation(contactInfo);
        setActiveTab(arg);
        setOpen(false);
      } catch (err) {
        console.error("Error during login:", err);
        setIsLoading(false);
        // setError(err.message || "Login failed.");
      } finally {
        setIsLoading(false);
      }
    } else {
      //   setError("Email and password are required.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 border-none max-w-[400px] sm:max-w-[490px]">
        <div className="max-w-[400px] sm:max-w-[490px] px-8 py-4 rounded-[11px] bg-white mx-auto">
          <div>
            <Image
              alt="Company logo"
              className="w-24"
              src={logo}
              width={96}
              height={96}
            />
          </div>
          <div className="grid items-center gap-4 w-full">
            <div className="py-2">
              <DialogTitle className="text-[20px] font-medium">
                Sign in to your account
              </DialogTitle>
              <p className="text-[12px]">
                Track prices, organise travel plans, and access member-only
                deals with your ticketing account.
              </p>
            </div>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="grid gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    // onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="email"
                    name="email"
                    readOnly={defaultMail ? true : false}
                    disabled={defaultMail ? true : false}
                    value={defaultMail}
                    placeholder="Enter your email"
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
              </div>
              <div>
                <button
                  disabled={isLoading}
                  type="submit"
                  className={`${
                    isLoading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#f06a3d] hover:bg-[#b94c28]"
                  } w-full text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-0`}
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center">
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
                      />
                    </div>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </div>
            </form>
            <div className="flex justify-between items-center">
              <p className="text-sm">Forget password ?</p>
              <Link
                className="text-blue-400 text-sm underline"
                href="/reset-password"
              >
                Reset it
              </Link>
            </div>

            <div className="flex items-center justify-center my-4">
              <div className="w-full h-px bg-gray-300"></div>
              <span className="mx-3 text-black">or</span>
              <div className="w-full h-px bg-gray-300"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <LoginWithGoogle />
              <LoginWithFacebook />
            </div>
            <p className="text-[12px] mt-2 text-center">
              Do you haven&apos;t any account?{" "}
              <Link href="/sign-up" className="text-[#f06a3d]">
                Sign up
              </Link>{" "}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
