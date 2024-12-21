import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../InputAndDropdown/Input";
import SelectDropDown from "../InputAndDropdown/SelectDropDown";
import Spinner from "../Spinner/Spinner";
import { useParams } from "react-router-dom";
import { getData } from "../../Data";
// import { endPointBasedOnKey } from "../../Data/commonData";

const PlanForm = ({ handleFormSubmit, loading }) => {
  const { vehicleMaster } = useSelector((state) => state.vehicles);
  const [collectedData, setCollectedData] = useState([]);
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);

  const fetchCollectedData = async (userUrl) => {
    const userResponse = await getData(userUrl, token);

    if (userResponse) {
      return setCollectedData({
        userId: userResponse?.data,
      });
    }
  };
  useEffect(() => {
    fetchCollectedData("/getAllUsers?userType=customer");
  }, []);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-wrap gap-4">
        {/* for updating the value of the existing one & for creating new one */}
        <>
          {/* <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"userId"}
              options={(collectedData && collectedData?.userId) || []}
              value={id ? vehicleMaster[0]?.userId : ""}
            />
          </div> */}
          <div className="w-full lg:w-[48%]">
            <Input
              item={"couponName"}
              value={id ? vehicleMaster[0]?.couponName : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"discountType"}
              value={id ? vehicleMaster[0]?.discountType : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <Input
              item={"discount"}
              value={id ? vehicleMaster[0]?.discount : ""}
            />
          </div>
          <div className="w-full lg:w-[48%]">
            <SelectDropDown
              item={"isCouponActive"}
              options={["active", "inActive"]}
              value={id ? vehicleMaster[0]?.isCouponActive : ""}
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

export default PlanForm;
