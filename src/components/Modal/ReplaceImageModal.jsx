import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import Spinner from "../Spinner/Spinner";
import { compressImageToBlob } from "../../utils/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";

const ReplaceImageModal = ({ item, onClose, onConfirm }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isTouchDevice =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  // reset whenever a different image is opened or the modal closes
  useEffect(() => {
    setSelectedFile(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
  }, [item?._id]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageClick = () => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return; // phones use the Camera/Gallery buttons below
    // desktop: straight to the file picker
    openFileChooser("gallery");
  };

  const openFileChooser = (type) => {
    const input = fileInputRef.current;
    if (type === "camera") {
      input.setAttribute("capture", "environment");
    } else {
      input.removeAttribute("capture");
    }
    input.value = "";
    input.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.size === 0) {
      return handleAsyncError(dispatch, "No file or invalid file selected.");
    }
    try {
      setIsCompressing(true);
      const compressedBlob = await compressImageToBlob(file, 0.7);
      const finalFile = new File([compressedBlob], file.name, {
        type: "image/jpeg",
      });
      setSelectedFile(finalFile);
      setPreviewUrl(URL.createObjectURL(finalFile));
    } catch (error) {
      console.error("Image compression failed:", error);
      handleAsyncError(dispatch, "Image selection failed.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const ok = await onConfirm(item, selectedFile);
    setIsUploading(false);
    if (ok) onClose();
  };

  const busy = isCompressing || isUploading;

  return (
    <ModalWrapper
      active={!!item}
      onClose={busy ? undefined : onClose}
      title="Replace Image"
      size="sm"
      position="responsive"
      showClose={!busy}
      closeOnOverlay={!busy}
      closeOnEsc={!busy}
      zIndexClass="z-50"
    >
      <div className="px-4 pb-4">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {/* tap the image to pick a new one */}
        <button
          type="button"
          disabled={busy || isTouchDevice}
          onClick={handleImageClick}
          className="relative block w-full h-64 rounded-md border-2 border-dashed border-gray-300 overflow-hidden"
        >
          {isCompressing ? (
            <div className="flex h-full items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-theme"></div>
            </div>
          ) : (
            <>
              <img
                src={previewUrl || item?.imageUrl}
                alt={item?.fileName || "Image"}
                className="w-full h-full object-contain"
              />
              {!previewUrl && !isTouchDevice && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                  Click image to change
                </span>
              )}
            </>
          )}
        </button>

        {previewUrl && !isCompressing && (
          <p className="mt-2 text-center text-xs text-gray-500">
            Preview only. Not saved until you press Replace Image.
          </p>
        )}

        {/* camera or gallery choice, same as the upload component */}
        {isTouchDevice && !busy && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => openFileChooser("camera")}
              className="rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:border-theme hover:text-theme"
            >
              Camera
            </button>
            <button
              type="button"
              onClick={() => openFileChooser("gallery")}
              className="rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:border-theme hover:text-theme"
            >
              Gallery
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedFile || busy}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-theme py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? <Spinner /> : "Replace Image"}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default ReplaceImageModal;
