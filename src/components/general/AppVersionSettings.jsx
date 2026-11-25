import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { Switch } from "../../components/InputAndDropdown/InputSwitch";
import Spinner from "../../components/Spinner/Spinner";
import { updateAppInfo } from "../../Redux/GeneralSlice/GeneralSlice";

const VERSION_REGEX = /^\d+\.\d+\.\d+$/;

// numbers and dots only, max 3 parts (1.2.3)
const sanitizeVersion = (value) =>
  value
    .replace(/[^\d.]/g, "")
    .replace(/^\./, "")
    .replace(/\.{2,}/g, ".")
    .split(".")
    .slice(0, 3)
    .join(".");

// -1 if a < b, 0 if equal, 1 if a > b
const compareVersions = (a, b) => {
  const x = a.split(".").map(Number);
  const y = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0) ? 1 : -1;
  }
  return 0;
};

const AppVersionSettings = ({ android, ios }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <PlatformCard platform="android" label="Android" info={android} />
    <PlatformCard platform="ios" label="iOS" info={ios} />
  </div>
);

export default AppVersionSettings;

const PlatformCard = ({ platform, label, info }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const savedVersion = info?.latestVersion || "";
  const savedForce = !!info?.forceUpdate;

  const [version, setVersion] = useState(savedVersion);
  const [force, setForce] = useState(savedForce);
  const [saving, setSaving] = useState(false);
  const [confirmOld, setConfirmOld] = useState(false);

  // keep the form in sync after a save or a refetch
  useEffect(() => {
    setVersion(savedVersion);
    setForce(savedForce);
    setConfirmOld(false);
  }, [savedVersion, savedForce]);

  const versionChanged = version !== savedVersion;
  const forceChanged = force !== savedForce;
  const isDirty = versionChanged || forceChanged;
  const isLower =
    versionChanged &&
    VERSION_REGEX.test(version) &&
    VERSION_REGEX.test(savedVersion) &&
    compareVersions(version, savedVersion) < 0;

  const save = async () => {
    if (versionChanged && !VERSION_REGEX.test(version))
      return handleAsyncError(
        dispatch,
        "Version must look like 1.2.3 (numbers only)",
      );

    // older version: ask once before saving
    if (isLower && !confirmOld) return setConfirmOld(true);

    try {
      setSaving(true);
      const response = await postData(
        "/general/app-info",
        {
          platform,
          ...(versionChanged ? { latestVersion: version } : {}),
          ...(forceChanged ? { forceUpdate: force } : {}),
        },
        token,
      );
      if (response?.success) {
        dispatch(updateAppInfo(response.data.appInfo));
        handleAsyncError(dispatch, `${label} app info updated`, "success");
      } else {
        handleAsyncError(dispatch, response?.message || "Unable to update");
      }
    } catch (error) {
      handleAsyncError(dispatch, error?.message);
    } finally {
      setSaving(false);
      setConfirmOld(false);
    }
  };

  return (
    <div className="border rounded-md p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{label}</h3>
        <span className="text-xs text-gray-500">
          Current: {savedVersion || "--"}
        </span>
      </div>

      <div>
        <label className="text-sm font-medium">Latest version</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="1.2.3"
          maxLength={20}
          className="block w-full rounded-md outline-none ring-1 ring-inset ring-gray-400 px-5 py-3 text-sm mt-1"
          value={version}
          onChange={(e) => {
            setVersion(sanitizeVersion(e.target.value));
            setConfirmOld(false);
          }}
        />
        <p className="text-xs text-gray-500 mt-1">
          Numbers only, in the format 1.2.3.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">Force update</span>
        <Switch
          checked={force}
          onChange={() => setForce((v) => !v)}
          disabled={saving}
        />
      </div>

      {force && !savedForce && (
        <p className="text-xs text-amber-700">
          With force update on, app users below the latest version cannot use
          the app until they update.
        </p>
      )}

      {confirmOld && (
        <div className="border border-amber-300 bg-amber-50 text-amber-800 rounded-md p-2 text-xs">
          <b>{version}</b> is older than the current <b>{savedVersion}</b>.
          Users who are on a version between {version} and {savedVersion} will
          stop getting the update prompt, and force update will no longer apply
          to them. Only continue if you are rolling back on purpose.
        </div>
      )}

      <div className="flex justify-end gap-2">
        {confirmOld && (
          <button
            type="button"
            onClick={() => setConfirmOld(false)}
            disabled={saving}
            className="px-4 py-1.5 rounded-md border border-gray-400 text-sm"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={save}
          disabled={!isDirty || saving}
          className="px-4 py-1.5 rounded-md bg-theme text-white text-sm disabled:bg-gray-400 flex items-center"
        >
          {saving ? (
            <Spinner />
          ) : confirmOld ? (
            "Yes, set older version"
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};
