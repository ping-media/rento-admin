import Spinner from "../../components/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { togglePaymentUpdateModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { useEffect, useState } from "react";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { cancelBookingById } from "../../Data/Function";
import { postData } from "../../Data/index";
import {
  handleUpdateDateForPayment,
  updateTimeLineData,
} from "../../Redux/VehicleSlice/VehicleSlice";
import SelectDropDown from "../../components/InputAndDropdown/SelectDropDown";

const UpdateBookingPayment = ({ id }) => {
  const { isPaymentUpdateModalActive } = useSelector((state) => state.sideBar);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { token } = useSelector((state) => state.user);
  const [formLoading, setFormLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentRecord, setPaymentRecord] = useState([]);
  const [paymentFor, setPaymentFor] = useState("");
  const [paymentRecordId, setPaymentRecordId] = useState(0);
  const dispatch = useDispatch();

  // for getting id for payment record
  const getPaymentAmount = (paymentForInput) => {
    if (paymentForInput === "extendVehicle") {
      if (
        vehicleMaster[0]?.bookingPrice?.extendAmount &&
        vehicleMaster[0]?.bookingPrice?.extendAmount?.length > 0
      ) {
        const paymentRecord = [];
        vehicleMaster[0]?.bookingPrice?.extendAmount?.map((item) => {
          paymentRecord.push({
            id: item?.id,
            title: item?.title,
            amount: item?.amount,
            status: item?.status || "unpaid",
          });
        });
        setPaymentRecord(paymentRecord);
      } else {
        handleAsyncError(dispatch, "No extend vehicle records found!");
      }
    } else if (paymentForInput === "vehicleChange") {
      if (
        vehicleMaster[0]?.bookingPrice?.diffAmount &&
        vehicleMaster[0]?.bookingPrice?.diffAmount?.length > 0
      ) {
        const paymentRecord = [];
        vehicleMaster[0]?.bookingPrice?.diffAmount?.map((item) => {
          paymentRecord.push({
            id: item?.id,
            title: item?.title,
            amount: item?.amount,
            status: item?.status || "unpaid",
          });
        });
        setPaymentRecord(paymentRecord);
      } else {
        handleAsyncError(dispatch, "No change vehicle records found!");
      }
    }
  };

  // for setting payment records dropdown
  useEffect(() => {
    if (paymentFor === "") return;
    // reset before change to next value
    setPaymentRecord([]);
    getPaymentAmount(paymentFor);
  }, [paymentFor]);

  // for updating the payment for specific booking
  const handlUpdateBookingPaymentRecord = async (event) => {
    event.preventDefault();
    setFormLoading(true);
    try {
      if (paymentFor === "" && paymentRecordId === 0 && paymentMode === "")
        return handleAsyncError(dispatch, "All fields required!");

      // through this we can dynamically change the data in extendAmount or in diffAmount
      const For =
        paymentFor === "extendVehicle" ? "extendAmount" : "diffAmount";
      const updateData = paymentRecord.find(
        (item) => item.id === Number(paymentRecordId)
      );
      if (updateData) {
        updateData.status = "paid";
        if (!updateData.hasOwnProperty("paymentMethod")) {
          updateData.paymentMethod = paymentMode;
        } else {
          updateData.paymentMethod = paymentMode;
        }
      }
      // creating data for updating the database
      const data = {
        bookingPrice: {
          ...vehicleMaster[0].bookingPrice,
          [For]: vehicleMaster[0]?.bookingPrice?.[For]?.map((item) =>
            item.id === updateData.id ? updateData : item
          ) || [updateData],
        },
        _id: id,
      };

      // return console.log(updateData, data);

      const isUpdate = await cancelBookingById(id, data, token);
      if (isUpdate === true) {
        handleAsyncError(
          dispatch,
          "Payment record save successfully",
          "success"
        );
        // updating the timeline for booking
        const timeLineData = {
          currentBooking_id: id,
          timeLine: [
            {
              title: "Payment Updated",
              date: new Date().toLocaleString(),
              paymentAmount: updateData?.amount,
            },
          ],
        };
        postData("/createTimeline", timeLineData, token);
        handleCloseModal();
        // for updating timeline redux data
        dispatch(updateTimeLineData(timeLineData));
        const { _id, ...dataForRedux } = data;
        return dispatch(handleUpdateDateForPayment(dataForRedux));
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
    // reseting to default values
    setPaymentMode("");
    setPaymentRecord([]);
    setPaymentFor("");
    setPaymentRecordId(0);
    dispatch(togglePaymentUpdateModal());
  };

  return (
    <div
      className={`fixed ${
        !isPaymentUpdateModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-md">
        <div className="flex justify-between p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Update Payment Record
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
            <div className="text-left mb-2">
              <SelectDropDown
                item={"Payment Record"}
                options={["extendVehicle", "vehicleChange"]}
                setIsLocationSelected={setPaymentFor}
                require={true}
              />
            </div>
            {/* {paymentFor !== "CashPayment" && ( */}
            <div className="text-left mb-2">
              <SelectDropDown
                item={"Payment Record Id"}
                options={paymentRecord?.filter(
                  (record) => record?.status !== "paid"
                )}
                setIsLocationSelected={setPaymentRecordId}
                // require={paymentFor !== "CashPayment" ? true : false}
                require={true}
              />
            </div>
            {/* )} */}
            <div className="text-left mb-2">
              <SelectDropDown
                item={"PaymentMode"}
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
