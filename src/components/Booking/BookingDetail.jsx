import VehicleInfo from "../VehicleDetails/VehicleInfo";

const BookingDetail = () => {
  const data = {
    user: [
      { key: "Name", value: "Manjunath R" },
      { key: "Mobile Number", value: "917406569307" },
      { key: "Email", value: "manjushobha2630@gmail.com" },
      { key: "Joined", value: "2024-10-28 02:45 PM" },
    ],
    moreInfo: [
      { key: "Pick Up Location", value: "Hoodi, Bangalore" },
      { key: "Drop Off Location", value: "Hoodi, Bangalore" },
      { key: "Start Date", value: "2024-10-29 09:30:00" },
      { key: "End Date", value: "2024-10-30 09:30:00" },
    ],
  };
  return (
    <>
      <div className="flex gap-4 flex-wrap">
        <div className="bg-white shadow-md rounded-xl flex-1 px-6 py-4">
          <h2 className="mb-3 text-xl font-semibold text-gray-500">
            {`${data?.user[0]?.value} requested for rental`}
          </h2>
          <div className="border-2 p-2 border-gray-300 rounded-lg mb-8">
            {data?.user?.map((item, index) => (
              <div
                className={`flex justify-between items-center py-1.5 ${
                  index == data?.user?.length - 1 ? "" : "border-b-2"
                } border-gray-300`}
                key={index}
              >
                <span className="font-semibold uppercase">{item?.key}</span>{" "}
                <span className="text-gray-500">{item?.value}</span>
              </div>
            ))}
          </div>
          <h2 className="mb-3 text-xl font-semibold text-gray-500">
            More Information
          </h2>
          <div className="border-2 p-2 border-gray-300 rounded-lg">
            {data?.moreInfo?.map((item, index) => (
              <div
                className={`flex justify-between items-center py-1.5 ${
                  index == data?.moreInfo?.length - 1 ? "" : "border-b-2"
                } border-gray-300`}
                key={index}
              >
                <span className="font-semibold uppercase">{item?.key}</span>{" "}
                <span className="text-gray-500">{item?.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 px-6 py-4 bg-white shadow-md rounded-lg">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold uppercase text-lg">Hero Mastero 125</h2>
              <small className="text-gray-600">2024</small>
            </div>
            <div>
              <h2 className="font-semibold uppercase">Rental Price</h2>
              <p className="font-bold text-lg">₹100.00/DAY</p>
            </div>
          </div>
          <VehicleInfo />
        </div>
      </div>
    </>
  );
};

export default BookingDetail;
