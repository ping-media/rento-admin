import { useDispatch, useSelector } from "react-redux";
import { postData } from "../../Data";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { updateAddOnData } from "../../Redux/GeneralSlice/GeneralSlice";

const InputSwitchForAddOn = ({ value, id }) => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  //   changing the locationStatus or vehicleStatus
  const handleChangeStatus = async () => {
    try {
      if (!value && !id) return;
      const newStatus = value == "active" ? "inactive" : "active";
      dispatch(updateAddOnData({ _id: id, status: newStatus }));
      const data = { id: id, status: newStatus };
      const response = await postData("/manageAddOn", data, token);
      if (response?.status != 200)
        return handleAsyncError(dispatch, response?.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          value=""
          checked={value == "active" ? true : false}
          onChange={handleChangeStatus}
        />
        <div className="group peer bg-white rounded-full duration-300 w-9 h-5 ring-2 ring-theme after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-3 after:w-3 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
      </label>
    </>
  );
};

export default InputSwitchForAddOn;
