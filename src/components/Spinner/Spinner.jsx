const Spinner = ({ message, textColor = "white" }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-4 border-t-theme border-gray-300 rounded-full animate-spin mr-1"></div>
      <span className={`mr-2 text-${textColor} uppercase`}>{message}</span>
    </div>
  );
};

export default Spinner;
