import Image from "next/image";
import Link from "next/link";
import booking from "@/public/images/booking-com.png";
import kayak from "@/public/images/kayak.png";
import openT from "@/public/images/openT.png";
import priceline from "@/public/images/priceline.png";
import agoda from "@/public/images/agoda.png";
import playstore from "@/public/images/playstore.png";
import appstore from "@/public/images/appstore.png";
import FacebookIcon from "@/public/icons/FacebookIcon";
import TwitterIcon from "@/public/icons/TwitterIcon";
import YoutubeIcon from "@/public/icons/YoutubeIcon";
import InstagramIcon from "@/public/icons/InstagramIcon";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-600 py-8 border-t ">
      <div className=" py-10 container_section_sm  max-w-7xl">
        <div className="px-20 xl:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          <div>
            <h2 className="text-[14px] font-semibold mb-4">Company</h2>
            <ul className="space-y-2 text-[14px] ">
              <li>
                <Link href="#" className="hover:text-gray-900 underline hover:no-underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-900 underline hover:no-underline">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-900 underline hover:no-underline">
                  Mobile
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-900 underline hover:no-underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-900 underline hover:no-underline">
                  How we work
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-[14px] font-semibold mb-4">Contact</h2>
            <ul className="space-y-2 text-[14px] ">
              <li>
                <Link href="#" className="hover:text-gray-900 underline hover:no-underline">
                  Help/FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-900 underline hover:no-underline">
                  Press
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-900 underline hover:no-underline">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-900 underline hover:no-underline">
                  Advertise with us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-[14px] font-semibold mb-4">More</h2>
            <ul className="space-y-2 text-[14px] ">
              <li>
                <Link href="#" className="hover:text-gray-900 underline hover:no-underline">
                  Airline fees
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-900 underline hover:no-underline">
                  Airlines
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-900 underline hover:no-underline">
                  Low fare tips
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gray-900 underline hover:no-underline">
                  Badges & Certificates
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-[14px] font-semibold mb-4">
              Get the KAYAK App
            </h2>
            <div className="flex flex-col gap-3">
              <Link href="#" className="inline-block">
                <Image
                  src={playstore}
                  alt="Get it on Google Play"
                  width={135}
                  height={40}
                />
              </Link>
              <Link href="#" className="inline-block">
                <Image
                  src={appstore}
                  alt="Download on the App Store"
                  width={135}
                  height={40}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-20 xl:px-0">
          <div className="mt-8 pt-8  ">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center space-x-4 flex-wrap">
                <span className="text-sm">&copy;2024 TICKETING</span>
                <Link
                  href="#"
                  className="text-sm hover:text-gray-900 underline hover:no-underline"
                >
                  Privacy
                </Link>
                <Link
                  href="#"
                  className="text-sm hover:text-gray-900 underline hover:no-underline"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="#"
                  className="text-sm hover:text-gray-900 underline hover:no-underline"
                >
                  Add choices
                </Link>
              </div>
              <div className="flex space-x-6 mt-4 sm:mt-0">
                <Link href="#" className="text-gray-400 hover:text-gray-900">
                  <span className="sr-only">Facebook</span>
                  <FacebookIcon />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-gray-900">
                  <span className="sr-only">Twitter</span>
                  <TwitterIcon />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-gray-900">
                  <span className="sr-only">YouTube</span>
                  <YoutubeIcon />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-gray-900">
                  <span className="sr-only">Instagram</span>
                  <InstagramIcon />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap  gap-4">
            <Image
              src={booking}
              alt="Booking.com"
              className="w-[106px] h-full"
            />
            <Image src={kayak} alt="KAYAK" className="w-[106px] h-full" />
            <Image src={openT} alt="OpenTable" className="w-[106px] h-full" />
            <Image
              src={priceline}
              alt="Priceline"
              className="w-[106px] h-full"
            />
            <Image src={agoda} alt="Agoda" className="w-[70px] h-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}
