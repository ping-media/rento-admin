const Spinner = ({ message, textColor = "white" }) => {
  return (
    <div className="flex items-center justify-center">
      <span className={`mr-2 text-${textColor}`}>{message}</span>
      <div className="w-5 h-5 border-4 border-t-theme border-gray-300 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
