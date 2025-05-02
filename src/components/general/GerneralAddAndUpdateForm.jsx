import React from "react";
import PreLoader from "../Skeleton/PreLoader";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";

const GerneralAddAndUpdateForm = ({
  handleUpdateSpecialSettings,
  specialDaysModal,
  formLoading,
}) => {
  const { general, loading } = useSelector((state) => state.general);
  return !loading ? (
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
            Based on the above value, the amount will be increased or decreased
            on selected days.
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
  ) : (
    <PreLoader />
  );
};

export default GerneralAddAndUpdateForm;
