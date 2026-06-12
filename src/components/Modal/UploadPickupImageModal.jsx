import { useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import Input from "../InputAndDropdown/Input";
import ImageUploadAndPreview from "../ImageComponent/ImageUploadAndPreview";
import VehicleSearchInput from "../../components/InputAndDropdown/vehicle-search-input";
import useRideStart from "../../hooks/use-ride-start";

const isDev = import.meta.env.VITE_ENV === "development";

const UploadPickupImageModal = ({
  isBookingIdPresent = false,
  onVehicleChange = null,
}) => {
  const {
    loggedInRole,
    vehicleMaster,
    imagesUrl,
    setImageUrl,
    image,
    setImage,
    loading,
    isKycApproved,
    selectedVehicle,
    setSelectedVehicle,
    isChange,
    userId,
    handleUploadPickupImages,
    handleClearAndClose,
    handleCloseModalAndVerifyUser,
    rideVehicleImages,
    isAllImagesUploaded,
  } = useRideStart({ isBookingIdPresent, onVehicleChange });
  const { isUploadPickupImageActive } = useSelector((state) => state.sideBar);

  if (!isUploadPickupImageActive) return null;

  return (
    <div className="fixed z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
      <div className="relative top-12 md:top-14 mx-auto shadow-xl rounded-md bg-white max-w-xl">
        <div className="flex justify-between p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Start Ride
          </h2>
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

            {vehicleMaster[0]?.vehicleBasic?.vehicleNumber === "unassigned" && (
              <div className="flex items-center w-full mb-3">
                <VehicleSearchInput
                  booking={vehicleMaster[0]}
                  selectedVehicle={selectedVehicle}
                  setSelectedVehicle={setSelectedVehicle}
                />
              </div>
            )}

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
              {isChange &&
                vehicleMaster[0]?.changeVehicle?.vehicleTableId !== null && (
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
              className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:bg-theme focus:ring-opacity-50 disabled:bg-theme/60"
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
