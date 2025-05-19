import React, { useState } from "react";
import WebSettings from "./WebSettings";
import { useDispatch, useSelector } from "react-redux";
import PreLoader from "../Skeleton/PreLoader";
import AppLink from "./AppLink";
import { postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { updateGeneralInfo } from "../../Redux/GeneralSlice/GeneralSlice";
import Spinner from "../Spinner/Spinner";
import SocialMedia from "./SocialMedia.jsx";

const Button = ({ label = "update", disabled = false }) => (
  <button
    type="submit"
    className="bg-theme px-3 py-1.5 rounded-md text-white disabled:bg-theme/80"
    disabled={disabled}
  >
    {label}
  </button>
);

const WebsiteForm = () => {
  const { general, loading } = useSelector((state) => state.general);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmitBasic = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = Object.fromEntries(formData.entries());

    try {
      setFormLoading(true);
      const response = await postData(
        "/updateGeneralBasic",
        { updates: result },
        token
      );
      if (response?.success) {
        dispatch(updateGeneralInfo(result));
        handleAsyncError(dispatch, response?.message, "success");
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <PreLoader />;
  }
  return (
    <form onSubmit={handleSubmitBasic}>
      <h2 className="text-md lg:text-lg font-semibold mb-3 border-b uppercase">
        Basic Info
      </h2>
      <div className="mb-3">
        <WebSettings data={general?.info} loading={loading} />
      </div>

      <div className="mb-3 pb-1 flex items-center justify-between border-b">
        <h2 className="text-md lg:text-lg font-semibold uppercase">
          Social Media
        </h2>
      </div>
      <div className="mb-3">
        <SocialMedia
          data={general?.info?.socialmedia && general?.info?.socialmedia}
        />
      </div>

      <h2 className="text-md lg:text-lg font-semibold mb-3 border-b uppercase">
        App Links
      </h2>
      <div className="mb-3">
        <AppLink data={general?.info?.appLink} loading={loading} />
      </div>
      <div className="text-left">
        <Button
          label={
            formLoading ? (
              <div className="flex items-center gap-2">
                <Spinner /> updating
              </div>
            ) : (
              "update"
            )
          }
          disabled={formLoading}
        />
      </div>
    </form>
  );
};

export default WebsiteForm;
