import { postData } from "../Data";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { togglePickupImageModal } from "../Redux/SideBarSlice/SideBarSlice";
import {
  handleInvoiceCreated,
  updateTimeLineData,
} from "../Redux/VehicleSlice/VehicleSlice";
import { isValidIndianMobile } from "../utils";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";

// const isDev = import.meta.env.VITE_ENV === "development";

const useRideStart = ({ isBookingIdPresent, onVehicleChange }) => {
  const { token, loggedInRole } = useSelector((state) => state.user);
  const { tempVehicleData, vehicleMaster } = useSelector(
    (state) => state.vehicles,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [imagesUrl, setImageUrl] = useState({
    vehicleFront: "",
    vehicleLeft: "",
    vehicleRight: "",
    vehicleBack: "",
    odoMeterReading: "",
    others: "",
  });
  const [image, setImage] = useState({
    vehicleFront: null,
    vehicleLeft: null,
    vehicleRight: null,
    vehicleBack: null,
    odoMeterReading: null,
    others: null,
  });
  const [loading, setLoading] = useState(false);
  const [isKycApproved, setIsKycApproved] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [formValues, setFormValues] = useState({
    startMeterReading: "",
    EndMeterReading: "",
    rideOtp: "",
    altContact: "",
    address: "",
  });
  const [cachedVehicles, setCachedVehicles] = useState(null);

  const handleFormValueChange = (field) => (e) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const currentUser = vehicleMaster?.[0]?.userId ?? null;

  const diffData = useMemo(() => {
    const list = vehicleMaster?.[0]?.bookingPrice?.diffAmount || [];
    return list.length > 0 ? list[list.length - 1] : null;
  }, [vehicleMaster]);

  const isChange =
    (diffData !== null && diffData?.rideStatus === false ? true : false) ||
    false;

  const userId = (vehicleMaster && vehicleMaster[0]?.userId?._id) || "";
  const bookingId = (vehicleMaster && vehicleMaster[0]?.bookingId) || "";
  const docId = (vehicleMaster && vehicleMaster[0]?._id) || "";

  // new image compress per image
  const handleUploadPickupImages = async (event) => {
    event.preventDefault();
    setLoading(true);

    // if (!isDev) {
    //   const isAnyImageMissing = Object.values(imagesUrl).some(
    //     (value) => value === "",
    //   );

    //   if (isAnyImageMissing) {
    //     setLoading(false);
    //     return handleAsyncError(dispatch, "All Images Required!.");
    //   }
    // }

    if (!tempVehicleData) {
      setLoading(false);
      return handleAsyncError(dispatch, "All fields required.");
    }

    if (userId === "" || bookingId === "" || docId === "") {
      setLoading(false);
      return handleAsyncError(dispatch, "Required fields missing! try again");
    }

    try {
      const rawFormData = new FormData(event.target);
      const altContact = rawFormData.get("altContact");
      const finalFormData = new FormData();

      const savedAltContact = currentUser?.altContact;

      const hasValidSavedAltContact =
        savedAltContact && isValidIndianMobile(savedAltContact);

      const hasValidNewAltContact =
        altContact && isValidIndianMobile(altContact);

      if (loggedInRole !== "admin") {
        // If no valid saved alt contact exists
        if (!hasValidSavedAltContact) {
          // Then new altContact becomes mandatory
          if (!altContact) {
            setLoading(false);
            return handleAsyncError(
              dispatch,
              "Alternate contact number is required.",
            );
          }

          if (!hasValidNewAltContact) {
            setLoading(false);
            return handleAsyncError(
              dispatch,
              "Alternate contact number must be a valid 10-digit mobile number.",
            );
          }
        }
      }

      // return;

      // Copy all non-file fields
      for (let [key, value] of rawFormData.entries()) {
        if (!(value instanceof File)) {
          finalFormData.append(key, value);
        }
      }
      // filter data
      // if (!isDev) {
      const imagesToSend = Object.values(image).filter(Boolean);

      if (imagesToSend.length > 0) {
        finalFormData.append("imageLinks", JSON.stringify(imagesToSend));
      }
      // }
      finalFormData.append("userId", userId);
      finalFormData.append("bookingId", bookingId);
      finalFormData.append("_id", docId);
      finalFormData.append("startDateAndTime", Date.now());

      const finalAltContact = hasValidSavedAltContact
        ? savedAltContact
        : altContact;

      if (finalAltContact) {
        finalFormData.append("altContact", finalAltContact);
      }

      // changing the data based on id is present or not
      let currentData = !isBookingIdPresent
        ? vehicleMaster?.data
        : vehicleMaster;

      let currentBooking = currentData?.find(
        (item) => item?._id === tempVehicleData?._id,
      );

      if (!currentBooking?.vehicleAssigned && !isChange) {
        if (!selectedVehicle) {
          setLoading(false);
          return handleAsyncError(
            dispatch,
            "Please select a vehicle to assign before starting the ride.",
          );
        }
        finalFormData.append("assignVehicleTableId", selectedVehicle._id);
        finalFormData.append(
          "assignVehicleNumber",
          selectedVehicle.vehicleNumber,
        );
      }

      // for paymentmethod update in booking price
      const updatePaymentMode =
        finalFormData.get("PaymentMode") ||
        currentBooking?.bookingPrice?.AmountLeftAfterUserPaid?.paymentMethod;

      let updatedBooking = {
        ...currentBooking,
        bookingPrice: {
          ...currentBooking?.bookingPrice,
          isPickupImageAdded: true,
        },
        paymentStatus: "paid",
        rideStatus: "ongoing",
      };

      if (!isChange) {
        if (currentBooking?.paymentMethod?.toLowerCase() === "cash") {
          updatedBooking.bookingPrice.payOnPickupMethod =
            updatePaymentMode || "cash";
        } else {
          updatedBooking.bookingPrice.AmountLeftAfterUserPaid = {
            ...currentBooking?.bookingPrice?.AmountLeftAfterUserPaid,
            status: "paid",
            paymentMethod:
              updatePaymentMode ||
              currentBooking?.bookingPrice?.AmountLeftAfterUserPaid
                ?.paymentMethod,
          };
        }
      }

      // try {
      if (isChange) {
        finalFormData.append(
          "vehicleNumber",
          currentBooking?.vehicleBasic?.vehicleNumber,
        );
        finalFormData.append("isVehicleUpdate", true);
        finalFormData.append(
          "diffAmountId",
          currentBooking?.bookingPrice?.diffAmount[
            currentBooking?.bookingPrice?.diffAmount?.length - 1
          ]?.id,
        );
      }

      // console.log(Object.fromEntries(finalFormData.entries()));
      // return;

      const responseImage = await postData("/start-ride", finalFormData, token);

      if (responseImage?.status === 200) {
        setImage({
          vehicleFront: null,
          vehicleLeft: null,
          vehicleRight: null,
          vehicleBack: null,
          odoMeterReading: null,
          others: null,
        });
        // setImageUrl([]);
        setImageUrl({
          vehicleFront: "",
          vehicleLeft: "",
          vehicleRight: "",
          vehicleBack: "",
          odoMeterReading: "",
          others: "",
        });
        setFormValues({
          startMeterReading: "",
          EndMeterReading: "",
          rideOtp: "",
          altContact: "",
          address: "",
        });
        setCachedVehicles(null);
        onVehicleChange && onVehicleChange();
        dispatch(togglePickupImageModal());

        if (isChange) {
          const targetId =
            currentBooking?.bookingPrice?.diffAmount?.[
              currentBooking?.bookingPrice?.diffAmount?.length - 1
            ]?.id;

          updatedBooking = {
            ...updatedBooking,
            bookingPrice: {
              ...updatedBooking.bookingPrice,
              diffAmount: updatedBooking.bookingPrice.diffAmount.map((item) =>
                item.id === targetId ? { ...item, rideStatus: true } : item,
              ),
            },
          };
        } else {
          updatedBooking = {
            ...updatedBooking,
            vehicleBasic: {
              ...updatedBooking?.vehicleBasic,
              endRide: responseImage?.endOtp || 0,
            },
            pickupImage: responseImage?.newDocument,
          };
        }

        dispatch(handleInvoiceCreated(updatedBooking));
        // updating the timeline for booking
        const isRideStart =
          (vehicleMaster && vehicleMaster[0]?.rideStatus === "ongoing") ||
          false;

        const changeUnpaidAmount =
          vehicleMaster &&
          (vehicleMaster[0]?.bookingPrice?.diffAmount || []).reduce(
            (sum, item) => {
              return item.status !== "paid" ? sum + item.amount : sum;
            },
            0,
          );

        let amount = 0;

        // adding remaning amount
        if (vehicleMaster[0]?.paymentMethod === "partiallyPay") {
          amount =
            vehicleMaster[0]?.bookingPrice?.AmountLeftAfterUserPaid &&
            vehicleMaster[0]?.bookingPrice?.AmountLeftAfterUserPaid?.status ===
              "unpaid"
              ? vehicleMaster[0]?.bookingPrice?.AmountLeftAfterUserPaid?.amount
              : 0;
        } else if (vehicleMaster[0]?.paymentMethod === "cash") {
          amount =
            vehicleMaster[0]?.bookingPrice?.discountTotalPrice > 0
              ? vehicleMaster[0]?.bookingPrice?.discountTotalPrice
              : vehicleMaster[0]?.bookingPrice?.totalPrice;
        }

        const TimelineVehicleNumber =
          responseImage?.vehicleNumber?.trim() !== ""
            ? responseImage.vehicleNumber
            : vehicleMaster[0]?.vehicleBasic?.vehicleNumber;

        const timeLineData = {
          currentBooking_id: vehicleMaster && vehicleMaster[0]?._id,
          timeLine: [
            {
              title:
                isChange && isChange === true && isRideStart
                  ? `Ride Updated by ${loggedInRole}`
                  : `Ride Started by ${loggedInRole}`,
              date: Date.now(),
              vehicleName: vehicleMaster[0]?.vehicleName,
              vehicleNumber: TimelineVehicleNumber,
              // vehicleNumber: vehicleMaster[0]?.vehicleBasic?.vehicleNumber,
              remaining_amount: amount,
              paymentMode: !isChange ? updatePaymentMode : "",
            },
          ],
        };
        await postData("/createTimeline", timeLineData, token);
        // for updating timeline redux data
        dispatch(updateTimeLineData(timeLineData));
        handleAsyncError(dispatch, responseImage?.message, "success");
      } else {
        if (responseImage?.isKyc === false) {
          setIsKycApproved(true);
        }
        handleAsyncError(dispatch, responseImage?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setLoading(false);
    }
  };

  //   close modal and clear value
  const handleClearAndClose = () => {
    return dispatch(togglePickupImageModal());
  };

  // close modal and send to kyc page
  const handleCloseModalAndVerifyUser = (id) => {
    dispatch(togglePickupImageModal());
    return navigate(`/all-users/${id}`);
  };

  // for giving different title to image modal
  const rideVehicleImages = [
    { title: "vehicleFront" },
    { title: "vehicleLeft" },
    { title: "vehicleRight" },
    { title: "vehicleBack" },
    { title: "odoMeterReading" },
    { title: "others" },
  ];

  const isAllImagesUploaded = useMemo(() => {
    return import.meta.env.VITE_ENV !== "development"
      ? Object.values(imagesUrl).every((val) => val !== "")
      : true;
  }, [imagesUrl]);

  return {
    token,
    loggedInRole,
    tempVehicleData,
    vehicleMaster,
    dispatch,
    navigate,
    imagesUrl,
    setImageUrl,
    image,
    setImage,
    loading,
    setLoading,
    isKycApproved,
    setIsKycApproved,
    selectedVehicle,
    setSelectedVehicle,
    currentUser,
    diffData,
    isChange,
    userId,
    bookingId,
    docId,
    handleUploadPickupImages,
    handleClearAndClose,
    handleCloseModalAndVerifyUser,
    rideVehicleImages,
    isAllImagesUploaded,
    formValues,
    handleFormValueChange,
    cachedVehicles,
    setCachedVehicles,
  };
};

export default useRideStart;
