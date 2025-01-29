import { useEffect, useState } from "react";
import PreLoader from "../../components/Skeleton/PreLoader";
import { getData } from "../../Data/index";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
// import { timelineFormatDate } from "../../utils/index";
import CopyButton from "../../components/Buttons/CopyButton";
import { addTimeLineData } from "../../Redux/VehicleSlice/VehicleSlice";

const BookingTimeLine = ({ bookingId }) => {
  const { token } = useSelector((state) => state.user);
  const { timeLineData } = useSelector((state) => state.vehicles);
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
        return dispatch(addTimeLineData(response?.data));
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
          timeLineData != null &&
          Object.entries(timeLineData?.timeLine)?.map(([key, value], index) => (
            <div
              className={`mb-2 flex justify-between ${
                index === 0
                  ? "items-start"
                  : index === Object.entries(timeLineData?.timeLine)?.length - 1
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
              <div
                className={`order-1 w-5/12 ${
                  (index + 1) % 2 === 0 ? "text-left" : "text-right"
                }`}
              >
                {key !== "Payment Link" ? (
                  <>
                    <h3 className="mb-1 font-bold text-gray-800 text-sm">
                      {key}
                    </h3>
                    <p className="text-gray-700 leading-tight text-xs">
                      {/* {timelineFormatDate(value)} */}
                      {value}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="mb-1 font-bold text-gray-800 text-sm flex items-center justify-end">
                      {key}
                      <span className="ml-1">
                        <CopyButton textToCopy={value} />
                      </span>
                    </h3>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BookingTimeLine;
