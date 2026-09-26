import React, { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PreLoader from "../Skeleton/PreLoader";
import CommonTable from "../Table/CommonTable";
import {
  toggleSlidesModal,
  toggleTestimonialModal,
} from "../../Redux/SideBarSlice/SideBarSlice";
import { postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { removeGeneralTestimonial } from "../../Redux/GeneralSlice/GeneralSlice";
import Slides from "./Slides";
const TestimonialsModal = lazy(() => import("../Modal/TestimonialsModal"));
const SlidesModal = lazy(() => import("../Modal/SlidesModal"));

const Button = ({ label = "update", fn }) => (
  <button
    type="button"
    className="bg-theme px-3 py-1.5 rounded-md text-white disabled:bg-theme/80 outline-none"
    onClick={fn}
  >
    {label}
  </button>
);

const OthersForm = () => {
  const { general, loading } = useSelector((state) => state.general);
  const { token } = useSelector((state) => state.user);
  const [rowId, setRowId] = useState("");
  const dispatch = useDispatch();

  const deleteTestimonial = async (id) => {
    try {
      setRowId(id);
      const response = await postData(
        "/updateGeneralTestimonial",
        { action: "delete", data: { _id: id } },
        token
      );
      if (response?.success) {
        dispatch(removeGeneralTestimonial(id));
        return handleAsyncError(dispatch, response?.message, "success");
      } else {
        return handleAsyncError(dispatch, response?.message);
      }
    } catch (error) {
      handleAsyncError(dispatch, "Unable to delete! try again");
    } finally {
      setRowId("");
    }
  };

  if (loading) {
    return <PreLoader />;
  }
  return (
    <>
      <TestimonialsModal />
      <SlidesModal />
      <div className="flex items-center justify-between mb-3 border-b pb-1">
        <h2 className="text-md lg:text-lg font-semibold uppercase">Banners</h2>
        <Button label="Add Slides" fn={() => dispatch(toggleSlidesModal())} />
      </div>
      <div className="mb-3">
        <Slides />
      </div>

      <div className="flex items-center justify-between mb-3 border-b pb-1">
        <h2 className="text-md lg:text-lg font-semibold uppercase">
          testimonials
        </h2>
        <Button
          label="Add Testimonial"
          fn={() => dispatch(toggleTestimonialModal())}
        />
      </div>
      <div className="mb-3">
        <CommonTable
          coloumn={["name", "message", "rating"]}
          action={true}
          showSlNo={true}
          handleDelete={deleteTestimonial}
          rowId={rowId}
          data={general?.testimonial}
        />
      </div>
    </>
  );
};

export default OthersForm;
