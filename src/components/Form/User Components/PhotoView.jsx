import { useEffect, useState } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { tableIcons } from "../../../Data/Icons";
import Spinner from "../../Spinner/Spinner";

const PhotoView = ({
  item,
  className = "w-full",
  hookLoading,
  uniqueId,
  alt = "Images",
  deleteFn,
  rowId,
  variant = "full",
  dataId,
  showName = false,
}) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (item) {
      const lightbox = new PhotoSwipeLightbox({
        gallery: `#${uniqueId}`,
        children: "a",
        pswpModule: () => import("photoswipe"),
      });
      lightbox.init();
      return () => lightbox.destroy();
    }
  }, [item]);

  useEffect(() => {
    if (item?.imageUrl || item?.link) {
      const img = new Image();
      img.src = item.imageUrl || item.link;
      img.onload = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
    }
  }, [item]);

  return (
    <div>
      {!hookLoading && item ? (
        <div className="relative" id={uniqueId}>
          {deleteFn && (
            <div className="absolute right-1 top-2 z-10">
              <button
                type="button"
                className={`p-1 rounded-full bg-white group transition-all duration-500 flex item-center hover:text-white hover:bg-theme`}
                onClick={() =>
                  dataId ? deleteFn(dataId, item) : deleteFn(item?._id)
                }
              >
                {rowId !== item?._id ? tableIcons?.delete : <Spinner />}
              </button>
            </div>
          )}
          <div
            className={`relative ${className} border rounded-md px-1`}
            key={item?._id}
          >
            {variant === "full" ? (
              <a
                href={item.imageUrl || item.link}
                data-pswp-width={imageSize.width}
                data-pswp-height={imageSize.height}
                target="_blank"
                rel="noreferrer"
                style={{
                  aspectRatio:
                    imageSize.width && imageSize.height
                      ? `${imageSize.width} / ${imageSize.height}`
                      : "auto",
                }}
              >
                <img
                  src={item.imageUrl || item.link}
                  alt={item.fileName || alt}
                  className={`w-full ${
                    deleteFn ? "min-h-40 max-h-40" : "min-h-20 max-h-20"
                  } object-contain brightness-95`}
                />
              </a>
            ) : (
              <a
                href={item.imageUrl}
                data-pswp-width={imageSize.width}
                data-pswp-height={imageSize.height}
                target="_blank"
                rel="noreferrer"
                style={{
                  aspectRatio:
                    imageSize.width && imageSize.height
                      ? `${imageSize.width} / ${imageSize.height}`
                      : "auto",
                }}
                className="flex items-center gap-1"
              >
                {tableIcons?.image}
                {item?.fileName?.split("_")[3]}
              </a>
            )}
          </div>
          {showName && (
            <p className="text-center mt-2 capitalize">
              {item.fileName.split("_")[3] || "--"}
            </p>
          )}
        </div>
      ) : (
        <p className="italic text-sm my-2 text-gray-400">No documents found.</p>
      )}
    </div>
  );
};

export default PhotoView;
