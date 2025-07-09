import { useDispatch, useSelector } from "react-redux";
import { toggleAddonModal } from "../../Redux/SideBarSlice/SideBarSlice";
import Spinner from "../Spinner/Spinner";
import { useState } from "react";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { formatPrice } from "../../utils/index";

const AddonModal = () => {
  const dispatch = useDispatch();
  const { isAddonModalActive } = useSelector((state) => state.sideBar);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { extraAddOn } = useSelector((state) => state.general);
  const { token } = useSelector((state) => state.user);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  //   updating the booking or Reschedule the booking
  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.target);
    const result = Object.fromEntries(formData.entries());
    const bookingId = vehicleMaster[0]?._id;

    try {
      if (!bookingId) {
        handleAsyncError(dispatch, "Unable to update booking! try again.");
        return;
      }

      //   console.log(selectedAddOns);

      //   const response = await postData(
      //     "/reschedule-booking",
      //     {
      //       _id: bookingId,
      //       BookingStartDateAndTime: dbBookingStartDateAndTime,
      //       BookingEndDateAndTime: dbBookingEndDateAndTime,
      //     },
      //     token
      //   );
      //   if (response?.success) {
      //     let data = null;
      //     if (response?.isStartUpdate) {
      //       data = {
      //         ...data,
      //         BookingStartDateAndTime: dbBookingStartDateAndTime,
      //       };
      //     }
      //     if (response?.isEndUpdate) {
      //       data = { ...data, BookingEndDateAndTime: dbBookingEndDateAndTime };
      //     }
      //     handleAsyncError(dispatch, "Reschedule Successfully", "success");
      //     dispatch(updateBookingDates(data));
      //     dispatch(toggleRescheduleModal());
      //   }
    } catch (error) {
      console.warn("Error while updating booking", error?.message);
      handleAsyncError(dispatch, "Unable to reschedule booking! try again");
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddonToggle = (checked, item) => {
    if (checked) {
      setSelectedAddOns((prev) => [...prev, item]);
    } else {
      setSelectedAddOns((prev) => prev.filter((i) => i._id !== item._id));
    }
  };

  return (
    <div
      className={`fixed ${
        !isAddonModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-md">
        <div className="flex justify-between border-b p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Add Add-On
          </h2>
          <button
            onClick={() => dispatch(toggleAddonModal())}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={formLoading}
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

        <div className="p-6 pt-2">
          <form onSubmit={handleUpdateBooking}>
            <div className="w-full mb-2">
              <h2 className="font-semibold text-md">Extra Add-On</h2>
              {extraAddOn?.data?.length > 0 &&
                extraAddOn?.data
                  ?.filter((addon) => addon?.status !== "inactive")
                  ?.map((item, index) => {
                    const isChecked = selectedAddOns.some(
                      (i) => i._id === item._id
                    );
                    return (
                      <div
                        className="flex items-center gap-1 mb-1 lg:mb-2"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          id={item?.name}
                          className="w-4 h-4 accent-red-600"
                          checked={isChecked}
                          onChange={(e) =>
                            handleAddonToggle(e.target.checked, item)
                          }
                        />
                        <label
                          htmlFor={item?.name}
                          className="text-sm cursor-pointer capitalize"
                        >
                          {item?.name}
                          <span className="text-gray-500 italic">
                            (₹{formatPrice(item?.amount)}/day)
                          </span>
                        </label>
                      </div>
                    );
                  })}
            </div>
            <button
              type="submit"
              className="bg-theme px-4 py-2 mt-3 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400 w-full flex items-center justify-center outline-none"
              disabled={formLoading}
            >
              {!formLoading ? "Add Add-On" : <Spinner message={"loading..."} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddonModal;
