import CopyButton from "../Buttons/CopyButton";

const WhatsappLinkModal = ({ active, setActive, title, link }) => {
  return (
    <div
      className={`fixed ${
        !active ? "hidden" : ""
      } z-40 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
    >
      <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
        <div className="flex justify-end p-2">
          <button
            onClick={() => setActive(false)}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-6 pt-0 text-center">
          <svg
            className="w-16 h-16 text-green-600 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <h3 className="text-xl font-normal text-gray-700 mt-5 mb-4">
            {title}
          </h3>
          <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2 mb-4">
            <span className="text-sm text-gray-600 truncate">{link}</span>
            <CopyButton textToCopy={link} />
          </div>
          <button
            className="w-full text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-300 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center justify-center"
            onClick={() => setActive(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsappLinkModal;
