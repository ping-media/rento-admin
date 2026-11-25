import { useRef, useState } from "react";
import useVehicleDocuments from "../../../hooks/use-vehicle-documents";
import {
  DOCUMENT_TYPES,
  getCustomerVisibility,
} from "../../../constants/vehicleDocuments";
import DocumentUploadBox from "./DocumentUploadBox";
import { Switch } from "../../InputAndDropdown/InputSwitch";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "../../Modal/ModalWrapper";
import PhotoView from "../../Form/User Components/PhotoView";
import useVehicleDocumentSettings from "../../../hooks/use-vehicle-document-settings";
import PdfViewer from "../../Pdf/PdfViewer";
import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
import { openImagePreview } from "../../../utils/openImagePreview";

const formatSize = (bytes = 0) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

const isExpired = (d) => d && new Date(d).getTime() < Date.now();

// shows the title if given, otherwise the document type name (never the file name)
const nameOf = (doc) =>
  doc.title ||
  DOCUMENT_TYPES.find((t) => t.value === doc.documentType)?.label ||
  "Document";

const VehicleDocumentsManager = ({ vehicleTableId }) => {
  const {
    docsByType,
    loading,
    busyId,
    uploadDocument,
    updateDocument,
    deleteDocument,
    fetchDocumentUrl,
  } = useVehicleDocuments(vehicleTableId);
  const { token, loggedInRole } = useSelector((state) => state.user);
  const isAdmin = loggedInRole === "admin";
  const { settings, loading: settingsLoading } =
    useVehicleDocumentSettings(isAdmin);
  const [preview, setPreview] = useState(null); // { url, isPdf, name }
  const viewLock = useRef(false);
  const [viewingId, setViewingId] = useState("");
  const [previewReady, setPreviewReady] = useState(false);
  const dispatch = useDispatch();

  // which single-document slot is currently in "replace" mode
  const [replacingType, setReplacingType] = useState("");

  const handleToggle = (doc) =>
    updateDocument(doc._id, { isVisibleToCustomer: !doc.isVisibleToCustomer });

  const handleDelete = (doc) => {
    if (window.confirm(`Delete "${nameOf(doc)}"?`)) deleteDocument(doc._id);
  };

  // replace is handled by the server: it removes the old document after saving the new one
  const handleUpload = async (payload, oldDoc = null) => {
    const ok = await uploadDocument({
      ...payload,
      replaceDocumentId: oldDoc?._id,
    });
    if (ok) setReplacingType("");
    return ok;
  };

  const handleView = async (doc) => {
    if (viewLock.current) return; // a request is already running
    viewLock.current = true;
    setViewingId(doc._id);

    try {
      if (doc.mimeType === "application/pdf") {
        setPreviewReady(false);
        setPreview({
          url: `${import.meta.env.VITE_BASED_URL}/vehicle-documents/${doc._id}/file`,
          isPdf: true,
          name: nameOf(doc),
        });
        return;
      }

      const url = await fetchDocumentUrl(doc._id);
      if (!url) return;
      const opened = await openImagePreview(url);
      if (!opened) handleAsyncError(dispatch, "Unable to load the image");
    } finally {
      viewLock.current = false;
      setViewingId("");
    }
  };

  if (!vehicleTableId) return null;

  if (loading || (isAdmin && settingsLoading)) return <DocumentsSkeleton />;

  return (
    <>
      <div className="lg:h-[30rem] overflow-y-scroll px-4 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DOCUMENT_TYPES.map(({ value, label, single }) => {
            const list = docsByType[value] || [];
            const isReplacing = single && replacingType === value;
            // a single slot shows the card OR the upload box, never both
            const showCard = list.length > 0 && !isReplacing;
            const showUpload = !single || list.length === 0 || isReplacing;

            return (
              <div
                key={value}
                className={`flex flex-col ${single ? "" : "sm:col-span-2"}`}
              >
                {showCard && (
                  <>
                    <p className="block text-gray-800 font-semibold text-sm mb-2 text-left">
                      {label}
                    </p>
                    {list.map((doc) => (
                      <DocRow
                        key={doc._id}
                        doc={doc}
                        fill={single}
                        visibility={
                          isAdmin ? getCustomerVisibility(doc, settings) : null
                        }
                        isAdmin={isAdmin}
                        busy={busyId === doc._id}
                        onView={handleView}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onReplace={
                          single ? () => setReplacingType(value) : undefined
                        }
                        viewing={viewingId === doc._id}
                        viewLocked={!!viewingId}
                      />
                    ))}
                  </>
                )}

                {showUpload && (
                  <DocumentUploadBox
                    label={
                      list.length === 0
                        ? label
                        : single
                          ? `New ${label}`
                          : `Add another ${label}`
                    }
                    documentType={value}
                    showTitle={!single}
                    busy={busyId === value}
                    onCancel={
                      isReplacing ? () => setReplacingType("") : undefined
                    }
                    onUpload={(payload) =>
                      handleUpload(payload, single ? list[0] : null)
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ModalWrapper
        active={!!preview}
        onClose={() => {
          setPreview(null);
          setPreviewReady(false);
        }}
        title={preview?.name}
        size="2xl"
        position="center"
        zIndexClass="z-50"
      >
        {preview && (
          <div className="px-4 pb-4">
            <div className="relative h-[70vh] sm:h-[65vh] overflow-y-auto rounded-md">
              {!previewReady && (
                <div className="absolute inset-0 z-10 animate-pulse rounded-md bg-gray-200" />
              )}

              {preview.isPdf ? (
                <PdfViewer
                  url={preview.url}
                  token={token}
                  onReady={() => setPreviewReady(true)}
                />
              ) : (
                previewReady && (
                  <PhotoView
                    item={{ imageUrl: preview.url, fileName: preview.name }}
                    uniqueId="vehicle-doc-preview"
                    className="w-full"
                  />
                )
              )}
            </div>
          </div>
        )}
      </ModalWrapper>
    </>
  );
};

export default VehicleDocumentsManager;

const DocumentsSkeleton = () => (
  <div className="lg:h-[30rem] overflow-y-scroll px-4 pb-2">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {DOCUMENT_TYPES.map(({ value, single }) => (
        <div key={value} className={single ? "" : "sm:col-span-2"}>
          <div className="mb-2 h-4 w-40 animate-pulse rounded bg-gray-200" />
          <div className="min-h-[12rem] animate-pulse rounded-md bg-gray-200" />
        </div>
      ))}
    </div>
  </div>
);

const DocRow = ({
  doc,
  busy,
  isAdmin,
  fill,
  visibility,
  viewing,
  viewLocked,
  onView,
  onToggle,
  onDelete,
  onReplace,
}) => (
  <div
    className={`flex flex-col justify-between rounded-md border border-gray-200 p-3 ${
      fill ? "min-h-[12rem] flex-1" : "mb-2"
    }`}
  >
    <div className="flex items-start gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-8 w-8 shrink-0 text-red-500"
        fill="currentColor"
      >
        <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5z" />
      </svg>

      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-semibold text-gray-800"
          title={nameOf(doc)}
        >
          {nameOf(doc)}
        </p>
        <p className="text-xs text-gray-500">{formatSize(doc.fileSize)}</p>
        {doc.expiryDate && (
          <p
            className={`text-xs ${isExpired(doc.expiryDate) ? "text-red-500" : "text-gray-500"}`}
          >
            {isExpired(doc.expiryDate) ? "Expired " : "Expires "}
            {formatDate(doc.expiryDate)}
          </p>
        )}
      </div>
    </div>

    <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
      {isAdmin && (
        <div>
          <div className="flex items-center gap-2">
            <Switch
              checked={!!doc.isVisibleToCustomer}
              disabled={busy}
              onChange={() => onToggle(doc)}
            />
            <span className="text-xs font-semibold text-gray-700">
              Show to customer
            </span>
          </div>
          {visibility && (
            <p
              className={`mt-1 text-xs ${
                visibility.shown ? "text-green-600" : "text-amber-600"
              }`}
            >
              {visibility.text}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy || viewLocked}
          onClick={() => onView(doc)}
          className="flex flex-1 items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-xs hover:border-theme hover:text-theme disabled:opacity-50"
        >
          {viewing ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-theme border-t-transparent" />
          ) : (
            "View"
          )}
        </button>
        {onReplace && (
          <button
            type="button"
            disabled={busy}
            onClick={onReplace}
            className="flex-1 rounded-md border border-theme px-3 py-2 text-xs text-theme hover:bg-theme hover:text-white disabled:opacity-50"
          >
            Replace
          </button>
        )}
        {isAdmin && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onDelete(doc)}
            className="flex-1 rounded-md border border-red-500 px-3 py-2 text-xs text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  </div>
);
