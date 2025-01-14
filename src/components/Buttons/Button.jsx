const Button = ({ title, fn, customClass, disable = false }) => {
  return (
    <button
      className={`${
        customClass ? customClass : "bg-theme"
      } font-semibold text-gray-100 p-1.5 text-sm lg:px-2.5 lg:py-1.5 rounded-md shadow-lg hover:bg-theme-dark hover:shadow-md inline-flex items-center gap-1 transition-all duration-200 ease-in disabled:bg-opacity-50`}
      disabled={disable}
      onClick={fn}
    >
      {title}
    </button>
  );
};

export default Button;
