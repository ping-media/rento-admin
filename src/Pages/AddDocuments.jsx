import React from "react";
import Identity from "../components/Documents/Identity";
import License from "../components/Documents/License";
import Selfie from "../components/Documents/Selfie";
import BackButton from "../components/Buttons/BackButton";

const AddDocuments = () => {
  return (
    <div>
      <div className="flex items-center gap-1 mb-2">
        <BackButton />
        <h1 className="uppercase text-theme font-bold text-2xl">
          Add Documents
        </h1>
      </div>
      <div className="mb-2.5">
        <Identity />
      </div>
      <div className="mb-2.5">
        <License />
      </div>
      <div className="mb-2.5">
        <Selfie />
      </div>
    </div>
  );
};

export default AddDocuments;
