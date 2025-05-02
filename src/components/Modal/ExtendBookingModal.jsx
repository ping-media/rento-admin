import Spinner from "../../components/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { toggleBookingExtendModal } from "../../Redux/SideBarSlice/SideBarSlice";
import Input from "../../components/InputAndDropdown/Input";
import React, { useEffect, useState } from "react";
import {
  addDaysToDate,
  addOneMinute,
  calculatePriceForExtendBooking,
  calculateTotalAddOnPrice,
  formatFullDateAndTime,
} from "../../utils/index";
import { getData, postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import {
  handleUpdateExtendVehicle,
  updateTimeLineData,
} from "../../Redux/VehicleSlice/VehicleSlice";
import { updateTimeLineForPayment } from "../../Data/Function";
import ChangeTextToInput from "../../components/InputAndDropdown/ChangeTextToInput";
import PreLoader from "../../components/Skeleton/PreLoader";

const ExtendBookingModal = ({ bookingData }) => {
  const { isBookingExtendModalActive } = useSelector((state) => state.sideBar);
  const { token } = useSelector((state) => state.user);
  const [plan, setPlan] = useState({ data: null, loading: false });
  const [isPlanApplied, setIsPlanApplied] = useState(false);
  const [extensionDays, setExtensionDays] = useState(0);
  const [extendPrice, setExtendPrice] = useState(0);
  const [newDate, setNewDate] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const dispatch = useDispatch();

  // extend bookng function
  const handleExtendBooking = async (event) => {
    event.preventDefault();
    if (!newDate) return;

    const finalAmount = calculatePriceForExtendBooking(
      bookingData?.vehicleTableId?.perDayCost,
      extensionDays,
      Number(bookingData?.bookingPrice?.extraAddonPrice)
    );

    const data = {
      _id: bookingData?._id,
      vehicleTableId: bookingData?.vehicleTableId?._id,
      BookingStartDateAndTime: addOneMinute(
        bookingData?.BookingEndDateAndTime
      ).replace(".000Z", "Z"),
      BookingEndDateAndTime: newDate,
      bookingPrice: bookingData?.bookingPrice,
      extendBooking: bookingData?.extendBooking,
      oldBookings: {
        BookingStartDateAndTime: bookingData?.BookingStartDateAndTime,
        BookingEndDateAndTime: bookingData?.BookingEndDateAndTime,
      },
      extendAmount: {
        id: bookingData?.bookingPrice?.extendAmount?.length + 1,
        title: "extended",
        amount: finalAmount,
        paymentMethod: "",
        status: "unpaid",
      },
      bookingStatus: "extended",
    };
    if (!data) return;
    try {
      setFormLoading(true);
      const response = await postData(
        `/extendBooking?BookingStartDateAndTime=${addOneMinute(
          bookingData?.BookingEndDateAndTime
        )}&BookingEndDateAndTime=${newDate}&stationId=${
          bookingData?.stationId
        }`,
        {
          ...data,
          contact: bookingData?.userId?.contact,
          firstName: bookingData?.userId?.firstName,
          managerContact: bookingData?.stationMasterUserId?.contact,
        },
        token
      );
      if (response?.status === 200) {
        setExtensionDays(0);
        setNewDate("");
        dispatch(handleUpdateExtendVehicle(data));
        // updating the timeline for booking
        const timeLineData = await updateTimeLineForPayment(
          data,
          token,
          "Booking Extended"
        );
        // for updating timeline redux data
        dispatch(updateTimeLineData(timeLineData));
        // dispatch(toggleBookingExtendModal());
        handleCloseModal();
        return handleAsyncError(dispatch, response?.message, "success");
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    // (async () => {
    //   try {
    //     setPlan((prev) => ({ ...prev, loading: true }));
    //     const response = await getData("/getPlanData?page=1&limit=50", token);
    //     if (response.status === 200) {
    //       setPlan((prev) => ({ ...prev, data: response?.data }));
    //     }
    //   } finally {
    //     setPlan((prev) => ({ ...prev, loading: false }));
    //   }
    // })();
    if (
      plan?.data === null &&
      bookingData?.vehicleTableId?.vehiclePlan?.length
    ) {
      setPlan((prev) => ({
        ...prev,
        data: bookingData?.vehicleTableId?.vehiclePlan,
      }));
    }
  }, [bookingData]);

  // after closing the modal clear all the state to default
  const handleCloseModal = () => {
    setExtensionDays(0);
    setNewDate("");
    dispatch(toggleBookingExtendModal());
  };

  // for showing extend vehicle price on based on days
  useEffect(() => {
    if (Number(extensionDays) !== 0) {
      const hasPlan =
        plan?.data?.length > 0
          ? plan?.data?.filter(
              (plan) => Number(plan?.planDuration) === Number(extensionDays)
            )
          : [];
      const planPrice = hasPlan?.length > 0 ? Number(hasPlan[0]?.planPrice) : 0;
      const extraAddonPrice =
        bookingData?.bookingPrice?.extraAddonDetails &&
        bookingData?.bookingPrice?.extraAddonDetails?.length > 0
          ? calculateTotalAddOnPrice(
              bookingData?.bookingPrice?.extraAddonDetails,
              extensionDays
            )
          : 0;
      if (planPrice > 0) {
        setIsPlanApplied(true);
      } else {
        setIsPlanApplied(false);
      }
      const price =
        planPrice > 0
          ? planPrice
          : calculatePriceForExtendBooking(
              rides[0]?.vehicleTableId?.perDayCost,
              extensionDays,
              extraAddonPrice
            );

      if (Number(price) > 0) {
        setExtendPrice(price);
      }
    } else {
      setExtendPrice(0);
    }
  }, [extensionDays]);

  if (plan?.loading) {
    return <PreLoader />;
  }

  return (
    <div
      className={`fixed ${
        !isBookingExtendModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-lg">
        <div className="flex justify-between p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Extend Booking
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
          <form onSubmit={handleExtendBooking}>
            <div className="mb-2">
              <p className="text-gray-400 text-left">
                <span className="font-semibold text-black mr-1">
                  Current End Date:
                </span>
                {formatFullDateAndTime(
                  addOneMinute(bookingData?.BookingEndDateAndTime)
                )}
              </p>
            </div>
            <div className="mb-2">
              <Input
                item={"extension day's"}
                type="number"
                setValueChange={setExtensionDays}
                onChangeFun={addDaysToDate}
                dateToBeAdd={addOneMinute(bookingData?.BookingEndDateAndTime)}
                setDateChange={setNewDate}
                isModalClose={isBookingExtendModalActive}
              />
            </div>
            <div>
              {isPlanApplied && (
                <div className="mb-2">
                  <p
                    className={`text-gray-400 text-left text-sm font-semibold italic`}
                  >
                    (Plan Applied)
                  </p>
                </div>
              )}
              <div className="mb-2">
                <p
                  className={`text-gray-400 text-left ${
                    newDate === "" ? "italic" : ""
                  }`}
                >
                  <span className="font-semibold text-black not-italic mr-1">
                    New End Date:
                  </span>
                  {newDate !== ""
                    ? formatFullDateAndTime(newDate)
                    : "(Enter number of days to view the new date)"}
                </p>
              </div>
              <div className={`mb-2`}>
                <p className="text-theme text-left flex items-center">
                  <span className="font-semibold text-black mr-1">
                    New Amount:
                  </span>

                  <ChangeTextToInput
                    value={extendPrice}
                    setValue={(e) => setExtendPrice(e.target.value)}
                    type={"number"}
                  />
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400"
              disabled={formLoading}
            >
              {!formLoading ? (
                "Extend Booking"
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

export default ExtendBookingModal;
