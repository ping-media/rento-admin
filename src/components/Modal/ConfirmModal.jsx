import ModalWrapper from "./ModalWrapper";
import Spinner from "../Spinner/Spinner";

const VARIANTS = {
  primary: "bg-theme hover:bg-theme-dark text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const DefaultIcon = () => (
  <svg
    className="mx-auto h-14 w-14 text-amber-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
    ></path>
  </svg>
);

const ConfirmModal = ({
  active,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  loadingText = "Please wait",
  variant = "primary", // primary | danger
  icon, // pass a node to replace the default icon, or null for none
}) => {
  const handleClose = () => {
    if (!loading) onClose?.();
  };

  return (
    <ModalWrapper
      active={active}
      onClose={handleClose}
      size="sm"
      position="center"
      showClose={false}
      closeOnOverlay={!loading}
      closeOnEsc={!loading}
    >
      <div className="p-6 text-center">
        {icon === undefined ? <DefaultIcon /> : icon}
        <h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`w-full rounded-lg px-3 py-2.5 text-base font-medium disabled:bg-gray-400 ${VARIANTS[variant] || VARIANTS.primary}`}
          >
            {loading ? <Spinner message={loadingText} /> : confirmText}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ConfirmModal;
