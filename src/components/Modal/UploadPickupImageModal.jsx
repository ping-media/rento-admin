import { useDispatch, useSelector } from "react-redux";
import { togglePickupImageModal } from "../../Redux/SideBarSlice/SideBarSlice";
import { useState } from "react";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postData, postMultipleData } from "../../Data";
import Spinner from "../Spinner/Spinner";
import {
  handleInvoiceCreated,
  updateTimeLineData,
} from "../../Redux/VehicleSlice/VehicleSlice";
import Input from "../InputAndDropdown/Input";
import { useNavigate } from "react-router-dom";
import ImageUploadAndPreview from "../ImageComponent/ImageUploadAndPreview";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";

const UploadPickupImageModal = ({
  isBookingIdPresent = false,
  // isChange,
  // setIsChange,
}) => {
  const { isUploadPickupImageActive } = useSelector((state) => state.sideBar);
  const { token } = useSelector((state) => state.user);
  const { tempVehicleData, vehicleMaster } = useSelector(
    (state) => state.vehicles
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

  const diffData = vehicleMaster?.[0]?.bookingPrice?.diffAmount
    ? vehicleMaster[0]?.bookingPrice?.diffAmount[
        vehicleMaster[0]?.bookingPrice?.diffAmount?.length - 1
      ]
    : null;
  const isChange =
    (diffData !== null && diffData?.rideStatus === false ? true : false) ||
    false;

  // new image compress per image
  const handleUploadPickupImages = async (event) => {
    event.preventDefault();
    setLoading(true);

    const isAnyImageMissing = Object.values(imagesUrl).some(
      (value) => value === ""
    );

    if (isAnyImageMissing) {
      return handleAsyncError(dispatch, "All Images Required!.");
    }

    if (!tempVehicleData) {
      return handleAsyncError(dispatch, "All fields required.");
    }

    const rawFormData = new FormData(event.target);
    const finalFormData = new FormData();

    // Copy all non-file fields
    for (let [key, value] of rawFormData.entries()) {
      if (!(value instanceof File)) {
        finalFormData.append(key, value);
      }
    }

    let hasFiles = false;

    for (const file of Object.values(image)) {
      if (file instanceof File || file instanceof Blob) {
        hasFiles = true;
        finalFormData.append("images", file);
      }
    }

    if (!hasFiles) {
      return handleAsyncError(
        dispatch,
        "Unable to upload! No images provided."
      );
    }

    finalFormData.append("userId", tempVehicleData?.userId?._id);
    finalFormData.append("bookingId", tempVehicleData?.bookingId);
    finalFormData.append("_id", tempVehicleData?._id);

    // changing the data based on id is present or not
    let currentData = !isBookingIdPresent ? vehicleMaster?.data : vehicleMaster;

    let currentBooking = currentData?.find(
      (item) => item?._id == tempVehicleData?._id
    );

    // for paymentmethod update in booking price
    const updatePaymentMode =
      finalFormData.get("PaymentMode") ||
      currentBooking?.bookingPrice?.AmountLeftAfterUserPaid?.paymentMethod;

    let updatedBooking;
    if (!isChange) {
      if (currentBooking?.paymentMethod?.toLowerCase() === "cash") {
        updatedBooking = {
          ...currentBooking,
          bookingPrice: {
            ...currentBooking.bookingPrice,
            isPickupImageAdded: true,
            payOnPickupMethod: updatePaymentMode || "cash",
          },
          paymentStatus: "paid",
          rideStatus: "ongoing",
        };
      } else {
        updatedBooking = {
          ...currentBooking,
          bookingPrice: {
            ...currentBooking.bookingPrice,
            isPickupImageAdded: true,
            AmountLeftAfterUserPaid: {
              ...currentBooking?.bookingPrice?.AmountLeftAfterUserPaid,
              status: "paid",
              paymentMethod:
                updatePaymentMode ||
                currentBooking?.bookingPrice?.AmountLeftAfterUserPaid
                  ?.paymentMethod,
            },
          },
          paymentStatus: "paid",
          rideStatus: "ongoing",
        };
      }
    }

    try {
      if (isChange) {
        finalFormData.append(
          "vehicleNumber",
          currentBooking?.vehicleBasic?.vehicleNumber
        );
        finalFormData.append("isVehicleUpdate", true);
        finalFormData.append(
          "diffAmountId",
          currentBooking?.bookingPrice?.diffAmount[
            currentBooking?.bookingPrice?.diffAmount?.length - 1
          ]?.id
        );
      }

      // for (const [key, value] of finalFormData.entries()) {
      //   console.log(`${key}:`, value);
      // }

      // return;

      const responseImage = await postMultipleData(
        "/pickupImage",
        finalFormData,
        token
      );

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
        dispatch(togglePickupImageModal());

        if (isChange) {
          updatedBooking = {
            ...updatedBooking,
            bookingPrice: {
              ...updatedBooking?.bookingPrice,
              diffAmount: updatedBooking.bookingPrice.diffAmount.map((item) =>
                item.id ===
                currentBooking?.bookingPrice?.diffAmount[
                  currentBooking?.bookingPrice?.diffAmount?.length - 1
                ]?.id
                  ? { ...item, rideStatus: true }
                  : item
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
        const timeLineData = {
          currentBooking_id: vehicleMaster && vehicleMaster[0]?._id,
          timeLine: [
            {
              title:
                isChange && isChange === true ? "Ride Updated" : "Ride Started",
              date: Date.now(),
              vehicleName: vehicleMaster[0]?.vehicleName,
              vehicleNumber: vehicleMaster[0]?.vehicleBasic?.vehicleNumber,
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
      // setIsChange && setIsChange(false);
      setLoading(false);
    }
  };

  //   close modal and clear value
  const handleClearAndClose = () => {
    // dispatch(removeTempVehicleData());
    // setIsChange && setIsChange(false);
    return dispatch(togglePickupImageModal());
  };

  // close modal and send to kyc page
  const handleCloseModalAndVerifyUser = (id) => {
    // setIsChange(false);
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

  return (
    <div
      className={`fixed ${
        !isUploadPickupImageActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-5 mx-auto shadow-xl rounded-md bg-white max-w-xl">
        <div className="flex justify-end p-2">
          <button
            onClick={handleClearAndClose}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
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
            className="lg:h-[30rem] overflow-y-hidden overflow-y-scroll px-0 lg:px-2"
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
            <div className="mb-2">
              <p className="text-gray-400 text-xs text-left italic">
                Note: (All six images are required.)
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-2">
              {rideVehicleImages.map((item, index) => (
                <div key={index}>
                  <ImageUploadAndPreview
                    title={item?.title}
                    image={image[item?.title]}
                    setImageMultiChanger={setImage}
                    imagesUrl={imagesUrl[item?.title]}
                    setImageUrlMultiChanger={setImageUrl}
                    name="images"
                  />
                </div>
              ))}
            </div>
            {(vehicleMaster[0]?.paymentMethod === "cash" ||
              vehicleMaster[0]?.paymentStatus === "partially_paid" ||
              vehicleMaster[0]?.paymentStatus === "partiallyPay") &&
              !vehicleMaster[0]?.bookingPrice?.diffAmount && (
                <div className="flex items-center flex-wrap gap-4 mb-3">
                  <input
                    type="hidden"
                    value={vehicleMaster[0]?.paymentStatus}
                    name="paymentStatus"
                  />
                  <div className="w-full lg:w-[48%]">
                    <Input
                      type="number"
                      value={
                        (vehicleMaster[0]?.paymentMethod === "cash"
                          ? vehicleMaster[0]?.bookingPrice?.discountTotalPrice >
                            0
                            ? Number(
                                vehicleMaster[0]?.bookingPrice
                                  ?.discountTotalPrice
                              )
                            : Number(vehicleMaster[0]?.bookingPrice?.totalPrice)
                          : Number(
                              vehicleMaster[0]?.bookingPrice
                                ?.AmountLeftAfterUserPaid?.amount
                            ) ||
                            Number(
                              vehicleMaster[0]?.bookingPrice
                                ?.AmountLeftAfterUserPaid
                            )) || 0
                      }
                      item="remainingPayment"
                      require={true}
                      disabled={true}
                    />
                  </div>
                  <div className="text-left w-full lg:w-[48%]">
                    <SelectDropDown
                      options={["cash", "online"]}
                      item="PaymentMode"
                      require={true}
                      isSearchEnable={false}
                    />
                  </div>
                </div>
              )}
            <div className="flex items-center flex-wrap gap-4 mb-3">
              <div className="w-full lg:w-[48%]">
                <Input
                  type="number"
                  item="startMeterReading"
                  placeholder={"start Reading"}
                  require={true}
                />
              </div>
              {isChange && (
                <div className="w-full lg:w-[48%]">
                  <Input
                    type="number"
                    item="EndMeterReading"
                    name="oldVehicleEndMeterReading"
                    placeholder={"End Reading"}
                    require={true}
                  />
                </div>
              )}
              <div className="w-full lg:w-[48%]">
                <Input
                  type="number"
                  item="rideOtp"
                  placeholder={"Otp"}
                  require={true}
                />
              </div>
            </div>
            <button
              className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
              type="submit"
              disabled={loading}
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
