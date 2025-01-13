import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  formatPathNameToTitle,
  handlePreviousPage,
  modifyUrl,
} from "../utils/index.js";
import {
  fetchVehicleMasterById,
  handleCreateAndUpdateVehicle,
} from "../Data/Function.js";
import PreLoader from "../components/Skeleton/PreLoader.jsx";
import { endPointBasedOnURL, forms } from "../Data/commonData.js";
import { removeTempIds } from "../Redux/VehicleSlice/VehicleSlice.js";
import { tableIcons } from "../Data/Icons.jsx";

const CreateNewAndUpdateForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = useState(false);
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { loading, vehicleMaster, tempIds } = useSelector(
    (state) => state.vehicles
  );

  // fetch data based on id taking from url
  useEffect(() => {
    if (id) {
      fetchVehicleMasterById(
        dispatch,
        id,
        token,
        endPointBasedOnURL[modifyUrl(location.pathname).replace("/", "")]
      );
    }
  }, [dispatch, id, token, location.pathname]);

  // Dynamically select the form to render based on the URL
  const getFormType = () => {
    const formType = location.pathname.split("/")[1];
    return forms[formType];
  };

  const FormComponent = getFormType();

  return !loading ? (
    <>
      <div className="flex items-center gap-2 mb-5">
        {/* back button visiable on mobile screen  */}
        <button
          className="flex lg:hidden items-center gap-1 p-2 rounded-lg border-2 border-theme bg-theme text-gray-100"
          type="button"
          onClick={() => handlePreviousPage(navigate)}
        >
          {tableIcons?.backArrow}
          <span className="text-sm">Back</span>
        </button>
        {/* heading render dynamically based on url  */}
        <h1 className="text-xl lg:text-2xl uppercase font-bold text-theme">
          {location.pathname.includes("/all-bookings/")
            ? `${id ? "Edit" : "Add"} Booking${
                id ? `: #${vehicleMaster[0]?.bookingId}` : ""
              }`
            : `${id ? "Edit" : "Add"} ${formatPathNameToTitle(
                location.pathname
              )}`}
        </h1>
      </div>
      <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-5 mx-auto bg-white">
        {/* if id not present than go to create new vehicle or any other thing  */}
        <>
          <FormComponent
            handleFormSubmit={(event) =>
              handleCreateAndUpdateVehicle(
                event,
                dispatch,
                setFormLoading,
                token,
                navigate,
                tempIds,
                removeTempIds,
                id
              )
            }
            loading={formLoading}
          />
        </>
      </div>
    </>
  ) : (
    <PreLoader />
  );
};

export default CreateNewAndUpdateForm;
