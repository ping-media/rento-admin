import { Link } from "react-router-dom";
import { formatPathNameToTitle } from "../../utils/index";
import { tableIcons } from "../../Data/Icons";
import BulkActionButtons from "./BulkActionButtons";

const TablePageHeader = ({ setInputSearchQuery }) => {
  const handleQuery = (e) => {
    e.preventDefault();
    setInputSearchQuery(e.target.value);
  };

  return (
    <div className="flex items-center flex-wrap justify-between gap-2 w-full">
      <div className="flex items-center gap-2">
        <h1 className="text-xl xl:text-2xl uppercase font-bold text-theme">
          {formatPathNameToTitle(location.pathname)}
        </h1>
        {!(
          location.pathname == "/payments" ||
          location.pathname == "/all-invoices" ||
          location.pathname == "/users-documents"
        ) && (
          <Link
            className="bg-theme font-semibold text-gray-100 px-2.5 py-1.5 rounded-md shadow-lg hover:bg-theme-light hover:shadow-md inline-flex items-center gap-1"
            to={location.pathname != "/all-pickup-image" ? "add-new" : "#"}
          >
            {tableIcons.add}
            Add
          </Link>
        )}
        {/* this button is to perform bulk action */}
        <BulkActionButtons />
      </div>
      {!(location.pathname == "/users-documents") && (
        <div className="w-full lg:w-[30%] bg-white rounded-md shadow-lg">
          <form className="flex items-center justify-center p-2">
            <input
              type="text"
              placeholder="Search Here.."
              className="w-full rounded-md px-2 py-1 focus:outline-none focus:border-transparent"
              onChange={(e) => handleQuery(e)}
            />
            <button
              type="submit"
              className="bg-gray-800 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
            >
              {tableIcons.search}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TablePageHeader;
