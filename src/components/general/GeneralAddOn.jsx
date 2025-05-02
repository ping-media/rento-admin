import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import Spinner from "../../components/Spinner/Spinner";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postData } from "../../Data/index";
import {
  addNewAddOnData,
  removeAddOnData,
} from "../../Redux/GeneralSlice/GeneralSlice";
import GeneralAddOnForm from "./GeneralAddOnForm";
import AddOnTable from "../../components/Table/AddOnTable";
import { tableIcons } from "../../Data/Icons";

const GeneralAddOn = () => {
  const { extraAddOn, loading } = useSelector((state) => state.general);
  const { token } = useSelector((state) => state.user);
  const [addOnModal, setAddOnModal] = useState(false);
  const [addOnId, setAddOnId] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const dispatch = useDispatch();

  const handleMangeAddOn = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const result = Object.fromEntries(formData.entries());
    result.amount = parseFloat(result.amount) || 0;
    result.maxAmount = parseFloat(result.maxAmount) || 0;

    if (addOnId === "") {
      if (
        result.name === "" &&
        result.amount === 0 &&
        result.amount === "" &&
        !["active", "inactive"].includes(result.status)
      ) {
        handleAsyncError(dispatch, "All fields required!");
        return;
      }
    }

    if (addOnId !== "") {
      formData.append("id", addOnId);
    }

    try {
      setFormLoading(true);
      const response = await postData("/manageAddOn", result, token);
      if (response.status === 200) {
        const newData = [...(extraAddOn?.data || []), response?.data];
        dispatch(addNewAddOnData(newData));
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

  const handleDeleteAddOn = async (id) => {
    if (!id) {
      handleAsyncError(dispatch, "Unable to delete! try again");
      return;
    }
    try {
      setFormLoading(true);
      const response = await postData(
        "/manageAddOn",
        { id: id, delete: true },
        token
      );
      if (response.status === 200) {
        dispatch(removeAddOnData(id));
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
