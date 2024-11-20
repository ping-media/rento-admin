import { useSelector } from "react-redux";
import { BackButton, CreateUpdate, ImageComponent, InputComponent, Loader, SelectComponent, SwitchComponent } from "../components/CommonComponents/commonComponents.jsx";
import {  statusArr, UserTypeArr } from "../constant.js";

const CreateNewUser = () => {
  const loading = useSelector((state) => state.theme.loading);
  return (
    <>
      {
        loading ? <Loader /> : null
      }
      <BackButton label="New User" />
      <div className="w-full lg:w-[95%] shadow-lg rounded-xl p-5 mx-auto bg-white">
        <div style={{ display: "flex", marginTop: "15px" }}>
          <SelectComponent
            label={"User Type"}
            name="userType"
            data={UserTypeArr}
          />
          <InputComponent
            label={"First Name"}
            type="text"
            placeholder="Please Enter firstName"
            name="firstName"
          />
        </div>
        <div style={{ display: "flex", marginTop: "15px" }}>
          <InputComponent
            label={"Last Name"}
            type="text"
            placeholder="Please Enter lastName"
            name="lastName"
          />
          <InputComponent
            label={"Email"}
            type="text"
            placeholder="Please Enter email"
            name="email"
          />
        </div>
        <div style={{ display: "flex", marginTop: "15px" }}>
          <InputComponent
            type="number"
            label={"Contact"}
            placeholder="Please Enter contact"
            name="contact"
          />
          <InputComponent
            label={"Alternate Contact"}
            type="text"
            placeholder="Please Enter altContact"
            name="altContact"
          />
        </div>
        <div style={{ display: "flex", marginTop: "15px" }}>
          <SelectComponent
            label={"Status"}
            name="status"
            data={statusArr}
          />
          <InputComponent
            label={"Password"}
            type="password"
            placeholder="Please Enter password"
            name="password"
          />
        </div>
        <div style={{ display: "flex", marginTop: "15px" }}>
          <SwitchComponent
            label={"Is Email Verified"}
            name="isEmailVerified"
          />
          <SwitchComponent
            label={"Is Contact Verified"}
            name="isContactVerified"
          />
          <SwitchComponent
            label={"KYC Approved"}
            name="kycApproved"
            //style={true}
          />
        </div>
        <div style={{ display: "flex", marginTop: "15px" }}>
        <ImageComponent label={"Address Proof"} name={"addressProof"} />
          <ImageComponent label={"Id Proof"} name={"idProof"} />
          <ImageComponent label={"Driving Licence"} name={"drivingLicence"} />
        </div>
        <CreateUpdate url="/signup" />
      </div>
    </>
  );
};

export default CreateNewUser;
