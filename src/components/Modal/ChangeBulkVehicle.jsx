import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleVehicleUpdateModal } from "../../Redux/SideBarSlice/SideBarSlice";
import Input from "../../components/InputAndDropdown/Input";
import SelectDropDown from "../../components/InputAndDropdown/SelectDropDown";
import {
  changeTempLoadingFalse,
  changeTempLoadingTrue,
  handleIsHeaderChecked,
  removeTempIds,
  restvehicleMaster,
} from "../../Redux/VehicleSlice/VehicleSlice";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { handleDeleteAndEditAllData } from "../../Data/Function";
import { getData } from "../../Data/index";
import Spinner from "../../components/Spinner/Spinner";

const ChangeBulkVehicle = ({
  selectedVehicleIds = [],
  vehicle = null,
  isRest = true,
}) => {
  const { isVehicleUpdateModalActive } = useSelector((state) => state.sideBar);
  const { tempIds, tempLoading } = useSelector((state) => state.vehicles);
  const { token } = useSelector((state) => state.user);
  const [planMaster, setPlanMaster] = useState([]);
  const [planMasterLoading, setPlanMasterLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const dispatch = useDispatch();

  const isRestData = isRest ? restvehicleMaster : null;

  // for updating multiple data in one go
  const handleChangeVehicle = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const results = Object.fromEntries(formData.entries());

    if (results.vehicleStatus === "don'tChange" && results?.length === 0) {
      handleAsyncError(dispatch, "At least update any one value");
      return;
    }

    const excludedKeys = ["perDayCost", "freeKms", "vehicleStatus"];

    let vehiclePlan = Object.entries(results)
      .filter(([key]) => !excludedKeys.includes(key))
      .filter(([key, value]) => {
        if (key.endsWith("_limit")) return false;

        // allow zero also (0 is valid), but must be a number
        const num = Number(value);
        const kmLimitKey = `${key}_limit`;
        const kmLimit = Number(results[kmLimitKey]);

        // keep entry if either price OR kmLimit is provided
        return (
          (!isNaN(num) && value !== "" && num >= 0) ||
          (!isNaN(kmLimit) && kmLimit > 0)
        );
      })
      .map(([id, price]) => {
        const kmLimitKey = `${id}_limit`;
        const kmLimit = Number(results[kmLimitKey]) || 0;

        return {
          _id: id,
          // only include if user provided price
          ...(price !== undefined && price !== "" && !isNaN(Number(price))
            ? { planPrice: Number(price) }
            : {}),
          // only include if user provided kmLimit
          ...(results[kmLimitKey] !== undefined && !isNaN(kmLimit)
            ? { kmLimit }
            : {}),
        };
      });

    // Final validation
    if (
      results.vehicleStatus === "don'tChange" &&
      vehiclePlan.length === 0 &&
      results?.length === 0
    ) {
      handleAsyncError(
        dispatch,
        "Please add price or kmLimit for at least one plan or per day cost.",
      );
      return;
    }

    if (!tempIds || !selectedVehicleIds)
      return handleAsyncError(dispatch, "unable to get Ids! try again.");

    try {
      setFormLoading(true);

      const vehicleIds = tempIds?.length > 0 ? tempIds : selectedVehicleIds;

      let data = {
        vehicleIds,
        updateData: {},
      };

      if (results.perDayCost > 0) {
        data = {
          ...data,
          updateData: {
            ...(data.updateData || {}),
            perDayCost: Number(results.perDayCost),
          },
        };
      }

      if (results.freeKms > 0) {
        data = {
          ...data,
          updateData: {
            ...(data.updateData || {}),
            freeKms: Number(results.freeKms),
          },
        };
      }

      if (results.vehicleStatus !== "don'tChange") {
        data = {
          ...data,
          updateData: {
            ...(data.updateData || {}),
            vehicleStatus: results.vehicleStatus,
          },
        };
      }

      if (vehiclePlan.length > 0) {
        data = {
          ...data,
          vehiclePlan: vehiclePlan,
        };
      }

      return handleDeleteAndEditAllData({
        data,
        operation: "edit",
        handleAsyncError,
        changeTempLoadingTrue,
        changeTempLoadingFalse,
        dispatch,
        removeTempIds,
        restvehicleMaster: isRestData,
        token,
        handleIsHeaderChecked,
        handleCloseModal,
      });
    } catch (error) {
      handleAsyncError(
        dispatch,
        "Unable to update vehicle right now! try again.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  // for fetching plan
  useEffect(() => {
    if (!isVehicleUpdateModalActive || planMaster?.length > 0) return;
    (async () => {
      try {
        setPlanMasterLoading(true);
        const response = await getData("/getPlanData?page=1&limit=50", token);
        if (response.status === 200) {
          setPlanMaster(response?.data);
        } else {
          handleAsyncError(dispatch, "Unable to fetch plan! try again");
        }
      } catch (error) {
        handleAsyncError(dispatch, "Unable to get Plan Data! try again");
      } finally {
        setPlanMasterLoading(false);
      }
    })();
  }, [isVehicleUpdateModalActive]);

  // for closing the modal
  const handleCloseModal = () => {
    dispatch(toggleVehicleUpdateModal());
    return;
  };

  const { vehiclePlan, daily } = useMemo(() => {
    if (!vehicle) return { vehiclePlan: [], daily: {} };

    const vehiclePlan = vehicle?.vehiclePlan ?? [];
    const daily = {
      perdaycost: vehicle?.perDayCost ?? 0,
      freeKms: vehicle?.freeKms ?? 0,
    };

    return { vehiclePlan, daily };
  }, [vehicle]);

  const vehiclePlanMap = useMemo(() => {
    if (!vehiclePlan?.length) return {};
    return vehiclePlan.reduce((acc, curr) => {
      acc[curr._id] = curr;
      return acc;
    }, {});
  }, [vehiclePlan]);

  if (!isVehicleUpdateModalActive) return null;

  return (
    <div
      className={`fixed inset-0 z-40 bg-gray-900 bg-opacity-60 flex justify-center items-center px-4 ${
        !isVehicleUpdateModalActive ? "hidden" : ""
      }`}
    >
      <div className="relative w-full max-w-xl bg-white rounded-md shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between border-b p-2 sticky top-0 bg-white z-10">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Update Price
          </h2>
          <button
            onClick={handleCloseModal}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={
              formLoading || planMasterLoading || tempLoading?.loading || false
            }
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

        {/* Scrollable content */}
        <div className="overflow-y-auto px-4 2xl:px-6 py-2.5 flex-1">
          {selectedVehicleIds?.length > 0 && (
            <div className="pb-2 border-b mb-2">
              <span className="text-md text-left font-normal text-theme border px-2 py-0.5 rounded-full border-theme bg-theme/10">
                {selectedVehicleIds?.length} Vehicles Selected
              </span>
            </div>
          )}
          <form onSubmit={handleChangeVehicle}>
            <div className="mb-2 flex items-center gap-2">
              <Input
                placeholder="Per Day Cost"
                item={"perDayCost"}
                defaultValue={daily?.perdaycost || ""}
                type="number"
              />
              <Input
                placeholder="Km Limit"
                item={"freeKms"}
                defaultValue={daily?.freeKms || ""}
                type="number"
              />
            </div>

            <div className="mb-2">
              <h2 className="text-md text-left font-bold border-b pb-1 mb-1.5">
                Plan Price & Km Limit
              </h2>
              <div className="flex justify-center flex-wrap gap-2 items-center">
                {planMasterLoading ? (
                  <Spinner />
                ) : planMaster?.length > 0 ? (
                  planMaster.map((plan) => (
                    <div
                      className="w-full flex items-center gap-2"
                      key={plan._id}
                    >
                      <Input
                        placeholder={plan.planName}
                        item={plan._id}
                        defaultValue={
                          vehiclePlanMap?.[plan._id]?.planPrice || ""
                        }
                        type="number"
                      />
                      <Input
                        placeholder={"km Limit"}
                        item={`${plan._id}_limit`}
                        defaultValue={vehiclePlanMap?.[plan._id]?.kmLimit || ""}
                        type="number"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center italic">
                    No Plan Found.
                  </p>
                )}
              </div>
            </div>

            <div className="text-left mb-2">
              <SelectDropDown
                item={"vehicleStatus"}
                value="don'tChange"
                options={["don'tChange", "active", "inactive"]}
                isSearchEnable={false}
              />
            </div>

            <button
              type="submit"
              className="bg-theme px-4 py-2 text-gray-100 gap-2 rounded-md hover:bg-theme-dark transition duration-300 ease-in-out shadow-lg hover:shadow-none disabled:bg-gray-400 flex items-center justify-center w-full mt-3"
              disabled={
                formLoading || planMasterLoading || tempLoading?.loading
              }
            >
              {!formLoading ? (
                "Update Price"
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

export default ChangeBulkVehicle;
