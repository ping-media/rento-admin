import Input from "../../../components/InputAndDropdown/Input";
import Spinner from "../../../components/Spinner/Spinner";
import { tableIcons } from "../../../Data/Icons";
import React from "react";

const NotesForm = ({ onSubmit, value, onValueChange, loading, className }) => {
  return (
    <form className="flex items-end my-4" onSubmit={onSubmit}>
      <Input
        bodyWidth={`w-full lg:w-2/4 ${className}`}
        customClass="w-[98%] px-3 py-1.5"
        item="notes"
        value={value}
        setValueChange={onValueChange}
        isCapital={false}
        require={true}
      />
      <button
        type="submit"
        className="bg-theme text-gray-100 px-2 py-1.5 rounded-lg disabled:bg-gray-400"
        disabled={loading}
      >
        {!loading ? (
          <p className="flex items-center gap-1">
            {tableIcons?.add}
            Add
          </p>
        ) : (
          <Spinner />
        )}
      </button>
    </form>
  );
};

export default NotesForm;
