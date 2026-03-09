import React, { useState } from "react";
import WebsiteForm from "../components/general/WebsiteForm";
import OthersForm from "../components/general/OthersForm";
import DropdownTab from "../components/TabButton/DropdownButton";
import PolicyEditor from "../components/general/PolicyEditor";

const COMPONENTS = {
  general: WebsiteForm,
  others: OthersForm,
  terms_and_conditions: PolicyEditor,
  privacy_policy: PolicyEditor,
  refund_policy: PolicyEditor,
};

export const TAB_LIST = [
  { id: "general", title: "General" },
  { id: "terms_and_conditions", title: "Terms & Condition" },
  { id: "privacy_policy", title: "Privacy Policy" },
  { id: "refund_policy", title: "Refund Policy" },
  { id: "others", title: "Banners" },
];

const General = () => {
  const [tab, setTab] = useState("general");
  const DynamicComponent = COMPONENTS[tab];

  return (
    <>
      <div className="flex items-center flex-wrap justify-between">
        <h1 className="text-2xl captialize font-bold text-theme mb-5">
          Settings
        </h1>
        <div className="w-full md:w-2/5 lg:w-1/5  mb-5 md:mb-0">
          <DropdownTab options={TAB_LIST} tab={tab} setTab={setTab} />
        </div>
      </div>

      <div className="bg-white p-2 shadow-md rounded-md">
        {DynamicComponent && <DynamicComponent tab={tab} />}
      </div>
    </>
  );
};

export default React.memo(General);
