import React from "react";
import Identity from "../components/Documents/Identity";
import License from "../components/Documents/License";
import Selfie from "../components/Documents/Selfie";

const AddDocuments = () => {
  return (
    <div>
      <h1 className="mb-2 uppercase text-theme font-bold text-2xl">
        Add Documents
      </h1>
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
