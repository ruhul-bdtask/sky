// app/components/Header.js
import { useSidebar } from "@/app/sidebar-context";
import { Menu, X, Heart } from "lucide-react";
import logo from "@/public/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar(); // Access the sidebar state
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`bg-white shadow-sm z-40 left-0 right-0 h-20 border-b ${
        isScrolled ? "fixed top-0" : "relative"
      }`}
    >
      <div className="max-w-full  sm:px-6 lg:px-2 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none  "
            >
              <span className="sr-only">Open sidebar</span>
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <Link href={"/"}>
              <Image src={logo}></Image>
            </Link>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">View favorites</span>
              <Heart className="h-6 w-6" />
            </button>
            <button className="ml-4 px-4 py-2 rounded-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
