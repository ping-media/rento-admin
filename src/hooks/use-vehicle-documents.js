import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getData,
  patchData,
  deleteData,
  postMultipleData,
} from "../Data/index";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import { ALLOWED_DOC_MIME, MAX_DOC_MB } from "../constants/vehicleDocuments";

// postMultipleData can return a string on failure, the others return an object
const getMessage = (res, fallback = "Something went wrong") =>
  typeof res === "string" ? res : res?.message || fallback;

const useVehicleDocuments = (vehicleTableId) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(!!vehicleTableId);
  const [busyId, setBusyId] = useState(""); // doc _id or document type being worked on

  const loadDocs = useCallback(async () => {
    if (!vehicleTableId) return;
    setLoading(true);
    try {
      const res = await getData(
        `/vehicle-documents/vehicle/${vehicleTableId}`,
        token,
      );
      if (res?.success) {
        setDocs(res.data || []);
      } else {
        handleAsyncError(dispatch, getMessage(res, "Unable to load documents"));
      }
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
    } finally {
      setLoading(false);
    }
  }, [vehicleTableId, token]);

  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  // { rc: [...], puc: [...], ... }
  const docsByType = useMemo(() => {
    return docs.reduce((acc, d) => {
      (acc[d.documentType] = acc[d.documentType] || []).push(d);
      return acc;
    }, {});
  }, [docs]);

  // returns true on success so the UI can reset its slot
  const uploadDocument = async ({
    file,
    documentType,
    title = "",
    expiryDate = "",
    isVisibleToCustomer = true,
    replaceDocumentId = "",
  }) => {
    if (!file) {
      handleAsyncError(dispatch, "Select a file first");
      return false;
    }
    if (!ALLOWED_DOC_MIME.includes(file.type)) {
      handleAsyncError(
        dispatch,
        "Only PDF, JPG, PNG or WEBP files are allowed",
      );
      return false;
    }
    if (file.size > MAX_DOC_MB * 1024 * 1024) {
      handleAsyncError(
        dispatch,
        `File too large. Max ${MAX_DOC_MB} MB allowed`,
      );
      return false;
    }

    try {
      setBusyId(documentType);
      const formData = new FormData();
      formData.append("document", file);
      formData.append("documentType", documentType);
      formData.append("title", title);
      if (expiryDate) formData.append("expiryDate", expiryDate);
      formData.append("isVisibleToCustomer", String(isVisibleToCustomer));

      if (replaceDocumentId)
        formData.append("replaceDocumentId", replaceDocumentId);

      const res = await postMultipleData(
        `/vehicle-documents/${vehicleTableId}`,
        formData,
        token,
      );

      if (res?.success) {
        handleAsyncError(dispatch, res.message, "success");
        setDocs((prev) => [
          res.data,
          ...prev.filter((d) => d._id !== replaceDocumentId),
        ]);
        return true;
      }
      handleAsyncError(dispatch, getMessage(res, "Upload failed"));
      return false;
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
      return false;
    } finally {
      setBusyId("");
    }
  };

  // changes: { title?, expiryDate?, isVisibleToCustomer? }
  const updateDocument = async (documentId, changes) => {
    try {
      setBusyId(documentId);
      const res = await patchData(
        `/vehicle-documents/${documentId}`,
        changes,
        token,
      );
      if (res?.success) {
        setDocs((prev) =>
          prev.map((d) => (d._id === documentId ? { ...d, ...res.data } : d)),
        );
        return true;
      }
      handleAsyncError(dispatch, getMessage(res, "Update failed"));
      return false;
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
      return false;
    } finally {
      setBusyId("");
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      setBusyId(documentId);
      const res = await deleteData(`/vehicle-documents/${documentId}`, token);
      if (res?.success) {
        handleAsyncError(dispatch, res.message, "success");
        setDocs((prev) => prev.filter((d) => d._id !== documentId));
        return true;
      }
      handleAsyncError(dispatch, getMessage(res, "Delete failed"));
      return false;
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
      return false;
    } finally {
      setBusyId("");
    }
  };

  // Opens a short-lived signed link. The tab is opened first (inside the click)
  // so the browser's popup blocker doesn't stop it after the async call.
  // returns a short-lived signed url, or "" on failure
  const fetchDocumentUrl = async (documentId) => {
    try {
      setBusyId(documentId);
      const res = await getData(`/vehicle-documents/${documentId}/link`, token);
      if (res?.success && res.data?.url) return res.data.url;
      handleAsyncError(dispatch, getMessage(res, "Unable to open document"));
      return "";
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
      return "";
    } finally {
      setBusyId("");
    }
  };

  return {
    docs,
    docsByType,
    loading,
    busyId,
    loadDocs,
    uploadDocument,
    updateDocument,
    deleteDocument,
    fetchDocumentUrl,
  };
};

export default useVehicleDocuments;
