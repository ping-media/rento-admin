import BookingDetail from "../components/Booking/BookingDetail";

const BookingDetails = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl uppercase font-bold text-theme">
          Booking Details
        </h1>
      </div>
      <div className="mt-5">
        <BookingDetail />
      </div>
    </>
  );
};

export default BookingDetails;
