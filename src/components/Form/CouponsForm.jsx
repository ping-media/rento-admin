import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import Spinner from "../Spinner/Spinner";
import { useParams } from "react-router-dom";
import { useState } from "react";

const PlanForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [couponCount, setCouponCount] = useState(0);
  const { id } = useParams();

  return (
    <form onSubmit={handleFormSubmit}>
      <p className="mb-2 text-sm italic text-gray-400">
        <span className="font-semibold text-gray-600">Note:</span> (Enter -1 in
        coupon count field for infinite coupon usage)
      </p>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one & for creating new one */}
        <>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"couponName"}
              value={id ? vehicleMaster[0]?.couponName : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"discountType"}
              options={["percentage", "fixed"]}
              value={id ? vehicleMaster[0]?.discountType : "percentage"}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              type="number"
              item={"discount"}
              value={id ? vehicleMaster[0]?.discount : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <input
              type="hidden"
              name="allowedUsersCount"
              value={
                id
                  ? couponCount > 0 || couponCount === "-1"
                    ? couponCount
                    : vehicleMaster[0]?.allowedUsersCount
                  : couponCount
              }
            />
            <Input
              type="number"
              item={"couponCount"}
              value={id ? vehicleMaster[0]?.couponCount : "-1"}
              setValueChange={setCouponCount}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"isCouponActive"}
              options={["active", "inActive"]}
              value={id ? vehicleMaster[0]?.isCouponActive : "active"}
            />
          </div>
        </>
      </div>
      <button
        className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <Spinner message={"uploading"} />
        ) : id ? (
          "Update"
        ) : (
          "Add New"
        )}
      </button>
    </form>
  );
};

export default PlanForm;
