const BookingTimeLine = () => {
  return (
    <div className="container mx-auto py-4">
      <div className="relative wrap overflow-hidden">
        <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border left-1/2"></div>
        <div className="mb-3 flex justify-between items-center w-full right-timeline">
          <div className="order-1 w-5/12"></div>
          <div className="z-20 flex items-center order-1 bg-theme shadow-xl w-6 h-6 rounded-full"></div>
          <div className="order-1 bg-gray-300 bg-opacity-50 rounded-lg shadow-xl w-5/12 px-3 py-2">
            <h3 className="mb-1 font-bold text-gray-800 text-md">
              Event Title
            </h3>
            <p className="text-gray-700 leading-tight text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
        <div className="mb-3 flex justify-between flex-row-reverse items-center w-full left-timeline">
          <div className="order-1 w-5/12"></div>
          <div className="z-20 flex items-center order-1 bg-theme shadow-xl w-6 h-6 rounded-full"></div>
          <div className="order-1 bg-gray-300 bg-opacity-50 rounded-lg shadow-xl w-5/12 px-3 py-2">
            <h3 className="mb-1 font-bold text-gray-800 text-md">
              Event Title
            </h3>
            <p className="text-gray-700 leading-tight text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
        <div className="mb-3 flex justify-between items-center w-full right-timeline">
          <div className="order-1 w-5/12"></div>
          <div className="z-20 flex items-center order-1 bg-theme shadow-xl w-6 h-6 rounded-full"></div>
          <div className="order-1 bg-gray-300 bg-opacity-50 rounded-lg shadow-xl w-5/12 px-3 py-2">
            <h3 className="mb-1 font-bold text-gray-800 text-md">
              Event Title
            </h3>
            <p className="text-gray-700 leading-tight text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTimeLine;
