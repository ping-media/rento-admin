import React, { useState } from "react";
import TabButton from "../components/TabButton/TabButton";
import WebsiteForm from "../components/general/WebsiteForm";
import OthersForm from "../components/general/OthersForm";

const General = () => {
  const [tab, setTab] = useState("general");

  return (
    <>
      <div className="flex items-center flex-wrap justify-between">
        <h1 className="text-2xl captialize font-bold text-theme mb-5">
          Settings
        </h1>
        <div className="w-full md:w-2/5 lg:w-1/3">
          <TabButton
            options={[
              { id: "general", title: "General" },
              { id: "others", title: "Banners" },
            ]}
            tab={tab}
            setTab={setTab}
          />
        </div>
      </div>

      <div className="bg-white p-2 shadow-md rounded-md">
        {tab === "general" && <WebsiteForm />}
        {tab === "others" && <OthersForm />}
      </div>
    </>
  );
};

export default General;
