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
  formatPrice,
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
import { debounce } from "lodash";

const ExtendBookingModal = ({ bookingData }) => {
  const { isBookingExtendModalActive } = useSelector((state) => state.sideBar);
  const { general } = useSelector((state) => state.general);
  const { token } = useSelector((state) => state.user);
  const [plan, setPlan] = useState({ data: null, loading: false });
  const [isPlanApplied, setIsPlanApplied] = useState(false);
  const [extensionDays, setExtensionDays] = useState(0);
  const [addOnPrice, setAddOnPrice] = useState(0);
  const [freeVehicle, setFreeVehicle] = useState(null);
  const [extendPrice, setExtendPrice] = useState(0);
  const [daysBreakdown, setDaysBreakdown] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [priceLoading, setPriceLoading] = useState(false);

  const [formLoading, setFormLoading] = useState(false);
  const dispatch = useDispatch();

  const checkFreeVehicle = async () => {
    try {
      setPriceLoading(true);
      const isVehicleFree = await getData(
        `/getAllVehiclesAvailable?_id=${
          bookingData?.vehicleTableId?._id
        }&BookingStartDateAndTime=${addOneMinute(
          bookingData?.BookingEndDateAndTime
        ).replace(".000Z", "Z")}&BookingEndDateAndTime=${newDate}`,
        token
      );
      if (isVehicleFree?.status === 200) {
        setFreeVehicle(
          isVehicleFree?.data?.length > 0 ? isVehicleFree?.data[0] : null
        );
        if (isVehicleFree?.data?.length === 0) {
          handleAsyncError(dispatch, isVehicleFree?.message);
          return;
        }
      }
    } catch (error) {
      handleAsyncError(dispatch, "Unable to get Vehicle Info! try again");
    } finally {
      setPriceLoading(false);
    }
  };

  // extend bookng function
  const handleExtendBooking = async (event) => {
    event.preventDefault();
    if (!newDate) return;

    const newStartDate = addOneMinute(
      bookingData?.BookingEndDateAndTime
    ).replace(".000Z", "Z");

    const extendAmountList = bookingData?.bookingPrice?.extendAmount || [];

    const data = {
      _id: bookingData?._id,
      vehicleTableId: bookingData?.vehicleTableId?._id,
      BookingStartDateAndTime: newStartDate,
      BookingEndDateAndTime: newDate,
      bookingPrice: bookingData?.bookingPrice,
      extendBooking: bookingData?.extendBooking,
      oldBookings: {
        BookingStartDateAndTime: bookingData?.BookingStartDateAndTime,
        BookingEndDateAndTime: bookingData?.BookingEndDateAndTime,
      },
      extendAmount: {
        id: extendAmountList.length + 1 || 1,
        title: "extended",
        extendDuration: extensionDays,
        amount: extendPrice,
        addOnAmount: addOnPrice,
        BookingStartDateAndTime: newStartDate,
        bookingEndDateAndTime: newDate,
        daysBreakdown: daysBreakdown || [],
        package: selectedPlan || [],
        orderId: "",
        transactionId: "",
        paymentMethod: "",
        status: "unpaid",
      },
      bookingStatus: "extended",
    };
    if (!data) return;
    try {
      setFormLoading(true);
      const response = await postData(
        `/extendBooking?BookingStartDateAndTime=${newStartDate}&BookingEndDateAndTime=${newDate}&stationId=${bookingData?.stationId}`,
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
        const { BookingStartDateAndTime, ...rest } = data;
        dispatch(handleUpdateExtendVehicle(rest));
        // updating the timeline for booking
        const timeLineData = await updateTimeLineForPayment(
          data,
          token,
          "Extension Payment Link"
        );
        // for updating timeline redux data
        dispatch(updateTimeLineData(timeLineData));
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

  useEffect(() => {
    if (!bookingData || !newDate) return;

    const debouncedCheck = debounce(() => {
      checkFreeVehicle();
    }, 200);
    debouncedCheck();

    return () => {
      debouncedCheck.cancel();
    };
  }, [bookingData, newDate]);

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
          ? planPrice + extraAddonPrice
          : calculatePriceForExtendBooking(
              freeVehicle?.totalRentalCost,
              extraAddonPrice,
              general?.GST?.status === "inactive" ? false : true || false,
              general?.GST?.percentage || 18
            );

      if (Number(price) > 0) {
        setExtendPrice(price);
        setAddOnPrice(extraAddonPrice);
        setDaysBreakdown(freeVehicle?._daysBreakdown);
        setSelectedPlan(hasPlan);
      }
    } else {
      setExtendPrice(0);
    }
  }, [extensionDays, freeVehicle]);

  // through this we are disabling the extension util previous one is completed
  const isDisabled =
    (!["paid", "partiallyPay", "partially_paid"].includes(
      bookingData?.paymentStatus
    ) &&
      true) ||
    (bookingData?.bookingPrice?.extendAmount &&
      bookingData?.bookingPrice?.extendAmount?.length > 0 &&
      bookingData?.bookingPrice?.extendAmount[
        bookingData?.bookingPrice?.extendAmount?.length - 1
      ]?.status === "unpaid")
      ? true
      : false;

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
        <div className="flex justify-between border-b p-2">
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

        <div className="p-6 pt-2 text-center">
          {isDisabled && (
            <p className="text-left text-xs lg:text-sm text-theme italic mb-2">
              <span className="font-bold mr-1">Note:</span>
              update the pending payment in order to extend the ride.
            </p>
          )}
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
              <div className="mb-2 bg-gray-500/30 rounded-md p-2">
                <div className="w-full flex items-center justify-between mb-1">
                  <p>Vehicle Rental Cost:</p>
                  <p>
                    ₹{" "}
                    {priceLoading
                      ? "--"
                      : extendPrice > 0 && extensionDays > 0
                      ? formatPrice(extendPrice - addOnPrice)
                      : "--"}
                  </p>
                </div>
                <div className="w-full flex items-center justify-between mb-1">
                  <p>Add On Cost:</p>
                  <p>
                    ₹{" "}
                    {priceLoading
                      ? "--"
                      : addOnPrice >= 0 && extensionDays > 0
                      ? formatPrice(addOnPrice)
                      : "--"}
                  </p>
                </div>
              </div>

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
                <div className="flex items-center text-theme text-left">
                  <p className="font-semibold text-black mr-1">New Amount:</p>
                  {priceLoading ? (
                    <p className="w-20 h-5 bg-gray-300/80 rounded-md animate-pulse"></p>
                  ) : (
                    <ChangeTextToInput
                      value={extendPrice}
                      setValue={(e) => setExtendPrice(e.target.value)}
                      type={"number"}
                    />
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-theme/80 w-full flex items-center justify-center"
              disabled={
                isDisabled || extensionDays == 0 ? true : false || formLoading
              }
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
