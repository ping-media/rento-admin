import { tableIcons } from "../../Data/Icons";
import React, { useRef, useState } from "react";
import GenerateInvoiceButton from "./GenerateInvoiceButton";
import { togglePickupImageModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { useDispatch } from "react-redux";
import { addTempVehicleData } from "../../Redux/VehicleSlice/VehicleSlice";

const MoreActionCell = ({ item, loadingStates, setLoadingStates }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState("bottom-full");
  const detailsRef = useRef(null);

  const handleAddImages = () => {
    setIsOpen(false);
    dispatch(addTempVehicleData(item));
    dispatch(togglePickupImageModal());
  };

  const handleOpen = () => {
    if (detailsRef.current) {
      const rect = detailsRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if dropdown fits below, otherwise position it above
      if (rect.bottom + 200 > viewportHeight) {
        setPosition("top-full");
      } else {
        setPosition("bottom-full");
      }
    }

    setIsOpen(true);
  };

  return (
    <details className="relative" ref={detailsRef} open={isOpen}>
      <summary
        className="flex items-center cursor-pointer list-none transition-all duration-500 p-2"
        onClick={handleOpen}
      >
        {tableIcons.threeDots}
      </summary>
      {isOpen && (
        <div
          className={`absolute right-0 ${position} mt-2 w-40 py-1 bg-white border border-gray-200 shadow-lg rounded-lg flex flex-col z-50`}
        >
          <div className="text-left hover:bg-gray-100 w-full">
            <GenerateInvoiceButton
              item={item}
              loadingStates={loadingStates}
              setLoadingStates={setLoadingStates}
            />
          </div>
          <button
            className="px-3 py-1 text-left hover:bg-gray-100 w-full disabled:bg-gray-300 disabled:bg-opacity-50"
            type="button"
            onClick={handleAddImages}
            disabled={item?.bookingPrice?.isPickupImageAdded}
          >
            {item?.bookingPrice?.isPickupImageAdded
              ? "Images Added"
              : "Start Ride"}
          </button>
        </div>
      )}
    </details>
  );
};

export default MoreActionCell;
