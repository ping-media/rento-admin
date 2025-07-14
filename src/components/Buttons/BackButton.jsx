import { tableIcons } from "../../Data/Icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ endpoint = -1 }) => {
  const navigate = useNavigate();

  return (
    <button className="p-1 lg:px-2 lg:py-1" onClick={() => navigate(endpoint)}>
      {tableIcons?.backArrow}
    </button>
  );
};

export default BackButton;
