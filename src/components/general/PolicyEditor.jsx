import React, { useState, useMemo, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { TAB_LIST } from "../../Pages/General";
import Spinner from "../../components/Spinner/Spinner";

// Toolbar without image support
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const PolicyEditor = ({ tab }) => {
  const [content, setContent] = useState({
    term_condition: "",
    privacy_policy: "",
    refund_policy: "",
  });
  const [loading, setLoading] = useState(false);

  // Get current page title
  const pageTitle = useMemo(() => {
    return TAB_LIST?.find((t) => t.id === tab);
  }, [tab]);

  // Current editor value
  const editorValue = useMemo(() => {
    return content?.[tab] ?? "";
  }, [content, tab]);

  // Update only current tab content
  const handleChange = useCallback(
    (value) => {
      setContent((prev) => ({
        ...prev,
        [tab]: value,
      }));
    },
    [tab],
  );

  return (
    <>
      <h2 className="text-md lg:text-lg font-semibold mb-3 border-b uppercase">
        {pageTitle?.title ?? "--"}
      </h2>

      <div className="w-full">
        <ReactQuill
          theme="snow"
          value={editorValue}
          onChange={handleChange}
          modules={modules}
          style={{ height: "400px", marginBottom: "50px" }}
        />

        <Button
          label={
            loading ? (
              <div className="flex items-center gap-2">
                <Spinner /> updating
              </div>
            ) : (
              "update"
            )
          }
          disabled={loading}
        />
      </div>
    </>
  );
};

export default React.memo(PolicyEditor);

const Button = ({ label = "update", disabled = false }) => (
  <button
    type="submit"
    className="bg-theme w-full p-3 md:px-4 md:py-3 rounded-md text-white disabled:bg-theme/80 uppercase text-sm md:text-base"
    disabled={disabled}
  >
    {label}
  </button>
);
