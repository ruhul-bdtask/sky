"use client";

import Link from "next/link";

import { GiCommercialAirplane } from "react-icons/gi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-300 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 text-center relative">
          <h1 className="text-6xl font-bold text-orange-400 mb-4 ">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 animate-fade-in">
            Oops! This page is out of control
          </h2>
          <p className="text-gray-600 mb-8 animate-fade-in">
            It seems like we&apos;ve encountered some turbulence. The page
            you&apos;re looking for has flown off our radar.
          </p>
          <div className="flex justify-center items-center space-x-16 mb-8">
            <div className="animate-float text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-16 h-16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div className="">
              <GiCommercialAirplane size={50} />
            </div>
            <div className="animate-pulse text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-16 h-16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
          <Link href="/">
            <button className="bg-orange-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-500 transition duration-300 ease-in-out transform hover:scale-105 animate-fade-in">
              Return to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
