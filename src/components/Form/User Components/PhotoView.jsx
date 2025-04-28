import { useEffect } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

const PhotoView = ({ item, className = "w-full", hookLoading, uniqueId }) => {
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
        <div id={uniqueId}>
          <div
            className={`relative ${className} border rounded-md p-1`}
            key={item?._id}
          >
            <a
              href={item.imageUrl}
              data-pswp-width="1920"
              data-pswp-height="1080"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={item.imageUrl}
                alt={item.fileName}
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
