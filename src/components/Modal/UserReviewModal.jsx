import Spinner from "../Spinner/Spinner";
import { getData } from "../../Data";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Star } from "@mui/icons-material";

const UserReviewModal = ({ isActive, setIsActive, userId }) => {
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [error, setError] = useState("");

  const fetchReviews = async (pageNum) => {
    pageNum === 1 ? setLoading(true) : setLoadingMore(true);
    setError("");
    try {
      const response = await getData(
        `/users/${userId}/reviews?page=${pageNum}`,
        token,
      );
      setReviews((prev) =>
        pageNum === 1 ? response.reviews : [...prev, ...response.reviews],
      );
      setTotalReviews(response.totalReviews);
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (err) {
      setError("Failed to load review");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      setReviews([]);
      setHasMore(false);
      fetchReviews(1);
    }
  }, [isActive, userId]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 50;
    if (nearBottom && hasMore && !loading && !loadingMore) {
      fetchReviews(page + 1);
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
      <div className="relative top-10 mx-auto shadow-xl rounded-md bg-white w-full lg:max-w-xl">
        <div className="flex justify-between border-b p-2">
          <div className="flex items-center gap-2">
            <h2 className="text-theme text-lg uppercase font-semibold">
              User Review
            </h2>
            <p className="text-sm text-gray-500">
              ({totalReviews ?? 0}{" "}
              {(totalReviews ?? 0) === 1 ? "review" : "reviews"})
            </p>
          </div>
          <button
            onClick={() => setIsActive(false)}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={loading || false}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-4 pt-2">
          {loading && <Spinner />}

          {!loading && error && (
            <p className="text-red-500 text-center">{error}</p>
          )}

          {!loading && !error && totalReviews === 0 && (
            <p className="text-gray-500 text-center">No reviews yet.</p>
          )}

          {!loading && !error && reviews?.length > 0 && (
            <div
              onScroll={handleScroll}
              className="max-h-[60vh] overflow-y-auto space-y-4 pr-1"
            >
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border rounded-md p-3 text-left"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < review.stars
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                          fontSize="small"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-sm text-gray-500 mb-1">
                    {review.ratedBy?.firstName} {review.ratedBy?.lastName} ·
                    Booking #{review.bookingId}
                  </p>

                  <p className="text-base">{review.comment || "No comment"}</p>
                </div>
              ))}

              {loadingMore && <Spinner />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReviewModal;
