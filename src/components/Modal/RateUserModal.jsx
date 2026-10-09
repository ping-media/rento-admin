import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, StarBorder } from "@mui/icons-material";
import Spinner from "../Spinner/Spinner";
import { postData } from "../../Data";
import { updateIsRated } from "../../Redux/VehicleSlice/VehicleSlice";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";

const STARS = new Set([1, 2, 3, 4, 5]);

const RateUserModal = ({ isActive, setIsActive, userId, bookingId }) => {
  const { token } = useSelector((state) => state.user);
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (isActive) {
      setStars(0);
      setHovered(0);
      setComment("");
      setError("");
    }
  }, [isActive]);

  if (!isActive) return null;

  const handleSubmit = async () => {
    if (!stars) {
      setError("Please select a star rating");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await postData(
        `/users/${userId}/rate`,
        { bookingId, stars, comment: comment.trim() },
        token,
      );
      setIsActive(false);
      //updating the redux state
      dispatch(updateIsRated());
      handleAsyncError(dispatch, "Customer rate successfully.", "success");
    } catch (err) {
      setError(
        err?.response?.message || err.message || "Failed to submit rating",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
      <div className="relative top-[28%] sm:top-[25%] mx-auto shadow-xl rounded-md bg-white w-full lg:max-w-lg">
        <div className="flex justify-between border-b p-2">
          <h2 className="text-theme text-lg uppercase font-semibold">
            Rate Customer
          </h2>
          <button
            onClick={() => setIsActive(false)}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={loading}
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

        <div className="p-6 pt-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            {STARS.map((n) => {
              const active = n <= (hovered || stars);
              const Icon = active ? Star : StarBorder;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStars(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  disabled={loading}
                >
                  <Icon className="text-yellow-500" fontSize="large" />
                </button>
              );
            })}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a message (optional)"
            rows={3}
            maxLength={300}
            className="w-full border rounded-md p-2 text-base mb-3 resize-none"
            disabled={loading}
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-theme text-white px-6 py-2 rounded-md disabled:opacity-60"
          >
            {loading ? <Spinner /> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateUserModal;
