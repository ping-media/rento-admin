import React, { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { camelCaseToSpaceSeparated, formatPrice } from "../../utils";
const VehiclePlanModal = lazy(
  () => import("../../components/Modal/VehiclePlanModal"),
);

const VehicleDetailList = ({ vehicle }) => {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState([]);

  if (Object.keys(vehicle) === 0) return null;

  const excludedKeys = [
    "id",
    "_v",
    "At",
    "Id",
    "Image",
    "maintenance",
    "isUnderMaintenance",
  ];
  const filteredEntries = useMemo(() => {
    return Object.entries(vehicle).filter(
      ([key]) => !excludedKeys.some((exclude) => key.includes(exclude)),
    );
  }, [vehicle]);

  const renderValue = useCallback((key, value) => {
    const isPriceField = key.includes("Cost") || key.includes("Charges");

    if (typeof value !== "object") {
      if (isPriceField) {
        return `₹${formatPrice(Number(value))}`;
      }
      return value;
    }

    if (key === "vehiclePlan") {
      const oneDayPlan = {
        _id: "one-day-plan",
        planName: "1 Day Package",
        planDuration: 1,
        kmLimit: vehicle?.freeKms ?? 0,
        planPrice: vehicle?.perDayCost ?? 0,
      };

      const updatedValue = [oneDayPlan, ...(value || [])];
      return (
        <button
          onClick={() => {
            setSelectedPlans(updatedValue);
            setIsPlanModalOpen(true);
          }}
          className="underline underline-offset-4 font-medium"
        >
          View Plans
        </button>
      );
    }

    return `${value?.length || 0} applied`;
  }, []);

  const ModalTitle = `${vehicle.vehicleBrand} ${vehicle.vehicleName}`;

  return (
    <>
      <Suspense fallback={null}>
        <VehiclePlanModal
          isPlanModalActive={isPlanModalOpen}
          onClose={setIsPlanModalOpen}
          planData={selectedPlans ?? []}
          title={ModalTitle}
          image={vehicle?.vehicleImage ?? ""}
        />
      </Suspense>

      <div className="border-2 p-2 border-gray-300 rounded-lg">
        {filteredEntries.map(([key, value], index) => (
          <div
            key={key}
            className={`flex justify-between items-center text-sm py-1.5 ${
              index !== filteredEntries.length - 1 ? "border-b-2" : ""
            } border-gray-300`}
          >
            <span className="font-medium capitalize">
              {camelCaseToSpaceSeparated(key)}
            </span>

            <span className="text-gray-500 capitalize">
              {renderValue(key, value)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default VehicleDetailList;
