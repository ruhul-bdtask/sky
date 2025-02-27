import React from "react";

export default function Loading({ loading }) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[#FF6810] z-50 overflow-hidden transition-all duration-700 ${
        loading ? "translate-y-0 opacity-100" : "-translate-y-full opacity-100"
      }`}
    >
      <img
        src="/ticketing.gif"
        alt="Loading..."
        className="w-64  h-full object-contain"
      />
    </div>
  );
}
