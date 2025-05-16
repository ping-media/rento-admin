import { formatFullDateAndTime } from "../../utils/index";

const ViewModal = ({ isActive, setIsActive, startDate, endDate, reason }) => {
  return (
    <div
      className={`fixed ${
        !isActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
        <div className="flex items-center border-b justify-end p-1">
          <h4 className="text-lg font-semibold text-theme">Maintenance</h4>
          <button
            onClick={() => setIsActive(!isActive)}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-4 pt-1">
          <p className="text-sm mb-1">
            <span className="font-semibold">Start:</span>{" "}
            {formatFullDateAndTime(startDate)}
          </p>
          <p className="text-sm mb-1">
            <span className="font-semibold">End:</span>{" "}
            {formatFullDateAndTime(endDate)}
          </p>
          <p className="w-full h-full overflow-hidden">
            <span className="font-semibold mr-1">Reason:</span>
            {reason}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
