import React, { useState } from "react";
import Select from "react-select";
import Datetime from "react-datetime";
import moment from "moment";

export default function BookingFormComp({
  index,
  passenger,
  updatePassengerData,
}) {
  const customStyles = {
    control: (base) => ({
      ...base,
      height: 50, // Desired height of the select box
      minHeight: 50, // Ensures the height doesn't shrink
    }),
    valueContainer: (base) => ({
      ...base,
      height: 50, // Matches the height of the control
      display: "flex",
      alignItems: "center", // Vertically center the text
    }),
    input: (base) => ({
      ...base,
      height: "100%", // Ensures input height fills the control height
      margin: 0,
    }),
    singleValue: (base) => ({
      ...base,
      display: "flex",
      alignItems: "center", // Center the selected value vertically
    }),
  };
  const valid = (current) => current.isAfter(moment().add(10, "day"));

  const documentTypes = [
    { value: "passport", label: "Passport" },
    { value: "nid", label: "Nid" },
  ];
  const countryOptions = [
    { value: "USA", label: "USA" },
    { value: "India", label: "India" },
    { value: "China", label: "China" },
  ];
  const [isDetailed, setIsDetailed] = useState(false);
  const [tabIndex, setTabIndex] = useState();

  const handleDetails = (index) => {
    setTabIndex(index);
    setIsDetailed(!isDetailed);
    if (isDetailed) {
      setTabIndex(null);
    }
  };

  return (
    <div>
      <div className="py-6 px-16 shadow-custom_shadow">
        <label
          className={`block text-sm font-medium ${
            tabIndex == index ? "text-black" : "text-[#9A9A9A]"
          }   mb-1 cursor-pointer text-[18px] font-[600] rounded-[4px]`}
          onClick={() => handleDetails(index)}
        >
          Passenger {index + 1} {""}({passenger?.type})
        </label>
        <div className={`${tabIndex == index ? "block" : "hidden"}`}>
          <p className="text-[14px] text-[#8696A1]">
            Make sure the names you enter exactly match your passport, and
            please use English characters only. Names can’t be changed once you
            have completed your booking.
          </p>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  className="border-2 border-gray-300 p-3 w-full rounded-[4px] focus:outline-none"
                  value={passenger.firstName}
                  onChange={(e) =>
                    updatePassengerData(index, "firstName", e.target.value)
                  }
                />
                <div className="w-full my-5">
                  <Select
                    styles={customStyles}
                    placeholder={"Select Document"}
                    options={documentTypes}
                    value={documentTypes.find(
                      (option) => option.value === passenger.documentType
                    )}
                    onChange={(selected) =>
                      updatePassengerData(index, "documentType", selected.value)
                    }
                  />
                </div>
                <div className="border-2 border-gray-300 p-2.5 w-full rounded-[4px] focus:outline-none">
                  <Datetime
                    inputProps={{
                      className:
                        "outline-none focus:outline-none focus:ring-0 ",
                    }}
                    dateFormat="DD-MM-YYYY"
                    timeFormat={false}
                    initialValue={moment().add(10, "day")}
                    isValidDate={valid}
                    value={passenger.dob ? moment(passenger.dob) : ""}
                    onChange={(date) =>
                      updatePassengerData(
                        index,
                        "dob",
                        date?.format("YYYY-MM-DD")
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[18px]">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border-2 border-gray-300 p-3 w-full rounded-[4px] focus:outline-none"
                  value={passenger.lastName}
                  onChange={(e) =>
                    updatePassengerData(index, "lastName", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Document number"
                  className="border-2 border-gray-300 p-3 w-full rounded-[4px] focus:outline-none"
                  value={passenger.docNumber}
                  onChange={(e) =>
                    updatePassengerData(index, "docNumber", e.target.value)
                  }
                />
                <div className="w-full">
                  <Select
                    styles={customStyles}
                    placeholder={"Select country"}
                    options={countryOptions}
                    value={countryOptions.find(
                      (option) => option.value === passenger.country
                    )}
                    onChange={(selected) =>
                      updatePassengerData(index, "country", selected.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end mt-4">
              <button
                type="submit"
                className="bg-[#FC660F] text-white py-3 font-semibold hover:bg-orange-600 transition duration-300 rounded-[4px] w-[200px] h-[49px]"
              >
                Save & Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
