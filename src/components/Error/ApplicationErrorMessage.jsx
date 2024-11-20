const ApplicationErrorMessage = ({ type }) => {
  const errorType = {
    enquiryLimit: "This ad pause due to max download limit.",
    lowBalance: "This ad pause due to low balance.",
  };
  return (
    <p className="text-center lg:text-left capitalize text-red-600 font-semibold p-1 mt-2">
      {errorType[type]}
    </p>
  );
};

export default ApplicationErrorMessage;
