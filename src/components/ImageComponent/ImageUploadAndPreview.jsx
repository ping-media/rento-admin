import { camelCaseToSpaceSeparated } from "../../utils/index";

const ImageUploadAndPreview = ({
  image,
  imagesUrl,
  setImageChanger,
  setImageUrlChanger,
  customImageText = "image",
  title = "Image",
  setImageMultiChanger,
  setImageUrlMultiChanger,
  name = "image",
}) => {
  // for changing image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageChanger && setImageChanger(file);
      setImageMultiChanger &&
        setImageMultiChanger((prev) => ({ ...prev, [title]: file }));
      // creating local iamge
      const url = URL.createObjectURL(file);
      setImageUrlChanger && setImageUrlChanger(url);
      setImageUrlMultiChanger &&
        setImageUrlMultiChanger((prev) => ({ ...prev, [title]: url }));
    }
  };

  // for deleting image
  const handleRemoveImage = () => {
    // for single file delete
    setImageUrlChanger && setImageUrlChanger("");
    //  for multiple file and want to delete only one
    setImageUrlMultiChanger &&
      setImageUrlMultiChanger((prev) => ({ ...prev, [title]: "" }));
  };

  return (
    <>
      <p className="block text-gray-800 font-semibold text-sm mb-2 text-left">
        {camelCaseToSpaceSeparated(title)}
      </p>
      <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md px-6 py-6 md:py-5 lg:py-4 text-center mb-5">
        <input
          type="file"
          className="hidden"
          id={`ImageInput-${title}`}
          accept="image/*"
          name={name}
          onChange={(e) => handleImageChange(e)}
        />
        {imagesUrl ? (
          //  image preview only shows when there user select any image
          <>
            <div className="lg:absolute block text-right right-8 z-50 mb-5">
              {/* remove image if user want to reupload another image */}
              <button
                className="inline-flex items-center gap-1 text-red-500 border border-red-500 p-1 rounded-md hover:bg-red-500 hover:text-gray-100 transition duration-300 ease-in-out group"
                type="button"
                onClick={handleRemoveImage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="group-hover:stroke-gray-100 stroke-red-500 transition duration-300 ease-in-out group"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Remove
              </button>
            </div>
            <div className="w-full h-28 mx-auto relative mx-auto">
              <img
                src={imagesUrl}
                className="w-full h-full object-contain hover:border rounded-xl transition duration-300 ease-in-out"
                alt="UPLOAD_IMAGE"
              />
            </div>
          </>
        ) : (
          <label htmlFor={`ImageInput-${title}`} className="cursor-pointer">
            {/* if not showing image preview than show option to upload */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-300 mb-4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g transform="translate(2 3)">
                <path d="M20 16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v11z" />
                <circle cx="10" cy="10" r="4" />
              </g>
            </svg>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <label
                htmlFor={`ImageInput-${title}`}
                className="cursor-pointer text-theme hover:underline mr-1"
              >
                Browse
              </label>
              to upload {customImageText}.
            </p>
          </label>
        )}
      </div>
    </>
  );
};

export default ImageUploadAndPreview;
