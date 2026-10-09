const ButtonSkeleton = () => {
  return (
    <button className="mt-2 p-2 border text-gray-100 !w-28 hover:text-black border-gray-300 flex items-center gap-1 h-10 bg-gray-300 rounded"></button>
  );
};

export const BtnSkeleton = (length = 4, className = "w-20 h-9") => {
  return (
    <>
      {new Array(length).fill("").map((_, index) => (
        <div
          key={index}
          className={`${className} bg-gray-200 rounded-md animate-pulse`}
        />
      ))}
    </>
  );
};

export default ButtonSkeleton;
