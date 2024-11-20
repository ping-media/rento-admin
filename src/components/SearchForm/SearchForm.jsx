import { Link } from "react-router-dom";
//import Spinner from "../spinner/Spinner";

const SearchForm = ({
  formSubmit,
  checkApplication,
  setCheckApplication,
  loading,
}) => {
  return (
    <>
      <div className="mb-3 lg:hidden">
        <Link
          className="inline-flex items-center px-3 py-1.5 border text-red-500 group border-red-500 rounded-lg transition duration-300 ease-in-out hover:bg-red-500 hover:text-gray-100"
          to={"/my-ads"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-red-500 group-hover:stroke-gray-100 transition duration-300 ease-in-out"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </Link>
      </div>
      <form onSubmit={formSubmit}>
        <div>
          <label
            htmlFor="inputUrlCheck"
            className="block text-gray-800 font-semibold text-sm"
          >
            Enter Application URL
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="inputUrlCheck"
              placeholder="Enter Application URL"
              className="block w-full rounded-md px-5 py-3 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              value={checkApplication}
              onChange={(e) => setCheckApplication(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          className="bg-theme-blue hover:bg-theme-blue-light text-white font-bold px-5 py-3 rounded-md w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400"
          type="submit"
          disabled={loading}
        >
          {/* {loading ? <Spinner message={"checking"} /> : "check"} */}
        </button>
      </form>
    </>
  );
};

export default SearchForm;
