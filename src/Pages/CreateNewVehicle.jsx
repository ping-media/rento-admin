import { useSelector } from "react-redux";
import { BackButton, CreateUpdate, ImageComponent, InputComponent, Loader, SelectComponent4, SelectComponent5 } from "../components/CommonComponents/commonComponents.jsx";

const CreateNewVehicle = () => {
  const loading = useSelector((state) => state.theme.loading);

  return (
    <>
      {
        loading ? <Loader /> : ""
      }
      <BackButton label="Master Vehicle"/>
      <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-5 mx-auto bg-white">
        <ImageComponent label={"Vehicle Image"} name={"vehicleImage"} />
        <div style={{ display: "flex", marginTop: "15px" }}>
          <InputComponent
            label="Vehicle Name"
            type="text"
            placeholder="Please Enter Vehicle Name"
            name="vehicleName"
          />
        </div>
        <div style={{ display: "flex", marginTop: "15px" }}>
          <SelectComponent4 />
          <SelectComponent5 />
        </div>
        <CreateUpdate url="/createVehicleMaster" />
      </div>
    </>
  );
};

export default CreateNewVehicle;
