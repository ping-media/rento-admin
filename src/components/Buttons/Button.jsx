import Spinner from "../Spinner/Spinner";

const Button = ({
  title,
  fn,
  customClass,
  disable = false,
  loading,
  customLoadingMessage = "updating",
  variant = "button",
  isHidden = "",
  onDisabledClick,
}) => {
  const isVariant =
    variant === "button"
      ? "font-semibold rounded-md shadow-lg hover:bg-theme-dark hover:shadow-md inline-flex items-center gap-1 transition-all duration-200 ease-in"
      : "";

  const isDisabled = loading || disable;

  const handleClick = (e) => {
    if (isDisabled) {
      onDisabledClick?.();
      return;
    }

    fn?.(e);
  };

  return (
    <button
      type="button"
      className={`${
        customClass
          ? customClass
          : "bg-theme text-gray-100 p-1.5 text-sm lg:px-2.5 lg:py-1.5"
      } ${isVariant} ${isHidden} ${
        isDisabled
          ? "opacity-75 cursor-not-allowed"
          : "hover:bg-theme-dark hover:shadow-md"
      }`}
      aria-disabled={isDisabled}
      onClick={handleClick}
    >
      {loading ? <Spinner message={customLoadingMessage} /> : title}
    </button>
  );
};

export default Button;
