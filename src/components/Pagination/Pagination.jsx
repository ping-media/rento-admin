import { useEffect } from "react";
// import { ScrollTopAfterEvent } from "../utils/utilFunction";

const Pagination = ({ totalNumberOfPages, currentPage, setPageChanger }) => {
  //going back to previous page
  const handlePrevPageChange = () => {
    currentPage > 1 && setPageChanger(currentPage - 1);
  };
  // going to next page
  const handleNextPageChange = () => {
    currentPage <= totalNumberOfPages && setPageChanger(currentPage + 1);
  };
  //jump to any page when you click on that page number
  const handleJumpPageChange = (number) => {
    return setPageChanger(number);
  };
  //handle the pagination page number adding ellipses where it is need
  const getPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 10; // Total number of page buttons to display

    // If total pages are less than or equal to max pages to show, just return all pages
    if (totalNumberOfPages <= maxPagesToShow) {
      for (let i = 1; i <= totalNumberOfPages; i++) {
        items.push(i);
      }
    } else {
      // Always show the first page
      items.push(1);

      // Logic to show ellipses and pages
      if (currentPage > 3) {
        items.push("...");
      }

      // Calculate the range of pages to show around the current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalNumberOfPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      // Show the last page
      if (currentPage < totalNumberOfPages - 2) {
        items.push("...");
      }
      items.push(totalNumberOfPages);
    }

    return items;
  };

  const paginationItems = getPaginationItems();
  //scroll the page back to top after page changes
  // useEffect(() => {
  //   ScrollTopAfterEvent();
  // }, [currentPage]);

  return (
    paginationItems && (
      <div className="flex items-center justify-center">
        <div className="py-3 rounded-lg">
          <ol className="flex items-center text-sm text-gray-500 divide-x rtl:divide-x-reverse divide-gray-300 gap-2">
            <li>
              <button
                type="button"
                className="relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 -my-3 rounded-md outline-none hover:bg-gray-500/5 focus:ring-2 focus:ring-theme transition text-black disabled:bg-gray-300"
                aria-label="Previous"
                rel="prev"
                onClick={handlePrevPageChange}
                disabled={currentPage == 1 ? true : false}
              >
                <svg
                  className="w-6 h-6 rtl:scale-x-[-1]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </li>
            {paginationItems.map((number, index) => (
              <li key={index}>
                <button
                  type="button"
                  className={`relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 -my-3 rounded-md outline-none transition focus:underline ${
                    currentPage == number
                      ? "text-gray-100 bg-black ring-0"
                      : "text-black bg-transparent"
                  } ring-2 ring-gray-200`}
                  onClick={() => handleJumpPageChange(number)}
                  disabled={number == "..." ? true : false}
                >
                  <span>{number}</span>
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="relative flex items-center justify-center font-medium min-w-[2rem] px-1.5 h-8 -my-3 rounded-md outline-none hover:bg-gray-500/5 focus:ring-2 focus:ring-theme transition text-black"
                aria-label="Next"
                rel="next"
                onClick={handleNextPageChange}
                disabled={currentPage === totalNumberOfPages ? true : false}
                title="next"
              >
                <svg
                  className="w-6 h-6 rtl:scale-x-[-1]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </li>
          </ol>
        </div>
      </div>
    )
  );
};

export default Pagination;
