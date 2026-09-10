import { useDispatch, useSelector } from "react-redux";
import NotesForm from "../../components/Booking/_components/NotesForm";
import React, { useState } from "react";
import { postData } from "../../Data";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { updateTimeLineNoteData } from "../../Redux/VehicleSlice/VehicleSlice";

const BookingTimelineNoteModal = ({ open, setOpen, _id, index = null }) => {
  const { currentUser, token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [Note, setNote] = useState("");
  const dispatch = useDispatch();

  //   submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    if ((!_id && _id.trim() === "") || index === undefined || index === null) {
      return handleAsyncError(
        dispatch,
        "unable to get required fields! try again",
      );
    }

    const formData = new FormData(event.target);
    const note = formData.get("notes");
    if (!note || note.length === 0 || note.length > 200)
      return handleAsyncError(
        dispatch,
        "Note cannot be empty or greater than 200 characters",
      );

    const data = {
      _id,
      note: {
        key: `${currentUser?.firstName} (${currentUser?.userType})`,
        value: note,
      },
      index,
    };
    try {
      setLoading(true);
      const response = await postData(`/add-timeline-note`, data, token);

      if (!response.success) {
        return handleAsyncError(dispatch, "unable to add note");
      }

      dispatch(updateTimeLineNoteData({ index, note: data.note }));
      setNote("");
      setOpen(false);
      handleAsyncError(dispatch, response.message, "success");
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed ${
        !open ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-md">
        <div className="flex justify-between border-b p-2">
          <h2 className="text-theme font-semibold text-lg uppercase">
            Add Extension Note
          </h2>
          <button
            onClick={setOpen}
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

        <div className="p-6 pt-2">
          <NotesForm
            onSubmit={handleSubmit}
            value={Note}
            onValueChange={setNote}
            loading={loading}
            className="lg:w-5/6"
          />
        </div>
      </div>
    </div>
  );
};

export default BookingTimelineNoteModal;
