import Input from "../InputAndDropdown/Input";
import React from "react";

const WebSettings = ({ data, loading }) => {
  return (
    !loading && (
      <>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <div className="w-full lg:flex-1">
            <Input
              item={"email"}
              type="email"
              value={data?.email}
              require={true}
            />
          </div>
          <div className="w-full lg:flex-1">
            <Input
              item={"contact"}
              type="number"
              value={data?.contact}
              require={true}
            />
          </div>
          <div className="w-full lg:flex-1">
            <Input
              item={"waContact"}
              type="number"
              value={data?.waContact}
              require={true}
            />
          </div>
        </div>
        <Input item={"address"} value={data?.address} require={true} />
      </>
    )
  );
};

export default WebSettings;
