import { useDispatch, useSelector } from "react-redux";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
//import Spinner from "../Spinner/Spinner";
import { useEffect, useState } from "react";
import { toggleEditLimitModal } from "../../Redux/SideBarSlice/SideBarSlice";

const EditLimitModal = () => {
  const dispatch = useDispatch();
  const { isEditLimitModalActive } = useSelector((state) => state.sideBar);
  const { editLimit } = useSelector((state) => state.sideBar);
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);

  // setting the current limit in input when user click on edit button
  useEffect(() => {
    if (editLimit) {
      setLimit(editLimit.limit);
    } else if (!isEditLimitModalActive) {
      setLimit("");
    }
  }, [editLimit]);

  const handleUpdateLimit = async (event) => {
    event.preventDefault();
    setLoading(true);
    return setLoading(false);
  };

  return (
    <div
      className={`fixed ${
        !false ? "hidden" : ""
      } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
    >
      <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
        <div className="flex justify-end p-2">
          <button
            onClick={() => dispatch(toggleEditLimitModal())}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
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
        <div className="px-6 py-3">
          <p className="text-sm mb-5 text-gray-400 uppercase">
            Edit Max Download Limit
          </p>
          <form onSubmit={handleUpdateLimit}>
            <div className="mb-10">
              <input
                id="downloadLimit"
                name="downloadLimit"
                type="text"
                className="w-full border-b border-gray-300 px-3 py-2 border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
                placeholder="Enter Download Limit"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-theme-blue hover:bg-theme-blue-light text-gray-100 transition duration-300 ease-in-out px-3 py-2 w-full rounded-lg disabled:bg-gray-400"
              disabled={loading}
            >
              {/* {loading ? (
                <Spinner message={"updating..."} />
              ) : (
                "Update Max Download Limit"
              )} */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLimitModal;
