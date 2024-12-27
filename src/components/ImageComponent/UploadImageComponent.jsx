const UploadImageComponent = () => {
  return (
    <>
      <label htmlFor="ImageInput" className="cursor-pointer w-full">
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
            htmlFor="ImageInput"
            className="cursor-pointer text-theme hover:underline mr-1"
          >
            Browse
          </label>
          to upload Images.
        </p>
      </label>
    </>
  );
};

export default UploadImageComponent;
