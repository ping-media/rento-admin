import React, { useCallback, useEffect, useState } from "react";
import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
import { useDispatch } from "react-redux";
import { getData } from "../../../Data/index";
import { BtnSkeleton } from "../../../components/Skeleton/ButtonSkeleton";

// 30-day plan searches 31 days when the start month has 31 days
const getSearchDuration = (planDuration, startDate) => {
  const days = Number(planDuration) || 1;
  if (days !== 30 || !startDate) return days;

  const d = new Date(startDate);
  if (isNaN(d.getTime())) return days;

  // ISO strings are IST wall-clock with a fake "Z", so read them with UTC getters.
  // Date objects (e.g. from a date picker) are read with local getters.
  const isString = typeof startDate === "string";
  const year = isString ? d.getUTCFullYear() : d.getFullYear();
  const month = isString ? d.getUTCMonth() : d.getMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  return daysInMonth === 31 ? 31 : 30;
};

export const BookingPlan = ({ duration, setDuration, startDate }) => {
  const [plans, setPlans] = useState([
    { _id: "default", planName: "1 day", planDuration: 1 },
  ]);
  const [plansLoading, setPlansLoading] = useState(true);
  const dispatch = useDispatch();

  //   fetching plans
  const fetchData = useCallback(async () => {
    setPlansLoading(true);
    try {
      let endpoint = `/getPlanData`;
      const response = await getData(endpoint);

      if (response?.status === 200) {
        const defaultPlan = {
          _id: "default",
          planName: "1 day",
          planDuration: 1,
        };
        const dbPlans = response?.data ?? [];
        setPlans([defaultPlan, ...dbPlans]);
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setPlansLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full my-2">
      <h2 className="text-theme-dark font-semibold text-md lg:text-xl uppercase">
        Packages
      </h2>

      {plansLoading ? (
        <div className="flex items-center gap-2.5 mt-2.5">
          <BtnSkeleton />
        </div>
      ) : (
        <div className="flex items-center gap-2.5 overflow-x-auto mt-2.5">
          {plans?.length > 1 ? (
            <>
              {plans.map((p) => {
                const label = p.planName.replace(/\s*package\s*/i, "").trim();
                return (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() =>
                      setDuration(getSearchDuration(p.planDuration, startDate))
                    }
                    className={`border rounded-md border-gray-400 hover:border-none hover:bg-theme hover:text-white transition-colors duration-200 ease-in-out min-w-20 flex-shrink-0 py-1.5 ${duration === getSearchDuration(p.planDuration, startDate) ? "bg-theme text-white border-none" : ""}`}
                    // onClick={() => setDuration(Number(p.planDuration) || 1)}
                    // className={`border rounded-md border-gray-400 hover:border-none hover:bg-theme hover:text-white transition-colors duration-200 ease-in-out min-w-20 flex-shrink-0 py-1.5 ${duration === p.planDuration ? "bg-theme text-white border-none" : ""}`}
                  >
                    {label}
                  </button>
                );
              })}
            </>
          ) : (
            <p>No Packages Found.</p>
          )}
        </div>
      )}
    </div>
  );
};
