import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import Spinner from "../Spinner/Spinner";
import { useParams } from "react-router-dom";
import { userType } from "../../Data/commonData";
import UserDocuments from "./User Components/UserDocuments";

const UserForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { id } = useParams();

  return (
    vehicleMaster && (
      <>
        <form className="mb-5" onSubmit={handleFormSubmit}>
          <div className="flex flex-wrap gap-4">
            <>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"firstName"}
                  value={
                    id || location.pathname == "/profile"
                      ? vehicleMaster[0]?.userId?.firstName ||
                        vehicleMaster?.firstName ||
                        vehicleMaster[0]?.firstName
                      : ""
                  }
                  require={true}
                />
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"lastName"}
                  value={
                    id || location.pathname == "/profile"
                      ? vehicleMaster[0]?.userId?.lastName ||
                        vehicleMaster?.lastName ||
                        vehicleMaster[0]?.lastName
                      : ""
                  }
                  require={true}
                />
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"contact"}
                  type="number"
                  value={
                    id || location.pathname == "/profile"
                      ? Number(vehicleMaster[0]?.userId?.contact) ||
                        Number(vehicleMaster?.contact) ||
                        Number(vehicleMaster[0]?.contact)
                      : ""
                  }
                  require={true}
                  disabled={location?.pathname == "/profile" ? true : false}
                />
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"altContact"}
                  type="number"
                  value={
                    id || location.pathname == "/profile"
                      ? (() => {
                          const altContact =
                            vehicleMaster[0]?.userId?.altContact ??
                            vehicleMaster?.altContact ??
                            vehicleMaster[0]?.altContact;

                          return altContact &&
                            altContact !== "Na" &&
                            !isNaN(altContact)
                            ? Number(altContact)
                            : "";
                        })()
                      : ""
                  }
                  require={true}
                />
              </div>
              <div className="w-full lg:w-[48%]">
                <Input
                  item={"email"}
                  type="email"
                  value={
                    id || location.pathname == "/profile"
                      ? vehicleMaster[0]?.userId?.email ||
                        vehicleMaster?.email ||
                        vehicleMaster[0]?.email
                      : ""
                  }
                  require={true}
                />
              </div>
              {location.pathname !== "/profile" && (
                <div className="w-full lg:w-[48%]">
                  <Input
                    item={"addressProof"}
                    value={
                      id
                        ? vehicleMaster[0]?.userId?.addressProof ||
                          vehicleMaster?.addressProof ||
                          vehicleMaster[0]?.addressProof
                        : ""
                    }
                  />
                </div>
              )}
              {location.pathname !== "/profile" && (
                <div className="w-full lg:w-[48%]">
                  <Input
                    type="date"
                    item={"dateofbirth"}
                    placeholder={"Date of Birth"}
                    value={
                      id
                        ? vehicleMaster[0]?.userId?.dateofbirth !== "Na"
                          ? vehicleMaster[0]?.userId?.dateofbirth
                          : "" || vehicleMaster?.dateofbirth !== "Na"
                          ? vehicleMaster?.dateofbirth
                          : "" || vehicleMaster[0]?.dateofbirth !== "Na"
                          ? vehicleMaster[0]?.dateofbirth
                          : ""
                        : ""
                    }
                  />
                </div>
              )}
            </>
            {!id && (
              <div className="w-full lg:w-[48%]">
                <Input item={"password"} type="password" />
              </div>
            )}
            {location.pathname != "/profile" && (
              <>
                <div className="w-full lg:w-[48%]">
                  <SelectDropDown
                    item={"userType"}
                    options={userType}
                    value={
                      id
                        ? vehicleMaster[0]?.userId?.userType ||
                          vehicleMaster?.userType ||
                          vehicleMaster[0]?.userType
                        : ""
                    }
                    require={true}
                  />
                </div>
                <div className="w-full lg:w-[48%]">
                  <SelectDropDown
                    item={"isContactVerified"}
                    options={["yes", "no"]}
                    value={
                      id
                        ? vehicleMaster[0]?.userId?.isContactVerified ||
                          vehicleMaster?.isContactVerified ||
                          vehicleMaster[0]?.isContactVerified
                        : "no"
                    }
                    require={true}
                  />
                </div>
                <div className="w-full lg:w-[48%]">
                  <SelectDropDown
                    item={"isEmailVerified"}
                    options={["yes", "no"]}
                    value={
                      id
                        ? vehicleMaster[0]?.userId?.isEmailVerified ||
                          vehicleMaster?.isEmailVerified ||
                          vehicleMaster[0]?.isEmailVerified
                        : "no"
                    }
                    require={true}
                  />
                </div>
                <div className="w-full lg:w-[48%]">
                  <SelectDropDown
                    item={"status"}
                    options={["active", "inactive"]}
                    value={
                      id
                        ? vehicleMaster[0]?.userId?.status ||
                          vehicleMaster?.status ||
                          vehicleMaster[0]?.status
                        : "active"
                    }
                    require={true}
                  />
                </div>
              </>
            )}
          </div>
          <button
            className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Spinner
                message={
                  location.pathname == "/profile" ? "updating" : "uploading"
                }
              />
            ) : id ? (
              "Update"
            ) : location.pathname === "/profile" ? (
              "Update"
            ) : (
              "Add New"
            )}
          </button>
        </form>
        {/* for showing user documents  */}
        {location.pathname !== "/profile" && (
          <UserDocuments
            dataId={vehicleMaster[0]?._id}
            data={
              vehicleMaster[0]?.files && vehicleMaster[0]?.files?.length > 0
                ? vehicleMaster[0]?.files
                : []
            }
            hookLoading={loading}
          />
        )}
      </>
    )
  );
};

export default UserForm;
