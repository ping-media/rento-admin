export const isMobileDevice = () =>
  /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

export const handleWhatsappLink = (url, title, setWhatsappModal) => {
  if (!url) return;
  if (isMobileDevice()) {
    window.open(url, "_blank");
  } else {
    setWhatsappModal({ active: true, title, link: url });
  }
};
