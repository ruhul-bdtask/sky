import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import React from "react";
import google from "@/public/images/google.png";
import useAirlineStore from "../../../stores/airlineStore";
import { useState } from "react";
import { fetchData } from "@/utils/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import useSyncSavedFlights from "@/hooks/useSyncSavedFlights";

const LoginWithGoogle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { token, setToken, setUserData, userData } = useAirlineStore();
  const { syncSavedFlights } = useSyncSavedFlights();
  const router = useRouter();

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
        setUserData(response.user);
        syncSavedFlights(token);

        router.push("/");
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

  return (
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
  );
};

export default LoginWithGoogle;
