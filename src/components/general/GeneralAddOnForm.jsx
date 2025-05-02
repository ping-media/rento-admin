import React, { useEffect, useState } from "react";
import PreLoader from "../Skeleton/PreLoader";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";

const GeneralAddOnForm = ({
  id,
  handleUpdateAddOn,
  addOnModal,
  formLoading,
}) => {
  const { extraAddOn, loading } = useSelector((state) => state.general);
  const [currenAddOn, setCurrentAddOn] = useState(null);

  useEffect(() => {
    if (id && id === "" && extraAddOn?.data?.length === 0) return;

    const current = extraAddOn?.data?.filter((item) => item?._id === id);
    if (current) {
      setCurrentAddOn(current[0]);
    }
  }, [id, extraAddOn]);

  return !loading ? (
    <form
      onSubmit={handleUpdateAddOn}
      className={`${addOnModal ? "" : "hidden"}`}
    >
      <div className="flex items-center flex-wrap gap-4 lg:mb-2">
        <div className="w-full lg:w-[49%] mb-2 lg:mb-0">
          <Input
            placeholder="Add-on Name"
            item="name"
            value={(id && currenAddOn && currenAddOn?.name) || ""}
            isModalClose={addOnModal}
            require={true}
          />
        </div>
        <div className="w-full lg:w-[49%] mb-2 lg:mb-0">
          <Input
            placeholder="Per Day Cost"
            item="amount"
            type="number"
            value={(id && currenAddOn && currenAddOn?.amount) || ""}
            isModalClose={addOnModal}
            require={true}
          />
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-4 lg:mb-2">
        <div className="w-full lg:w-[49%] mb-2 lg:mb-0">
          <Input
            placeholder="Max Cost"
            item="maxAmount"
            type="number"
            value={(id && currenAddOn && currenAddOn?.maxAmount) || 0}
            isModalClose={addOnModal}
            // require={true}
          />
        </div>
        <div className="w-full lg:w-[49%] mb-2 lg:mb-0">
          <SelectDropDown
            placeholder="Add-on Status"
            item="status"
            value={(id && currenAddOn && currenAddOn?.status) || "active"}
            isModalClose={addOnModal}
            options={["active", "inactive"]}
            require={true}
            isSearchEnable={false}
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1 whitespace-nowrap disabled:bg-gray-400"
        disabled={formLoading}
      >
        {formLoading ? "Updating" : id === "" ? "Add" : "Update"}
      </button>
    </form>
  ) : (
    <PreLoader />
  );
};

export default GeneralAddOnForm;
