import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

// Preloads the image (PhotoSwipe needs its size), then opens the lightbox directly.
// Resolves true if opened, false if the image could not be loaded.
export const openImagePreview = (url) =>
  new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const lightbox = new PhotoSwipeLightbox({
        dataSource: [
          { src: url, width: img.naturalWidth, height: img.naturalHeight },
        ],
        pswpModule: () => import("photoswipe"),
        showHideAnimationType: "fade",
      });
      lightbox.on("close", () => setTimeout(() => lightbox.destroy(), 500));
      lightbox.init();
      lightbox.loadAndOpen(0);
      resolve(true);
    };

    img.onerror = () => resolve(false);
    img.src = url;
  });
