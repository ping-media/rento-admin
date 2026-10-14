import { Switch } from "../../InputAndDropdown/InputSwitch";
import { postData } from "../../../Data";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { patchMasterUser } from "../../../Redux/VehicleSlice/VehicleSlice";
import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";

const SWITCHES = [
  //   {
  //     field: "isContactVerified",
  //     title: "Contact Verified",
  //     on: "Mobile number confirmed",
  //     off: "Mobile not confirmed",
  //   },
  //   {
  //     field: "isEmailVerified",
  //     title: "Email Verified",
  //     on: "Email address confirmed",
  //     off: "Email not confirmed",
  //   },
  {
    field: "status",
    title: "Account Status",
    on: "User can login",
    off: "Login blocked",
  },
];

const toApiValue = (field, checked) => {
  if (field === "status") return checked ? "active" : "inactive";
  return checked ? "yes" : "no";
};

const isOn = (field, value) =>
  field === "status" ? value === "active" : value === "yes";

const UserStatusSwitches = ({ isAdmin = false }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { token } = useSelector((state) => state.user);
  const [loadingField, setLoadingField] = useState(null);

  const userData =
    vehicleMaster?.[0]?.userId ||
    vehicleMaster?.userId ||
    vehicleMaster?.[0] ||
    vehicleMaster;

  const handleToggle = async (field, checked) => {
    const previousValue = userData?.[field];
    const newValue = toApiValue(field, checked);

    // optimistic update in redux
    dispatch(patchMasterUser({ [field]: newValue }));
    setLoadingField(field);

    try {
      const response = await postData(
        `/change-user-profile`,
        { _id: id, [field]: newValue },
        token,
      );

      if (response?.status !== 200) {
        handleAsyncError(dispatch, response?.message || "Update failed");
      }
    } catch (error) {
      // roll back redux to the old value
      dispatch(patchMasterUser({ [field]: previousValue }));
      console.error(error);
    } finally {
      setLoadingField(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 mb-5">
      {SWITCHES.map(({ field, title, on, off }) => {
        const checked = isOn(field, userData?.[field]);

        return (
          <div
            key={field}
            className="flex items-center justify-between gap-3 border rounded-md px-3 py-2"
          >
            <div>
              <p className="font-semibold text-base leading-tight">{title}</p>
              <p className="text-xs text-gray-500">{checked ? on : off}</p>
            </div>
            {isAdmin ? (
              <Switch
                checked={checked}
                disabled={loadingField === field}
                onChange={(e) => handleToggle(field, e.target.checked)}
              />
            ) : (
              <div
                className={`flex items-center gap-1 px-4 py-1.5 rounded-full ${userData?.[field] === "active" ? "bg-emerald-100 text-[#059669]" : "bg-red-100 text-[#E23844]"}`}
              >
                <svg
                  width="5"
                  height="6"
                  viewBox="0 0 5 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="2.5"
                    cy="3"
                    r="2.5"
                    fill={`${
                      userData?.[field] === "active" ? "#059669" : "#E23844"
                    }`}
                  ></circle>
                </svg>
                <span className="capitalize">{userData?.[field]}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserStatusSwitches;
