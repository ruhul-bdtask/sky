"use client";

import { useSidebar } from "@/app/sidebar-context";
import Sidebar from "../sideBar/Sidebar";
import Header from "../header/Header";
import Footer from "../footer/Footer";

export default function HomeLayout({ children }) {
  const { isSidebarOpen } = useSidebar();

  return (
    <div>
      <Header />
      <div className="flex  w-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div
          className={`flex-1 w-full overflow-y-auto transition-all duration-100 ease-in-out `}
        >
          {/* Fixed Header */}

          {/* Children with scrolling enabled */}
          <div
            className={` transition-all duration-300 ease-in-out ${
              isSidebarOpen ? "ml-64" : "ml-16"
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
