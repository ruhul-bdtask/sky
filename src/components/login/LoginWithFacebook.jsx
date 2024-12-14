import { fetchData } from "@/utils/api";
import React, { useState } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import Cookies from "js-cookie";

import { ImFacebook2 } from "react-icons/im";
import useAirlineStore from "../../../stores/airlineStore";
import { useRouter } from "next/navigation";
import useSyncSavedFlights from "@/hooks/useSyncSavedFlights";

const LoginWithFacebook = () => {
  const { token, setToken, setUserData, userData } = useAirlineStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { syncSavedFlights } = useSyncSavedFlights();

  const FACEBOOK_CLIENT_ID = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID;

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
  };
  return (
    <FacebookLogin
      appId={FACEBOOK_CLIENT_ID}
      autoLoad={false}
      fields="name,email,picture"
      // onClick={componentClicked}
      callback={facebookLoginHandler}
      render={(renderProps) => (
        <button
          className="flex items-center gap-2 p-3 border border-gray-400 justify-center rounded-[10px]"
          type="button"
          onClick={renderProps.onClick}
        >
          <ImFacebook2 className="text-blue-500" />
          Facebook
        </button>
      )}
    />
  );
};

export default LoginWithFacebook;
