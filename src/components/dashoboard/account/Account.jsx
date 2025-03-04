import Image from "next/image";
import React, { useEffect, useState } from "react";
import accountImg from "@/public/images/accountImg.png";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import DatePicker from "react-date-picker";
import moment from "moment";
import { useMutation } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useAirlineStore from "../../../../stores/airlineStore";
import Loading from "@/components/loader/Loading";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Account({
  userData,
  userDataLoading,
  refetchUserData,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAirlineStore();
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const customStyles = {
    valueContainer: (base) => ({
      ...base,
      height: "100%", // Ensure it fills the control height
      display: "flex",
      alignItems: "center",
      padding: "0 5px", // Adds spacing inside the select
    }),
    input: (base) => ({
      ...base,
      height: "100%",
      margin: 0,
      padding: 0, // Ensures no extra padding
      "&:focus": {
        textAlign: "left", // Keep text left-aligned on focus
      },
    }),
    singleValue: (base) => ({
      ...base,
      display: "flex",
      alignItems: "center",
      color: "#333", // Ensures the text color is readable
    }),
    placeholder: (base, state) => ({
      ...base,
      display: "flex",
      alignItems: "center",
      color: "#999",
      display: state.isFocused ? "none" : "flex",
      transition: "opacity 0.2s ease-in-out", // Smooth transition effect
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "8px", // Adjusts the dropdown icon spacing
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "100%", // Ensures consistent height
      alignItems: "center",
    }),
  };

  const [profileInfo, setProfileInfo] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    postal_code: "",
    city: "",
    country: "",
    postal_code: "",
    date_of_birth: "",
    gender: "",
  });

  useEffect(() => {
    if (userData?.data) {
      setProfileInfo({
        ...profileInfo,
        user_id: userData?.data?.id,
        first_name: userData?.data?.first_name,
        last_name: userData?.data?.last_name,
        phone: userData?.data?.phone,
        address: userData?.data?.address,
        postal_code: userData?.data?.postal_code,
        city: userData?.data?.city,
        country: userData?.data?.country,
        date_of_birth: userData?.data?.date_of_birth,
        postal_code: userData?.data?.postal_code,
        gender: userData?.data?.gender,
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    let name, value;

    if (e?.target) {
      // Handling normal input fields
      name = e.target.name;
      value = e.target.value;
    } else {
      // Handling Select and PhoneInput (which pass value directly)
      name = e.name;
      value = e.value;
    }

    setProfileInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const genders = [
    { value: "male", label: "Male", name: "Male" },
    { value: "female", label: "Female", name: "Female" },
    { value: "others", label: "Others", name: "Others" },
  ];

  const formatDateString = (date) => {
    if (!date) return "";

    // Get year, month, and day components and create a date string in YYYY-MM-DD format
    // This avoids timezone issues that can occur with toISOString()
    const year = date?.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const mutation = useMutation({
    mutationFn: (payload) =>
      fetchData("/user/update-profile", "POST", payload, token),
    onSuccess: (data) => {
      setIsLoading(false);
      toast.success(data?.message);
      refetchUserData();
      if (data?.error == 30001) {
        router.push("/login");
      }
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Mutation failed", error);
      toast.error(error?.message);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (payload) =>
      fetchData("/user/change-password", "POST", payload, token),
    onSuccess: (data) => {
      if (data?.success == true) {
        setIsLoading(false);
        toast.success(data?.message);
        setPasswords({
          old_password: "",
          new_password: "",
        });
      }
      refetchUserData();
      if (data?.error == 30001) {
        router.push("/login");
      }
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Mutation failed", error);
      toast.error(error?.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    mutation.mutate(profileInfo);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    passwordMutation.mutate(passwords);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#FF6810] z-50">
        <img
          src={"/ticketing.gif"}
          alt="Loading..."
          className="w-48 md:w-64 h-full object-contain"
        />
      </div>
    );
  }

  return (
    <section>
      <div className=" mx-auto ">
        <h1 className="text-2xl font-bold mb-6">Account</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border rounded-[6px]">
          <div>
            <section className="bg-white rounded-lg  p-6 mb-6 ">
              <h2 className="text-xl font-semibold mb-4">Account</h2>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First name
                  </label>
                  <div className="flex items-center border p-1.5 rounded-md">
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={profileInfo?.first_name}
                      onChange={handleChange}
                      className="flex-grow border-gray-300  focus:outline-none outline-none w-full"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last name
                  </label>
                  <div className="flex items-center border p-1.5 rounded-md">
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={profileInfo?.last_name}
                      onChange={handleChange}
                      className="flex-grow border-gray-300  focus:outline-none outline-none w-full"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <PhoneInput
                    country={"bd"} // Default country
                    value={profileInfo?.phone}
                    onChange={(value) => handleChange({ name: "phone", value })}
                    inputProps={{
                      name: "phone",
                      id: "phone",
                      required: true,
                      className:
                        "pl-10 w-full border rounded-md px-3 py-2 text-sm ",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date of birth
                  </label>
                  <div className="w-full border border-gray-300 rounded-[5px] focus:outline-none">
                    <DatePicker
                      onChange={(date) => {
                        handleChange({
                          // new Date(date).toLocaleDateString()
                          // moment(date).toISOString()

                          name: "date_of_birth",
                          value: formatDateString(date),
                        }); // Update passenger data
                      }}
                      value={
                        profileInfo.date_of_birth
                          ? moment
                              .utc(profileInfo.date_of_birth)
                              .startOf("day")
                              .toDate() // Force UTC date part only
                          : ""
                      }
                      maxDate={new Date()}
                      format="dd-MM-yyyy"
                      className="w-full p-1  focus:outline-none" // Ensure border styles here
                      calendarClassName="rounded-md shadow-lg border-gray-200"
                      clearIcon={null} // Removes the clear icon for a cleaner design
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender
                  </label>
                  <Select
                    styles={customStyles}
                    options={genders}
                    isSearchable={true}
                    isClearable={true}
                    value={genders.find(
                      (option) => option?.label === profileInfo?.gender
                    )}
                    onChange={(selectedOption) =>
                      handleChange({
                        name: "gender",
                        value: selectedOption?.label,
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <div className="flex items-center border p-1.5 rounded-md">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={profileInfo?.city}
                      onChange={handleChange}
                      className="flex-grow border-gray-300  focus:outline-none outline-none w-full"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="postal_code"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Postal code
                  </label>
                  <div className="flex items-center border p-1.5 rounded-md">
                    <input
                      type="text"
                      id="postal_code"
                      name="postal_code"
                      value={profileInfo?.postal_code}
                      onChange={handleChange}
                      className="flex-grow border-gray-300  focus:outline-none outline-none w-full"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country
                  </label>
                  <div className="flex items-center border p-1.5 rounded-md">
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={profileInfo?.country}
                      onChange={handleChange}
                      className="flex-grow border-gray-300  focus:outline-none outline-none w-full"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address
                  </label>
                  <div className="flex items-center border p-1.5 rounded-md">
                    <textarea
                      type="text"
                      id="address"
                      name="address"
                      value={profileInfo?.address}
                      onChange={handleChange}
                      className="flex-grow border-gray-300  focus:outline-none outline-none w-full"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="text-white bg-[#FC660F] text-sm py-1.5 px-3 rounded-sm hover:bg-[#da7b44]"
                >
                  Save
                </button>
              </form>
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
          <h2 className="text-[16px] font-semibold mb-4">Change Password</h2>
          <p className="text-[14px] text-black mb-4">
            Change your old password
          </p>

          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4 relative">
              <label
                htmlFor="old_password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Old Password
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                id="old_password"
                name="old_password"
                onChange={handlePasswordChange}
                required
                className="w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:ring-[#363F45] focus:border-[#363F45] focus:outline-none"
              />
              <button
                type="button"
                onClick={toggleOldPasswordVisibility}
                className="absolute right-3 bottom-0 transform -translate-y-1/2 text-gray-500"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            <div className="mb-4 relative">
              <label
                htmlFor="new_password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                id="new_password"
                name="new_password"
                onChange={handlePasswordChange}
                required
                className="w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:ring-[#363F45] focus:border-[#363F45] focus:outline-none"
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute right-3 bottom-0 transform -translate-y-1/2 text-gray-500"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="bg-[#363F45] text-white px-3 py-2 rounded-[2px] text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Update Password
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}
