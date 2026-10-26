import React, { lazy, Suspense, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../InputAndDropdown/Input";
import Spinner from "../../Spinner/Spinner";
import UserRideTimeLine from "../../Booking/UserRideTimeLine";
import { format, parseISO } from "date-fns";
import KycData from "./KycData";
import { Star, StarHalf, StarBorder } from "@mui/icons-material";
import UserStatusSwitches from "./UserStatusSwitches";
import { postData } from "../../../Data";
import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
import ConfirmActionModal from "../../Modal/ConfirmActionModal";
import { patchMasterUser } from "../../../Redux/VehicleSlice/VehicleSlice";
const UserReviewModal = lazy(() => import("../../Modal/UserReviewModal"));

const formatDateTime = (isoString) => {
  if (!isoString) return null;

  const date = parseISO(isoString);

  return format(date, "dd MMM yyyy, hh:mm a");
};

const ACTION_CONFIG = {
  manager: {
    title: "Change customer to manager?",
    message:
      "This customer will be moved to the managers list and will no longer appear under customers.",
    confirmText: "Yes, change",
  },
  unverify: {
    title: "Mark user as un-verified?",
    message:
      "The saved Aadhaar and license approval will be removed, and the KYC details will have to be entered again to verify this user.",
    confirmText: "Yes, mark un-verified",
  },
};

const CustomerForm = ({ handleFormSubmit, loading, isProfile = false }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { loggedInRole, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [action, setAction] = useState(null); // null | "manager" | "unverify"
  const [actionLoading, setActionLoading] = useState(false);
  const [kycKey, setKycKey] = useState(0);
  const [review, setReview] = useState(false);
  const { id } = useParams();
  const location = useLocation();

  const isAdmin = loggedInRole === "admin";
  const isManager = location.pathname.includes("/all-managers/");

  const userCreatedAt =
    vehicleMaster?.[0]?.userId?.createdAt ||
    vehicleMaster?.userId?.createdAt ||
    vehicleMaster?.[0]?.createdAt ||
    vehicleMaster?.createdAt ||
    "";

  const userId =
    vehicleMaster?.[0]?.userId?._id ||
    vehicleMaster?.userId?._id ||
    vehicleMaster?.[0]?._id ||
    vehicleMaster?._id ||
    "";

  const rating =
    vehicleMaster?.[0]?.userId?.rating ||
    vehicleMaster?.userId?.rating ||
    vehicleMaster?.[0]?.rating ||
    vehicleMaster?.rating ||
    null;

  const isAddCustomer = location.pathname.endsWith("/all-users/add-new");

  const showStatusSwitches =
    !isProfile && !location.pathname.includes("/add-new");

  const isAllCustomerEditable = useMemo(() => {
    const sanitizeId = id && id.trim() !== "";
    return location.pathname.includes("/all-users/") && sanitizeId;
  }, [id, location.pathname]);

  const canMakeManager = isAdmin && !!isAllCustomerEditable;
  const showCreatedAt =
    userCreatedAt && userCreatedAt?.trim() !== "" && !isProfile;

  const kycApproved =
    vehicleMaster?.[0]?.userId?.kycApproved ??
    vehicleMaster?.userId?.kycApproved ??
    vehicleMaster?.[0]?.kycApproved ??
    vehicleMaster?.kycApproved;

  const isDocumentVerified =
    vehicleMaster?.[0]?.userId?.isDocumentVerified ??
    vehicleMaster?.userId?.isDocumentVerified ??
    vehicleMaster?.[0]?.isDocumentVerified ??
    vehicleMaster?.isDocumentVerified;

  const isDeleted = Boolean(
    vehicleMaster?.[0]?.userId?.isDeleted ??
    vehicleMaster?.userId?.isDeleted ??
    vehicleMaster?.[0]?.isDeleted ??
    vehicleMaster?.isDeleted,
  );

  const isVerified = kycApproved === "yes" || isDocumentVerified === "yes";

  const runAction = async () => {
    if (!action || actionLoading) return;
    setActionLoading(true);
    try {
      const toManager = action === "manager";
      const response = toManager
        ? await postData("/change-user-role", { _id: id }, token)
        : await postData("/kyc-unverify", { userId: id }, token);

      if (response?.status === 200 || response?.success) {
        handleAsyncError(
          dispatch,
          response?.message ||
            (toManager
              ? "Customer changed to manager"
              : "User marked un-verified"),
          "success",
        );
        setAction(null);
        if (toManager) {
          navigate(`/all-managers/${id}`); // no longer a customer
        } else {
          dispatch(
            patchMasterUser({ kycApproved: "no", isDocumentVerified: "no" }),
          );
          setKycKey((k) => k + 1); // remounts KycData so it refetches
        }
      } else {
        handleAsyncError(dispatch, response?.message || "Something went wrong");
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        <UserReviewModal
          isActive={review}
          setIsActive={setReview}
          userId={id}
        />
      </Suspense>

      <ConfirmActionModal
        active={!!action}
        title={ACTION_CONFIG[action]?.title}
        message={ACTION_CONFIG[action]?.message}
        confirmText={ACTION_CONFIG[action]?.confirmText}
        loading={actionLoading}
        onConfirm={runAction}
        onCancel={() => setAction(null)}
      />

      <div
        className={`${
          isAllCustomerEditable
            ? "flex items-center flex-wrap lg:items-start lg:grid lg:grid-cols-2 gap-2"
            : ""
        }`}
      >
        {isAllCustomerEditable && (
          <div className="w-full hidden sm:flex flex-col lg:flex-1 order-2">
            <h2 className="text-lg text-theme font-semibold uppercase">
              Rides History
            </h2>
            <UserRideTimeLine />
          </div>
        )}

        <div className="w-full lg:flex-1 order-1">
          <form
            className="mb-5 w-full"
            onSubmit={
              isAdmin && !isDeleted
                ? handleFormSubmit
                : (e) => e.preventDefault()
            }
          >
            {(showCreatedAt || canMakeManager) && (
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                {showCreatedAt ? (
                  <p className="text-base">
                    <span className="font-semibold">Created at:</span>{" "}
                    {formatDateTime(userCreatedAt)}
                  </p>
                ) : (
                  <span />
                )}
                {/* {canMakeManager && (
                  <button
                    type="button"
                    onClick={() => setAction("manager")}
                    className="rounded-md border border-theme px-3 py-1.5 text-sm font-semibold text-theme transition-colors hover:bg-theme hover:text-white"
                  >
                    Make Manager
                  </button>
                )} */}
              </div>
            )}

            {rating !== null && !isProfile && !isManager && (
              <div className="flex items-center gap-3 flex-wrap mb-3">
                <div className="flex items-center">
                  <p className="font-semibold text-base mr-0.5 sm:mr-1">
                    Rating:
                  </p>
                  <RatingStars rating={rating} />
                </div>

                <button
                  type="button"
                  className="text-theme hover:underline underline-offset-4 transition-all ease-in-out"
                  onClick={() => setReview(true)}
                >
                  View Review
                </button>
              </div>
            )}

            {!isProfile &&
              !location.pathname.includes("/add-new") &&
              !isManager && <KycData key={kycKey} userId={userId} />}

            <div
              className={`flex flex-wrap gap-4 pt-3 ${!isProfile && !location.pathname.includes("/add-new") ? "border-t" : ""}`}
            >
              <fieldset disabled={isDeleted} className="contents">
                <div className="w-full lg:w-[48%]">
                  <Input
                    item={"firstName"}
                    value={
                      id || location.pathname == "/profile"
                        ? vehicleMaster?.firstName ||
                          vehicleMaster[0]?.userId?.firstName ||
                          vehicleMaster[0]?.firstName
                        : ""
                    }
                    require={true}
                  />
                </div>

                <div className="w-full lg:w-[48%]">
                  <Input
                    item={"lastName"}
                    value={
                      id || location.pathname == "/profile"
                        ? vehicleMaster[0]?.userId?.lastName ||
                          vehicleMaster?.lastName ||
                          vehicleMaster[0]?.lastName
                        : ""
                    }
                    require={true}
                  />
                </div>

                <div className="w-full lg:w-[48%]">
                  <Input
                    item={"contact"}
                    type="number"
                    value={
                      id || location.pathname == "/profile"
                        ? Number(vehicleMaster[0]?.userId?.contact) ||
                          Number(vehicleMaster?.contact) ||
                          Number(vehicleMaster[0]?.contact)
                        : ""
                    }
                    require={true}
                    disabled={location?.pathname == "/profile" ? true : false}
                  />
                </div>

                {!isAddCustomer && (
                  <div className="w-full lg:w-[48%]">
                    <Input
                      item={"altContact"}
                      type="number"
                      value={
                        id || location.pathname == "/profile"
                          ? (() => {
                              const altContact =
                                vehicleMaster[0]?.userId?.altContact ??
                                vehicleMaster?.altContact ??
                                vehicleMaster[0]?.altContact;

                              return altContact &&
                                altContact !== "Na" &&
                                !isNaN(altContact)
                                ? Number(altContact)
                                : "";
                            })()
                          : ""
                      }
                      require={false}
                    />
                  </div>
                )}

                <div className="w-full lg:w-[48%]">
                  <Input
                    item={"email"}
                    type="email"
                    value={
                      id || location.pathname == "/profile"
                        ? vehicleMaster[0]?.userId?.email ||
                          vehicleMaster?.email ||
                          vehicleMaster[0]?.email
                        : ""
                    }
                    require={true}
                  />
                </div>

                {!isProfile && !isAddCustomer && (
                  <div className="w-full lg:w-[48%]">
                    <Input
                      item={"addressProof"}
                      value={
                        id
                          ? vehicleMaster[0]?.userId?.addressProof ||
                            vehicleMaster?.addressProof ||
                            vehicleMaster[0]?.addressProof
                          : ""
                      }
                    />
                  </div>
                )}

                {!isProfile && !isAddCustomer && (
                  <div className="w-full lg:w-[48%]">
                    <Input
                      type="date"
                      item={"dateofbirth"}
                      placeholder={"Date of Birth"}
                      value={
                        id
                          ? vehicleMaster[0]?.userId?.dateofbirth !== "Na"
                            ? vehicleMaster[0]?.userId?.dateofbirth
                            : "" || vehicleMaster?.dateofbirth !== "Na"
                              ? vehicleMaster?.dateofbirth
                              : "" || vehicleMaster[0]?.dateofbirth !== "Na"
                                ? vehicleMaster[0]?.dateofbirth
                                : ""
                          : ""
                      }
                    />
                  </div>
                )}

                {!id && !isAddCustomer && !isProfile && (
                  <div className="w-full lg:w-[48%]">
                    <Input
                      item={"password"}
                      type="password"
                      isPassword={true}
                      require
                    />
                  </div>
                )}
              </fieldset>

              {!isProfile && location.pathname.includes("/add-new") && (
                <>
                  <input
                    type="hidden"
                    name="userType"
                    value={isAddCustomer ? "customer" : "manager"}
                  />
                  <input type="hidden" name="isContactVerified" value="no" />
                  <input type="hidden" name="isEmailVerified" value="no" />
                  <input type="hidden" name="status" value="active" />
                </>
              )}
            </div>

            {(isProfile || isAdmin) && !isDeleted && (
              <button
                className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-opacity-50 disabled:bg-gray-400"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Spinner
                    message={
                      location.pathname == "/profile" ? "updating" : "uploading"
                    }
                  />
                ) : id ? (
                  "Update"
                ) : location.pathname === "/profile" ? (
                  "Update"
                ) : (
                  "Add New"
                )}
              </button>
            )}
          </form>

          {showStatusSwitches && (
            <UserStatusSwitches
              isAdmin={isAdmin}
              isDeleted={isDeleted}
              onUnverify={
                isAdmin && isAllCustomerEditable && isVerified
                  ? () => setAction("unverify")
                  : undefined
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerForm;

const RatingStars = ({ rating }) => {
  if (!rating) return null;

  const value = rating.average ?? 0;
  const fullStars = Math.floor(value);
  const remainder = value - fullStars;

  const hasHalfStar = remainder > 0 && remainder < 0.5;
  const roundUpToFull = remainder >= 0.5;

  const filledCount = hasHalfStar
    ? fullStars
    : fullStars + (roundUpToFull ? 1 : 0);
  const emptyCount = 5 - filledCount - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      <p className="text-base font-semibold mr-1">{value.toFixed(1)}</p>
      <div className="flex items-center gap-0.1 sm:gap-0.4 mr-0.5 sm:mr-1">
        {[...Array(filledCount)].map((_, i) => (
          <Star
            className="text-yellow-500"
            fontSize="medium"
            key={`full-${i}`}
          />
        ))}
        {hasHalfStar && (
          <StarHalf className="text-yellow-500" fontSize="small" />
        )}
        {[...Array(emptyCount)].map((_, i) => (
          <StarBorder
            className="text-yellow-500"
            fontSize="small"
            key={`empty-${i}`}
          />
        ))}
      </div>
      <p className="text-base">({rating.totalReviews})</p>
    </div>
  );
};
