import { useEffect, useRef } from "react";
import UploadImageComponent from "./UploadImageComponent";

const MultipleImageAndPreview = ({
  image,
  imagesUrl,
  setImageChanger,
  setImageUrlChanger,
}) => {
  const imagesRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const imageFiles = files.map((file) => {
        const url = URL.createObjectURL(file);
        return { file, url };
      });

      setImageChanger((prev) => [
        ...prev,
        ...imageFiles.map((img) => img.file),
      ]);
      setImageUrlChanger((prev) => [
        ...prev,
        ...imageFiles.map((img) => img.url),
      ]);
    }
  };

  const handleRemoveImage = (index) => {
    if (!imagesUrl && !image) return;
    setImageChanger((prev) => prev.filter((_, i) => i !== index));
    setImageUrlChanger((prev) => prev.filter((_, i) => i !== index));
  };

  //   for remove the images if there any left
  useEffect(() => {
    if (imagesRef) {
      imagesRef.current.value = "";
    }
  }, []);

  //   console.log(image, imagesUrl);

  return (
    <>
      <p className="block text-gray-800 font-semibold text-sm mb-2 text-left">
        Pickup Image
      </p>
      <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md px-6 py-6 md:py-5 lg:py-4 text-center mb-5">
        <input
          type="file"
          className="hidden"
          id="ImageInput"
          accept="image/*"
          name="images"
          onChange={(e) => handleImageChange(e)}
          ref={imagesRef}
          multiple
        />
        {imagesUrl?.length > 0 ? (
          //  image preview only shows when there user select any image
          <>
            <div className="flex items-center w-full gap-4 flex-wrap w-full mx-auto">
              {/* remove image if user want to reupload another image */}
              {imagesUrl?.map((image, index) => (
                <div key={index}>
                  <button
                    className="inline-flex items-center gap-1 text-red-500 border border-red-500 p-1 rounded-md hover:bg-red-500 hover:text-gray-100 transition duration-300 ease-in-out group"
                    type="button"
                    onClick={() => handleRemoveImage(index)}
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
                  </button>
                  <div className="w-full h-24 relative mx-auto">
                    <img
                      src={image}
                      className="w-full h-full object-contain hover:border rounded-xl transition duration-300 ease-in-out"
                      alt={`UPLOAD_IMAGE_${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            {imagesUrl?.length < 6 && <UploadImageComponent />}
          </>
        ) : (
          <UploadImageComponent />
        )}
      </div>
    </>
  );
};

export default MultipleImageAndPreview;
