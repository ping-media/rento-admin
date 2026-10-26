import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import Spinner from "../../components/Spinner/Spinner";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postData } from "../../Data/index";
import GeneralAddOnForm from "./GeneralAddOnForm";
import AddOnTable from "../../components/Table/AddOnTable";
import { tableIcons } from "../../Data/Icons";
import {
  removeStationAddOn,
  updateStationAddon,
} from "../../Redux/VehicleSlice/VehicleSlice";

const GeneralAddOn = () => {
  const { vehicleMaster, loading } = useSelector((state) => state.vehicles);
  const { token } = useSelector((state) => state.user);
  const [addOnModal, setAddOnModal] = useState(false);
  const [addOnId, setAddOnId] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const dispatch = useDispatch();

  // for creating and updating
  const handleMangeAddOn = async (e) => {
    e.preventDefault();

    const stationData = vehicleMaster && vehicleMaster?.[0];

    if (!stationData?._id) {
      return handleAsyncError(dispatch, "unable to get station id! try again");
    }

    const formData = new FormData(e.target);
    const result = Object.fromEntries(formData.entries());

    result.amount = parseFloat(result.amount) || 0;
    result.maxAmount = parseFloat(result.maxAmount) || 0;

    if (
      addOnId === "" &&
      (result.name === "" ||
        result.amount === "" ||
        !["active", "inactive"].includes(result.status))
    ) {
      return handleAsyncError(dispatch, "All fields are required!");
    }

    formData.set("stationId", stationData._id);
    formData.set("amount", result.amount);
    formData.set("maxAmount", result.maxAmount);

    if (addOnId !== "") {
      formData.set("_id", addOnId);
      formData.set("action", "update");
    } else {
      formData.set("action", "create");
    }

    try {
      setFormLoading(true);
      const response = await postData("/create-station-addon", formData, token);
      if (response.success) {
        dispatch(updateStationAddon(response?.data));
        setAddOnModal(!addOnModal);
        setAddOnId("");
        handleAsyncError(dispatch, response?.message, "success");
        return;
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, "Unable to make request! try again");
    } finally {
      setFormLoading(false);
    }
  };

  // for deleting
  const handleDeleteAddOn = async (id) => {
    if (!id) {
      handleAsyncError(dispatch, "Unable to delete! try again");
      return;
    }
    try {
      setFormLoading(true);
      const response = await postData(
        "/create-station-addon",
        { _id: id, action: "delete" },
        token
      );
      if (response.status === 200) {
        dispatch(removeStationAddOn(id));
        handleAsyncError(dispatch, response?.message, "success");
        return;
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, "Unable to delete AddOn! try again");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="border-b mb-3 flex items-center justify-between py-1">
        <div className="flex items-center gap-2">
          {addOnModal && (
            <button
              className="p-1.5 hover:bg-theme hover:text-white rounded-md transition-all duration-200 ease-in-out"
              onClick={() => {
                setAddOnModal(!addOnModal);
                addOnId !== "" && setAddOnId("");
              }}
            >
              {tableIcons?.backArrow}
            </button>
          )}
          <h2 className="text-md lg:text-lg font-semibold uppercase">
            Extra Add On
          </h2>
        </div>
        {!addOnModal && (
          <button
            className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1 whitespace-nowrap disabled:bg-gray-400"
            onClick={() => setAddOnModal(!addOnModal)}
          >
            Add Add-On
          </button>
        )}
      </div>

      {!addOnModal && (
        <AddOnTable
          addOnId={addOnId}
          setAddOnId={setAddOnId}
          setModalValue={setAddOnModal}
          deleteFn={handleDeleteAddOn}
          loading={formLoading}
        />
      )}
      <div className="mb-3">
        <GeneralAddOnForm
          id={addOnId}
          handleUpdateAddOn={handleMangeAddOn}
          addOnModal={addOnModal}
          formLoading={formLoading}
        />
      </div>
    </>
  );
};

export default GeneralAddOn;
