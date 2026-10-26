import { useEffect, useRef } from "react";

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
};

const ModalWrapper = ({
  active,
  onClose,
  children,
  title, // optional heading shown next to the close button
  size = "md", // sm | md | lg | xl | 2xl | full
  position = "top", // "top" (like your current modal) | "center"
  showClose = true,
  closeOnOverlay = true, // click on the dark area closes it
  closeOnEsc = true,
  lockScroll = true, // stop the page behind from scrolling
  zIndexClass = "z-40",
  overlayClassName = "",
  className = "", // extra classes for the white panel
}) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (closeOnEsc && e.key === "Escape") onCloseRef.current?.();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    if (lockScroll) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      if (lockScroll) document.body.style.overflow = prevOverflow;
    };
  }, [active, closeOnEsc, lockScroll]);

  if (!active) return null;

  // only a click that starts and ends on the dark area closes it
  const handleOverlay = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className={`fixed inset-0 ${zIndexClass} overflow-y-auto bg-gray-900 bg-opacity-60 px-4 ${overlayClassName}`}
      onMouseDown={handleOverlay}
    >
      <div
        className={`flex min-h-full justify-center pb-6 ${
          position === "center"
            ? "items-center py-6"
            : "items-start pt-24 sm:pt-40"
        }`}
        onMouseDown={handleOverlay}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === "string" ? title : undefined}
          className={`relative w-full ${SIZES[size] || SIZES.md} rounded-md bg-white shadow-xl ${className}`}
        >
          {(title || showClose) && (
            <div
              className={`flex items-center p-2 ${
                title ? "justify-between pl-4" : "justify-end"
              }`}
            >
              {title && (
                <h3 className="text-base font-semibold text-gray-800">
                  {title}
                </h3>
              )}
              {showClose && (
                <button
                  onClick={onClose}
                  type="button"
                  aria-label="Close"
                  className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
