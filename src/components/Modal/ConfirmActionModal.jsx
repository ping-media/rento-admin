import Spinner from "../Spinner/Spinner";
import ModalWrapper from "./ModalWrapper";

const ConfirmActionModal = ({
  active,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) => (
  <ModalWrapper
    active={active}
    onClose={() => !loading && onCancel()}
    size="sm"
    position="center"
    showClose={false}
    zIndexClass="z-50"
  >
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{message}</p>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => !loading && onCancel()}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-60 sm:w-auto sm:py-2.5"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="w-full rounded-lg bg-theme px-4 py-3 text-sm font-semibold text-white hover:bg-theme-dark disabled:bg-gray-400 sm:w-auto sm:py-2.5"
        >
          {loading ? <Spinner /> : confirmText}
        </button>
      </div>
    </div>
  </ModalWrapper>
);

export default ConfirmActionModal;
