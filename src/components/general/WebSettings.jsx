import Input from "../InputAndDropdown/Input";
import React from "react";

const WebSettings = ({ data, loading }) => {
  return (
    !loading && (
      <>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
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
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full lg:w-fit">
            <Input
              item={"altContact"}
              type="number"
              value={data?.altContact}
              // require={true}
            />
          </div>
          <div className="w-full lg:flex-1">
            <Input item={"address"} value={data?.address} require={true} />
          </div>
        </div>
      </>
    )
  );
};

export default WebSettings;
