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

const CreateNewAndUpdateForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = useState(false);
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.vehicles);

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
    const formType = location.pathname.split("/")[1]; // Assuming the first part of the URL defines the form type
    return forms[formType] || CouponForm; // Default to CouponForm if no match is found
  };

  const FormComponent = getFormType();

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
          <FormComponent
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

export default CreateNewAndUpdateForm;
