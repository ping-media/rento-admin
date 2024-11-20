import { useSelector} from "react-redux";
import { BackButton, CreateUpdate, InputComponent, Loader, SelectComponent2, SelectComponent6, SelectStateCityRegion } from "../components/CommonComponents/commonComponents.jsx";

const CreateNewStation = () => {
  const loading = useSelector((state) => state.theme.loading);
  return (
    <>
      {
        loading ? <Loader /> : null
      }
      <div>
        <BackButton label="New Station" />
        <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-5 mx-auto bg-white">
          <div style={{ display: "flex", marginTop: "15px" }}>
            <InputComponent
              label="Station Id"
              type="text"
              placeholder="Please Enter Station Id"
              name="stationId"
            />
            <SelectComponent2 />
          </div>
          <div style={{ display: "flex", marginTop: "15px" }}>
            <InputComponent
              type="text"
              label="Station Name"
              placeholder="Please Enter Station Name"
              name="stationName"
            />
            <SelectComponent6 />
          </div>
          <SelectStateCityRegion />
          <div style={{ display: "flex", marginTop: "15px" }}>
            <InputComponent
              type="number"
              label="Pin Code"
              placeholder="Please Enter Pin Code"
              name="pinCode"
            />
            <InputComponent
              label="Address"
              type="text"
              placeholder="Please Enter Address"
              name="address"
            />
          </div>
          <div style={{ display: "flex", marginTop: "15px" }}>
            <InputComponent
              type="text"
              label="Latitude"
              placeholder="Please Enter latitude"
              name="latitude"
            />
            <InputComponent
              label="Longitude"
              type="text"
              placeholder="Please Enter Longitude"
              name="longitude"
            />
          </div>
          <CreateUpdate url="/createStation" />
        </div>
      </div>

    </>
  );
};

export default CreateNewStation;
