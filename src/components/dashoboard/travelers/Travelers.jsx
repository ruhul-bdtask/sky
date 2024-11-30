import React from "react";

export default function Travelers() {
  return (
    <section>
      <h2 className="text-[24px] font-bold text-black mb-5">Travelers</h2>
      <div className="w-full flex flex-col gap-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
          <div className="">
            <div className="border-b">
              <h3 className="text-[16px] font-bold text-black mb-1">
                Primary traveler
              </h3>
              <p className="text-[14px] text-gray-600 mb-4">
                Search for flights more easily by saving your home airport and
                other airports you travel through often.
              </p>

              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-[#EAEEF1] text-black w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                  M
                </div>
                <span className="text-[14px] text-black">
                  myname2346@gmail.com
                </span>
              </div>
            </div>

            <div className="flex items-center flex-wrap">
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-10">
                  <div>
                    <label className="block text-[14px] text-black mb-1 font-[500]">
                      First name
                    </label>
                    <div className="text-sm text-black">-</div>
                  </div>
                  <div>
                    <label className="block text-[14px] text-black mb-1 font-[500]">
                      Middle name
                    </label>
                    <div className="text-sm text-black">-</div>
                  </div>
                  <div>
                    <label className="block text-[14px] text-black mb-1 font-[500]">
                      Surname
                    </label>
                    <div className="text-sm text-black">-</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-[14px] text-black mb-1 font-[500]">
                      Date of birth
                    </label>
                    <div className="text-sm text-black">-</div>
                  </div>
                  <div>
                    <label className="block text-[14px] text-black mb-1 font-[500]">
                      Gender
                    </label>
                    <div className="text-sm text-black">-</div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-[14px] text-black mb-1 font-[500]">
                    Mobile number
                  </label>
                  <div className="text-sm text-black">-</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-[14px] text-black mb-1 font-[500]">
                      DHS redress number
                    </label>
                    <div className="text-sm text-black">-</div>
                  </div>
                  <div>
                    <label className="block text-[14px] text-black mb-1 font-[500]">
                      Known traveler number
                    </label>
                    <div className="text-sm text-black">-</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <button className="text-sm text-[#007799] hover:text-[#297f97] focus:outline-none font-[500]">
                  Edit traveler
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
          <h2 className="text-[16px]  font-bold text-black mb-2">
            Travel companions
          </h2>
          <p className="text-[14px] text-[#686868] mb-6">
            Add family, friends, and colleagues with whom you travel often for
            faster and easier bookings
          </p>

          <p className="text-[#007799] text-[14px] font-semibold cursor-pointer">
            Add traveler
          </p>
        </div>
      </div>
    </section>
  );
}
