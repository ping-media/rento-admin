import { tableIcons } from "../../Data/Icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ endpoint = -1 }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // react-router stores the position in the history stack as `idx`.
    // idx > 0 means the user arrived from another page inside the app,
    // so going back restores the list with its page, limit and filters.
    const hasAppHistory = window.history.state?.idx > 0;

    if (hasAppHistory || endpoint === -1) {
      navigate(-1);
    } else {
      navigate(endpoint); // opened directly or refreshed: go to the plain list
    }
  };

  return (
    <button className="p-1 lg:px-2 lg:py-1 outline-none" onClick={handleBack}>
      {tableIcons?.backArrow}
    </button>
  );
};

export default BackButton;

// import { tableIcons } from "../../Data/Icons";
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const BackButton = ({ endpoint = -1 }) => {
//   const navigate = useNavigate();

//   return (
//     <button
//       className="p-1 lg:px-2 lg:py-1 outline-none"
//       onClick={() => navigate(endpoint)}
//     >
//       {tableIcons?.backArrow}
//     </button>
//   );
// };

// export default BackButton;
