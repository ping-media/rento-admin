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

  // return (
  //   <div className="fixed right-2 z-50 top-10 w-72">
  //     <div
  //       className={`relative w-full flex flex-wrap items-center justify-center py-3 pl-4 pr-14 rounded text-base font-medium [transition:all_0.5s_ease] text-gray-100 [&amp;_svg]:text-[#b22b2b] group ${
  //         errorType == "error" ? "bg-red-500" : "bg-green-500"
  //       }`}
  //     >
  //       <button
  //         type="button"
  //         aria-label="close-error"
  //         className="absolute right-4 p-1 rounded-md transition text-white"
  //         onClick={() => dispatch(clearError())}
  //       >
  //         <svg
  //           //   stroke="currentColor"
  //           fill="none"
  //           strokeWidth="1.8"
  //           viewBox="0 0 24 24"
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           height="16"
  //           width="16"
  //           className="sizer [--sz:16px] h-4 w-4 stroke-white"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path d="M18 6 6 18"></path>
  //           <path d="m6 6 12 12"></path>
  //         </svg>
  //       </button>
  //       <p className="flex flex-row items-center mr-auto gap-x-2 capitalize text-wrap">
  //         {errorType == "error" ? (
  //           <svg
  //             //   stroke="currentColor"
  //             fill="none"
  //             strokeWidth="1.8"
  //             viewBox="0 0 24 24"
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             height="28"
  //             width="28"
  //             className="h-7 w-7 stroke-white"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
  //             <path d="M12 9v4"></path>
  //             <path d="M12 17h.01"></path>
  //           </svg>
  //         ) : (
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             width="28"
  //             height="28"
  //             viewBox="0 0 24 24"
  //             fill="none"
  //             className="h-7 w-7 stroke-white"
  //             strokeWidth="1.8"
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //           >
  //             <polyline points="20 6 9 17 4 12"></polyline>
  //           </svg>
  //         )}

  //         {error}
  //       </p>
  //     </div>
  //   </div>
  // );
  return (
    <div className="fixed right-2 z-50 top-16 w-72">
      <div
        id={`toast-${errorType}`}
        className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow"
        role="alert"
      >
        <div
          className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${
            errorType === "error"
              ? "text-red-500 bg-red-100"
              : "text-green-500 bg-green-100"
          } rounded-lg`}
        >
          {errorType === "error" ? (
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
          )}
        </div>
        <div className="ml-3 text-sm font-normal capitalize">{error}</div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
          data-dismiss-target={`#toast-${errorType}`}
          aria-label="Close"
          onClick={() => dispatch(clearError())}
        >
          <span className="sr-only">Close</span>
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Alert;
