import { Grid, h } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const DataTableComponent = ({ Data }) => {
  const { limit } = useSelector((state) => state.pagination);
  const tableRef = useRef(null);

  useEffect(() => {
    if (Data && Data.length === 0) return;

    if (Data) {
      const header = Object.keys(Data[0]);
      let filteredHeader = header.filter(
        (key) =>
          ![
            "_id",
            "vehicleMasterId",
            "vehicleTableId",
            "stationMasterUserId",
            "vehicleBasic",
            "stationId",
            "createdAt",
            "updatedAt",
            "__v",
            "locationId",
            "freeKms",
            "extraKmsCharges",
            "vehicleModel",
            "vehicleColor",
            "refundableDeposit",
            "lateFee",
            "speedLimit",
            "kmsRun",
            "condition",
            "vehiclePlan",
            "userId",
          ].includes(key)
      );

      const grid = new Grid({
        columns: filteredHeader.map((col) => ({
          name: col,
          formatter: (cell) => {
            if (typeof cell === "string" && cell.startsWith("http")) {
              // Render image for URL
              return h("img", {
                src: cell,
                class: "w-28 h-20 object-contain",
              });
            }
            return cell;
          },
        })),
        data: Data.map((row) => filteredHeader.map((key) => row[key])),
        search: true,
        sort: true,
        pagination: {
          limit: limit,
        },
      }).render(tableRef.current);

      console.log(grid);
    }
  }, [Data, limit]);

  return (
    <>
      <div className="mt-5" ref={tableRef}></div>
    </>
  );
};

export default DataTableComponent;
