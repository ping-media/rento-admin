import TableSkeleton from "./TableSkeleton";
import TableNotFound from "../Skeleton/TableNotFound";
import Pagination from "../Pagination/Pagination";
import DropDownComponent from "../DropDown/DropDownComponent";

// same classes as the shared table
const TH =
  "p-2 whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize";
const TD = "px-2 py-1 text-md lg:text-sm font-medium text-gray-900";
const ROW =
  "bg-white p-3.5 md:p-0 transition-all duration-500 hover:bg-gray-50 [&>td]:!h-[70px] sm:[&>td]:!h-[58px] [&>td]:overflow-hidden";

const alignCls = (align) => (align === "right" ? "text-right" : "text-left");

/**
 * columns: [{ key, label, render?(row, index), align?: "left" | "right", tdClassName? }]
 * pagination (optional): { page, limit, totalPages, setPage, setLimit, options? }
 */
const SimpleTable = ({
  columns,
  rows = [],
  loading = false,
  rowKey = (row) => row._id,
  onRowClick,
  showSerial = true,
  pagination,
}) => {
  const startIndex = pagination ? (pagination.page - 1) * pagination.limit : 0;

  return (
    <>
      <div className="mt-5">
        <div className="flex flex-col">
          <div className="overflow-x-auto pb-4">
            <div className="min-w-full inline-block align-middle">
              <div className="relative overflow-hidden border shadow-lg rounded-lg border-gray-200 w-full">
                {loading ? (
                  <TableSkeleton />
                ) : (
                  <table className="table-auto min-w-full rounded-xl">
                    <thead>
                      <tr className="bg-gray-50 h-14 sm:h-12">
                        {showSerial && (
                          <th className={`${TH} text-left`}>SL</th>
                        )}
                        {columns.map((col) => (
                          <th
                            key={col.key}
                            scope="col"
                            className={`${TH} ${alignCls(col.align)}`}
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {rows.length > 0 ? (
                        rows.map((row, index) => {
                          const serial = startIndex + index + 1;
                          return (
                            <tr
                              key={rowKey(row)}
                              className={`${ROW} ${onRowClick ? "cursor-pointer" : ""}`}
                              onClick={
                                onRowClick ? () => onRowClick(row) : undefined
                              }
                            >
                              {showSerial && (
                                <td className={`${TD} whitespace-nowrap`}>
                                  {serial < 10 ? `0${serial}` : serial}
                                </td>
                              )}
                              {columns.map((col) => (
                                <td
                                  key={col.key}
                                  className={`${TD} ${alignCls(col.align)} ${
                                    col.tdClassName ||
                                    "whitespace-nowrap capitalize"
                                  }`}
                                >
                                  {col.render
                                    ? col.render(row, index)
                                    : (row[col.key] ?? "--")}
                                </td>
                              ))}
                            </tr>
                          );
                        })
                      ) : (
                        <TableNotFound
                          ColumnsCount={columns.length + (showSerial ? 1 : 0)}
                        />
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {pagination && rows.length > 0 && (
        <div className="flex flex-wrap items-center justify-start lg:justify-between gap-4 lg:gap-2">
          <div className="flex items-center gap-2">
            <h2 className="capitalize">Rows per Page</h2>
            <DropDownComponent
              options={pagination.options || [25, 50, 100]}
              customLimit={pagination.limit}
              setLimitChanger={pagination.setLimit}
            />
          </div>
          <span className="hidden lg:mx-1">|</span>
          <Pagination
            totalNumberOfPages={pagination.totalPages}
            currentPage={pagination.page}
            setPageChanger={pagination.setPage}
            syncUrl={false}
          />
        </div>
      )}
    </>
  );
};

export default SimpleTable;
