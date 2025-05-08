import React, { useState } from "react";
import GeneralForm from "../components/general/GeneralForm";
import TabButton from "../components/TabButton/TabButton";
import GeneralAddOn from "../components/general/GeneralAddOn";

const General = () => {
  const [tab, setTab] = useState("general");

  return (
    <>
      <div className="flex items-center flex-wrap justify-between">
        <h1 className="text-xl uppercase font-bold text-theme mb-5">
          Settings
        </h1>
        <div className="w-full md:w-2/5 lg:w-1/3">
          <TabButton
            options={[
              { id: "general", title: "General" },
              { id: "addon", title: "Add-On" },
            ]}
            tab={tab}
            setTab={setTab}
          />
        </div>
      </div>

      <div className="bg-white p-2 shadow-md rounded-md">
        {tab === "general" && <GeneralForm />}
        {tab === "addon" && <GeneralAddOn />}
      </div>
    </>
  );
};

export default General;
