import Spinner from "../../components/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { toggleBookingExtendModal } from "../../Redux/SideBarSlice/SideBarSlice";
import Input from "../../components/InputAndDropdown/Input";
import React, { useEffect, useState } from "react";
import {
  addDaysToDate,
  addOneMinute,
  calculatePriceForExtendBooking,
  calculateTax,
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
import ChangeTextToInput from "../../components/InputAndDropdown/ChangeTextToInput";
import PreLoader from "../../components/Skeleton/PreLoader";
import { debounce } from "lodash";
import SelectDropDown from "../../components/InputAndDropdown/SelectDropDown";
import TextArea from "../../components/InputAndDropdown/TextArea";

const ExtendBookingModal = ({ bookingData }) => {
  const { isBookingExtendModalActive } = useSelector((state) => state.sideBar);
  const { token, loggedInRole, currentUser } = useSelector(
    (state) => state.user
  );
  const [plan, setPlan] = useState({ data: null, loading: false });
  const [isPlanApplied, setIsPlanApplied] = useState(false);
  const [extensionDays, setExtensionDays] = useState(0);
  const [addOnPrice, setAddOnPrice] = useState(0);
  const [freeVehicle, setFreeVehicle] = useState(null);
  const [extendPrice, setExtendPrice] = useState(0);
  const [totalExtendPrice, setTotalExtendPrice] = useState(0);
  const [newFreeLimit, setNewFreeLimit] = useState(0);
  const [daysBreakdown, setDaysBreakdown] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState([]);
  const [appliedPlans, setAppliedPlans] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [priceLoading, setPriceLoading] = useState(false);
  const [displayTax, setDisplayTax] = useState({
    tax: 0,
    addonTax: 0,
  });

  const [formLoading, setFormLoading] = useState(false);
  const dispatch = useDispatch();

  const taxStatus =
    (bookingData && bookingData?.stationData?.isGstActive === "inactive"
      ? false
      : true) || false;

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
      } else {
        handleAsyncError(dispatch, isVehicleFree?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, "Unable to get Vehicle Info! try again");
    } finally {
      setPriceLoading(false);
    }
  };

  // new extend booking fn
  const handleExtendBooking = async (event) => {
    event.preventDefault();
    if (!newDate) return;

    const formdata = new FormData(event.target);
    const extensionMode = formdata?.get("extensionMode") || "online";

    const extensionData = {
      key: `${currentUser?.firstName} (${currentUser?.userType})`,
      value: formdata?.get("extensionNote") || "",
      noteType: "general",
      createdAt: Date.now(),
    };

    if (loggedInRole === "admin" && extensionMode === "") {
      return handleAsyncError(dispatch, "please select valid extension mode!");
    }

    const newStartDate = addOneMinute(
      bookingData?.BookingEndDateAndTime
    ).replace(".000Z", "Z");

    const extendAmountList = bookingData?.bookingPrice?.extendAmount || [];
    const extensionId = extendAmountList.length + 1 || 1;

    // calculating the free km limit
    const isPackage = appliedPlans?.length > 0 ? appliedPlans : null;

    const daysBreakdowns = daysBreakdown ?? null;

    const freeKmLimitForPlan =
      isPackage !== null
        ? isPackage.reduce((sum, plan) => {
            return sum + plan.kmLimit * plan.count;
          }, 0)
        : 0;

    const freeKmLimitForDays =
      daysBreakdowns !== null
        ? daysBreakdowns?.length * Number(newFreeLimit !== 0 ? newFreeLimit : 1)
        : 0;

    const freeLimit = freeKmLimitForPlan + freeKmLimitForDays;

    const addonGstPercentage =
      freeVehicle?.stationData?.extraAddOn?.[0]?.gstPercentage || 0;

    const addonTax =
      addonGstPercentage > 0 ? calculateTax(addOnPrice, addonGstPercentage) : 0;

    let data = {
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
        id: extensionId,
        title: "extended",
        extendDuration: Number(extensionDays),
        amount: extendPrice,
        addOnAmount: Number(addOnPrice),
        tax: freeVehicle?.tax || 0,
        addonTax,
        originalBookingEndDateAndTime:
          bookingData?.BookingEndDateAndTime.replace(".000Z", "Z"),
        BookingStartDateAndTime: newStartDate,
        bookingEndDateAndTime: newDate,
        daysBreakdown: daysBreakdown || [],
        package: selectedPlan || [],
        appliedPlans: appliedPlans || [],
        freeLimit,
        orderId: "",
        transactionId: "",
        paymentMethod: "",
        status: "unpaid",
      },
      bookingStatus: "extended",
    };

    try {
      setFormLoading(true);
      data = {
        ...data,
        contact: bookingData?.userId?.contact,
        firstName: bookingData?.userId?.firstName,
        managerContact: bookingData?.stationMasterUserId?.contact,
      };
      const extensionNote = extensionData?.value !== "" ? extensionData : null;

      const order = await postData(
        "/initiate-extend-admin-booking",
        {
          _id: bookingData?._id,
          bookingId: bookingData?.bookingId,
          amount:
            Number(extendPrice) +
            Number(addOnPrice) +
            Number(data?.extendAmount?.tax || 0) +
            Number(data?.extendAmount?.addonTax || 0),
          extensionMode,
          extensionNote,
          data,
        },
        token
      );
      if (order?.success) {
        setExtensionDays(0);
        setNewDate("");
        const timeLineData = order?.timeLine || null;
        if (timeLineData !== null) {
          dispatch(updateTimeLineData(timeLineData));
        }
        if (extensionMode === "cash") {
          const { contact, firstName, managerContact, ...reduxData } = data;
          if (extensionNote !== null) {
            dispatch(
              handleUpdateExtendVehicle({ ...reduxData, notes: extensionNote })
            );
          } else {
            dispatch(handleUpdateExtendVehicle(reduxData));
          }
        }
        handleAsyncError(
          dispatch,
          extensionMode === "cash"
            ? "Ride extended successfully"
            : "Extend Request Placed successfully",
          "success"
        );
        handleCloseModal();
        return;
      } else {
        return handleAsyncError(dispatch, order?.message);
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

  // main pricing calculation (without tax)
  useEffect(() => {
    if (Number(extensionDays) !== 0 && freeVehicle !== null) {
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
        planPrice > 0 ? planPrice : Number(freeVehicle?.totalRentalCost);

      setExtendPrice(price);
      setAddOnPrice(extraAddonPrice);

      setDaysBreakdown(freeVehicle?._daysBreakdown);
      setAppliedPlans(freeVehicle?.appliedPlans);
      setNewFreeLimit(freeVehicle?.freeKms);
      setSelectedPlan(hasPlan);
    } else {
      setExtendPrice(0);
      setAddOnPrice(0);
      setTotalExtendPrice(0);
      setDisplayTax({ tax: 0, addonTax: 0 });
    }
  }, [extensionDays, freeVehicle]);

  // tax update
  useEffect(() => {
    if (!taxStatus) {
      setDisplayTax({ tax: 0, addonTax: 0 });
      setTotalExtendPrice(extendPrice + addOnPrice);
      return;
    }

    let tax = 0;
    let addonTax = 0;

    if (extendPrice > 0) {
      const taxPercentage = freeVehicle?.vehicleMasterData?.gstPercentage || 0;
      tax = calculateTax(extendPrice, taxPercentage);
    }

    if (addOnPrice > 0) {
      const addonGstPercentage =
        freeVehicle?.stationData?.extraAddOn[0]?.gstPercentage || 0;
      addonTax = calculateTax(addOnPrice, addonGstPercentage);
    }

    setDisplayTax({ tax, addonTax });

    const total = extendPrice + addOnPrice + tax + addonTax;
    setTotalExtendPrice(total);
  }, [extendPrice, addOnPrice, taxStatus, freeVehicle]);

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
      <div className="relative top-10 mx-auto shadow-xl rounded-md bg-white max-w-lg">
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
                    ({extensionDays} day's package applied)
                  </p>
                </div>
              )}
              <div className="mb-2 bg-gray-500/30 rounded-md p-2">
                <div className="w-full flex items-center justify-between mb-1">
                  <p>Vehicle Rental Cost:</p>
                  <p>
                    {" "}
                    {priceLoading ? (
                      "--"
                    ) : extendPrice >= 0 && extensionDays > 0 ? (
                      <ChangeTextToInput
                        value={Number(extendPrice)}
                        setValue={(e) => setExtendPrice(Number(e.target.value))}
                        type={"number"}
                      />
                    ) : (
                      "--"
                    )}
                  </p>
                </div>
                {taxStatus && (
                  <div className="w-full flex items-center justify-between mb-1">
                    <p>GST:</p>
                    <p>
                      {" "}
                      {priceLoading ? (
                        "--"
                      ) : displayTax.tax >= 0 && extensionDays > 0 ? (
                        <ChangeTextToInput
                          value={Number(displayTax.tax)}
                          setValue={(e) =>
                            setDisplayTax((prev) => ({
                              ...prev,
                              tax: Number(e.target.value),
                            }))
                          }
                          type={"number"}
                        />
                      ) : (
                        "--"
                      )}
                    </p>
                  </div>
                )}
                <div className="w-full flex items-center justify-between mb-1">
                  <p>Add On Cost:</p>
                  <p>
                    {" "}
                    {priceLoading ? (
                      "--"
                    ) : addOnPrice >= 0 && extensionDays > 0 ? (
                      <ChangeTextToInput
                        value={Number(addOnPrice)}
                        setValue={(e) => setAddOnPrice(Number(e.target.value))}
                        type={"number"}
                      />
                    ) : (
                      "--"
                    )}
                  </p>
                </div>
                {taxStatus && (
                  <div className="w-full flex items-center justify-between mb-1">
                    <p>GST:</p>
                    <p>
                      {" "}
                      {priceLoading ? (
                        "--"
                      ) : displayTax.addonTax >= 0 && extensionDays > 0 ? (
                        <ChangeTextToInput
                          value={Number(displayTax.addonTax)}
                          setValue={(e) =>
                            setDisplayTax((prev) => ({
                              ...prev,
                              addonTax: Number(e.target.value),
                            }))
                          }
                          type={"number"}
                        />
                      ) : (
                        "--"
                      )}
                    </p>
                  </div>
                )}
              </div>

              {loggedInRole === "admin" && (
                <>
                  <div className="text-left w-full mb-2">
                    <TextArea
                      placeholder={"Extension Note"}
                      item={"extensionNote"}
                    />
                  </div>
                  <div className="text-left w-full mb-2">
                    <SelectDropDown
                      item={"extensionMode"}
                      options={["cash", "online"]}
                      value="online"
                      require={true}
                      isSearchEnable={false}
                    />
                  </div>
                </>
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
                <div className="flex items-center text-theme text-left">
                  <p className="font-semibold text-black mr-1">
                    New Payable Amount:
                  </p>
                  {priceLoading ? (
                    <p className="w-20 h-5 bg-gray-300/80 rounded-md animate-pulse"></p>
                  ) : (
                    formatPrice(Number(totalExtendPrice))
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 inline-flex gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-theme/80 w-full flex items-center justify-center"
              disabled={
                isDisabled || extensionDays == 0
                  ? true
                  : false || Number(extendPrice) === 0 || formLoading
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
