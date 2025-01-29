import Spinner from "../../components/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { togglePaymentUpdateModal } from "../../Redux/SideBarSlice/SideBarSlice";
import Input from "../../components/InputAndDropdown/Input";
import { useState } from "react";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { cancelBookingById } from "../../Data/Function";
import { postData } from "../../Data/index";
import {
  handleUpdateDateForPayment,
  handleUpdateFlags,
  updateTimeLineData,
} from "../../Redux/VehicleSlice/VehicleSlice";
import SelectDropDown from "../../components/InputAndDropdown/SelectDropDown";

const UpdateBookingPayment = ({ id }) => {
  const { isPaymentUpdateModalActive } = useSelector((state) => state.sideBar);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { token } = useSelector((state) => state.user);
  const [formLoading, setFormLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("");
  const dispatch = useDispatch();

  // for updating the payment for specific booking
  const handlUpdateBookingPaymentRecord = async (event) => {
    event.preventDefault();
    setFormLoading(true);
    try {
      if (finalAmount === 0 && paymentMode === "")
        return handleAsyncError(dispatch, "All fields required!");
      const paymentStatus =
        vehicleMaster[0]?.paymentStatus === "partiallyPay" ||
        vehicleMaster[0]?.paymentStatus === "partially_paid"
          ? "paid"
          : vehicleMaster[0]?.paymentStatus;

      //   dynamically create a key
      const paymentKey =
        vehicleMaster[0]?.paymentStatus === "partiallyPay" ||
        vehicleMaster[0]?.paymentStatus === "partially_paid"
          ? "paymentDone"
          : vehicleMaster[0]?.bookingPrice?.diffAmount &&
            vehicleMaster[0]?.bookingPrice?.diffAmount > 0
          ? "vehicleChange"
          : "extentend";

      const data = {
        paymentUpdates: {
          [paymentKey]: { amount: finalAmount, paymentMode: paymentMode },
        },
        paymentStatus: paymentStatus,
        _id: id,
      };

      const isCanceled = await cancelBookingById(id, data, token);
      if (isCanceled === true) {
        handleAsyncError(
          dispatch,
          "Payment record save successfully",
          "success"
        );
        // updating the timeline for booking
        const timeLineData = {
          currentBooking_id: id,
          timeLine: {
            "Payment Updated": new Date().toLocaleString(),
          },
        };
        postData("/createTimeline", timeLineData, token);
        handleCloseModal();
        // for updating timeline redux data
        dispatch(updateTimeLineData(timeLineData));
        return dispatch(handleUpdateDateForPayment(data));
      }
      if (isCanceled !== true) return handleAsyncError(dispatch, isCanceled);
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setFormLoading(false);
    }
  };

  // after closing the modal clear all the state to default
  const handleCloseModal = () => {
    dispatch(togglePaymentUpdateModal());
  };

  return (
    <div
      className={`fixed ${
        !isPaymentUpdateModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
        <div className="flex justify-between p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Update Payment
          </h2>
          <button
            onClick={handleCloseModal}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={formLoading || false}
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

        <div className="p-6 pt-0 text-center">
          <form onSubmit={handlUpdateBookingPaymentRecord}>
            <div className="mb-2">
              <Input
                item={"finalAmount"}
                type="number"
                require={true}
                setValueChange={setFinalAmount}
              />
            </div>
            <div className="mb-2">
              <SelectDropDown
                item={"finalAmount"}
                options={["online", "cash"]}
                setIsLocationSelected={setPaymentMode}
                require={true}
              />
            </div>
            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400"
              disabled={formLoading}
            >
              {!formLoading ? (
                "Update Payment"
              ) : (
                <Spinner message={"loading..."} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBookingPayment;
