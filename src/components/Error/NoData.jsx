import React from "react";
import NoDataImg from "../../assets/logo/No-data.svg";

const NoData = ({ message = "404 Not Found" }) => {
  return (
    <div className="flex items-center justify-center h-full flex-col">
      <img
        src={NoDataImg}
        className="lg:w-[50%] mx-auto lg:h-[50%] object-cover mb-10"
        alt="UNDER_DEVELOPMENT"
      />
      <h1 className="text-center uppercase text-3xl font-bold">
        404 Not Found
      </h1>
    </div>
  );
};

export default NoData;
