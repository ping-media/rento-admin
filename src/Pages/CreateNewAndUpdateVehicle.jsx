import { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { endPointBasedOnURL } from "../Data/commonData.js";
const VehicleForm = lazy(() => import("../components/Form/VehicleForm.jsx"));

const CreateNewAndUpdateVehicle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = useState(false);
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { vehicleMaster, loading } = useSelector((state) => state.vehicles);

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
  }, []);

  // const handleCreateAndUpdateVehicle = async (event) => {
  //   event.preventDefault();
  //   setFormLoading(true);
  //   const response = new FormData(event.target);
  //   let result = Object.fromEntries(response.entries());
  //   // appending the id which is taken from url
  //   if (id) {
  //     result = Object.assign(result, { _id: id });
  //   }

  //   const endpoint = `${
  //     endPointBasedOnURL[modifyUrl(location?.pathname)]
  //   }?_id=${id}`;

  //   console.log(
  //     `${endPointBasedOnURL[modifyUrl(location?.pathname)]}?_id=${id}`,
  //     result
  //   );

  //   // try {
  //   //   const response = await postData(endpoint, result, token);
  //   //   if (response?.status == 200) {
  //   //     handleAsyncError(dispatch, response?.message, "success");
  //   //     navigate(removeAfterSecondSlash(location?.pathname));
  //   //   } else {
  //   //     handleAsyncError(dispatch, response?.message);
  //   //   }
  //   // } catch (error) {
  //   //   handleAsyncError(dispatch, error?.message);
  //   // }
  //   return setFormLoading(false);
  // };

  useEffect(() => {
    console.log(location.pathname);
  }, []);

  return !loading ? (
    <>
      <div className="flex items-center gap-2 mb-5">
        <button
          className="flex lg:hidden items-center gap-1 p-2 rounded-lg border-2 border-theme bg-theme text-gray-100"
          type="button"
          onClick={() => handlePreviousPage(navigate)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H6M12 5l-7 7 7 7" />
          </svg>
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-xl lg:text-2xl uppercase font-bold text-theme">
          {id ? "Edit" : "Add"} {formatPathNameToTitle(location.pathname)}
        </h1>
      </div>
      <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-5 mx-auto bg-white">
        {/* if id not present than go to create new vehicle or any other thing  */}
        <>
          <VehicleForm
            handleFormSubmit={(event) =>
              handleCreateAndUpdateVehicle(
                event,
                dispatch,
                setFormLoading,
                id,
                token,
                navigate
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

export default CreateNewAndUpdateVehicle;
