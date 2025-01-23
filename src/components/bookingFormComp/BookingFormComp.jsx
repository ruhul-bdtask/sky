import React, { useEffect, useState } from "react";
import Select from "react-select";
import Datetime from "react-datetime";
import moment from "moment";
import useAirlineStore from "../../../stores/airlineStore";
import { toast } from "react-toastify";
const countryOptions = require("../../../public/utils/countries.json");

export default function BookingFormComp({
  index,
  passenger,
  updatePassengerData,
  passengerData,
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
    { value: "passport", label: "Passport", shortCode: "p" },
    { value: "nid", label: "Nid", shortCode: "n" },
  ];

  const titles = [
    { value: "Mr", label: "Mr", shortCode: "Mr" },
    { value: "Mrs", label: "Mrs", shortCode: "Mrs" },
    { value: "Miss", label: "Miss", shortCode: "Miss" },
  ];

  // const countryOptions = [
  //   { value: "USA", label: "USA", shortCode: "US" },
  //   { value: "India", label: "India", shortCode: "IN" },
  //   { value: "China", label: "China", shortCode: "CN" },
  // ];

  const [isDetailed, setIsDetailed] = useState(false);
  const [tabIndex, setTabIndex] = useState();
  const { setPassengerInformation, passengerInformation } = useAirlineStore();

  const handleDetails = (index) => {
    setTabIndex(index);
    setIsDetailed(!isDetailed);
    if (isDetailed) {
      setTabIndex(null);
    }
  };

  const validatePassengers = (passengers) => {
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];

      if (!passenger.firstName || passenger.firstName.trim() === "") {
        toast.error(`Passenger ${i + 1}: Please fill up First Name`);
        return false;
      }
      if (!passenger.lastName || passenger.lastName.trim() === "") {
        toast.error(`Passenger ${i + 1}: Please fill up Last Name`);
        return false;
      }

      if (!passenger.documentType || passenger.documentType.trim() === "") {
        toast.error(`Passenger ${i + 1}: Please select Document Type`);
        return false;
      }

      if (!passenger.country || passenger.country.trim() === "") {
        toast.error(`Passenger ${i + 1}: Please select Country`);
        return false;
      }
      if (!passenger.docNumber || passenger.docNumber.trim() === "") {
        toast.error(`Passenger ${i + 1}: Please fill up Document Number`);
        return false;
      }
    }

    return true;
  };

  const handlePassengerInfo = (e, index) => {
    e.preventDefault();

    const isValid = validatePassengers(passengerData);
    if (isValid) {
      setPassengerInformation(passengerData);
      handleDetails(index);
    }
  };

  return (
    <div>
      <div className="py-6 px-4 md:px-16  shadow-custom_shadow">
        <label
          className={`block text-sm font-medium ${
            tabIndex === index ? "text-black" : "text-[#9A9A9A]"
          } mb-1 cursor-pointer text-[18px] font-[600] rounded-[4px]`}
          onClick={() => handleDetails(index)}
        >
          {Object.keys(passengerInformation).length == 0 ? (
            <>
              <span>Passenger {index + 1}</span> ({passenger?.pxn_type})
            </>
          ) : passengerInformation[index]?.firstName == "" ? (
            "Fill up this box also..."
          ) : (
            passengerInformation[index]?.firstName +
            " " +
            passengerInformation[index]?.lastName
          )}
        </label>
        <div className={`${tabIndex === index ? "block" : "hidden"}`}>
          <p className="text-[14px] text-[#8696A1]">
            Make sure the names you enter exactly match your passport, and
            please use English characters only. Names can’t be changed once you
            have completed your booking.
          </p>
          <form onSubmit={handlePassengerInfo}>
            <div className="flex flex-col gap-4 mt-4 ">
              <div className="w-[100px] ">
                <Select
                  styles={customStyles}
                  options={titles}
                  value={
                    titles.find(
                      (option) =>
                        option.value ===
                        passengerData[index][`pxn_title_${index + 1}`]
                    ) || { label: "Mr.", value: "Mr." } // Default to "Mr."
                  }
                  onChange={(selected) =>
                    updatePassengerData(
                      index,
                      `pxn_title_${index + 1}`,
                      selected.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border-2 border-gray-300 p-3 w-full rounded-[4px] focus:outline-none"
                  value={passenger?.firstName}
                  onChange={(e) =>
                    updatePassengerData(index, "firstName", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border-2 border-gray-300 p-3 w-full rounded-[4px] focus:outline-none"
                  value={passenger.lastName}
                  onChange={(e) =>
                    updatePassengerData(index, "lastName", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full ">
                  <Select
                    styles={customStyles}
                    placeholder={"Select Document"}
                    options={documentTypes}
                    value={documentTypes.find(
                      (option) => option.value === passenger.documentType
                    )}
                    onChange={(selected) =>
                      updatePassengerData(
                        index,
                        "documentType",
                        selected.shortCode
                      )
                    }
                  />
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Document number"
                    className="border-2 border-gray-300 p-3 w-full rounded-[4px] focus:outline-none"
                    value={passenger.docNumber}
                    onChange={(e) =>
                      updatePassengerData(index, "docNumber", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <label htmlFor="">Document Expiry</label>
                  <Datetime
                    inputProps={{
                      className:
                        "border-2 border-gray-300 p-2.5 w-full rounded-[4px] focus:outline-none outline-none focus:outline-none focus:ring-0",
                    }}
                    dateFormat="DD-MM-YYYY"
                    timeFormat={false}
                    initialValue={moment().add(10, "day")}
                    // isValidDate={valid}
                    value={
                      passenger.doc_expire_date
                        ? moment(passenger.doc_expire_date)
                        : ""
                    }
                    onChange={(date) =>
                      updatePassengerData(index, "doc_expire_date", date)
                    }
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="">Nationality</label>

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <label htmlFor="">Date of birth</label>
                  <Datetime
                    inputProps={{
                      className:
                        "border-2 border-gray-300 p-2.5 w-full rounded-[4px] focus:outline-none outline-none focus:outline-none focus:ring-0",
                    }}
                    dateFormat="DD-MM-YYYY"
                    timeFormat={false}
                    initialValue={moment().add(10, "day")}
                    // isValidDate={valid}
                    value={passenger.dob ? moment(passenger.dob) : ""}
                    onChange={(date) => updatePassengerData(index, "dob", date)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end mt-4">
              <button
                type="button"
                onClick={(e) => handlePassengerInfo(e, index)}
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
