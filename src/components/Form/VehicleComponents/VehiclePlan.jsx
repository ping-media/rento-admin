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
  const [checkedPlans, setCheckedPlans] = useState({});
  const [planPrices, setPlanPrices] = useState({});
  const [firstLoad, setFirstLoad] = useState(false);
  const newPlanPrice = useDebounce(planPrices, 500);
  const dispatch = useDispatch();

  const handleCheckboxChange = (id) => {
    setCheckedPlans((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEditPlanId = (id, e) => {
    const value = typeof e === "number" ? e : Number(e.target.value);
    setPlanPrices((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Respond to changes in checkedPlans state
  useEffect(() => {
    if (!firstLoad) return;
    // console.log(collectedData);
    Object.keys(checkedPlans).forEach((id) => {
      const isChecked = checkedPlans[id];
      const existingPlan = tempIds.find((plan) => plan._id === id);
      const otherPlanDetails = collectedData.AllPlanDataId.find(
        (plan) => plan._id === id
      );
      if (isChecked && !existingPlan) {
        dispatch(
          addTempIds([
            {
              _id: id,
              planPrice: planPrices[id] || 0,
              planName: otherPlanDetails?.planName,
              planDuration: otherPlanDetails?.planDuration,
            },
          ])
        );
      } else if (!isChecked && existingPlan) {
        dispatch(removeLastTempId());
      }
    });
  }, [checkedPlans, tempIds, planPrices, dispatch]);

  // Update price for the selected plan
  useEffect(() => {
    if (newPlanPrice) {
      Object.keys(newPlanPrice).forEach((id) => {
        if (checkedPlans[id]) {
          dispatch(updateTempId({ id, planPrice: newPlanPrice[id] }));
        }
      });
    }
  }, [newPlanPrice, checkedPlans, dispatch]);

  // Initialize prefilled data
  useEffect(() => {
    if (data && data.length > 0) {
      const initialCheckedPlans = {};
      const initialPlanPrices = {};

      data.forEach((item) => {
        initialCheckedPlans[item._id] = true;
        initialPlanPrices[item._id] = item.planPrice || 0;
      });

      setCheckedPlans(initialCheckedPlans);
      setPlanPrices(initialPlanPrices);
      dispatch(addTempIdsAll(data));
    }
    setFirstLoad(true);
  }, [data, dispatch]);

  // Prevent increment and decrement via arrow keys
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 my-2.5">
      {collectedData?.AllPlanDataId?.length > 0 ? (
        collectedData?.AllPlanDataId.map((plan) => (
          <div className="w-[48%]" key={plan?._id}>
            <label
              className="inline-flex items-center whitespace-nowrap py-1.5 transition-all duration-300 ease-in-out"
              htmlFor={`checkbox_${plan?._id}`}
            >
              <input
                id={`checkbox_${plan?._id}`}
                type="checkbox"
                className="w-4 h-4 accent-red-600"
                onChange={() => handleCheckboxChange(plan?._id)}
                checked={checkedPlans[plan?._id] || false}
              />
              <span className="ml-2">{plan?.planName}</span>
            </label>

            <input
              type="number"
              className={`rounded-md px-4 py-1.5 ring-1 ring-inset ring-gray-400 focus:text-gray-800 outline-none ml-2 ${
                checkedPlans[plan?._id] ? "" : "invisible"
              }`}
              placeholder="Enter Plan Price"
              value={planPrices[plan?._id] || ""}
              onChange={(e) => handleEditPlanId(plan?._id, e)}
              onKeyDown={handleKeyDown}
            />
          </div>
        ))
      ) : (
        <p className="text-gray-400 italic capitalize">No package found.</p>
      )}
    </div>
  );
};

export default VehiclePlan;
