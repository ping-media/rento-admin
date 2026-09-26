import { EXCLUDED_KEYS, ROUTE_EXCLUSIONS } from "../constants/table";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addVehicleIdToDelete } from "../Redux/VehicleSlice/VehicleSlice";
import { toggleDeleteModal } from "../Redux/SideBarSlice/SideBarSlice";

const useDataTable = ({ searchTermQuery, pagination }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const { limit } = useSelector((state) => state.pagination);
  const { loggedInRole } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const showRecordsOptions = [25, 50, 100, 200, 500];
  //   sorting
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [Columns, setColumns] = useState([]);
  const [newUpdatedData, setNewUpdatedData] = useState([]);
  const [inputSearchQuery, setInputSearchQuery] = useState(
    searchTermQuery !== null ? searchTermQuery : "",
  );

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadFiltersAndData = useCallback(() => {
    if (newUpdatedData && pagination) {
      let dataToDisplay = [...sortedData];

      if (
        inputSearchQuery?.trim() !== "" &&
        location.pathname === "/all-vehicles"
      ) {
        setTotalPages(1);
      } else {
        const pageCount = Number(pagination?.totalPages);
        setTotalPages(pageCount);
        const start = (Number(pagination?.currentPage) - 1) * limit;
        const end = start + limit;
        dataToDisplay = sortedData?.slice(start, end);
      }

      setNewUpdatedData(dataToDisplay);
    }
  }, [newUpdatedData, pagination?.totalPages, pagination?.currentPage]);

  // Sorting function
  const sortData = (key) => {
    if (newUpdatedData) {
      const direction =
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc";
      const sorted = [...newUpdatedData].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      });
      setSortedData(sorted);
      setNewUpdatedData(sorted);
      setSortConfig({ key, direction });
    }
  };

  // for table header
  const getTableHeader = useCallback(
    (Data) => {
      if (!Data || Data.length === 0) {
        setColumns([]); // explicitly reset headers
        return;
      }

      const keys = Object.keys(Data[0]);

      let filteredKeys = keys.filter((key) => !EXCLUDED_KEYS.has(key));

      const routeExclusions = ROUTE_EXCLUSIONS[location.pathname];

      if (routeExclusions) {
        filteredKeys = filteredKeys.filter((key) => !routeExclusions.has(key));
      }

      const normalColumns = [];
      const statusColumns = [];

      for (const key of filteredKeys) {
        if (key.includes("Status") || key.includes("Active")) {
          statusColumns.push(key);
        } else {
          normalColumns.push(key);
        }
      }

      setColumns([...normalColumns, ...statusColumns]);
    },
    [location.pathname],
  );

  // for table value
  const getTableValue = useCallback((Data) => {
    if (Data.length == 0) return;

    setNewUpdatedData(Data);
    setSortedData(Data);
  }, []);

  // for delete the data
  const handleDeleteVehicle = (id) => {
    dispatch(addVehicleIdToDelete(id));
    dispatch(toggleDeleteModal());
  };

  // let user enter in view page or edit page when click on table row
  const handleViewData = (item) => {
    const { _id: id, bookingId } = item;

    if (location.pathname === "/payments" || location.pathname === "/logs") {
      return;
    }

    const url =
      location.pathname === "/all-bookings"
        ? `details/${id}_${bookingId}`
        : location.pathname === "/all-vehicles" ||
            location.pathname === "/all-invoices"
          ? `details/${id}`
          : `${id}`;

    navigate(url);
  };

  return {
    loadFiltersAndData,
    sortData,
    getTableHeader,
    getTableValue,
    handleDeleteVehicle,
    handleViewData,
    loadingStates,
    setLoadingStates,
    limit,
    loggedInRole,
    currentPage,
    setCurrentPage,
    totalPages,
    showRecordsOptions,
    sortedData,
    setSortedData,
    sortConfig,
    setSortConfig,
    Columns,
    setColumns,
    newUpdatedData,
    setNewUpdatedData,
    inputSearchQuery,
    setInputSearchQuery,
    location,
    dispatch,
    navigate,
  };
};

export default useDataTable;
