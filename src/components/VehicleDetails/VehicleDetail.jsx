import VehicleInfo from "./VehicleInfo";

const VehicleDetail = () => {
  const Data = [
    { key: "Brand", value: "Hero" },
    { key: "Type", value: "Bikes" },
    { key: "Class", value: "Bike" },
    { key: "Pick-up Point", value: "SUM Hospital, Odisha" },
    { key: "Drop Point", value: "SUM Hospital, Odisha" },
    { key: "Username", value: "caleballan" },
    { key: "Color", value: "White" },
    { key: "Mileage", value: 40 },
    { key: "Year", value: 2024 },
    { key: "Identification Number", value: "OD02 AD6489" },
    { key: "Transmission Type", value: "Autogear" },
    { key: "Condition", value: "New" },
    { key: "Fuel Type", value: "Petrol" },
    { key: "Seat", value: 2 },
  ];
  return (
    <>
      <div className="flex gap-4 flex-wrap">
        <div className="bg-white shadow-md rounded-xl flex-1 px-6 py-4">
          <h2 className="mb-3 text-xl font-semibold text-gray-500">
            Vehicle Infomation
          </h2>
          <div className="border-2 p-2 border-gray-300 rounded-lg">
            {Data.map((item, index) => (
              <div
                className={`flex justify-between items-center py-1.5 ${
                  index == Data.length - 1 ? "" : "border-b-2"
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

export default VehicleDetail;
