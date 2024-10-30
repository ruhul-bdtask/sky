import React from "react";

export default function Payment() {
  return (
    <section>
      <h2 className="text-[24px]  font-bold pt-8 pb-5">Saved payment methods</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-[16px]  font-semibold text-black mb-2">
          Saved payment methods
        </h2>
        <p className="text-[14px] text-[#686868] mb-6">
          Choose from your saved payment methods when booking to quickly
          autofill your payment info.
        </p>

        <p className="text-[#007799] text-[14px] font-semibold cursor-pointer">
          Add a credit card
        </p>
      </div>
    </section>
  );
}
