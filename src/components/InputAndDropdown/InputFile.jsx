import { useRef } from "react";

const InputFile = ({ labelDesc, labelId, name, image, setImage }) => {
  const inputRef = useRef(null);

  const handleLocalImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const openFileChooser = (type) => {
    const input = inputRef.current;
    if (type === "camera") {
      input.setAttribute("capture", "environment");
    } else {
      input.removeAttribute("capture");
    }
    input.click();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-left mb-2 text-gray-500">
          <p>{labelDesc}</p>
        </div>
        {image && (
          <button
            className="border-2 border-theme px-2 py-1 mb-1 rounded-lg text-theme hover:bg-theme hover:text-gray-100"
            type="button"
            onClick={handleRemoveImage}
          >
            Remove
          </button>
        )}
      </div>
      <div className="relative border-2 border-dashed border-gray-300 rounded-md px-4 py-2.5 text-center">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          capture="environment"
          name={name}
          onChange={handleLocalImage}
          id={labelId}
          ref={inputRef}
        />
        {image ? (
          <>
            <img
              src={image}
              className="w-54 max-h-40 object-contain mx-auto"
              alt="UPLOAD_DOCUMENT"
            />
          </>
        ) : (
          <div className="max-h-40">
            <button type="button" onClick={() => openFileChooser("camera")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-300 mb-4 hover:text-theme transition"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <g transform="translate(2 3)">
                  <path d="M20 16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v11z" />
                  <circle cx="10" cy="10" r="4" />
                </g>
              </svg>
            </button>
            <p className="text-sm text-gray-600">Drag & Drop your Image here</p>
            <p className="uppercase text-gray-600 mb-1">or</p>
            <button
              type="button"
              className="cursor-pointer hover:bg-theme-dark hover:shadow-md transition duration-200 ease-in-out border-2 px-2 py-1 border-theme rounded-md uppercase bg-theme text-gray-100 text-sm"
              onClick={() => openFileChooser("gallery")}
            >
              Choose Image
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default InputFile;
