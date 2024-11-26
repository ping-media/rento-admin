import { useDispatch } from "react-redux";
import VehicleDetail from "../components/VehicleDetails/VehicleDetail";

const VehicleDetails = () => {
  const dispatch = useDispatch();
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl uppercase font-bold text-theme">
          Vehicle Details
        </h1>
        <button
          className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none"
          // onClick={() => dispatch(toggleEditModal())}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
          </svg>
          <span>Edit</span>
        </button>
      </div>
      <div className="mt-5">
        <VehicleDetail />
      </div>
    </>
  );
};

export default VehicleDetails;
