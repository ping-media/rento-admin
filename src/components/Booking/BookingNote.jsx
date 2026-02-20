import { useState } from "react";
import { postData } from "../../Data/index";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { handleUpdateNotes } from "../../Redux/VehicleSlice/VehicleSlice";
import { formatInTimeZone } from "date-fns-tz";
import NotesForm from "./_components/NotesForm";

const formatDateTimeIN = (timestring) =>
  formatInTimeZone(
    new Date(timestring),
    "Asia/Kolkata",
    "MMM dd, yyyy, hh:mm a",
  );

const BookingNote = () => {
  const { currentUser, token } = useSelector((state) => state.user);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [Note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  //   submitting the note
  const handleSubmitNotRelatedBooking = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const note = formData.get("notes");
    if (note?.length <= 0)
      return handleAsyncError(dispatch, "Note cannot be empty!.");
    const data = {
      _id: vehicleMaster[0]?._id,
      notes: [
        {
          key: `${currentUser?.firstName} (${currentUser?.userType})`,
          value: note,
          noteType: "general",
          createdAt: Date.now(),
        },
      ],
    };
    try {
      setLoading(true);
      const response = await postData(
        `/createBooking?_id=${vehicleMaster[0]?._id}`,
        data,
        token,
      );
      const pushDataInRedux = {
        key: `${currentUser?.firstName} (${currentUser?.userType})`,
        value: note,
        noteType: "general",
        createdAt: Date.now(),
      };
      if (response.status !== 200) {
        return handleAsyncError(dispatch, "unable to add note");
      }

      dispatch(handleUpdateNotes(pushDataInRedux));
      setNote("");
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ul className="leading-8 mb-2 list-disc">
        {vehicleMaster && vehicleMaster[0]?.notes?.length > 0 ? (
          vehicleMaster[0]?.notes?.map((item, indx) => {
            if (item?.key?.length <= 0 || item?.noteType === "cancel") {
              return null;
            }
            return (
              <li key={`${item?._id}_${indx}`} className="ml-4 text-gray-400">
                <p className="text-sm">
                  {item?.value} | {item?.key}
                </p>
                <p className="text-xs">
                  {item?.createdAt && formatDateTimeIN(item?.createdAt)}
                  {/* {item?.createdAt && formatFullDateAndTime(item?.createdAt)} */}
                </p>
              </li>
            );
          })
        ) : (
          <li className="italic ml-4 text-gray-400">No notes found</li>
        )}
      </ul>

      {/* form to submit the note  */}
      <NotesForm
        onSubmit={handleSubmitNotRelatedBooking}
        value={Note}
        onValueChange={setNote}
        loading={loading}
      />
    </>
  );
};

export default BookingNote;
