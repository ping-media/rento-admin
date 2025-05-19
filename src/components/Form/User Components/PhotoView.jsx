import { useEffect } from "react";
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
}) => {
  const isMobile = window.innerWidth <= 768;

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

  return (
    <div>
      {!hookLoading && item ? (
        <div className="relative" id={uniqueId}>
          {deleteFn && (
            <div className="absolute right-1 top-2 z-10">
              <button
                type="button"
                className={`p-1 rounded-full bg-white group transition-all duration-500 flex item-center hover:text-white hover:bg-theme`}
                onClick={() => deleteFn(item?._id)}
              >
                {rowId !== item?._id ? tableIcons?.delete : <Spinner />}
              </button>
            </div>
          )}
          <div
            className={`relative ${className} border rounded-md p-1`}
            key={item?._id}
          >
            <a
              href={item.imageUrl || item.link}
              data-pswp-width={isMobile ? 720 : 1920}
              data-pswp-height={isMobile ? 1280 : 1080}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={item.imageUrl || item.link}
                alt={item.fileName || alt}
                className="w-full h-full object-contain brightness-95"
              />
            </a>
          </div>
        </div>
      ) : (
        <p className="italic text-sm my-2 text-gray-400">No documents found.</p>
      )}
    </div>
  );
};

export default PhotoView;
