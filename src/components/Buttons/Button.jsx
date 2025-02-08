import Spinner from "../../components/Spinner/Spinner";

const Button = ({
  title,
  fn,
  customClass,
  disable = false,
  loading,
  customLoadingMessage = "updating",
}) => {
  return (
    <button
      className={`${
        customClass ? customClass : "bg-theme text-gray-100"
      } font-semibold p-1.5 text-sm lg:px-2.5 lg:py-1.5 rounded-md shadow-lg hover:bg-theme-dark hover:shadow-md inline-flex items-center gap-1 transition-all duration-200 ease-in disabled:bg-opacity-50`}
      disabled={loading || disable}
      onClick={fn}
    >
      {loading ? (
        !loading ? (
          title
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
