import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/InputAndDropdown/Input";
import React, { useState } from "react";
import SelectDropDown from "../../components/InputAndDropdown/SelectDropDown";
import Spinner from "../../components/Spinner/Spinner";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { postData } from "../../Data/index";
import { addGeneral } from "../../Redux/GeneralSlice/GeneralSlice";
import GeneralTable from "../../components/Table/GeneralTable";

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
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <h2 className="text-md font-semibold mb-3 border-b uppercase">
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
        <h2 className="text-md lg:text-lg font-semibold uppercase">
          Special Days
        </h2>
        <button
          className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1 whitespace-nowrap disabled:bg-gray-400"
          onClick={() => setSpecialDaysModal(!specialDaysModal)}
        >
          Add Special Days
        </button>
      </div>

      {/* this will show the special days in tabular format    */}
      <p className="text-gray-400 italic py-1 text-xs">
        (Note: In order to remove price from special days you can delete the
        specials days from table.)
      </p>
      <GeneralTable />

      <form
        onSubmit={handleUpdateSpecialSettings}
        className={`${specialDaysModal ? "" : "hidden"}`}
      >
        <div className="flex items-center flex-wrap gap-4 lg:mb-2">
          <div className="w-full lg:w-[49%] mb-2 lg:mb-0">
            <Input
              placeholder="Starting Date"
              item="From"
              type="date"
              value={
                (general?.specialDays?.length > 0 &&
                  general?.specialDays[0]?.From) ||
                ""
              }
              require={true}
            />
          </div>
          <div className="w-full lg:w-[49%] mb-2 lg:mb-0">
            <Input
              placeholder="Ending Date"
              item="Too"
              type="date"
              value={
                (general?.specialDays?.length > 0 &&
                  general?.specialDays[0]?.Too) ||
                ""
              }
              require={true}
            />
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-4 lg:mb-2">
          <div className="w-full lg:w-[49%] mb-2 lg:mb-0">
            <Input
              placeholder="Percentage"
              item="Price"
              type="number"
              value={
                (general?.specialDays?.length > 0 &&
                  general?.specialDays[0]?.Price) ||
                ""
              }
              require={true}
            />
            <p className="text-gray-400 italic text-xs mt-1">
              The value entered above will be applied on slected days in
              percentage.
            </p>
          </div>
          <div className="w-full lg:w-[49%] mb-2 lg:mb-0">
            <SelectDropDown
              placeholder="Percentage Type(Increase/Decrease)"
              item="PriceType"
              options={["+", "-"]}
              value={
                (general?.specialDays?.length > 0 &&
                  general?.specialDays[0]?.PriceType) ||
                "+"
              }
              require={true}
            />
            <p className="text-gray-400 italic text-xs mt-1">
              Based on the above value, the amount will be increased or
              decreased on selected days.
            </p>
          </div>
        </div>
        <button
          type="submit"
          className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1 whitespace-nowrap disabled:bg-gray-400"
          disabled={formLoading.specialDaysLoading}
        >
          {formLoading.specialDaysLoading
            ? "Updating"
            : general?.specialDays?.length === 0
            ? "Add"
            : "Update"}
        </button>
      </form>
    </>
  );
};

export default GeneralForm;
