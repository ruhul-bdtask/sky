import React from "react";

export default function LoadingFixed() {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[#FF6810] z-50 overflow-hidden 
      `}
    >
      <img
        src="/ticketing.gif"
        alt="Loading..."
        className="w-64  h-full object-contain"
      />
    </div>
  );
}
