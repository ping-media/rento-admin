import { useEffect, useState } from "react";
import ImageUploadAndPreview from "./ImageUploadAndPreview";

const END_IMAGE_SLOTS = ["endImage1", "endImage2", "endImage3", "endImage4"];

const RideEndImages = ({ userId, onChange, onUploadingChange }) => {
  const [images, setImages] = useState({});
  const [imageUrls, setImageUrls] = useState({});
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    onUploadingChange?.(Object.values(uploading).some(Boolean));
  }, [uploading]);

  useEffect(() => {
    const links = END_IMAGE_SLOTS.filter(
      (slot) => imageUrls[slot] && images[slot],
    ).map((slot) => images[slot]);
    onChange(links);
  }, [images, imageUrls]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
      {END_IMAGE_SLOTS.map((slot, i) => (
        <div key={slot}>
          <p className="block text-gray-800 font-semibold text-sm mb-2 text-left">
            Photo {i + 1} (optional)
          </p>
          <ImageUploadAndPreview
            title={slot}
            isLabel={false}
            isUpload
            userId={userId}
            image={images[slot]}
            imagesUrl={imageUrls[slot]}
            setImageMultiChanger={setImages}
            setImageUrlMultiChanger={setImageUrls}
            onUploadingChange={(value) =>
              setUploading((prev) => ({ ...prev, [slot]: value }))
            }
          />
        </div>
      ))}
    </div>
  );
};

export default RideEndImages;
