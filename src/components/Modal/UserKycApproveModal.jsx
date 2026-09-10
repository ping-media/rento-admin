import { useDispatch, useSelector } from "react-redux";
import { toogleKycModalActive } from "../../Redux/SideBarSlice/SideBarSlice";
import Input from "../../components/InputAndDropdown/Input";
import { getData, postData } from "../../Data/index";
import { useLocation, useParams } from "react-router-dom";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner/Spinner";
import { handleUpdateUserStatus } from "../../Redux/VehicleSlice/VehicleSlice";
import PhotoView from "../../components/Form/User Components/PhotoView";

const UserKycApproveModal = () => {
  const dispatch = useDispatch();
  const { isKycModalActive } = useSelector((state) => state.sideBar);
  const { userDocuments, vehicleMaster } = useSelector(
    (state) => state.vehicles,
  );
  const { id } = useParams();
  const location = useLocation();
  const { token } = useSelector((state) => state.user);
  const [userDocument, setUserDocument] = useState([]);
  const [formError, setFormError] = useState({
    aadharNumber: "",
    licenseNumber: "",
  });
  const [userDocumentLoading, setUserDocumentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //   approval of kyc
  const handleSubmitAndChangeKYCStatus = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const userId = !location.pathname?.includes("all-bookings/details/")
      ? id
      : vehicleMaster?.[0]?.userId?._id;

    formData.append("userId", userId);

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
        // setting the user info for better info
        if (response?.userInfo) {
          setError(response?.userInfo);
        }
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
      let docId = id;
      if (location.pathname.includes("/all-bookings/details/")) {
        docId = id.split("_")[0];
      }
      const response = await getData(`/getDocument?userId=${docId}`, token);
      if (response?.status !== 200) {
        return handleAsyncError(dispatch, response?.message);
      }
      const result = Array.isArray(response?.data)
        ? response?.data?.[0]?.files
        : response?.data;
      setUserDocument(result);
    } catch (error) {
      return handleAsyncError(dispatch, error?.message);
    } finally {
      setUserDocumentLoading(false);
    }
  };

  // checking whether the aadharNumber & licenseNumber is valid or not
  const validateInput = (e, name) => {
    const value = e.target.value;

    if (name === "aadharNumber") {
      if (value.length > 12 || value.length < 12) {
        setFormError((prev) => ({
          ...prev,
          aadharNumber: "Enter valid 12 digit Aadhar number",
        }));
      } else {
        setFormError((prev) => ({
          ...prev,
          aadharNumber: "",
        }));
      }
    }
  };

  // fetching user documents
  useEffect(() => {
    if (id && userDocuments === null) {
      handleFetchDocuments();
    }
  }, [id, userDocuments]);

  useEffect(() => {
    if (userDocuments !== null) {
      const result = Array.isArray(userDocuments)
        ? userDocuments?.[0]?.files
        : userDocuments;
      setUserDocument(result);
    }
  }, [userDocuments]);

  const hasDocuments = Array.isArray(userDocument) && userDocument?.length > 0;
  // const hasDocuments =
  //   Array.isArray(userDocument) && userDocument[0]?.files?.length > 0;

  return (
    <div
      className={`fixed ${
        !isKycModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-5 mx-auto shadow-xl rounded-md bg-white w-full lg:max-w-md">
        <div className="flex justify-between border-b p-2">
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

        <div className="p-6 pt-2 text-center">
          {!userDocumentLoading && !hasDocuments && (
            <div className="mb-3 rounded bg-yellow-100 border border-yellow-300 p-2 text-sm text-yellow-800 text-left">
              Please upload the KYC documents first before verifying.
            </div>
          )}

          {/* user documents  */}
          <div
            className="flex items-center flex-wrap gap-2 border-b mb-3"
            id="kyc-gallery"
          >
            {/* {!userDocumentLoading ? (
              (userDocument && userDocument[0]?.files?.length > 0) ||
              (userDocument && userDocument?.files) ? (
                userDocument[0]?.files?.map((item) => { */}
            {!userDocumentLoading ? (
              hasDocuments ? (
                userDocument?.map((item) => {
                  return (
                    <div className="mb-3 w-20" key={item?._id}>
                      <PhotoView
                        item={item}
                        className="w-20 h-20"
                        uniqueId="kyc-gallery"
                        showName={true}
                      />
                    </div>
                  );
                })
              ) : (
                <p className="text-red-500 italic text-sm mt-1 pb-1">
                  No documents found. Please upload the documents first.
                </p>
              )
            ) : (
              <div className="w-full text-gray-400 italic text-sm mt-1 pb-1 flex items-center justify-center">
                <Spinner textColor="black" message={"fetching documents..."} />
              </div>
            )}
          </div>
          {/* showing conflict user info here  */}
          {error && (
            <div className="mt-5 mb-3 text-sm text-red-600">
              <p className="text-left">
                These details are already linked to{" "}
                <span className="capitalize font-semibold">
                  {error?.name} ({error?.phone})
                </span>
                .
              </p>
            </div>
          )}

          {/* continue form  */}
          <form onSubmit={handleSubmitAndChangeKYCStatus}>
            <div className="mb-2">
              <Input
                item={"aadharNumber"}
                require={true}
                handlevalidateInput={validateInput}
                disabled={!hasDocuments}
              />
              {formError.aadharNumber !== "" && (
                <p className="text-sm text-red-500 text-left">
                  {formError.aadharNumber}
                </p>
              )}
            </div>
            <div className="mb-2">
              <Input
                item={"licenseNumber"}
                require={true}
                handlevalidateInput={validateInput}
                disabled={!hasDocuments}
              />
              {formError.licenseNumber !== "" && (
                <p className="text-sm text-red-500 text-left">
                  {formError.licenseNumber}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-theme text-gray-100 rounded-md px-4 py-2.5 mt-3 disabled:bg-theme/60 flex items-center w-full justify-center"
              disabled={
                loading ||
                !hasDocuments ||
                formError?.aadharNumber !== "" ||
                formError?.licenseNumber !== ""
              }
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
