import { useState } from "react";

const DropDownComponent = ({ defaultValue, options, setValue }) => {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  const handleChangeData = (value) => {
    setIsOptionsVisible(!isOptionsVisible);
    setValue(value);
  };
  return (
    <>
      <div className="relative inline-block text-left">
        <div className="group">
          <button
            type="button"
            className="inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 rounded-md"
            onClick={() => setIsOptionsVisible(!isOptionsVisible)}
          >
            {defaultValue}
            <svg
              className="w-4 h-4 ml-2 -mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 12l-5-5h10l-5 5z" />
            </svg>
          </button>
          <div
            className={`absolute left-0 -top-48 mt-1 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg opacity-0 z-50 ${
              isOptionsVisible ? "visible opacity-100" : "hidden"
            } transition duration-300`}
          >
            <div className="py-1">
              {options.map((records, index) => (
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-[4.2rem]"
                  key={index}
                  onClick={() => handleChangeData(records)}
                >
                  {records}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DropDownComponent;
