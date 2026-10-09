import CardNotFound from "../Skeleton/CardNotFound";
import CardDataLoading from "../Skeleton/CardDataLoading";
import BookingCard from "../Card/BookingCard";

const BookingCardView = ({ dataLoading, Data, newUpdatedData }) => {
  if (dataLoading || !Data) {
    return (
      <div className="flex items-center justify-center h-52 bg-white rounded-xl">
        <CardDataLoading />
      </div>
    );
  }

  if (!newUpdatedData?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-52 bg-white rounded-xl shadow-xl">
        <CardNotFound />
      </div>
    );
  }

  return newUpdatedData.map((item, index) => (
    <BookingCard item={item} key={index} />
  ));
};

export default BookingCardView;
