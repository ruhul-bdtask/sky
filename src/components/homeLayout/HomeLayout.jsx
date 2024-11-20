"use client";

import Sidebar from "../sideBar/Sidebar";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useSidebar } from "@/context/sidebar-context";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function HomeLayout({ children }) {
  const { isSidebarOpen } = useSidebar();
  const router = useRouter();
  const ref = useRef(null);
  useEffect(() => {
    ref.current.continuousStart(); // Start the loading bar

    // Simulate an API call
    setTimeout(() => {
      ref.current.complete(); // Complete the loading bar
    }, 2000); // Simulate 2 seconds loading
  }, []);

  return (
    <div>
      <Header />
      <LoadingBar color="#f11946" height={2} ref={ref} />

      <div className="flex  w-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div
          className={`flex-1 w-full overflow-y-auto transition-all duration-100 ease-in-out mt-20`}
        >
          {/* Fixed Header */}

          {/* Children with scrolling enabled */}
          <div
            className={` transition-all duration-300 ease-in-out ${
              isSidebarOpen ? "ml-64" : "ml-0 lg:ml-16"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
