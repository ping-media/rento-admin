import React, { lazy, Suspense, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Input from "../../InputAndDropdown/Input";
import Spinner from "../../Spinner/Spinner";
// import { userType, userTypeWithoutAdmin } from "../../../Data/commonData";
import UserRideTimeLine from "../../Booking/UserRideTimeLine";
import { format, parseISO } from "date-fns";
import KycData from "./KycData";
import { Star, StarHalf, StarBorder } from "@mui/icons-material";
import UserStatusSwitches from "./UserStatusSwitches";
const UserReviewModal = lazy(() => import("../../Modal/UserReviewModal"));

const formatDateTime = (isoString) => {
  if (!isoString) return null;

  const date = parseISO(isoString);

  return format(date, "dd MMM yyyy, hh:mm a");
};

const CustomerForm = ({ handleFormSubmit, loading, isProfile = false }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { loggedInRole } = useSelector((state) => state.user);
  const [review, setReview] = useState(false);
  const { id } = useParams();
  const location = useLocation();

  // const isProfile = location.pathname === "/profile";
  const isAdmin = loggedInRole === "admin";
  // const USER_ROLE = isAdmin ? userType : userTypeWithoutAdmin;

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

  return (
    <>
      <Suspense fallback={null}>
        <UserReviewModal
          isActive={review}
          setIsActive={setReview}
          userId={id}
        />
      </Suspense>

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
            onSubmit={isAdmin ? handleFormSubmit : () => {}}
          >
            {userCreatedAt && userCreatedAt?.trim() !== "" && !isProfile && (
              <div className="mb-3">
                <p className="text-base">
                  <span className="font-semibold">Created at:</span>{" "}
                  {formatDateTime(userCreatedAt)}
                </p>
              </div>
            )}

            {rating !== null && !isProfile && (
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

            {!isProfile && !location.pathname.includes("/add-new") && (
              <KycData userId={userId} />
            )}

            <div
              className={`flex flex-wrap gap-4 pt-3 ${!isProfile && !location.pathname.includes("/add-new") ? "border-t" : ""}`}
            >
              <>
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
                {/* {location.pathname !== "/profile" && !isAddCustomer && ( */}
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

                {/* {location.pathname !== "/profile" && !isAddCustomer && ( */}
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
              </>

              {/* {location.pathname != "/profile" && ( */}
              {!isProfile && (
                <>
                  {!location.pathname.includes("/add-new") ? (
                    <>
                      {/*  <div className="w-full lg:w-[48%]">
                     <SelectDropDown
                       item={"userType"}
                       options={USER_ROLE}
                       value={
                         id
                           ? vehicleMaster[0]?.userId?.userType ||
                             vehicleMaster?.userType ||
                             vehicleMaster[0]?.userType
                           : ""
                       }
                       require={true}
                       isSearchEnable={false}
                     />
                   </div> */}
                    </>
                  ) : (
                    <>
                      <input
                        type="hidden"
                        name="userType"
                        value={isAddCustomer ? "customer" : "manager"}
                      />
                      <input
                        type="hidden"
                        name="isContactVerified"
                        value="no"
                      />
                      <input type="hidden" name="isEmailVerified" value="no" />
                      <input type="hidden" name="status" value="active" />
                    </>
                  )}

                  {/* {!isAddCustomer && (
                    <>
                      <div className="w-full lg:w-[48%]">
                        <SelectDropDown
                          item={"isContactVerified"}
                          placeholder={"Contact Verified"}
                          options={["yes", "no"]}
                          value={
                            id
                              ? vehicleMaster[0]?.userId?.isContactVerified ||
                                vehicleMaster?.isContactVerified ||
                                vehicleMaster[0]?.isContactVerified
                              : "no"
                          }
                          require={true}
                          isSearchEnable={false}
                        />
                      </div>

                      <div className="w-full lg:w-[48%]">
                        <SelectDropDown
                          item={"isEmailVerified"}
                          placeholder={"Email Verified"}
                          options={["yes", "no"]}
                          value={
                            id
                              ? vehicleMaster[0]?.userId?.isEmailVerified ||
                                vehicleMaster?.isEmailVerified ||
                                vehicleMaster[0]?.isEmailVerified
                              : "no"
                          }
                          require={true}
                          isSearchEnable={false}
                        />
                      </div>

                      <div className="w-full lg:w-[48%]">
                        <SelectDropDown
                          item={"status"}
                          options={["active", "inactive"]}
                          value={
                            id
                              ? vehicleMaster[0]?.userId?.status ||
                                vehicleMaster?.status ||
                                vehicleMaster[0]?.status
                              : "active"
                          }
                          require={true}
                          isSearchEnable={false}
                        />
                      </div>
                    </>
                  )} */}
                </>
              )}
            </div>

            {isAdmin && (
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

          {showStatusSwitches && <UserStatusSwitches isAdmin={isAdmin} />}
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
