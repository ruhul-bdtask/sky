"use client";

import useSyncSavedFlights from "@/hooks/useSyncSavedFlights";
import apple from "@/public/images/apple.png";
import device from "@/public/images/device.png";
import google from "@/public/images/google.png";
import logo from "@/public/images/logo.png";
import { fetchData } from "@/utils/api";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import useAirlineStore from "../../../stores/airlineStore";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState(null);
  const { token, setToken, setUserData, userData } = useAirlineStore();

  const handleClick = () => {};
  const FACEBOOK_CLIENT_ID = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID;

  const { syncSavedFlights } = useSyncSavedFlights();

  const {
    data: saveTripsData,
    error: saveTripsError,
    isLoading: saveTripsLoading,
    refetch: saveTripsRefetch,
  } = useQuery({
    queryKey: ["saveTrips", payload],
    queryFn: () => fetchData("/gds/save-trips", "GET", payload, token),
    enabled: false,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    // Basic validations
    if (!trimmedEmail) {
      return toast.error("Email is required.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return toast.error("Please enter a valid email address.");
    }
    if (!trimmedPassword) {
      return toast.error("Password is required.");
    }
    if (trimmedPassword.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }

    const payload = {
      email: trimmedEmail,
      password: trimmedPassword,
    };

    if (trimmedEmail && trimmedPassword) {
      try {
        setIsLoading(true);
        const data = await fetchData("/user/login", "POST", payload);
        const token = data.authorization?.token;

        if (!token) throw new Error("No token received from the server.");

        Cookies.set("auth-token", token);
        setToken(token);
        setUserData(data?.user);
        await syncSavedFlights(token);

        router.push("/dashboard");
      } catch (err) {
        console.error("Error during login:", err);
        setError(err.message || "Login failed.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Email and password are required.");
    }
  };

  // useEffect(() => {
  //   if (token) {
  //     router.push("/dashboard");
  //   }
  // }, [token, router]);

  // Google login hook
  const googleLoginHandler = useGoogleLogin({
    // flow: "auth-code",
    // flow: "implicit",
    onSuccess: async (credentialResponse) => {
      try {
        setIsLoading(true);
        const access_token = credentialResponse?.access_token;
        const response = await fetchData("/user/login-with-social", "POST", {
          provider: "google",
          token: access_token,
        });
        let token;
        if (response.success && response.authorization.token) {
          token = response.authorization.token;
        }
        if (!token) {
          throw new Error("Failed to retrieve token from Google response.");
        }
        // Save token securely in cookies
        Cookies.set("auth-token", token);
        setToken(token);

        router.push("/dashboard");
      } catch (error) {
        console.error("Login Error:", error);
        Cookies.remove("auth-token");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    },

    onError: () => {
      console.error("Google Login Failed");
    },
  });

  const facebookLoginHandler = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const access_token = credentialResponse?.accessToken;
      const response = await fetchData("/user/login-with-social", "POST", {
        provider: "facebook",
        token: access_token,
      });

      let token;
      if (response.success && response.authorization.token) {
        token = response.authorization.token;
      }
      if (!token) {
        throw new Error("Failed to retrieve token from Google response.");
      }
      // Save token securely in cookies
      Cookies.set("auth-token", token);
      setToken(token);

      router.push("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      Cookies.remove("auth-token");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h2 className="text-[20px] font-medium">Sign in to your account</h2>
          <p className="text-[12px]">
            Track prices, organise travel plans, and access member-only deals
            with your ticketing account.
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
              className="w-full bg-[#f06a3d] text-white font-medium py-2 px-4 rounded-md hover:bg-[#f06a3d] focus:outline-none  focus:ring-0"
            >
              {isLoading ? (
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
          <FacebookLogin
            appId={FACEBOOK_CLIENT_ID}
            autoLoad={false}
            fields="name,email,picture"
            // onClick={componentClicked}
            callback={facebookLoginHandler}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4267B2",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Login Facebook
              </button>
            )}
          />
          <button
            className="flex items-center gap-2 p-3 border border-gray-400 justify-center rounded-[10px]"
            type="button"
            onClick={googleLoginHandler}
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
          Do you haven&apos;t any account ?{" "}
          <Link href="/sign-up" className="text-[#f06a3d]">
            Sign up
          </Link>{" "}
        </p>
      </div>
    </div>
  );
}
