import Spinner from "../Spinner/Spinner";
import ModalWrapper from "./ModalWrapper";

const ConfirmActionModal = ({
  active,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  confirmDisabled = false,
  showConfirm = true,
  persistent = false, // true: overlay click and Escape don't close it
  position = "center",
  children,
  onConfirm,
  onCancel,
  size = "sm",
}) => (
  <ModalWrapper
    active={active}
    onClose={() => !loading && onCancel()}
    size={size}
    position={position}
    showClose={false}
    zIndexClass="z-50"
    closeOnOverlay={!persistent}
    closeOnEsc={!persistent}
  >
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{message}</p>
      {children}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => !loading && onCancel()}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-60 sm:w-auto sm:py-2.5"
        >
          {cancelText}
        </button>

        {showConfirm && (
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || confirmDisabled}
            className="w-full rounded-lg bg-theme px-4 py-3 text-sm font-semibold text-white hover:bg-theme-dark disabled:bg-gray-400 sm:w-auto sm:py-2.5"
          >
            {loading ? <Spinner /> : confirmText}
          </button>
        )}
      </div>
    </div>
  </ModalWrapper>
);

export default ConfirmActionModal;
