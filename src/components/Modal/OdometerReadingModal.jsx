import ChangeVehicleData from "../change-vehicle/ChangeVehicleData";

const OdometerReadingModal = ({ isActive, setIsActive }) => {
  return (
    <div
      className={`fixed ${
        !isActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
      onClick={() => setIsActive(false)}
    >
      <div
        className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b justify-end p-1">
          <h4 className="text-lg font-semibold text-theme">
            Vehicle's Odometer
          </h4>
          <button
            onClick={() => setIsActive(false)}
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

        <div className="p-6 lg:p-4 pt-0 text-center">
          <div className="lg:h-[30rem] overflow-y-scroll px-0">
            <ChangeVehicleData />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OdometerReadingModal;
