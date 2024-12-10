import React from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
export default function Notifications({ userData, userDataLoading }) {
  return (
    <section>
      <div className="w-full  ">
        <div className="bg-white rounded-[6px] shadow-sm border border-gray-200 p-6">
          <h2 className="text-[20px] font-bold text-black mb-2">
            Email preferences
          </h2>
          <p className="text-[14px] text-black mb-2">
            We&apos;ll send the selected emails
            to mdtouhidulislam3219@gmail.com.
          </p>

          <div className="divide-y divide-gray-200">
            {[
              {
                title: "Travel Hacker Tips",
                description:
                  "A monthly update on the latest travel tips, tricks, trends and tools from KAYAK.",
              },
              {
                title: "Special offers",
                description:
                  "Get special and limited-time deals and discounts from our partners.",
              },
              {
                title: "Great Getaways",
                description:
                  "Weekly travel inspiration on the top destinations and getaways from your home airport.",
              },
              {
                title: "Money-Back Notifications",
                description:
                  "Receive refund info if you experience flight delays or cancellations.",
              },
              {
                title: "Your opinion counts",
                description:
                  "Share your experience with other travellers by leaving a review.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <h3 className="text-[16px] font-bold text-black">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-black">{item.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch /> <span className="text-[14px] uppercase">Off</span>
                </div>
              </div>
            ))}

            {[
              {
                title: "Personalised recommendations",
                description:
                  "Travel deals relevant to the trip you're planning.",
              },
              {
                title: "Real-Time Prices",
                description:
                  "Get updated prices for searches you've made on Ticketing.",
              },
            ].map((item, index) => (
              <div key={index} className="py-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-[16px] font-bold text-black">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-black">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch />{" "}
                    <span className="text-[14px] uppercase">Off</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox id={`flights-${index}`} />
                  <label
                    htmlFor={`flights-${index}`}
                    className="text-sm text-gray-700"
                  >
                    Flights
                  </label>
                </div>
              </div>
            ))}
            <div></div>
          </div>

          <p className="mt-6 text-[14px] font-[300] text-gray-500">
            Don&apos;t need our help finding the best travel deals, destinations
            and insights? Unsubscribe from all
          </p>
        </div>
      </div>
    </section>
  );
}
