import Spinner from "../Spinner/Spinner";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tableIcons } from "../../Data/Icons";
import {
  formatFullDateAndTime,
  formatLocalTimeIntoISO,
  millisecToReadableFormat,
} from "../../utils/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { getData, postData } from "../../Data/index";
import {
  addMaintenanceData,
  resetMaintenanceData,
  startMaintenanceLoading,
} from "../../Redux/VehicleSlice/VehicleSlice";
import RepairRequestModal from "../Modal/RepairRequestModal";
import useStationScope from "../../hooks/use-station-scope";
import SimpleTable from "./SimpleTable";
import ModalWrapper from "../Modal/ModalWrapper";

const formatDateTimeIN = (timestring) => {
  if (!timestring) return { date: "NA", time: "NA" };
  const fullDateTime = formatFullDateAndTime(timestring);

  const date = `${fullDateTime.split(",")[0].trim()}, ${fullDateTime.split(",")[1].trim()}`;
  const time = `${fullDateTime.split(",")[2].trim()}`;

  return { date, time };
};

const MaintenanceTable = ({ isMaintenanceAdd }) => {
  const { vehicleMaster, loading, maintenanceData } = useSelector(
    (state) => state.vehicles,
  );
  const { withStation } = useStationScope();
  const [isActive, setIsActive] = useState(false);
  const [viewData, setViewData] = useState(null);
  const { token } = useSelector((state) => state.user);
  const [modifyingVehicleId, setModifyingVehicleId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  const showRecordsOptions = [25, 50, 100, 200, 500];
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const dispatch = useDispatch();

  const [requestsByBlock, setRequestsByBlock] = useState({});
  const [repairModal, setRepairModal] = useState({ open: false, block: null });
  const OPEN_REPAIR = ["pending", "in_progress", "completed"];

  const fetchRepairRequests = async () => {
    try {
      const res = await getData(
        withStation(
          `/maintenance-request/list?vehicleTableId=${vehicleMaster[0]?._id}&limit=100`,
        ),
        token,
      );
      const map = {};
      if (res?.status === 200) {
        // list is newest first, so keep the newest request per block
        res.data.forEach((r) => {
          if (!map[r.maintenanceVehicleId]) map[r.maintenanceVehicleId] = r;
        });
      }
      setRequestsByBlock(map);
    } catch (e) {
      setRequestsByBlock({});
    }
  };

  const fetchMaintenanceData = async () => {
    dispatch(startMaintenanceLoading());
    const response = await getData(
      `/maintenanceVehicle?vehicleTableId=${vehicleMaster[0]?._id}&page=${currentPage}&limit=${limit}`,
      token,
    );
    if (response?.status === 200) {
      dispatch(addMaintenanceData(response));
    } else {
      dispatch(resetMaintenanceData());
    }
    await fetchRepairRequests();
  };

  // maintenanceData
  useEffect(() => {
    if (!loading && vehicleMaster?.length > 0) {
      (async () => {
        await fetchMaintenanceData();
      })();
    }

    return () => dispatch(resetMaintenanceData());
  }, [loading, vehicleMaster, limit, currentPage, isMaintenanceAdd]);

  const maintenanceColumns = [
    {
      key: "startDate",
      label: "Starting Date",
      render: (item) => {
        const { date, time } = formatDateTimeIN(item?.startDate);
        return (
          <>
            {date}
            <br />
            {time}
          </>
        );
      },
    },
    {
      key: "endDate",
      label: "Ending Date",
      render: (item) => {
        const endDate = item?.actualEndDate || item?.endDate;
        const { date, time } = formatDateTimeIN(endDate);

        return (
          <>
            {date}
            <br />
            {time}
          </>
        );
      },
    },
    {
      key: "reason",
      label: "Reason",
      tdClassName: "max-w-24 truncate capitalize",
    },
    {
      key: "action",
      label: "Action",
      tdClassName: "whitespace-nowrap",
      render: (item) => {
        const repairReq = requestsByBlock[item?._id];
        const hasOpenRepair =
          !!repairReq && OPEN_REPAIR.includes(repairReq.status);

        return (
          <div className="flex items-center gap-1">
            {/* View button */}
            <button
              type="button"
              className="p-1 rounded-full bg-white hover:text-white hover:bg-theme transition-all duration-500 flex items-center"
              onClick={() => handleView(item?._id)}
              title="View details"
            >
              {tableIcons?.eyeOpen}
            </button>

            {/* Repair button */}
            {repairReq && (
              <button
                type="button"
                className="p-1 rounded-full bg-white hover:text-white hover:bg-theme transition-all duration-500 flex items-center"
                onClick={() =>
                  setRepairModal({
                    open: true,
                    block: item,
                  })
                }
                title="Repair / service details"
              >
                {tableIcons?.settings}
              </button>
            )}

            {/* Lock / Unlock button */}
            <button
              type="button"
              className={`p-1 rounded-full bg-white group transition-all duration-500 flex items-center ${
                !item?.isActive ||
                modifyingVehicleId === item?._id ||
                hasOpenRepair
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-white hover:bg-theme"
              }`}
              onClick={(e) => {
                e.stopPropagation();

                if (
                  !item?.isActive ||
                  modifyingVehicleId === item?._id ||
                  hasOpenRepair
                )
                  return;

                setConfirmModal({
                  open: true,
                  id: item?._id,
                });
              }}
              disabled={
                !item?.isActive ||
                modifyingVehicleId === item?._id ||
                hasOpenRepair
              }
              title={
                hasOpenRepair
                  ? "Complete and approve (or cancel) the repair request first"
                  : item?.isActive
                    ? "Vehicle currently under maintenance"
                    : "Unblock vehicle"
              }
            >
              {modifyingVehicleId === item?._id ? (
                <Spinner />
              ) : item?.isActive ? (
                tableIcons?.lock
              ) : (
                tableIcons?.unBlock
              )}
            </button>
          </div>
        );
      },
    },
  ];

  // unblock maintenance

  const unblockVehicles = async (id) => {
    const currentDateAndTime = new Date();
    const endDate = formatLocalTimeIntoISO(currentDateAndTime);

    const hasActiveMaintenance = maintenanceData?.data?.some((m) => {
      return m._id === id && m.isActive === true; // use backend flag
    });

    if (!hasActiveMaintenance)
      return handleAsyncError(dispatch, "No Active Maintenance found");

    const data = {
      maintenanceId: id,
      vehicleTableId: vehicleMaster[0]?._id,
      endDate: endDate,
    };

    try {
      setModifyingVehicleId(id);
      const response = await postData("/maintenanceVehicle", data, token);
      if (response.success === true) {
        handleAsyncError(dispatch, response?.message, "success");
        await fetchMaintenanceData();
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(
        dispatch,
        "Unable to update maintenance records! try again.",
      );
    } finally {
      setModifyingVehicleId(null);
    }
  };

  const handleView = (id) => {
    const data = maintenanceData?.data?.find((d) => d._id === id);
    if (data) {
      setIsActive(true);
      setViewData(data);
    }
  };

  return (
    <>
      {repairModal.open && (
        <RepairRequestModal
          requestId={requestsByBlock[repairModal.block?._id]?._id}
          onClose={() => setRepairModal({ open: false, block: null })}
          onChanged={fetchMaintenanceData}
        />
      )}

      <ModalWrapper
        active={isActive && viewData !== null}
        onClose={() => setIsActive(false)}
        title="Maintenance Details"
        size="xl"
        position="responsive"
      >
        <div className="flex flex-col gap-3 p-4">
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <tbody className="divide-y">
                <tr>
                  <td className="px-3 py-2.5 font-semibold text-gray-700 whitespace-nowrap">
                    Start
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">
                    {viewData?.startDate
                      ? formatFullDateAndTime(viewData.startDate)
                      : "--"}
                  </td>
                </tr>

                <tr>
                  <td className="px-3 py-2.5 font-semibold text-gray-700 whitespace-nowrap">
                    End
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">
                    {viewData?.actualEndDate
                      ? formatFullDateAndTime(viewData.actualEndDate)
                      : viewData?.endDate
                        ? formatFullDateAndTime(viewData.endDate)
                        : "--"}
                  </td>
                </tr>

                <tr>
                  <td className="px-3 py-2.5 font-semibold text-gray-700 whitespace-nowrap">
                    Create Date
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">
                    {viewData?.createDate
                      ? millisecToReadableFormat(viewData.createDate)
                      : "--"}
                  </td>
                </tr>

                <tr>
                  <td className="px-3 py-2.5 font-semibold text-gray-700 whitespace-nowrap">
                    Finish Date
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">
                    {viewData?.actualEndDate
                      ? formatFullDateAndTime(viewData.endDate)
                      : "--"}
                  </td>
                </tr>

                <tr>
                  <td className="px-3 py-2.5 font-semibold text-gray-700 whitespace-nowrap">
                    Created By
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">
                    {viewData?.createdBy || "--"}
                  </td>
                </tr>

                <tr>
                  <td className="px-3 py-2.5 font-semibold text-gray-700 whitespace-nowrap">
                    Finished By
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">
                    {viewData?.unblockedBy || "--"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-sm">
            <span className="font-semibold">Reason:</span>

            <div className="mt-1 max-h-40 overflow-y-auto rounded-md border bg-gray-50 p-2">
              <span className="capitalize break-all whitespace-pre-wrap">
                {viewData?.reason || "--"}
              </span>
            </div>
          </div>
        </div>
      </ModalWrapper>

      {/* Confirm Unblock Modal */}
      <ModalWrapper
        active={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, id: null })}
        title="Unblock Vehicle"
        size="sm"
        position="center"
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to unblock this vehicle from maintenance?
        </p>
        <div className="flex justify-end gap-3 mt-2">
          <button
            className="px-4 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
            onClick={() => setConfirmModal({ open: false, id: null })}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1.5 rounded-lg bg-theme text-white text-sm hover:opacity-90"
            onClick={() => {
              unblockVehicles(confirmModal.id);
              setConfirmModal({ open: false, id: null });
            }}
          >
            Confirm
          </button>
        </div>
      </ModalWrapper>

      <SimpleTable
        columns={maintenanceColumns}
        rows={maintenanceData?.data || []}
        loading={loading || maintenanceData?.loading}
        rowKey={(item) => item._id}
        showSerial={false}
        pagination={
          maintenanceData?.pagination?.limit >= 10 &&
          maintenanceData?.data?.length > 0
            ? {
                page: currentPage,
                limit,
                totalPages: maintenanceData?.pagination?.totalPages,
                setPage: setCurrentPage,
                setLimit,
                options: showRecordsOptions,
              }
            : null
        }
      />
    </>
  );
};

export default MaintenanceTable;
