const BookingUserDetails = ({ data }) => {
  return (
    <>
      {data?.user?.map((item, index) => (
        <div
          className={`flex justify-between items-center py-1.5 ${
            index == data?.user?.length - 1 ? "" : "border-b-2"
          } border-gray-300`}
          key={index}
        >
          <span className="font-semibold uppercase text-sm">{item?.key}</span>{" "}
          <span className="text-gray-500 text-sm">{item?.value}</span>
        </div>
      ))}
    </>
  );
};

export default BookingUserDetails;
