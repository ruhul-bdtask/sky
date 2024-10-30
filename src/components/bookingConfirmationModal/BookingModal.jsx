"use client";

import { useState } from "react";
import { Check, X, Download } from "lucide-react";

export default function BookingConfirmationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[21px] shadow-lg w-full max-w-[700px] h-[586px] flex flex-col relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-grow flex flex-col items-center justify-center px-10 py-8 space-y-6 ">
          <div className="bg-orange-500 rounded-full p-4">
            <Check className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-center">
            You have Successfully Booked ticket
          </h2>

          <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-sm mb-4">
              <div>
                <p className="text-gray-500">Invoice Number</p>
                <p className="font-semibold">INVBD45678434UI</p>
              </div>
              <div>
                <p className="text-gray-500">Payment method</p>
                <p className="font-semibold">Visa card</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-semibold">2 september 2024</p>
              </div>
              <div>
                <p className="text-gray-500">Time</p>
                <p className="font-semibold">09:45 AM</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center mb-4">
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
                  <p className="font-semibold">DHA-CXS</p>
                  <p className="text-sm text-gray-500">1 Traveler</p>
                </div>
                <div className=" ml-auto  text-right">
                  <p className="font-semibold">Tk.14,345</p>
                  <p className="text-sm text-gray-500">Economy</p>
                </div>
              </div>

              <div className="flex justify-between text-sm mb-4">
                <div>
                  <p className="font-semibold">11:30</p>
                  <p className="text-gray-500">Sun, 14 Sep, 2024</p>
                  <p className="text-gray-500">DAC</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Non-stop</p>
                  <div className="w-24 h-px bg-gray-300 my-2 mx-auto"></div>
                  <p className="text-gray-500">1H</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">12:30</p>
                  <p className="text-gray-500">Sun, 14 Sep, 2024</p>
                  <p className="text-gray-500">KUL</p>
                </div>
              </div>
            </div>
          </div>

          <button className=" bg-[#FC660F] text-white py-3 font-semibold hover:bg-orange-600 flex items-center px-4  transition duration-300 rounded-[4px] ">
            <Download className="w-5 h-5 mr-2" />
            Ticket Copy
          </button>
        </div>
      </div>
    </div>
  );
}
