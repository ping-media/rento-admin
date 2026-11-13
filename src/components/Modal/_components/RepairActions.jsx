import Spinner from "../../Spinner/Spinner";
import { INPUT_CLS } from "../../../utils/maintenance";

const RepairActions = ({
  isBooking,
  status,
  editable,
  saving,
  uploading,
  showReject,
  setShowReject,
  rejectNote,
  setRejectNote,
  onSave,
  onReject,
  onApprove,
  onCancel,
}) => {
  const busy = saving || uploading;
  return (
    <>
      {status === "completed" && showReject && (
        <div>
          <label className="font-medium">Reason for sending back *</label>
          <textarea
            rows={2}
            className={INPUT_CLS}
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-end border-t pt-3">
        {editable && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => onSave("in_progress")}
              className="px-4 py-1.5 rounded-md border border-theme text-theme"
            >
              Save
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onSave("completed")}
              className="px-4 py-1.5 rounded-md bg-theme text-white"
            >
              Mark Completed
            </button>
          </>
        )}

        {status === "completed" && (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={showReject ? onReject : () => setShowReject(true)}
              className="px-4 py-1.5 rounded-md border border-gray-400"
            >
              {showReject ? "Confirm Send Back" : "Send Back"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onApprove}
              className="px-4 py-1.5 rounded-md bg-green-600 text-white"
            >
              {isBooking ? "Approve" : "Approve & Unblock"}
            </button>
          </>
        )}

        {["pending", "in_progress", "completed"].includes(status) && (
          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="px-4 py-1.5 rounded-md border border-red-500 text-red-600"
          >
            Cancel Request
          </button>
        )}
        {saving && <Spinner />}
      </div>
    </>
  );
};

export default RepairActions;
