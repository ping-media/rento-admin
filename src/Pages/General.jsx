import { useDispatch, useSelector } from "react-redux";
import { getData } from "../Data/index";
import React, { useCallback, useEffect, useState } from "react";
import {
  addGeneral,
  startLoading,
  stopLoading,
} from "../Redux/GeneralSlice/GeneralSlice";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import GeneralForm from "../components/general/GeneralForm";
import TabButton from "../components/TabButton/TabButton";
import GeneralAddOn from "../components/general/GeneralAddOn";

const General = () => {
  const { token } = useSelector((state) => state.user);
  const [tab, setTab] = useState("general");
  const dispatch = useDispatch();

  const getGeneralSettings = useCallback(async () => {
    try {
      dispatch(startLoading());
      const response = await getData("/general", token);
      if (response.success === true) {
        dispatch(addGeneral(response.data));
      } else if (response.success === false) {
        handleAsyncError(
          dispatch,
          "Unable to Load General Settings! try again"
        );
        dispatch(stopLoading());
        return;
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    getGeneralSettings();
  }, []);

  return (
    <>
      <div className="flex items-center flex-wrap justify-between">
        <h1 className="text-xl uppercase font-bold text-theme mb-5">
          General Settings
        </h1>
        <div className="w-full md:w-2/5 lg:w-1/3">
          <TabButton
            options={[
              { id: "general", title: "General" },
              { id: "addon", title: "Add-On" },
            ]}
            tab={tab}
            setTab={setTab}
          />
        </div>
      </div>

      <div className="bg-white p-2 shadow-md rounded-md">
        {tab === "general" && <GeneralForm />}
        {tab === "addon" && <GeneralAddOn />}
      </div>
    </>
  );
};

export default General;
