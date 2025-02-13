import Image from "next/image";
import React from "react";
import google from "@/public/images/google.png";
import trip from "@/public/images/trip-seats.png";
import accountImg from "@/public/images/accountImg.png";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

export default function Account({ userData, userDataLoading }) {
  return (
    <section>
      <div className=" mx-auto ">
        <h1 className="text-2xl font-bold mb-6">Account</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border rounded-[6px]">
          <div>
            <section className="bg-white rounded-lg  p-6 mb-6 ">
              <h2 className="text-xl font-semibold mb-4">Preferences</h2>
              <div className="space-y-7">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your name
                  </label>
                  <div className="flex items-center border p-2">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={
                        userData?.data?.first_name +
                        " " +
                        userData?.data?.last_name
                      }
                      className="flex-grow border-gray-300  focus:outline-none outline-none w-full"
                    />
                    <button className="ml-2 text-teal-600 hover:text-teal-800">
                      Edit
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Display name
                  </label>
                  <div className="flex items-center border p-2">
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={userData?.data?.first_name}
                      className="flex-grow border-gray-300  focus:outline-none outline-none w-full"
                    />
                    <button className="ml-2 text-teal-600 hover:text-teal-800">
                      Add{" "}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <div className="flex items-center border p-2">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData?.data?.email}
                      readOnly
                      className="flex-grow border-gray-300  focus:outline-none outline-none w-full"
                    />
                    <button className="ml-2 text-teal-600 hover:text-teal-800">
                      Edit{" "}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email-site"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email site
                  </label>
                  <div className="flex items-center border p-2">
                    <input
                      type="text"
                      id="email-site"
                      name="email-site"
                      value={userData?.data?.home_airport}
                      readOnly
                      className="flex-grow border-gray-300  focus:outline-none outline-none w-full"
                    />
                    <button className="ml-2 text-teal-600 hover:text-teal-800">
                      Edit{" "}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Social connections
                  </label>
                  <p className="text-sm text-gray-600 mb-2">
                    Link your accounts with Tickteing
                  </p>
                  <button className="bg-[#15844B] text-white px-3 py-2 rounded-[2px] text-[10px] font-medium hover:bg-green-700 ">
                    <div className="flex items-center gap-2">
                      <Image alt="google" src={google}></Image>
                      <p>Linked</p>
                    </div>
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className="hidden md:block ">
            <Image
              src={accountImg}
              alt="Illustration of laptop and people"
              className="w-full h-auto rounded-lg "
            />
          </div>
        </div>
        <section className="bg-white rounded-[6px] shadow-sm p-6 border my-4">
          <h2 className="text-[16px] font-semibold mb-4">Passkeys</h2>
          <p className="text-[14px] text-black mb-4">
            Passkeys are easy to set up and let you securely sign into your
            KAYAK account using your fingerprint, face, or screen lock.
          </p>
          <button className="bg-[#363F45] text-white px-3 py-2 rounded-[2px] text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Add Passkeys
          </button>
        </section>
        <section className="mb-8">
          <div
            className="px-6 py-8"
            style={{
              backgroundImage: `url(${trip.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-gray-100 bg-opacity-70 p-2 rounded-lg">
              <p className="mb-2 text-[24px] font-semibold">
                Connect your inbox
              </p>
              <p className="text-[14px] text-black mb-4">
                Automatically import bookings from your Gmail or Outlook account
                to new or existing trips (no email forwarding required).
                Organise your travel effortlessly.
              </p>
              <button className="bg-[#363F45] text-white text-[14px] font-semibold px-4 py-2 rounded">
                Connect
              </button>
            </div>
          </div>
        </section>
        <section className="rounded-[6px] shadow-sm p-6 border my-4 space-y-4">
          <div className="border-b pb-5">
            <h2 className="text-[16px] font-semibold mb-4">
              Authorized senders
            </h2>
            <p className="text-[14px] text-black mb-4">
              Forward booking receipts from these accounts manually to
              trips@kayak.co.in to add them to your trips. There will be no
              automatic syncing of receipts.
            </p>
            <p className="text-[16px] pb-3">myname123456@gmail.com(you)</p>
            <button className="bg-[#363F45] text-white px-3 py-1 rounded-[2px] text-sm font-medium hover:bg-gray-700 ">
              Add an email
            </button>
          </div>
          <div className="border-b pb-5">
            <h2 className="text-[16px] font-semibold mb-4">
              Automatically share trips
            </h2>
            <p className="text-[14px] text-black mb-4">
              We&apos;ll share every trip you create with these emails.
            </p>
            <button className="bg-[#363F45] text-white px-3 py-1 rounded-[2px] text-sm font-medium hover:bg-gray-700 ">
              Add an email
            </button>
          </div>
          <div>
            <h2 className="text-[16px] font-semibold mb-2">
              Trips calendar feed
            </h2>
            <p className="text-[14px] text-black mb-4">
              This feed address shows all your Trips
            </p>
            <p className="bg-[#F3F5F7] text-[12px] cursor-pointer inline-block p-1">
              https://www.ticketing.co.in/trips/ical/uf/SYhGZjr4JYY/5F$$RNBV/calendar.ics
            </p>
            <Link href={"#"}>
              <p className="text-[#0B7C9E] text-[14px] pt-4 ">
                {" "}
                Reset this link Read instructions
              </p>
            </Link>
          </div>
        </section>
        <section className="bg-white rounded-[6px] shadow-sm px-10 py-6 border my-4 flex items-center justify-between">
          <div className="px-10">
            <h2 className="text-[16px] font-semibold mb-1">
              Your usage information
            </h2>
            <p className="text-[14px] text-black mb-4">
              Usage information helps us improve your KAYAK experience. Want to
              check yours?
            </p>
          </div>
          <button className="bg-[#363F45] text-white  rounded-[2px] text-[14px] font-medium hover:bg-gray-700 w-[105px] h-[27px]">
            Check usage
          </button>
        </section>
        <section className="rounded-[6px] shadow-sm p-6 border my-4 space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-[14px] font-semibold mb-4">
              Your choices over personal information
            </h2>

            <p className="text-[9px] text-black mb-4">
              We share your personal information to allow third parties to
              provide marketing and offers relevant to you. You can modify how
              your information is shared for these purposes below. Learn more
            </p>

            <div className="flex justify-between items-center">
              <span className="text-[10px]">
                Sharing with our group companies Learn more
              </span>
              <p className="flex items-center gap-2">
                <Switch className="bg-[#0B7B99]" /> on
              </p>
            </div>
          </div>
          <div className="border-b pb-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px]">
                Sharing with travel partners Learn more
              </span>
              <p className="flex items-center gap-2">
                <Switch /> on
              </p>
            </div>
          </div>
          <div className="">
            <div className="flex justify-between items-center">
              <span className="text-[10px]">
                Sharing with our business partners {" "}
                <span className="underline">Learn more</span>
              </span>
              <p className="flex items-center gap-2">
                <Switch /> on
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
