import { tableIcons } from "../../Data/Icons";
import React, { useState } from "react";
import GenerateInvoiceButton from "./GenerateInvoiceButton";
import { togglePickupImageModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { useDispatch } from "react-redux";
import { addTempVehicleData } from "../../Redux/VehicleSlice/VehicleSlice";

const MoreActionCell = ({ item, loadingStates, setLoadingStates }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddImages = () => {
    setIsOpen(false);
    dispatch(addTempVehicleData(item));
    dispatch(togglePickupImageModal());
  };

  return (
    <details className="relative">
      <summary
        className="flex items-center cursor-pointer list-none transition-all duration-500 p-2"
        onClick={() => setIsOpen(true)}
      >
        {tableIcons.threeDots}
      </summary>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 py-1 bg-white border border-gray-200 shadow-lg rounded-lg flex flex-col z-30">
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
              : "Add Images"}
          </button>
        </div>
      )}
    </details>
  );
};

export default MoreActionCell;
