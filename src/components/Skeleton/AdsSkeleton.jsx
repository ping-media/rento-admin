const AdsSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
        {new Array(6).fill(undefined).map((_, index) => (
          <div
            className="p-5 shadow-md rounded-xl bg-white relative"
            key={index}
          >
            <div className=" w-full h-24 bg-gray-300 rounded-xl mx-auto mb-5"></div>
            <div className="flex flex-col items-center">
              <div className="flex flex-col justify-center items-center w-[75%]">
                <div className="h-4 bg-gray-300 rounded mb-2 w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 w-1/3"></div>
              </div>
              <div className="flex items-center gap-2">
                <button className="mt-2 p-2 border text-gray-100 !w-28 hover:text-black border-gray-300 flex items-center gap-1 h-10 bg-gray-300 rounded w-2/3"></button>
                <button className="mt-2 p-2 border text-gray-100 !w-28 hover:text-black border-gray-300 flex items-center gap-1 h-10 bg-gray-300 rounded w-2/3"></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdsSkeleton;
