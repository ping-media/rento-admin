import { useDispatch } from "react-redux";
import { clearError } from "../../Redux/ErrorSlice/ErrorSlice";
import { useEffect } from "react";

const Alert = ({ error, errorType = "error" }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(clearError());
    }, 2000);
  }, []);

  return (
    <div className="absolute right-2 z-10 top-10 w-72">
      <div
        className={`relative w-full flex flex-wrap items-center justify-center py-3 pl-4 pr-14 rounded-lg text-base font-medium [transition:all_0.5s_ease] text-gray-100 [&amp;_svg]:text-[#b22b2b] group ${
          errorType == "error" ? "bg-red-500" : "bg-green-500"
        }`}
      >
        <button
          type="button"
          aria-label="close-error"
          className="absolute right-4 p-1 rounded-md transition text-white"
          onClick={() => dispatch(clearError())}
        >
          <svg
            //   stroke="currentColor"
            fill="none"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="16"
            width="16"
            className="sizer [--sz:16px] h-4 w-4 stroke-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
        <p className="flex flex-row items-center mr-auto gap-x-2 capitalize text-wrap">
          {errorType == "error" ? (
            <svg
              //   stroke="currentColor"
              fill="none"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="28"
              width="28"
              className="h-7 w-7 stroke-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7 stroke-white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}

          {error}
        </p>
      </div>
    </div>
  );
};

export default Alert;
