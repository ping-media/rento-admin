import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData, postData } from "../Data/index";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import { formatLocalTimeIntoISO } from "../utils/index";
import useStationScope from "./use-station-scope";

const initialEdit = {
  readingAfterService: "",
  mechanicId: "",
  mechanicNotes: "",
  odometerReading: "",
  costItems: [],
  newAttachments: [],
  newEndDate: "",
};

const useRepairRequest = ({ requestId, onChanged }) => {
  const dispatch = useDispatch();
  const { token, loggedInRole } = useSelector((state) => state.user);
  const { withStation, bodyScope } = useStationScope();
  const isAdmin = loggedInRole === "admin";

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(!!requestId);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [edit, setEdit] = useState(initialEdit);
  const [rejectNote, setRejectNote] = useState("");
  const [showReject, setShowReject] = useState(false);

  const status = detail?.status;
  const editable = status === "pending" || status === "in_progress";
  const isBooking = !!detail?.bookingId; // a vehicle on an ongoing ride, no maintenance block

  const loadDetail = async () => {
    if (!requestId) return;
    setLoading(true);
    try {
      const res = await getData(
        withStation(`/maintenance-request/${requestId}`),
        token,
      );
      if (res?.status === 200) {
        const d = res.data;
        setDetail(d);
        setEdit({
          readingAfterService:
            d.serviceReadings?.readingAfterService ??
            d.serviceReadings?.readingBeforeService ??
            "",
          mechanicId: d.mechanicId?._id || "",
          mechanicNotes: d.mechanicNotes || "",
          odometerReading: d.odometerReading ?? "",
          costItems: (d.costItems || []).map(
            ({ category, description, amount }) => ({
              category,
              description,
              amount,
            }),
          ),
          newAttachments: [],
          newEndDate: "",
        });
      } else {
        handleAsyncError(dispatch, res?.message);
      }
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [requestId]);

  // one helper for every POST action
  const call = async (url, body, after) => {
    try {
      setSaving(true);
      const res = await postData(url, { ...body, ...bodyScope }, token);
      if (res?.status === 200) {
        handleAsyncError(dispatch, res.message, "success");
        await after?.(res);
        onChanged?.();
      } else {
        handleAsyncError(dispatch, res?.message);
      }
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
    } finally {
      setSaving(false);
    }
  };

  // cost items
  const addCost = () =>
    setEdit((p) => ({
      ...p,
      costItems: [
        ...p.costItems,
        { category: "parts", description: "", amount: "" },
      ],
    }));
  const setCost = (idx, key, value) =>
    setEdit((p) => ({
      ...p,
      costItems: p.costItems.map((c, i) =>
        i === idx ? { ...c, [key]: value } : c,
      ),
    }));
  const removeCost = (idx) =>
    setEdit((p) => ({
      ...p,
      costItems: p.costItems.filter((_, i) => i !== idx),
    }));
  const editTotal = edit.costItems.reduce(
    (t, i) => t + (Number(i.amount) || 0),
    0,
  );

  // photos
  const handlePhotoUploaded = (url) => {
    if (!url) return;
    setEdit((p) => ({
      ...p,
      newAttachments: [...p.newAttachments, { url }],
    }));
  };

  const removePendingPhoto = async (idx) => {
    const photo = edit.newAttachments[idx];
    setEdit((p) => ({
      ...p,
      newAttachments: p.newAttachments.filter((_, i) => i !== idx),
    }));
    try {
      const fileName = new URL(photo.url).pathname.slice(1);
      await postData("/delete-image", { fileName }, token);
    } catch (e) {
      // already removed from the list, an orphan file in S3 is harmless
    }
  };

  // actions
  const handleSave = (nextStatus) => {
    for (const i of edit.costItems) {
      if (!i.description.trim() || i.amount === "" || Number(i.amount) < 0)
        return handleAsyncError(
          dispatch,
          "Every cost item needs a description and a valid amount",
        );
    }
    if (nextStatus === "completed" && isAdmin && !edit.mechanicId)
      return handleAsyncError(dispatch, "Assign a manager before completing");

    if (
      nextStatus === "completed" &&
      isBooking &&
      (edit.readingAfterService === "" || Number(edit.readingAfterService) < 0)
    )
      return handleAsyncError(
        dispatch,
        "Enter the meter reading after service",
      );

    call(
      "/maintenance-request/update",
      {
        requestId,
        status: nextStatus,
        mechanicId: edit.mechanicId || undefined,
        mechanicNotes: edit.mechanicNotes,
        odometerReading:
          !isBooking && edit.odometerReading !== ""
            ? Number(edit.odometerReading)
            : undefined,
        readingAfterService:
          isBooking && edit.readingAfterService !== ""
            ? Number(edit.readingAfterService)
            : undefined,
        costItems: edit.costItems.map((i) => ({
          ...i,
          amount: Number(i.amount),
        })),
        attachments: edit.newAttachments,
        newEndDate: edit.newEndDate
          ? formatLocalTimeIntoISO(edit.newEndDate)
          : undefined,
      },
      loadDetail,
    );
  };

  const handleApprove = () =>
    call("/maintenance-request/approve", { requestId }, loadDetail);

  const handleReject = () => {
    if (!rejectNote.trim())
      return handleAsyncError(dispatch, "Reason is required");
    call(
      "/maintenance-request/reject",
      { requestId, rejectionNote: rejectNote },
      async () => {
        setShowReject(false);
        setRejectNote("");
        await loadDetail();
      },
    );
  };

  const handleCancel = () => {
    if (
      window.confirm(
        isBooking
          ? "Cancel this service request? The ride and its readings stay as they are."
          : "Cancel this repair request? The vehicle stays blocked.",
      )
    )
      call("/maintenance-request/cancel", { requestId }, loadDetail);
  };

  const handleAdjustment = (form, onDone) => {
    const amount = Number(form.amount);
    if (!form.amount || !isFinite(amount) || amount === 0)
      return handleAsyncError(dispatch, "Enter a non-zero amount");
    if (!form.description.trim())
      return handleAsyncError(dispatch, "Description is required");

    call(
      "/maintenance-request/adjustment",
      {
        requestId,
        amount,
        category: form.category,
        description: form.description,
      },
      onDone,
    );
  };

  return {
    isAdmin,
    isBooking,
    detail,
    loading,
    saving,
    uploading,
    setUploading,
    status,
    editable,
    edit,
    setEdit,
    editTotal,
    addCost,
    setCost,
    removeCost,
    handlePhotoUploaded,
    removePendingPhoto,
    rejectNote,
    setRejectNote,
    showReject,
    setShowReject,
    handleSave,
    handleApprove,
    handleReject,
    handleCancel,
    handleAdjustment,
  };
};

export default useRepairRequest;
