import React, { useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { TAB_LIST } from "../../Pages/General";
import Spinner from "../../components/Spinner/Spinner";
import usePolicy from "../../hooks/use-policy";

const BlockEmbed = Quill.import("blots/block/embed");

class DividerBlot extends BlockEmbed {
  static blotName = "divider";
  static tagName = "hr";
}

Quill.register(DividerBlot);

// Toolbar
const modules = {
  toolbar: {
    container: [
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
      ["divider"],
      ["clean"],
    ],
    handlers: {
      divider: function () {
        const range = this.quill.getSelection(true);
        this.quill.insertEmbed(range.index, "divider", true);
        this.quill.setSelection(range.index + 1);
      },
    },
  },
};

const PolicyEditor = ({ tab }) => {
  const { content, setContent, loading, fetching, updatePolicy } =
    usePolicy(tab);

  // Get current page title
  const pageTitle = useMemo(() => {
    return TAB_LIST?.find((t) => t.id === tab);
  }, [tab]);

  return (
    <>
      <h2 className="text-md lg:text-lg font-semibold mb-3 border-b uppercase">
        {pageTitle?.title ?? "--"}
      </h2>

      <div className="w-full">
        {fetching ? (
          <div className="h-[400px] flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            style={{ height: "400px", marginBottom: "50px" }}
          />
        )}

        <Button
          onClick={updatePolicy}
          label={
            loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner /> updating
              </div>
            ) : (
              "update"
            )
          }
          disabled={loading || fetching}
        />
      </div>
    </>
  );
};

export default React.memo(PolicyEditor);

const Button = ({ label = "update", disabled = false, onClick }) => (
  <button
    type="submit"
    onClick={onClick}
    className="bg-theme w-full p-3 md:px-4 md:py-3 rounded-md text-white disabled:bg-theme/80 uppercase text-sm md:text-base"
    disabled={disabled}
  >
    {label}
  </button>
);
