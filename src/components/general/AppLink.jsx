import Input from "../InputAndDropdown/Input";
import React from "react";

const AppLink = ({ data, loading }) => {
  return (
    !loading && (
      <>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <div className="w-full lg:flex-1">
            <Input
              item={"IOS"}
              isCapital={false}
              value={data?.IOS}
              require={true}
            />
          </div>
          <div className="w-full lg:flex-1">
            <Input
              item={"Android"}
              isCapital={false}
              value={data?.Android}
              require={true}
            />
          </div>
        </div>
      </>
    )
  );
};

export default AppLink;
