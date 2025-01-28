import { useDispatch, useSelector } from "react-redux";
import { toogleKycModalActive } from "../../Redux/SideBarSlice/SideBarSlice";
import Input from "../../components/InputAndDropdown/Input";
import { getData, postData } from "../../Data/index";
import { useParams } from "react-router-dom";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner/Spinner";
import { handleUpdateUserStatus } from "../../Redux/VehicleSlice/VehicleSlice";

const UserKycApproveModal = () => {
  const dispatch = useDispatch();
  const { isKycModalActive } = useSelector((state) => state.sideBar);
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const [userDocument, setUserDocument] = useState([]);
  const [userDocumentLoading, setUserDocumentLoading] = useState([]);
  const [loading, setLoading] = useState(false);

  //   approval of kyc
  const handleSubmitAndChangeKYCStatus = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("userId", id);
    try {
      setLoading(true);
      const response = await postData("/kycApproval", formData, token);
      if (response?.status === 200) {
        const updateUserFlag = { kycApproved: "yes" };
        // updating the state
        dispatch(handleUpdateUserStatus(updateUserFlag));
        dispatch(toogleKycModalActive());
        return handleAsyncError(dispatch, response?.message, "success");
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setLoading(false);
    }
  };

  // fetchDocument data
  const handleFetchDocuments = async () => {
    try {
      setUserDocumentLoading(true);
      const response = await getData(`/getDocument?userId=${id}`, token);
      if (response?.status !== 200) {
        return handleAsyncError(dispatch, response?.message);
      }
      return setUserDocument(response?.data);
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setUserDocumentLoading(false);
    }
  };

  // fetching user documents
  useEffect(() => {
    if (id) {
      handleFetchDocuments();
    }
  }, [id]);

  return (
    <div
      className={`fixed ${
        !isKycModalActive ? "hidden" : ""
      } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-5 mx-auto shadow-xl rounded-md bg-white w-full lg:max-w-xl">
        <div className="flex justify-between p-2">
          <h2 className="text-theme text-lg uppercase font-semibold">
            Kyc Verify
          </h2>
          <button
            onClick={() => dispatch(toogleKycModalActive())}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            disabled={loading || false}
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

        <div className="p-6 pt-0 text-center">
          {/* user documents  */}
          <div className="lg:flex items-center gap-2 mb-3">
            {(userDocument && userDocument[0]?.files?.length > 0) ||
            (userDocument && userDocument?.files) ? (
              userDocument[0]?.files?.map((item, index) => {
                if (index % 2 !== 0) {
                  return null;
                }
                return (
                  <div className="w-full flex-1 h-48 mb-3" key={item?._id}>
                    <img
                      src={item.imageUrl}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 italic text-sm mt-1">
                No Images Found.
              </p>
            )}
          </div>
          {/* continue form  */}
          <form onSubmit={handleSubmitAndChangeKYCStatus}>
            <div className="mb-2">
              <Input item={"aadharNumber"} require={true} />
            </div>
            <div className="mb-2">
              <Input item={"licenseNumber"} require={true} />
            </div>
            <button
              type="submit"
              className="bg-theme text-gray-100 rounded-md px-4 py-2.5 mt-2.5 disabled:bg-gray-400"
              disabled={loading}
            >
              {!loading ? "Verify" : <Spinner message={"checking..."} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserKycApproveModal;
