import { useDispatch, useSelector } from "react-redux";
import {
  addTempIds,
  addTempIdsAll,
  removeLastTempId,
  updateTempId,
} from "../../../Redux/VehicleSlice/VehicleSlice";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../utils/Helper/debounce";

const VehiclePlan = ({ collectedData, data }) => {
  const { tempIds } = useSelector((state) => state.vehicles);
  const [inputPlanPrice, setInputPlanPrice] = useState(0);
  const [inputSelectedId, setInputSelectedId] = useState("");
  const [checkedPlans, setCheckedPlans] = useState({});
  const newPlanPrice = useDebounce(inputPlanPrice, 500);
  const dispatch = useDispatch();

  const handleCheckboxChange = (id) => {
    setCheckedPlans((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEditPlanId = (id, e) => {
    setInputPlanPrice(typeof e === "number" ? e : e.target.value);
    setInputSelectedId(id);
  };

  // Respond to changes in checkedPlans state
  useEffect(() => {
    Object.keys(checkedPlans).forEach((id) => {
      const isChecked = checkedPlans[id];
      const existingPlan = tempIds.find((plan) => plan._id === id);

      if (isChecked && !existingPlan) {
        // Add new plan if it doesn't exist
        dispatch(addTempIds([{ _id: id, planPrice: inputPlanPrice || 0 }]));
      } else if (!isChecked && existingPlan) {
        // Remove plan if it exists and is unchecked
        dispatch(removeLastTempId());
      }
    });
  }, [checkedPlans, tempIds, inputPlanPrice, dispatch]);

  // Update price for the selected plan
  useEffect(() => {
    if (newPlanPrice && inputSelectedId) {
      dispatch(updateTempId({ id: inputSelectedId, planPrice: newPlanPrice }));
    }
  }, [newPlanPrice, inputSelectedId, dispatch]);

  //   this  happen when user edit the data
  useEffect(() => {
    if (data && data.length > 0) {
      dispatch(addTempIdsAll(data));
      data.map((item) => handleCheckboxChange(item?._id));
    }
  }, [data]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5 my-2.5">
        {collectedData && collectedData?.AllPlanDataId?.length > 0 ? (
          collectedData?.AllPlanDataId.map((plan, index) => (
            <div key={plan?._id}>
              <label
                className="inline-flex items-center whitespace-nowrap py-1.5 transition-all duration-300 ease-in-out"
                htmlFor={`checkbox_${plan?._id}`}
              >
                <input
                  id={`checkbox_${plan?._id}`}
                  type="checkbox"
                  className="w-4 h-4 accent-red-600"
                  onChange={() => handleCheckboxChange(plan?._id)}
                  checked={
                    data ? data[index]?._id : checkedPlans[plan?._id] || false
                  }
                />
                <span className="ml-2">{plan?.planName}</span>
              </label>

              <input
                type="number"
                className={`rounded-md px-4 py-1.5 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none ml-2 ${
                  (data && data[index]?._id) || checkedPlans[plan?._id]
                    ? ""
                    : "invisible"
                }`}
                placeholder="Enter Plan Price"
                value={data && data[index]?.planPrice}
                onChange={(e) => handleEditPlanId(plan?._id, e)}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic capitalize">No package found.</p>
        )}
      </div>
    </>
  );
};

export default VehiclePlan;
