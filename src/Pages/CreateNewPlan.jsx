import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { handleAsyncError } from "../utils/Helper/handleAsyncError.js";
import { BackButton, InputComponent, Loader, SelectComponent2 } from "../components/CommonComponents/commonComponents.jsx";
import { setUpdateData } from "../Redux/AdsSlice/VehicleSlice.js";
import { getApi, postApi } from "../response/api.js";
import { setError } from "../Redux/ErrorSlice/ErrorSlice.js";
import { staticData } from "../constant.js";
import { setLoading } from "../Redux/ThemeSlice/ThemeSlice.js";

const CreateNewPlan = () => {
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.theme)
  const { updateData } = useSelector(state => state.vehicles)  
  const dispatch = useDispatch();
  const [rows, setRows] = useState(1);
  const create = async () => {
    dispatch(setLoading(true))
    const res = await postApi('/createPlan', updateData)      
    if (res && res.status == 200) {
      dispatch(setError({ type: "success", message: res.message }))
      navigate('/plans')
    } else {
      dispatch(setError({ type: "error", message: res.message }))
    }
    dispatch(setLoading(true))
  }
  const updateRows = () => {
    if (window.innerWidth < 640) {
      setRows(2);
    } else {
      setRows(1);
    }
  };
  useEffect(() => {
    updateRows();
    window.addEventListener("resize", updateRows);
    return () => {
      window.removeEventListener("resize", updateRows);
    };
  }, []);

  return (
    <>
    {
      loading ? <Loader /> : null
    }
     <BackButton label="New Plan" />
      <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-5 mx-auto bg-white">
        <div style={{ display: "flex", marginTop: "15px" }}>
          <InputComponent
            type="text"
            label={"Plan Name"}
            placeholder="Please Enter planName"
            name="planName"
          />
          <InputComponent
            type="text"
            label="Plan Price"
            placeholder="Please Enter plan price"
            name="planPrice"
          />

        </div>
        <div style={{ display: "flex", marginTop: "15px" }}>
          <InputComponent
            type="text"
            label="Station Id"
            placeholder="Please Enter stationId"
            name="stationId"
          />
          <SelectComponent2/>
        </div>

        <button
          onClick={create}
          className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
        >
          {updateData._id ? "Update" : "Create"}
        </button>

      </div>
    </>
  );
};

export default CreateNewPlan;
