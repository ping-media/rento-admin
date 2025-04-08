import { useDispatch, useSelector } from "react-redux";
import { getData } from "../Data/index";
import React, { useCallback, useEffect } from "react";
import {
  addGeneral,
  startLoading,
  stopLoading,
} from "../Redux/GeneralSlice/GeneralSlice";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";
import GeneralForm from "../components/general/GeneralForm";

const General = () => {
  const { token } = useSelector((state) => state.user);
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
      <h1 className="text-xl uppercase font-bold text-theme mb-5">
        General Settings
      </h1>

      <div>
        <GeneralForm />
      </div>
    </>
  );
};

export default General;
