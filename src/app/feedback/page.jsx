import React from "react";
import coming from "@/public/images/coming-soon.jpg";

export default function page() {
  return (
    <>
      <img
        className="h-screen w-full object-cover "
        draggable={false}
        src={coming.src}
        alt=""
      />
    </>
  );
}
