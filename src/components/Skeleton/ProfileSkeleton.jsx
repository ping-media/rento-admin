const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-5 mx-auto bg-white">
        <>
          <div className="flex justify-end mb-5">
            <button className="p-2 border text-gray-100 !w-24 hover:text-black border-gray-300 flex items-center gap-1 h-10 bg-gray-300 rounded w-2/3"></button>
          </div>
          <div className="flex justify-center lg:justify-around flex-wrap items-center border-b-2 pb-4">
            <div>
              <div className="w-44 h-44 bg-gray-300 border rounded-full p-5 mx-auto border-2 mb-2"></div>
              <div className="text-center mb-5">
                <h2 className="text-xl font-semibold h-4 bg-gray-300 rounded mb-2"></h2>
                <p className="text-gray-400 h-4 bg-gray-300 rounded w-2/3"></p>
              </div>
            </div>
            <div className="leading-8 w-[50%]">
              <div className="h-4 bg-gray-300 rounded mb-2 w-1/3"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 w-1/3"></div>
            </div>
          </div>
          {/* wallet & user verification  */}
          <div className="p-5 w-full lg:w-[80%] mx-auto">
            <div className="flex items-center flex-wrap gap-6 flex-wrap my-5">
              <div className="flex-1 flex items-center p-4 shadow-md rounded-xl">
                <div className="w-16 h-16 bg-gray-300 lg:w-20 lg:h-20 border-r-2 rounded-xl"></div>
                <div className="px-4 w-[60%]">
                  <p className="text-gray-400 h-4 bg-gray-300 rounded mb-2"></p>
                  <h2 className="font-semibold text-lg lg:text-xl h-4 bg-gray-300 rounded w-2/3"></h2>
                </div>
              </div>
              <div className="flex-1 flex items-center p-4 shadow-md rounded-xl">
                <div className="w-16 h-16 bg-gray-300 lg:w-20 lg:h-20 border-r-2 rounded-xl"></div>
                <div className="px-4 w-[60%]">
                  <p className="text-gray-400 h-4 bg-gray-300 rounded mb-2"></p>
                  <h2 className="font-semibold text-lg lg:text-xl h-4 bg-gray-300 rounded w-2/3"></h2>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
