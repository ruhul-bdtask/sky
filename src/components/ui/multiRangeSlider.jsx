import { Range, getTrackBackground } from "react-range";
const MultiRangeSlider = ({ min, max, step, values, onChange }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="w-full h-[2px] relative"
            style={{
              background: getTrackBackground({
                values,
                colors: ["#ccc", "#3b82f6", "#ccc"],
                min,
                max,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            className="w-6 h-6 rounded-full bg-white border border-blue-500 focus:outline-none shadow-md flex items-center justify-center"
          >
            {/* <span className="text-xs text-white">{values[index]}</span> */}
          </div>
        )}
      />
      <div className="flex justify-between w-full mt-2 text-sm text-gray-600">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
