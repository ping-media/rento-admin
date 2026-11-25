import React, { useState } from "react";
import { handleAsyncError } from "../../../utils/Helper/handleAsyncError";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../InputAndDropdown/Input";
import Spinner from "../../Spinner/Spinner";
import { postData } from "../../../Data";

const CreateCustomerForm = ({ handleUserCreated }) => {
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");

    if (!firstName || !lastName)
      return handleAsyncError(dispatch, "First name or last name is missing!");

    try {
      setLoading(true);

      const response = await postData("/signup", formData, token);
      if (response.status === 200) {
        if (response?.data) handleUserCreated?.(response.data);
        form.reset();
        handleAsyncError(dispatch, "Customer created!", "success");
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(
        dispatch,
        "unable to create customer! try again after sometime",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 p-4">
      <div className="w-full lg:w-[48%]">
        <Input item={"firstName"} require={true} />
      </div>

      <div className="w-full lg:w-[48%]">
        <Input item={"lastName"} require={true} />
      </div>

      <div className="w-full lg:w-[48%]">
        <Input
          item={"contact"}
          placeholder="Phone Number"
          type="number"
          require={true}
        />
      </div>

      <div className="w-full lg:w-[48%]">
        <Input
          item={"altContact"}
          placeholder="Alternate Phone Number"
          type="number"
        />
      </div>

      <button
        className="flex items-center justify-center gap-2 bg-theme hover:bg-theme-dark text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-opacity-50 disabled:bg-gray-400"
        type="submit"
        disabled={loading}
      >
        {loading && <Spinner />} Create Customer
      </button>
    </form>
  );
};

export default CreateCustomerForm;
