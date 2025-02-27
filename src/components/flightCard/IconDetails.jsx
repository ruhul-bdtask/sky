import { useState } from "react";
import { BsFillPlugFill } from "react-icons/bs";
import { IoWifi } from "react-icons/io5";
import { MdOndemandVideo, MdOutlineKeyboardArrowUp } from "react-icons/md";

const IconDetails = ({ schedule }) => {
  const [isExpand, setExpand] = useState(false);
  const handleIconDetailsToggler = () => setExpand(!isExpand);
  return (
    <div className="mt-1 ">
      <div className={`flex p-2 bg-slate-100 rounded-xl`}>
        <div className="flex items-start space-x-1">
          <ul
            className={`${
              !isExpand ? "flex space-x-2" : "block"
            } mt-1 text-xs md:text-sm`}
          >
            {isExpand ? (
              <>
                <li className="flex items-center space-x-2 ">
                  <IoWifi />
                  <span>Wifi Facilities</span>
                </li>
                <li className="flex items-center space-x-2 ">
                  <MdOndemandVideo />
                  <span>TV Facilities</span>
                </li>
                <li className="flex items-center space-x-2 ">
                  <BsFillPlugFill />
                  <span>Mobile Charging Port</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center space-x-2 ">
                  <IoWifi />
                </li>
                <li className="flex items-center space-x-2 ">
                  <MdOndemandVideo />
                </li>
                <li className="flex items-center space-x-2 ">
                  <BsFillPlugFill />
                </li>
              </>
            )}
          </ul>
          <button onClick={() => handleIconDetailsToggler()}>
            <MdOutlineKeyboardArrowUp
              size={20}
              className={`${
                isExpand ? "rotate-0" : "-rotate-180"
              } transition-all`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IconDetails;
