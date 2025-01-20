import { useState } from "react";
import { postData } from "../../Data/index";
import Input from "../InputAndDropdown/Input";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { handleUpdateNotes } from "../../Redux/VehicleSlice/VehicleSlice";
import Spinner from "../../components/Spinner/Spinner";

const BookingNote = () => {
  const { currentUser, token } = useSelector((state) => state.user);
  const { vehicleMaster } = useSelector((state) => state.vehicles);
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
      notes: [{ key: currentUser?.userType, value: note, noteType: "general" }],
    };
    try {
      setLoading(true);
      const response = await postData(
        `/createBooking?_id=${vehicleMaster[0]?._id}`,
        data,
        token
      );
      const pushDataInRedux = {
        key: currentUser?.userType,
        value: note,
        noteType: "general",
      };
      if (response.status !== 200) {
        return handleAsyncError(dispatch, "unable to add note");
      }
      //   updating the redux state after successfully adding the note in booking
      dispatch(handleUpdateNotes(pushDataInRedux));
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
          vehicleMaster[0]?.notes?.map((item) => {
            // avoiding any null value to show
            if (item?.key?.length <= 0 || item?.noteType === "cancel") {
              return null;
            }
            return (
              <li key={item?._id} className="ml-4 text-gray-400">
                {item?.value} | {item?.key}
              </li>
            );
          })
        ) : (
          <li className="italic ml-4 text-gray-400">No notes found</li>
        )}
      </ul>
      {/* form to submit the note  */}
      <form
        className="flex items-end my-4"
        onSubmit={handleSubmitNotRelatedBooking}
      >
        <Input
          bodyWidth="w-2/4"
          customClass="w-[98%] px-3 py-1.5"
          item={"notes"}
          require={true}
        />
        <button
          type="submit"
          className="bg-theme text-gray-100 px-2 py-1.5 rounded-lg disabled:bg-gray-400"
          disabled={loading}
        >
          {!loading ? "Add" : <Spinner />}
        </button>
      </form>
    </>
  );
};

export default BookingNote;
