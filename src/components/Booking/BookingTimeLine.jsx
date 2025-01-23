import { useEffect, useState } from "react";
import PreLoader from "../../components/Skeleton/PreLoader";
import { getData } from "../../Data/index";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { timelineFormatDate } from "../../utils/index";

const BookingTimeLine = ({ bookingId }) => {
  const { token } = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // fetching timeline data
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getData(
          `/getTimelineData?bookingId=${bookingId}`,
          token
        );
        if (response?.status !== 200) {
          return handleAsyncError(dispatch, response?.message);
        }
        return setData(response?.data);
      } catch (error) {
        return handleAsyncError(dispatch, response?.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingId]);

  return (
    <div className="container mx-auto py-2">
      {loading && <PreLoader />}
      <div className="relative wrap overflow-hidden">
        <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border left-1/2"></div>
        {!loading &&
          data &&
          Object.entries(data?.timeLine)?.map(([key, value], index) => (
            <div
              className={`mb-2 flex justify-between ${
                index === 0
                  ? "items-start"
                  : index === Object.entries(data?.timeLine)?.length - 1
                  ? "items-end"
                  : "items-center"
              } w-full ${
                (index + 1) % 2 === 0
                  ? "right-timeline"
                  : "flex-row-reverse left-timeline"
              }`}
              key={index}
            >
              <div className="order-1 w-5/12"></div>
              <div className="z-20 flex items-center order-1 bg-theme shadow-xl w-4 h-4 rounded-full"></div>
              <div className="order-1 w-5/12">
                <h3 className="mb-1 font-bold text-gray-800 text-sm">{key}</h3>
                <p className="text-gray-700 leading-tight text-xs">
                  {timelineFormatDate(value)}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BookingTimeLine;
