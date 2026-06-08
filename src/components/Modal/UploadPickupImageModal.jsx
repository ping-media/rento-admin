import { useDispatch, useSelector } from "react-redux";
import { togglePickupImageModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { useMemo, useState } from "react";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postData } from "../../Data";
import Spinner from "../Spinner/Spinner";
import {
  handleInvoiceCreated,
  updateTimeLineData,
} from "../../Redux/VehicleSlice/VehicleSlice";
import Input from "../InputAndDropdown/Input";
import { useNavigate } from "react-router-dom";
import ImageUploadAndPreview from "../ImageComponent/ImageUploadAndPreview";
import { isValidIndianMobile } from "../../utils";
import VehicleSearchInput from "../../components/InputAndDropdown/vehicle-search-input";

const UploadPickupImageModal = ({
  isBookingIdPresent = false,
  onVehicleChange = null,
}) => {
  const { isUploadPickupImageActive } = useSelector((state) => state.sideBar);
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

  const currentUser = vehicleMaster?.[0]?.userId ?? null;

  const diffData = useMemo(() => {
    const list = vehicleMaster?.[0]?.bookingPrice?.diffAmount || [];
    return list.length > 0 ? list[list.length - 1] : null;
  }, [vehicleMaster]);

  const isChange =
    (diffData !== null && diffData?.rideStatus === false ? true : false) ||
    false;

  const userId = (vehicleMaster && vehicleMaster[0]?.userId?._id) || "";
  const booking = vehicleMaster && vehicleMaster[0];
  const bookingId = (vehicleMaster && vehicleMaster[0]?.bookingId) || "";
  const docId = (vehicleMaster && vehicleMaster[0]?._id) || "";

  const isDev = import.meta.env.VITE_ENV === "development";

  console.log(booking);

  // new image compress per image
  const handleUploadPickupImages = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!isDev) {
      const isAnyImageMissing = Object.values(imagesUrl).some(
        (value) => value === "",
      );

      if (isAnyImageMissing) {
        setLoading(false);
        return handleAsyncError(dispatch, "All Images Required!.");
      }
    }

    if (!tempVehicleData) {
      setLoading(false);
      return handleAsyncError(dispatch, "All fields required.");
    }

    if (userId === "" || bookingId === "" || docId === "") {
      setLoading(false);
      return handleAsyncError(dispatch, "Required fields missing! try again");
    }

    const rawFormData = new FormData(event.target);
    const altContact = rawFormData.get("altContact");
    const finalFormData = new FormData();

    const savedAltContact = currentUser?.altContact;

    const hasValidSavedAltContact =
      savedAltContact && isValidIndianMobile(savedAltContact);

    const hasValidNewAltContact = altContact && isValidIndianMobile(altContact);

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
    if (!isDev) {
      const imagesToSend = Object.values(image).filter(Boolean);
      finalFormData.append("imageLinks", JSON.stringify(imagesToSend));
    }
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
    let currentData = !isBookingIdPresent ? vehicleMaster?.data : vehicleMaster;

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

    try {
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
        setImageUrl([]);
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

  console.log(selectedVehicle);

  return (
    <div
      className={`fixed ${
        !isUploadPickupImageActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-12 md:top-14 mx-auto shadow-xl rounded-md bg-white max-w-xl">
        <div className="flex justify-between p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Start Ride
          </h2>
          <button
            onClick={handleClearAndClose}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            // disabled={loading || (loggedInRole === "manager" && isChange)}
            disabled={loading}
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
          <form
            onSubmit={handleUploadPickupImages}
            className="lg:h-[30rem] overflow-y-scroll px-0 lg:px-2"
          >
            {isKycApproved && (
              <div className="flex items-center justify-end gap-2 mb-2">
                <p className="text-gray-400">User KYC is Pending:</p>
                <button
                  type="button"
                  className="text-theme underline"
                  onClick={() =>
                    handleCloseModalAndVerifyUser(vehicleMaster[0]?.userId?._id)
                  }
                >
                  Verify KYC
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-2">
              {rideVehicleImages.map((item, index) => (
                <div key={index}>
                  <ImageUploadAndPreview
                    title={item?.title}
                    image={image[item?.title]}
                    setImageMultiChanger={setImage}
                    imagesUrl={imagesUrl[item?.title]}
                    setImageUrlMultiChanger={setImageUrl}
                    isUpload={true}
                    userId={userId}
                    isRequired={!isDev}
                    isDisableRemove={loading}
                    customImageText={item?.title}
                    isLabel={false}
                    name="image"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center w-full mb-3">
              <VehicleSearchInput
                booking={vehicleMaster[0]}
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
              />
            </div>
            {(vehicleMaster[0]?.paymentMethod === "cash" ||
              vehicleMaster[0]?.paymentStatus === "partially_paid" ||
              vehicleMaster[0]?.paymentStatus === "partiallyPay") &&
              !vehicleMaster[0]?.bookingPrice?.payOnPickupMethod && (
                <div className="flex items-center flex-wrap gap-4 mb-3">
                  <input
                    type="hidden"
                    value={vehicleMaster[0]?.paymentStatus}
                    name="paymentStatus"
                  />
                  <input
                    type="hidden"
                    name="remainingPayment"
                    value={
                      (vehicleMaster[0]?.paymentMethod === "cash"
                        ? vehicleMaster[0]?.bookingPrice?.discountTotalPrice > 0
                          ? Number(
                              vehicleMaster[0]?.bookingPrice
                                ?.discountTotalPrice,
                            )
                          : Number(vehicleMaster[0]?.bookingPrice?.totalPrice)
                        : Number(
                            vehicleMaster[0]?.bookingPrice
                              ?.AmountLeftAfterUserPaid?.amount,
                          ) ||
                          Number(
                            vehicleMaster[0]?.bookingPrice
                              ?.AmountLeftAfterUserPaid,
                          )) || 0
                    }
                  />
                  <input type="hidden" name="PaymentMode" value="cash" />
                </div>
              )}
            <div className="flex items-center flex-wrap gap-4 mb-3">
              <div className="w-full lg:w-[48%]">
                <Input
                  type="number"
                  item="startMeterReading"
                  placeholder={"Enter start Reading"}
                  require={true}
                  isLabel={false}
                />
              </div>
              {isChange && (
                <div className="w-full lg:w-[48%]">
                  <Input
                    type="number"
                    item="EndMeterReading"
                    name="oldVehicleEndMeterReading"
                    placeholder={"Enter End Reading"}
                    require={true}
                    isLabel={false}
                  />
                </div>
              )}
              <div className="w-full lg:w-[48%]">
                <Input
                  type="number"
                  item="rideOtp"
                  placeholder={"Enter Otp"}
                  require={true}
                  isLabel={false}
                />
              </div>

              {/* adding altContact and address fields  */}
              <div className="w-full lg:w-[48%]">
                <Input
                  type="number"
                  item="altContact"
                  placeholder={"Enter Alternate Contact Number"}
                  // require={loggedInRole !== "admin" ? true : false}
                  isLabel={false}
                />
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  item="address"
                  placeholder={"Enter Address"}
                  require={loggedInRole !== "admin" ? true : false}
                  isLabel={false}
                />
              </div>
            </div>

            <button
              className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-theme/60"
              type="submit"
              disabled={loading || !isAllImagesUploaded}
            >
              {!loading ? "Start Ride" : <Spinner message={"updating..."} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPickupImageModal;
