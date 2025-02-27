"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import { toast } from "react-toastify";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload) =>
      fetchData("/user/password/forgot", "POST", payload, null),
    onSuccess: (data) => {
      if (data?.success == true) {
        setIsLoading(false);
        toast.success(data?.status);
        setEmail("");
      } else {
        toast.error(data?.email);
      }
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Mutation failed", error);
      toast.error(error?.message);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning("please type email");
      return;
    } else {
      setIsLoading(true);
      mutation.mutate({
        email: email,
        site_url: "https://ticketing.com.bd/reset",
        // site_url: "http://localhost:3000/reset",
      });
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Reset your password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we&apos;ll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <label htmlFor="email">Email</label>
            <div className="flex items-center border p-1.5 rounded-md">
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="flex-grow border-gray-300  focus:outline-none outline-none w-full"
              />
            </div>
          </CardContent>
          <CardFooter>
            <button
              type="submit"
              className={`${
                isLoading && "cursor-not-allowed bg-gray-200"
              } text-white bg-[#FC660F] text-sm py-1.5 px-3  hover:bg-[#da7b44] w-full rounded-md`}
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
