import React, { useCallback, useEffect, useState } from "react";
import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
import { useDispatch } from "react-redux";
import { getData } from "../../../Data/index";
import { BtnSkeleton } from "../../../components/Skeleton/ButtonSkeleton";

export const BookingPlan = ({ duration, setDuration }) => {
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
        setPlans([defaultPlan, ...response?.data]);
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
                    onClick={() => setDuration(p.planDuration ?? 1)}
                    className={`border rounded-md border-gray-400 hover:border-none hover:bg-theme hover:text-white transition-colors duration-200 ease-in-out min-w-20 flex-shrink-0 py-1.5 ${duration === p.planDuration ? "bg-theme text-white border-none" : ""}`}
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
