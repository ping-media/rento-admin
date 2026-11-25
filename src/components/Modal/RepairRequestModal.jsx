import ModalWrapper from "../Modal/ModalWrapper";
import ManagerSelect from "../InputAndDropdown/ManagerSelect";
import useRepairRequest from "../../hooks/use-repair-request";
import RepairCostItems from "./_components/RepairCostItems";
import RepairPhotos from "./_components/RepairPhotos";
import RepairActions from "./_components/RepairActions";
import {
  bookingDetailsPath,
  INPUT_CLS,
  personName,
} from "../../utils/maintenance";
import { format, parse } from "date-fns";
import RepairTimeline from "./_components/RepairTimeline";
import { Link } from "react-router-dom";
import { formatNumber } from "../../utils";

const formatBlockDate = (iso) => {
  if (!iso) return "--";
  const d = parse(iso.slice(0, 16), "yyyy-MM-dd'T'HH:mm", new Date());
  return isNaN(d) ? "--" : format(d, "MMM d, yyyy, hh:mm a");
};

const RepairRequestModal = ({ requestId, onClose, onChanged }) => {
  const r = useRepairRequest({ requestId, onChanged });
  const {
    detail,
    loading,
    status,
    editable,
    edit,
    setEdit,
    isAdmin,
    isBooking,
  } = r;

  return (
    <ModalWrapper
      active
      onClose={onClose}
      size="2xl"
      position="responsive"
      zIndexClass="z-50"
      className="text-left"
      title={
        <span className="text-theme text-lg">
          Repair / Service
          {status && (
            <span className="ml-2 text-xs border border-theme rounded-full px-2 py-0.5 uppercase align-middle">
              {status.replace("_", " ")}
            </span>
          )}
        </span>
      }
    >
      <div className="p-4 pt-0 flex flex-col gap-3 text-sm">
        <div className="lg:max-h-[32rem] 2xl:max-h-[36rem] overflow-y-scroll">
          {!detail && loading && <RepairSkeleton />}

          {detail && (
            <>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 border rounded-md p-2 mb-2.5">
                <div>
                  <span className="text-gray-500">Vehicle: </span>
                  <b className="uppercase">
                    {detail.vehicleTableId?.vehicleNumber}
                  </b>
                </div>
                <div>
                  <span className="text-gray-500">Type: </span>
                  <b className="capitalize">{detail.type.replace("_", " ")}</b>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Problem: </span>
                  {detail.problemDescription}
                </div>
                {isBooking && (
                  <div className="col-span-2">
                    <span className="text-gray-500">
                      Meter reading before service:{" "}
                    </span>
                    <b>
                      {formatNumber(
                        Number(
                          detail.serviceReadings?.readingBeforeService ?? 0,
                        ),
                      )}{" "}
                      km
                    </b>
                  </div>
                )}
                {isBooking && detail.bookingId && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Booking: </span>
                    <Link
                      to={bookingDetailsPath(
                        `${detail.bookingId._id}_${detail.bookingId.bookingId}`,
                      )}
                      className="text-theme underline font-medium"
                    >
                      #{detail.bookingId.bookingId}
                    </Link>
                  </div>
                )}
                {detail.rejectionNote && status === "in_progress" && (
                  <div className="col-span-2 text-red-600">
                    Sent back: {detail.rejectionNote}
                  </div>
                )}
              </div>

              {isBooking && (
                <div className="bg-slate-100 p-2 my-2 rounded-md">
                  <p className="text-xs text-gray-500 font-medium">
                    <span className="font-semibold text-theme">Note:</span> If
                    the repair has no meter-related issue (for example a brake
                    cable or spark plug), keep the same reading as before
                    service. Change it only if the odometer was faulty or
                    replaced.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-2.5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium">Mechanic (manager)</label>
                  {editable && isAdmin ? (
                    <ManagerSelect
                      value={edit.mechanicId}
                      onChange={(v) =>
                        setEdit((p) => ({ ...p, mechanicId: v }))
                      }
                      placeholder="Select manager"
                    />
                  ) : (
                    <input
                      className="px-4 py-3 border rounded-md capitalize read-only:bg-gray-50 read-only:cursor-not-allowed"
                      value={personName(detail.mechanicId)}
                      readOnly
                    />
                  )}
                </div>
                {isBooking ? (
                  <div className="flex flex-col gap-1.5">
                    <label className="font-medium">
                      Meter reading after service (km){editable ? " *" : ""}
                    </label>
                    {editable ? (
                      <input
                        type="number"
                        min="0"
                        className={INPUT_CLS}
                        value={edit.readingAfterService}
                        onChange={(e) =>
                          setEdit((p) => ({
                            ...p,
                            readingAfterService: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <input
                        className="px-4 py-3 border rounded-md capitalize read-only:bg-gray-50 read-only:cursor-not-allowed"
                        value={
                          detail.serviceReadings?.readingAfterService ?? "--"
                        }
                        readOnly
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label className="font-medium">Odometer (km)</label>
                    {editable ? (
                      <input
                        type="number"
                        min="0"
                        className={INPUT_CLS}
                        value={edit.odometerReading}
                        onChange={(e) =>
                          setEdit((p) => ({
                            ...p,
                            odometerReading: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <input
                        className="px-4 py-3 border rounded-md capitalize read-only:bg-gray-50 read-only:cursor-not-allowed"
                        value={detail.odometerReading ?? "--"}
                        readOnly
                      />
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="font-medium">Notes</label>
                  {editable ? (
                    <textarea
                      rows={2}
                      className={`${INPUT_CLS} resize-none`}
                      value={edit.mechanicNotes}
                      onChange={(e) =>
                        setEdit((p) => ({
                          ...p,
                          mechanicNotes: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div>{detail.mechanicNotes || "--"}</div>
                  )}
                </div>
              </div>

              <RepairCostItems
                editable={editable}
                items={edit.costItems}
                savedItems={detail.costItems}
                total={editable ? r.editTotal : detail.totalCost}
                onAdd={r.addCost}
                onChange={r.setCost}
                onRemove={r.removeCost}
              />

              <RepairPhotos
                editable={editable}
                requestId={detail._id}
                saved={detail.attachments}
                pending={edit.newAttachments}
                onUploaded={r.handlePhotoUploaded}
                onRemovePending={r.removePendingPhoto}
                setUploading={r.setUploading}
              />

              {editable && detail.maintenanceVehicleId && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium">
                    Extend maintenance end (optional, current:{" "}
                    {formatBlockDate(detail.maintenanceVehicleId?.endDate)})
                  </label>
                  <input
                    type="datetime-local"
                    className={INPUT_CLS}
                    value={edit.newEndDate}
                    onChange={(e) =>
                      setEdit((p) => ({ ...p, newEndDate: e.target.value }))
                    }
                  />
                </div>
              )}

              <RepairTimeline items={detail.timeline} />

              {/* {status === "approved" && (
                <RepairAdjustment
                  saving={r.saving}
                  onSubmit={r.handleAdjustment}
                />
              )} */}

              <RepairActions
                isBooking={isBooking}
                status={status}
                editable={editable}
                saving={r.saving}
                uploading={r.uploading}
                showReject={r.showReject}
                setShowReject={r.setShowReject}
                rejectNote={r.rejectNote}
                setRejectNote={r.setRejectNote}
                onSave={r.handleSave}
                onReject={r.handleReject}
                onApprove={r.handleApprove}
                onCancel={r.handleCancel}
              />
            </>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default RepairRequestModal;

const Bar = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded ${className}`} />
);

const RepairSkeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse">
    <div className="grid grid-cols-2 gap-2 border rounded-md p-2">
      <Bar className="h-4 w-3/4" />
      <Bar className="h-4 w-2/3" />
      <Bar className="h-4 col-span-2" />
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col gap-1.5">
        <Bar className="h-4 w-24" />
        <Bar className="h-10 w-full" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Bar className="h-4 w-24" />
        <Bar className="h-10 w-full" />
      </div>
      <div className="col-span-2 flex flex-col gap-1.5">
        <Bar className="h-4 w-16" />
        <Bar className="h-16 w-full" />
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <Bar className="h-4 w-40" />
      <Bar className="h-9 w-full" />
      <Bar className="h-9 w-full" />
    </div>

    <div className="flex gap-2">
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} className="h-16 w-16" />
      ))}
    </div>

    <div className="flex justify-end gap-2 border-t pt-3">
      <Bar className="h-9 w-24" />
      <Bar className="h-9 w-32" />
    </div>
  </div>
);
