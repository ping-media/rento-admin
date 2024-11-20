import { BackButton, CreateUpdate, ImageComponent, InputComponent, Loader } from "../components/CommonComponents/commonComponents.jsx";
import {  useSelector } from "react-redux";

const CreateNewLocation = () => {
  const { loading } = useSelector(state => state.theme)

  return (
    <>
      {
        loading ? <Loader /> : null
      }
      <BackButton label="New Location" />
      <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-5 mx-auto bg-white">
        <ImageComponent
          label="Location Image"
          name="locationImage"
        />
        <div style={{ display: "flex", marginTop: "15px" }}>
          <InputComponent
            type="text"
            label="Location Name"
            placeholder="Please Enter Location Name"
            name="locationName"
          />
        </div>
        <CreateUpdate url="/createLocation" />
      </div>
    </>
  );
};

export default CreateNewLocation;
