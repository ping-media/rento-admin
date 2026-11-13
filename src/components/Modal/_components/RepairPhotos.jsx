import { useEffect, useRef } from "react";
import ImageUploadAndPreview from "../../ImageComponent/ImageUploadAndPreview";
import { MAX_PHOTOS } from "../../../utils/maintenance";
import PhotoView from "../../Form/User Components/PhotoView";

const RepairPhotos = ({
  editable,
  requestId,
  saved,
  pending,
  onUploaded,
  onRemovePending,
  onRemoveSaved,
  setUploading,
}) => {
  const busyRef = useRef({});

  const setSlotBusy = (slot, busy) => {
    busyRef.current[slot] = busy;
    setUploading(Object.values(busyRef.current).some(Boolean));
  };

  const photos = [
    ...saved.map((a, i) => ({
      a,
      id: a._id || `saved-${i}`,
      key: `s-${i}`,
      onRemove: editable ? () => onRemoveSaved(a) : undefined,
    })),
    ...pending.map((a, i) => ({
      a,
      id: `new-${i}`,
      key: `n-${i}`,
      onRemove: () => onRemovePending(i),
    })),
  ];
  const emptyCount = Math.max(MAX_PHOTOS - photos.length, 0);

  return (
    <div>
      <label className="font-medium">
        Photos (optional){" "}
        <span className="text-gray-500 font-normal">
          {photos.length}/{MAX_PHOTOS}
        </span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
        {photos.map((p) => (
          <PhotoSlot
            key={p.key}
            id={p.id}
            url={p.a.url}
            onRemove={p.onRemove}
          />
        ))}

        {editable &&
          Array.from({ length: emptyCount }).map((_, i) => (
            <EmptySlot
              key={`empty-${i}`}
              requestId={requestId}
              onUploaded={onUploaded}
              onBusyChange={(busy) => setSlotBusy(i, busy)}
            />
          ))}
      </div>

      {!editable && photos.length === 0 && (
        <div className="text-sm text-gray-400 italic mt-1">No photos.</div>
      )}
    </div>
  );
};

export default RepairPhotos;

const PhotoSlot = ({ id, url, onRemove }) => (
  <div className="aspect-square overflow-hidden [&>div]:w-full">
    <PhotoView
      item={{ _id: id, imageUrl: url }}
      uniqueId={`rp-${id}`}
      deleteFn={onRemove ? () => onRemove() : undefined}
      rowId="" // keeps the delete icon visible (PhotoView shows a spinner when rowId equals the item id)
      alt="Repair photo"
    />
  </div>
);

const EmptySlot = ({ requestId, onUploaded, onBusyChange }) => {
  useEffect(() => () => onBusyChange(false), []); // unmounting means this slot is no longer busy

  return (
    <div className="aspect-square">
      <ImageUploadAndPreview
        title="photo"
        customImageText="photo"
        isLabel={false}
        isUpload
        userId={requestId}
        uploadUrl="/maintenance-request/upload-image"
        imagesUrl=""
        setImageUrlChanger={onUploaded}
        onUploadingChange={onBusyChange}
      />
    </div>
  );
};
