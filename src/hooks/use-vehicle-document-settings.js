import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData, patchData } from "../Data/index";
import { handleAsyncError } from "../utils/Helper/handleAsyncError";

const getMessage = (res, fallback = "Something went wrong") =>
  typeof res === "string" ? res : res?.message || fallback;

const useVehicleDocumentSettings = (enabled = true) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const [settings, setSettings] = useState(null); // { allowCustomerView, visibleDocumentTypes }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getData("/vehicle-document-settings", token);
      if (res?.success) setSettings(res.data);
      else
        handleAsyncError(dispatch, getMessage(res, "Unable to load settings"));
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
    } finally {
      setLoading(false);
    }
  }, [token, enabled]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // changes: { allowCustomerView? , visibleDocumentTypes? }
  const saveSettings = async (changes) => {
    try {
      setSaving(true);
      const res = await patchData("/vehicle-document-settings", changes, token);
      if (res?.success) {
        setSettings((prev) => ({ ...prev, ...res.data }));
        return true;
      }
      handleAsyncError(dispatch, getMessage(res, "Unable to save settings"));
      return false;
    } catch (e) {
      handleAsyncError(dispatch, e?.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { settings, loading, saving, saveSettings };
};

export default useVehicleDocumentSettings;
