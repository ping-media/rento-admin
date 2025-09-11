import React, { useEffect, useState } from "react";
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

const ChangeBulkVehicle = () => {
  const { isVehicleUpdateModalActive } = useSelector((state) => state.sideBar);
  const { tempIds, tempLoading } = useSelector((state) => state.vehicles);
  const { token } = useSelector((state) => state.user);
  const [planMaster, setPlanMaster] = useState([]);
  const [planMasterLoading, setPlanMasterLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const dispatch = useDispatch();

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
        "Please add price or kmLimit for at least one plan or per day cost."
      );
      return;
    }

    if (!tempIds)
      return handleAsyncError(dispatch, "unable to get Ids! try again.");

    try {
      setFormLoading(true);

      let data = {
        vehicleIds: tempIds,
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

      // console.log(data);
      // return;

      return handleDeleteAndEditAllData(
        data,
        "edit",
        handleAsyncError,
        changeTempLoadingTrue,
        changeTempLoadingFalse,
        dispatch,
        removeTempIds,
        restvehicleMaster,
        token,
        handleIsHeaderChecked,
        handleCloseModal
      );
    } catch (error) {
      handleAsyncError(
        dispatch,
        "Unable to update vehicle right now! try again."
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

  if (!isVehicleUpdateModalActive) return;

  return (
    <div
      className={`fixed ${
        !isVehicleUpdateModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 h-full w-full px-4`}
    >
      <div className="relative top-5 mx-auto shadow-xl rounded-md bg-white max-w-xl min-h-[30rem]">
        <div className="flex justify-between border-b p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Update Vehicles
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

        {/* <p className="px-4 mb-2 pt-2 text-xs text-gray-400 italic">
          <span className="font-semibold">Note:</span> (Only put value for those
          you want to change price leave other fields empty.)
        </p> */}
        <div className="p-6 pt-0 text-center">
          <form onSubmit={handleChangeVehicle}>
            <div className="mb-2 flex items-center gap-2">
              <Input
                placeholder="Per Day Cost"
                item={"perDayCost"}
                type="number"
              />
              <Input placeholder="Km Limit" item={"freeKms"} type="number" />
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
                        type="number"
                      />
                      <Input
                        placeholder={"km Limit"}
                        item={`${plan._id}_limit`}
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
              {!formLoading || !tempLoading?.loading ? (
                "Update vehicle"
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
