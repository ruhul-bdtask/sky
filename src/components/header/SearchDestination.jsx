import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { ImSpinner6 } from "react-icons/im";

const SearchDestination = ({ onSelectDestination, currentInput }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(currentInput || "");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [noData, setNoData] = useState(false); // No data state
  const inputRef = useRef();

  // Debounce function to optimize filtering
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch Data
  const fetchData = async (query) => {
    if (!query.trim()) {
      setFilteredData([]); // Clear results when query is empty
      setNoData(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true); // Show loading spinner
    try {
      const response = await fetch("/utils/airports.json");
      const data = await response.json();

      // Filter based on search query
      const filtered = data.filter((destination) =>
        destination.label.toLowerCase().includes(query.toLowerCase())
      );

      setData(data);
      setFilteredData(filtered);
      setNoData(filtered.length === 0); // Set no data state
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  const debouncedFetchData = debounce(fetchData, 500);

  // Fetch data when search query changes
  useEffect(() => {
    debouncedFetchData(searchQuery);
  }, [searchQuery]);

  // Autofocus on input when the component is rendered
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <div className="max-w-full mx-auto bg-white shadow-md absolute top-1 w-full z-10">
      <div className="pb-3 ">
        <input
          ref={inputRef}
          type="text"
          className="rounded w-full p-3 focus:outline-none"
          placeholder="Search destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search destination"
        />
        <ul className="max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <ImSpinner6 className="animate-spin" size={20} />
            </div>
          ) : noData ? (
            <p className="text-gray-500 text-center">No destinations found.</p>
          ) : (
            filteredData.map((destination, index) => (
              <li
                key={index}
                className="flex items-center space-x-4 cursor-pointer hover:bg-[#f0f3f5] p-3 border-t"
                onClick={() =>
                  onSelectDestination(destination.label.split(",")[0])
                }
              >
                <Image
                  src={destination.img || "/default-image.png"} // Fallback image
                  alt={destination.label || "Destination"}
                  //   className="w-[60px] h-[60px] object-cover"
                  height={40}
                  width={40}
                />
                <div className="flex-grow">
                  <p className="font-semibold">{destination.label}</p>
                  <p className="text-sm text-gray-500">{destination.name}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchDestination;
