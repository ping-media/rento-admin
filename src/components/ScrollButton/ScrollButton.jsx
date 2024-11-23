const ScrollButton = ({ handleScroll }) => {
  return (
    <div
      className="absolute bottom-24 right-7 bg-theme-blue w-12 h-12 shadow-md rounded-full flex items-center justify-center cursor-pointer group"
      onClick={() => handleScroll()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        className="stroke-gray-100 group-hover:animate-bounce transition-all duration-300 ease-in-out"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v13M5 12l7 7 7-7" />
      </svg>
    </div>
  );
};

export default ScrollButton;
