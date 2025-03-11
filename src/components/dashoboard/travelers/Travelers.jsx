import { formatLongDate } from "@/lib/formatLongDate";
import { formatShortDate } from "@/lib/formatShortDate";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, CalendarIcon, User, FileText, Globe } from "lucide-react";
import { format } from "date-fns";
import DatePicker from "react-date-picker";
const countryOptions = require("../../../../public/utils/countries.json");
import Select from "react-select";
import moment from "moment";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAirlineStore from "../../../../stores/airlineStore";
import Loading from "@/components/loader/Loading";
import { fetchData } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function Travelers({
  userData,
  userDataLoading,
  refetchUserData,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAirlineStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    pxn_title: "",
    first_name: "",
    last_name: "",
    dob: null,
    document_expiration_date: null,
    document_issuing_country: "",
    document_nationality_country: "",
    document_number: "",
    document_type: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(formData);
  //   setIsOpen(false);
  //   // Here you would typically send the data to your API
  // };

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

  const documentTypes = [
    { value: "passport", label: "Passport", shortCode: "p" },
    { value: "nid", label: "NID", shortCode: "n" },
  ];

  const titles = [
    { value: "Mr", label: "Mr", shortCode: "Mr" },
    { value: "Mrs", label: "Mrs", shortCode: "Mrs" },
    { value: "Miss", label: "Miss", shortCode: "Miss" },
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
      fetchData("/gds/client-user-media", "POST", payload, token),
    onSuccess: (data) => {
      if (data?.success == true) {
        setIsLoading(false);
        toast.success(data?.message);
        refetchUserData();
        setIsOpen(false);
        setFormData({
          pxn_title: "",
          first_name: "",
          last_name: "",
          dob: null,
          document_expiration_date: null,
          document_issuing_country: "",
          document_nationality_country: "",
          document_number: "",
          document_type: "",
        });
      } else if (data?.error == 30001) {
        router.push("/login");
      } else {
        setIsLoading(false);
        toast.error(data?.message);
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

    if (
      !formData?.pxn_title ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.dob ||
      !formData.document_expiration_date ||
      !formData.document_issuing_country ||
      !formData.document_nationality_country ||
      !formData.document_number ||
      !formData.document_type
    ) {
      toast.error("All fields are required !");
      return;
    }

    // If no errors, proceed with the mutation
    mutation.mutate(formData);
  };

  return (
    <section>
      <Loading loading={isLoading} />
      <div className="flex justify-between items-center flex-wrap gap-5">
        <h2 className="text-[24px] font-bold text-black mb-5">Travelers</h2>
        <button
          onClick={() => setIsOpen(true)}
          className={` text-white bg-[#FC660F] text-sm py-1.5 px-3  hover:bg-[#da7b44]  rounded-md`}
        >
          Add Traveler Data
        </button>
      </div>

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
                  {userData?.data?.email}
                </span>
              </div>
            </div>

            {userData?.data?.media?.map((traveler, index) => (
              <div key={index}>
                <div className="flex items-center flex-wrap">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-10">
                      <div>
                        <label className="block text-[14px] text-black mb-1 font-[500]">
                          First name
                        </label>
                        <div className="text-sm text-black">
                          {" "}
                          {traveler.first_name}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[14px] text-black mb-1 font-[500]">
                          Last name
                        </label>
                        <div className="text-sm text-black">
                          {traveler.last_name}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[14px] text-black mb-1 font-[500]">
                          Date of birth
                        </label>
                        <div className="text-sm text-black">
                          {formatLongDate(traveler?.dob)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-[14px] text-black mb-1 font-[500]">
                          Passenger type
                        </label>
                        <div className="text-sm text-black">
                          {traveler?.pxn_type ? traveler?.pxn_type : "-"}
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-[14px] text-black mb-1 font-[500]">
                          Nationality
                        </label>
                        <div className="text-sm text-black">
                          {traveler?.document_nationality_country
                            ? traveler?.document_nationality_country
                            : "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[14px] text-black mb-1 font-[500]">
                          Document type
                        </label>
                        <div className="text-sm text-black">
                          {traveler?.document_type == "p" ? "Passport" : "NID"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-[14px] text-black mb-1 font-[500]">
                          Document Number
                        </label>
                        <div className="text-sm text-black">
                          {traveler?.document_number
                            ? traveler?.document_number
                            : "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[14px] text-black mb-1 font-[500]">
                          Document Expiration date
                        </label>
                        <div className="text-sm text-black">
                          {traveler?.document_expiration_date
                            ? formatLongDate(traveler?.document_expiration_date)
                            : "-"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[14px] text-black mb-1 font-[500]">
                          Document Issuing Country
                        </label>
                        <div className="text-sm text-black">
                          {traveler?.document_issuing_country
                            ? traveler?.document_issuing_country
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="text-right">
                    <button className="text-sm text-[#007799] hover:text-[#297f97] focus:outline-none font-[500]">
                      Edit traveler
                    </button>
                  </div> */}
                </div>
                {index < userData?.data?.media.length - 1 && (
                  <div className="my-8 border-t border-dashed border-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10">
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
        </div> */}

        <div>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="relative w-full max-w-3xl max-h-[90vh] overflow-auto rounded-lg bg-white shadow-lg py-10">
                {/* Modal Header */}
                {/* <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
                  <h2 className="text-xl font-semibold">
                    Add Traveler Information
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div> */}

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-4 md:p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>

                      <Select
                        styles={customStyles}
                        // placeholder={"Select country"}
                        options={titles}
                        isSearchable={true} // Enable search functionality
                        isClearable={true} // Enable clear button
                        value={titles.find(
                          (option) => option?.value == formData?.pxn_title
                        )}
                        onChange={(value) =>
                          handleChange("pxn_title", value?.value)
                        }
                      />
                    </div>

                    {/* Client User ID */}

                    {/* First Name */}
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          id="first_name"
                          className="pl-10"
                          value={formData.first_name}
                          onChange={(e) =>
                            handleChange("first_name", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          id="last_name"
                          className="pl-10"
                          value={formData.last_name}
                          onChange={(e) =>
                            handleChange("last_name", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <div
                        className="w-full border border-gray-300 rounded-[5px] focus:outline-none" // Ensure border styles here
                      >
                        <DatePicker
                          onChange={(date) => {
                            handleChange(
                              "dob",
                              // new Date(date).toLocaleDateString()
                              // moment(date).toISOString()
                              formatDateString(date)
                            ); // Update passenger data
                          }}
                          value={
                            formData.dob
                              ? moment.utc(formData.dob).startOf("day").toDate() // Force UTC date part only
                              : ""
                          }
                          maxDate={new Date()}
                          format="dd-MM-yyyy"
                          className="w-full p-0.5  focus:outline-none" // Ensure border styles here
                          calendarClassName="rounded-md shadow-lg border-gray-200"
                          clearIcon={null} // Removes the clear icon for a cleaner design
                        />
                      </div>
                    </div>

                    {/* Document Expiration Date */}
                    <div className="space-y-2">
                      <Label htmlFor="document_expiration_date">
                        Document Expiration Date
                      </Label>
                      <div
                        className="w-full border border-gray-300 rounded-[5px] focus:outline-none" // Ensure border styles here
                      >
                        <DatePicker
                          onChange={(date) => {
                            handleChange(
                              "document_expiration_date",
                              // new Date(date).toLocaleDateString()
                              // moment(date).toISOString()
                              formatDateString(date)
                            ); // Update passenger data
                          }}
                          value={
                            formData.document_expiration_date
                              ? moment
                                  .utc(formData.document_expiration_date)
                                  .startOf("day")
                                  .toDate() // Force UTC date part only
                              : ""
                          }
                          minDate={new Date()} // Prevent selecting past dates
                          format="dd-MM-yyyy"
                          className="w-full p-0.5  focus:outline-none" // Ensure border styles here
                          calendarClassName="rounded-md shadow-lg border-gray-200"
                          clearIcon={null} // Removes the clear icon for a cleaner design
                        />
                      </div>
                    </div>

                    {/* Document Type */}
                    <div className="space-y-2">
                      <Label htmlFor="document_type">Document Type</Label>
                      {/* <Select
                        value={formData.document_type}
                        onValueChange={(value) =>
                          handleChange("document_type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select> */}
                      <Select
                        styles={customStyles}
                        // placeholder={"Select country"}
                        options={documentTypes}
                        value={documentTypes.find(
                          (option) => option?.label == formData?.document_type
                        )}
                        isSearchable={true} // Enable search functionality
                        isClearable={true} // Enable clear button
                        onChange={(selected) =>
                          handleChange("document_type", selected?.label)
                        }
                      />
                    </div>

                    {/* Document Number */}
                    <div className="space-y-2">
                      <Label htmlFor="document_number">Document Number</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          id="document_number"
                          className="pl-10"
                          value={formData.document_number}
                          onChange={(e) =>
                            handleChange("document_number", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Document Issuing Country */}
                    <div className="space-y-2">
                      <Label htmlFor="document_issuing_country">
                        Document Issuing Country
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                        <Select
                          styles={customStyles}
                          options={countryOptions}
                          isSearchable={true} // Enable search functionality
                          isClearable={true} // Enable clear button
                          value={countryOptions.find(
                            (option) =>
                              option?.value ==
                              formData?.document_issuing_country
                          )}
                          onChange={(value) =>
                            handleChange(
                              "document_issuing_country",
                              value?.value
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Document Nationality Country */}
                    <div className="space-y-2">
                      <Label htmlFor="document_nationality_country">
                        Document Nationality Country
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                        <Select
                          styles={customStyles}
                          // placeholder={"Select country"}
                          options={countryOptions}
                          isSearchable={true} // Enable search functionality
                          isClearable={true} // Enable clear button
                          value={countryOptions.find(
                            (option) =>
                              option?.value ==
                              formData?.document_nationality_country
                          )}
                          onChange={(value) =>
                            handleChange(
                              "document_nationality_country",
                              value?.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <button
                      type="submit"
                      className="text-white bg-[#FC660F] text-sm py-1.5 px-3  hover:bg-[#da7b44]  rounded-md"
                    >
                      {" "}
                      Save Traveler Data
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
