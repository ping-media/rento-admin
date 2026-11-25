import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
import { compressImageToBlob } from "../../../utils/index";
import {
  ALLOWED_DOC_MIME,
  MAX_DOC_MB,
} from "../../../constants/vehicleDocuments";

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const DocumentUploadBox = ({
  label,
  documentType,
  onUpload, // ({ file, documentType, title, expiryDate }) => Promise<boolean>
  busy = false,
  showTitle = false, // show the title input (for service invoice / others)
  showExpiry = true, // show the expiry date input
  onCancel, // shown only while replacing an existing document
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  // local preview for images, cleaned up automatically
  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const reset = () => {
    setFile(null);
    setTitle("");
    setExpiryDate("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openFileChooser = (type) => {
    const input = fileInputRef.current;
    if (!input) return;
    if (type === "camera") {
      input.setAttribute("capture", "environment");
    } else {
      input.removeAttribute("capture");
    }
    input.value = "";
    input.click();
  };

  const handleFileChange = async (e) => {
    const picked = e.target.files?.[0];
    if (!picked || picked.size === 0) return;

    if (!ALLOWED_DOC_MIME.includes(picked.type)) {
      handleAsyncError(
        dispatch,
        "Only PDF, JPG, PNG or WEBP files are allowed",
      );
      return;
    }

    try {
      setIsCompressing(true);
      let finalFile = picked;

      // compress photos only, PDFs are sent as they are
      if (picked.type.startsWith("image/")) {
        const blob = await compressImageToBlob(picked, 0.7);
        finalFile = new File(
          [blob],
          `${picked.name.replace(/\.[^.]+$/, "")}.jpg`,
          { type: "image/jpeg" },
        );
      }

      if (finalFile.size > MAX_DOC_MB * 1024 * 1024) {
        handleAsyncError(
          dispatch,
          `File too large. Max ${MAX_DOC_MB} MB allowed`,
        );
        return;
      }
      setFile(finalFile);
    } catch (error) {
      console.error("Document processing failed:", error);
      handleAsyncError(dispatch, "Unable to read the selected file");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleUpload = async () => {
    if (!file || busy) return;
    const ok = await onUpload({
      file,
      documentType,
      title: title.trim(),
      expiryDate,
    });
    if (ok) reset();
  };

  return (
    <div className="flex flex-1 flex-col">
      <p className="block text-gray-800 font-semibold text-sm mb-2 text-left">
        {label}
      </p>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="my-1 text-sm text-white rounded-md bg-theme p-1"
        >
          Cancel
        </button>
      )}

      <div className="relative flex min-h-[12rem] flex-1 flex-col justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md px-4 sm:px-6 py-5 text-center">
        <input
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {isCompressing ? (
          <div className="flex justify-center items-center h-28">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-theme"></div>
          </div>
        ) : file ? (
          <>
            <div className="text-right mb-3">
              <button
                type="button"
                onClick={reset}
                disabled={busy}
                className="inline-flex items-center gap-1 text-red-500 border border-red-500 px-2 py-1 text-sm rounded-md hover:bg-red-500 hover:text-gray-100 transition disabled:opacity-50"
              >
                Remove
              </button>
            </div>

            {previewUrl ? (
              <div className="w-full h-28 mx-auto">
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 h-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-10 w-10 text-red-500"
                  fill="currentColor"
                >
                  <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5z" />
                </svg>
                <span className="text-sm text-gray-700">PDF document</span>
              </div>
            )}

            <p className="mt-2 text-xs text-gray-500">
              {file.type === "application/pdf" ? "PDF" : "Image"} ·{" "}
              {formatSize(file.size)}
            </p>

            <div className="mt-4 grid gap-3 text-left sm:grid-cols-2">
              {showTitle && (
                <div className={showExpiry ? "" : "sm:col-span-2"}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={title}
                    maxLength={80}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={busy}
                    placeholder="e.g. Brake pad replacement"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-theme"
                  />
                </div>
              )}
              {showExpiry && (
                <div className={showTitle ? "" : "sm:col-span-2"}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Expiry date (optional)
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    disabled={busy}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-theme"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleUpload}
              disabled={busy}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-theme px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {busy && (
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
              )}
              {busy ? "Uploading..." : "Upload"}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="cursor-pointer block w-full"
              onClick={() => openFileChooser("camera")}
              aria-label="Take a photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="mx-auto h-16 w-16 text-gray-400 mb-4 hover:text-theme transition"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <g transform="translate(2 3)">
                  <path d="M20 16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v11z" />
                  <circle cx="10" cy="10" r="4" />
                </g>
              </svg>
            </button>

            <p className="text-sm text-gray-600">
              <button
                type="button"
                className="cursor-pointer text-theme hover:underline"
                onClick={() => openFileChooser("gallery")}
              >
                Browse
              </button>{" "}
              to upload a PDF or image (max {MAX_DOC_MB} MB).
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentUploadBox;
