import { formatPrice } from "../../utils/index";
import { tableIcons } from "../../Data/Icons";
import React, { useState } from "react";

const ChangeTextToInput = ({ value, setValue, type }) => {
  const [isEdit, setIsEdit] = useState(false);
  return (
    <>
      {!isEdit ? (
        <>
          {type === "number" ? `₹${formatPrice(Number(value))}` : value}
          <button
            type="button"
            className="text-black ml-1"
            onClick={() => setIsEdit(true)}
          >
            {tableIcons?.pencil}
          </button>
        </>
      ) : (
        <input
          type={type}
          value={Number(value)}
          onChange={setValue}
          onBlur={() => setIsEdit(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setIsEdit(false);
          }}
          className="border p-1 outline-none rounded-md"
          autoFocus
        />
      )}
    </>
  );
};

export default ChangeTextToInput;
