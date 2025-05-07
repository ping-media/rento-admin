import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/InputAndDropdown/Input";
import React, { useState } from "react";
import SelectDropDown from "../../components/InputAndDropdown/SelectDropDown";
import Spinner from "../../components/Spinner/Spinner";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postData } from "../../Data/index";
import { addGeneral } from "../../Redux/GeneralSlice/GeneralSlice";
import GeneralTable from "../../components/Table/GeneralTable";
import GerneralAddAndUpdateForm from "./GerneralAddAndUpdateForm";
import { tableIcons } from "../../Data/Icons";
import GSTTable from "../Table/GSTTable";

const GeneralForm = () => {
  const { general, loading } = useSelector((state) => state.general);
  const { token } = useSelector((state) => state.user);
  const [specialDaysModal, setSpecialDaysModal] = useState(false);
  const [formLoading, setFormLoading] = useState({
    weakendLoading: false,
    specialDaysLoading: false,
  });
  const dispatch = useDispatch();

  const handleUpdatweakendSettings = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const result = Object.fromEntries(formData.entries());

    if (!result.weakendPrice || !["+", "-"].includes(result.weakendPriceType)) {
      handleAsyncError(dispatch, "All fields required!");
      return;
    }

    try {
      setFormLoading((prev) => ({ ...prev, weakendLoading: true }));
      const response = await postData(
        "/updateGeneral",
        {
          weakendPrice: Number(result.weakendPrice),
          weakendPriceType: result.weakendPriceType,
        },
        token
      );
      if (response.success === true) {
        const newData = { ...general, weakend: response?.data?.weakend };
        dispatch(addGeneral(newData));
        handleAsyncError(dispatch, response?.message, "success");
        return;
      }
    } catch (error) {
      handleAsyncError(dispatch, "Unable to update weakend price! try again");
    } finally {
      setFormLoading((prev) => ({ ...prev, weakendLoading: false }));
    }
  };

  const handleUpdateSpecialSettings = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const result = Object.fromEntries(formData.entries());

    if (
      result.Price === 0 ||
      !["+", "-"].includes(result.PriceType) ||
      !result.From ||
      !result.Too
    ) {
      handleAsyncError(dispatch, "All fields required!");
      return;
    }

    try {
      setFormLoading((prev) => ({ ...prev, specialDaysLoading: true }));
      const response = await postData(
        "/updateGeneral",
        {
          specialDays: [
            {
              From: result.From,
              Too: result.Too,
              Price: result.Price,
              PriceType: result.PriceType,
            },
          ],
        },
        token
      );
      if (response.success === true) {
        const newData = {
          ...general,
          specialDays: response?.data?.specialDays,
        };
        dispatch(addGeneral(newData));
        setSpecialDaysModal(!specialDaysModal);
        handleAsyncError(dispatch, response?.message, "success");
        return;
      }
    } catch (error) {
      handleAsyncError(
        dispatch,
        "Unable to update special days price! try again"
      );
    } finally {
      setFormLoading((prev) => ({ ...prev, specialDaysLoading: false }));
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-full">
        <Spinner textColor="black" />
      </div>
    );
  }

  return (
    <>
      <h2 className="text-md lg:text-lg font-semibold mb-3 border-b uppercase">
        Enable/Disable GST
      </h2>
      <GSTTable />

      <h2 className="text-md lg:text-lg font-semibold mt-2 mb-3 border-b uppercase">
        Weekend Price
      </h2>
      <form onSubmit={handleUpdatweakendSettings} className="mb-5">
        <div className="flex items-center flex-wrap gap-4 lg:mb-2">
          <div className="w-full lg:w-[49%] mb-2 lg:mb-0">
            <Input
              placeholder="Weekend Percentage"
              item="weakendPrice"
              type="number"
              value={general?.weakend?.Price || ""}
              require={true}
            />
            <p className="text-gray-400 italic text-xs mt-1">
              The value entered above will be applied on weekend in percentage.
            </p>
          </div>
          <div className="w-full lg:w-[49%] mb-2 lg:mb-0">
            <SelectDropDown
              placeholder="Percentage Type(Increase/Decrease)"
              item="weakendPriceType"
              options={["+", "-"]}
              value={general?.weakend?.PriceType || ""}
              require={true}
              isSearchEnable={false}
            />
            <p className="text-gray-400 italic text-xs mt-1">
              Based on the above value, the amount will be increased or
              decreased on weekend.
            </p>
          </div>
        </div>
        <button
          type="submit"
          className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1 whitespace-nowrap disabled:bg-gray-400"
          disabled={formLoading.weakendLoading}
        >
          {formLoading.weakendLoading ? "Updating" : "Update"}
        </button>
      </form>

      <div className="border-b mb-3 flex items-center justify-between py-1">
        <div className="flex items-center gap-2">
          {specialDaysModal && (
            <button
              className="p-1.5 hover:bg-theme hover:text-white rounded-md transition-all duration-200 ease-in-out"
              onClick={() => setSpecialDaysModal(!specialDaysModal)}
            >
              {tableIcons?.backArrow}
            </button>
          )}
          <h2 className="text-md lg:text-lg font-semibold uppercase">
            Special Days
          </h2>
        </div>
        {!specialDaysModal && (
          <button
            className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1 whitespace-nowrap disabled:bg-gray-400"
            onClick={() => setSpecialDaysModal(!specialDaysModal)}
          >
            Add Special Days
          </button>
        )}
      </div>

      {!specialDaysModal && <GeneralTable />}

      <GerneralAddAndUpdateForm
        handleUpdateSpecialSettings={handleUpdateSpecialSettings}
        specialDaysModal={specialDaysModal}
        formLoading={formLoading}
      />
    </>
  );
};

export default GeneralForm;
