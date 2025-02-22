const BookingProgress = ({ step_1, step_2, step_3 }) => {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 w-full">
          {/* Step 1  */}
          {Array.from({ length: 2 }).map((_, index) => (
            <div className="relative flex-1 flex items-center" key={index}>
              <div
                id={`indicator-${index + 1}`}
                className={`w-5 h-5 lg:w-8 lg:h-8 flex items-center justify-center ${"bg-theme"} text-white rounded-full transition-colors duration-300`}
              >
                {index + 1}
              </div>
              <div
                id={`line-${index + 1}`}
                className="absolute w-full h-1 bg-gray-300 left-0 top-1/2 transform translate-y-[-50%] z-[-1] transition-colors duration-300"
              ></div>
            </div>
          ))}
          {/* Step 3 */}
          <div>
            <div
              id="indicator-3"
              className="w-5 h-5 lg:w-8 lg:h-8 flex items-center justify-center bg-gray-300 text-gray-600 rounded-full transition-colors duration-300"
            >
              3 <span>{step_3}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          id="progress-bar"
          className="bg-theme h-2 rounded-full transition-all duration-300"
          style={{ width: "0%" }}
        ></div>
      </div>
    </>
  );
};

export default BookingProgress;
