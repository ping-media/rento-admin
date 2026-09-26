import { useDispatch, useSelector } from "react-redux";
import { toggleTestimonialModal } from "../../Redux/SideBarSlice/SideBarSlice";
import Input from "../InputAndDropdown/Input";
import TextArea from "../InputAndDropdown/TextArea";
import { useState } from "react";
import { postData } from "../../Data/index";
import { handleAsyncError } from "../../utils/Helper/handleAsyncError";
import { updateGeneralTestimonial } from "../../Redux/GeneralSlice/GeneralSlice";

const Button = ({ label = "update", disabled = false }) => (
  <button
    type="submit"
    className="bg-theme w-1/6 py-1.5 rounded-md text-white disabled:bg-theme/80"
    disabled={disabled}
  >
    {label}
  </button>
);

const TestimonialsModal = () => {
  const dispatch = useDispatch();
  const { isTestimonialModalActive } = useSelector((state) => state.sideBar);
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handleAddTestimonal = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = Object.fromEntries(formData.entries());

    try {
      setLoading(true);
      const response = await postData(
        "/updateGeneralTestimonial",
        { action: "add", data: result },
        token
      );
      if (response?.success) {
        dispatch(updateGeneralTestimonial(response?.testimonial));
        handleAsyncError(dispatch, response?.message, "success");
        dispatch(toggleTestimonialModal());
      } else {
        handleAsyncError(dispatch, response?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed ${
        !isTestimonialModalActive ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 `}
    >
      <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-md">
        <div className="flex items-center justify-between border-b p-2">
          <h2 className="text-theme font-semibold text-lg">Add Testimonial</h2>
          <button
            onClick={() => dispatch(toggleTestimonialModal())}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-4 pt-2 text-center">
          <form onSubmit={handleAddTestimonal}>
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <div className="flex-1">
                <Input
                  item={"name"}
                  require={true}
                  isModalClose={isTestimonialModalActive}
                />
              </div>
              <div className="flex-1">
                <Input
                  item={"rating"}
                  type="number"
                  isModalClose={isTestimonialModalActive}
                />
              </div>
            </div>
            <div className="mb-3">
              <TextArea
                item={"message"}
                require={true}
                isModalClose={isTestimonialModalActive}
              />
            </div>
            <div className="text-center">
              <Button
                label={loading ? "Submiting" : "Submit"}
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsModal;
