import { InputComponent, SelectComponent3, SelectComponent, SelectComponent2, Loader, CreateUpdate, BackButton, SwitchComponent } from "../components/CommonComponents/commonComponents.jsx";
import { useSelector } from "react-redux";
import { colorArr, staticData, statusArr } from "../constant.js";

const CreateNewVehicleTbl = () => {
  const isLoading = useSelector((state) => state.theme.loading);
  return (
    <>
      {
        isLoading ? <Loader /> : ""
      }
      <BackButton label="New Vehicle Table" />
      <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-5 mx-auto bg-white">
        <div style={{ display: "flex", marginTop: "15px" }}>
          <SelectComponent3 />
          <InputComponent
            label="Free Kms"
            type="text"
            placeholder="Please Enter free Kms"
            name="freeKms"
          />
        </div>
        <div style={{ display: "flex", marginTop: "15px" }}>
          <SelectComponent2 />
          <InputComponent
            type="text"
            label={"Station Id"}
            placeholder="Please Enter Vehicle station Id"
            name="stationId"
          />
        </div>
        <div style={{ display: "flex", marginTop: "15px" }}>
          <InputComponent
            type="text"
            label="Vehicle Number"
            placeholder="Please Enter Vehicle vehicle number"
            name="vehicleNumber"
          />
          <InputComponent
            type="text"
            label={"Vehicle Model"}
            placeholder="Please Enter Vehicle vehicle model"
            name="vehicleModel"
          />
        </div>
        <div style={{ display: "flex", marginTop: "15px" }}>
          <InputComponent
            type="text"
            label="Extra Kms Charges"
            placeholder="Please Enter Vehicle extra Kms Charges"
            name="extraKmsCharges"
          />
          <SelectComponent name="vehicleColor" label={"Vehicle Color"} data={colorArr} />
        </div>
        <div style={{ display: "flex", marginTop: "15px" }}>
          <InputComponent
            type="text"
            label="Per Day Cost"
            placeholder="Please Enter Per Day Cost"
            name="extraKmsCharges"
          />
          <InputComponent
            type="text"
            label="Last Service Date"
            placeholder="Please Enter Last Service Date"
            name="lastServiceDate"
          />
        </div>
        <div style={{ display: "flex", marginTop: "15px" }}>
          <InputComponent
            type="text"
            label="Kms Run"
            placeholder="Please Enter Kms Run"
            name="kmsRun"
          />
          <SwitchComponent name="isBooked" label={"Is Booked"} />
        </div>
        <div style={{ display: "flex", marginTop: "15px" }}>
          <InputComponent
            type="text"
            label="Condition"
            placeholder="Please Enter Condition"
            name="extraKmsCharges"
          />
          <SelectComponent name="vehicleStatus" label={"Vehicle Type"} data={statusArr} />
        </div>
        <CreateUpdate url="/createVehicle" />


      </div>
    </>
  );
};

export default CreateNewVehicleTbl;
