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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchData } from "@/utils/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ResetPasswordForm({ searchParams }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (payload) =>
      fetchData("/user/password/reset", "POST", payload, null),
    onSuccess: (data) => {
      if (data?.success == true) {
        setIsSubmitting(false);
        setPassword("");
        setSuccess(true);
      } else {
        toast.error(data?.email);
        setIsSubmitting(false);
        setError("Failed to reset password. Please try again.");
      }
    },
    onError: (error) => {
      setIsSubmitting(false);
      console.error("Mutation failed", error);
      toast.error(error?.message);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    Cookies.set("fromRoute", "/reset");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      email: searchParams?.email,
      token: searchParams?.token,
      password: password,
      password_confirmation: confirmPassword,
    };

    try {
      setIsSubmitting(true);

      // Here you would implement the actual password reset logic
      // For example, calling a server action or API endpoint

      // Simulate API call
      mutation.mutate(payload);

      // Simulate success
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleClick = () => {
    router.push("/login");
  };
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center">
          Create a new password for your account
        </CardDescription>
      </CardHeader>

      {success ? (
        <CardContent>
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your password has been reset successfully. You can now log in with
              your new password.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button onClick={() => handleClick()} className="mt-2">
              Go to login
            </Button>
          </div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {/* <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button> */}

            <button
              type="submit"
              className={`${
                isSubmitting && "cursor-not-allowed bg-gray-200"
              } text-white bg-[#FC660F] text-sm py-1.5 px-3  hover:bg-[#da7b44] w-full rounded-md`}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
