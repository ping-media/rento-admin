import Spinner from "../../components/Spinner/Spinner";

const Button = ({
  title,
  fn,
  customClass,
  disable = false,
  loading,
  customLoadingMessage = "updating",
  variant = "button",
  isHidden = "",
}) => {
  const isVariant =
    variant === "button"
      ? "font-semibold rounded-md shadow-lg hover:bg-theme-dark hover:shadow-md inline-flex items-center gap-1 transition-all duration-200 ease-in disabled:bg-opacity-50"
      : "";

  return (
    <button
      className={`${
        customClass
          ? customClass
          : "bg-theme text-gray-100 p-1.5 text-sm lg:px-2.5 lg:py-1.5"
      } ${isVariant} ${isHidden}`}
      disabled={loading || disable}
      onClick={fn}
    >
      {loading ? (
        !loading ? (
          <>{title}</>
        ) : (
          <Spinner message={customLoadingMessage} />
        )
      ) : (
        title
      )}
    </button>
  );
};

export default Button;
