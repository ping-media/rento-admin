import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import Spinner from "../Spinner/Spinner";
import { useParams } from "react-router-dom";
import { userType } from "../../Data/commonData";

const UserForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const { id } = useParams();

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one & for creating new one */}
        <>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"firstName"}
              value={id ? vehicleMaster[0]?.firstName : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"lastName"}
              value={id ? vehicleMaster[0]?.lastName : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"contact"}
              value={id ? vehicleMaster[0]?.contact : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"email"}
              type="email"
              value={id ? vehicleMaster[0]?.email : ""}
            />
          </div>
          {!id && (
            <div className="w-full lg:w-[48%]">
              <Input item={"password"} type="password" />
            </div>
          )}
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"userType"}
              options={userType}
              value={id ? vehicleMaster[0]?.userType : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"KycApproved"}
              options={["yes", "no"]}
              value={id ? vehicleMaster[0]?.kycApproved : "no"}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"isContactVerified"}
              options={["yes", "no"]}
              value={id ? vehicleMaster[0]?.isContactVerified : "no"}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"isEmailVerified"}
              options={["yes", "no"]}
              value={id ? vehicleMaster[0]?.isEmailVerified : "no"}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"status"}
              options={["active", "inActive"]}
              value={id ? vehicleMaster[0]?.status : "active"}
            />
          </div>
        </>
      </div>
      <button
        className="bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
        type="submit"
        disabled={loading}
      >
        {loading ? <Spinner message={"uploading"} /> : "Publish"}
      </button>
    </form>
  );
};

export default UserForm;
