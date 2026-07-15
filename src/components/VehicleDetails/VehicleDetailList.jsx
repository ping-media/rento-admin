import React from "react";
import { formatPrice } from "../../utils";
// const VehiclePlanModal = lazy(
//   () => import("../../components/Modal/VehiclePlanModal"),
// );

const VEHICLE_FIELD_CONFIG = [
  { key: "vehicleNumber", label: "Vehicle Number" },
  { key: "vehicleName", label: "Vehicle Name" },
  { key: "vehicleModel", label: "Vehicle Model" },
  { key: "stationName", label: "Station Name" },
  { key: "vehicleStatus", label: "Vehicle Status" },
  // { key: "vehicleBookingStatus", label: "Vehicle Booking Status" },
  { key: "refundableDeposit", label: "Security Deposit", isPrice: true },
  { key: "lateFee", label: "Late Fee", isPrice: true },
  { key: "speedLimit", label: "Speed Limit" },
  { key: "freeKms", label: "Free Kms" },
  { key: "extraKmsCharges", label: "Extra Kms", isPrice: true },
  { key: "lastServiceDate", label: "Last Service Date", isDate: true },
  { key: "lastMeterReading", label: "Last Metre Reading" },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "--";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const VehicleDetailList = ({ vehicle }) => {
  // const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  // const [selectedPlans, setSelectedPlans] = useState([]);
  if (Object.keys(vehicle) === 0) return null;

  const visibleFields = VEHICLE_FIELD_CONFIG.filter(
    ({ key }) => vehicle[key] !== undefined && vehicle[key] !== null,
  );

  // const excludedKeys = [
  //   "id",
  //   "_v",
  //   "At",
  //   "Id",
  //   "Image",
  //   "maintenance",
  //   "isUnderMaintenance",
  //   "currentBooking",
  // ];
  // const filteredEntries = useMemo(() => {
  //   return Object.entries(vehicle).filter(
  //     ([key]) => !excludedKeys.some((exclude) => key.includes(exclude)),
  //   );
  // }, [vehicle]);

  // const renderValue = useCallback((key, value) => {
  //   const isPriceField = key.includes("Cost") || key.includes("Charges");

  //   if (typeof value !== "object") {
  //     if (isPriceField) {
  //       return `₹${formatPrice(Number(value))}`;
  //     }
  //     return value;
  //   }

  //   if (key === "vehiclePlan") {
  //     const weekDayPlan = {
  //       _id: "week-day-plan",
  //       planName: "Weekday Package(Mon-Fri)",
  //       planDuration: 1,
  //       kmLimit: vehicle?.freeKms ?? 0,
  //       planPrice: vehicle?.perDayCost ?? 0,
  //     };

  //     const weekendPlan = {
  //       _id: "weekend-day-plan",
  //       planName: "Weekend Package(Sat,Sun)",
  //       planDuration: 1,
  //       kmLimit: vehicle?.freeKms ?? 0,
  //       planPrice: vehicle?.weekendCost ?? "--",
  //     };

  //     const updatedValue = [weekDayPlan, weekendPlan, ...(value || [])];
  //     return (
  //       <button
  //         onClick={() => {
  //           setSelectedPlans(updatedValue);
  //           setIsPlanModalOpen(true);
  //         }}
  //         className="underline underline-offset-4 font-medium"
  //       >
  //         View Plans
  //       </button>
  //     );
  //   }

  //   return `${value?.length || 0} applied`;
  // }, []);

  // const ModalTitle = `${vehicle.vehicleBrand} ${vehicle.vehicleName}`;

  return (
    <div className="border-2 p-2 border-gray-300 rounded-lg">
      {visibleFields.map(({ key, label, isPrice, isDate }, index) => {
        const value = vehicle[key];
        let displayValue = value;
        if (isDate) displayValue = formatDate(value);
        else if (isPrice) displayValue = `₹${formatPrice(Number(value))}`;

        return (
          <div
            key={key}
            className={`flex justify-between items-center text-sm py-1.5 ${
              index !== visibleFields.length - 1 ? "border-b-2" : ""
            } border-gray-300`}
          >
            <span className="font-medium capitalize">{label}</span>
            <span className="text-gray-500 capitalize">
              {String(displayValue)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default VehicleDetailList;

// return (
//   <>
//     <Suspense fallback={null}>
//       <VehiclePlanModal
//         isPlanModalActive={isPlanModalOpen}
//         onClose={setIsPlanModalOpen}
//         planData={selectedPlans ?? []}
//         title={ModalTitle}
//         image={vehicle?.vehicleImage ?? ""}
//       />
//     </Suspense>

//     <div className="border-2 p-2 border-gray-300 rounded-lg">
//       {filteredEntries.map(([key, value], index) => (
//         <div
//           key={key}
//           className={`flex justify-between items-center text-sm py-1.5 ${
//             index !== filteredEntries.length - 1 ? "border-b-2" : ""
//           } border-gray-300`}
//         >
//           <span className="font-medium capitalize">
//             {camelCaseToSpaceSeparated(
//               key === "perDayCost" ? "Weekday Cost" : key,
//             )}
//           </span>

//           <span className="text-gray-500 capitalize">
//             {renderValue(key, value)}
//           </span>
//         </div>
//       ))}
//     </div>
//   </>
// );
