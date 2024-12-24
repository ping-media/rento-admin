import React, { useState } from "react";
import DataTable from "react-data-table-component";

const DataTableComponent = () => {
  const [filterText, setFilterText] = useState("");
  const [data, setData] = useState([
    {
      id: 1,
      user: "Abu Bin Ishtiyak",
      email: "info@softnio.com",
      balance: "35,040.34 USD",
      phone: "818474958",
      verified: true,
      kyc: true,
      lastLogin: "10 Feb 2020",
      status: "Active",
    },
    {
      id: 2,
      user: "Ashley Lawson",
      email: "ashley@softnio.com",
      balance: "580.00 USD",
      phone: "1243941787",
      verified: true,
      kyc: true,
      lastLogin: "07 Feb 2020",
      status: "Pending",
    },
    // Add more rows here...
  ]);

  const columns = [
    {
      name: "User",
      selector: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full mr-3">
            {row.user.charAt(0)}
          </div>
          <div>
            <div className="font-bold">{row.user}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Balance",
      selector: (row) => row.balance,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Verified",
      selector: (row) => (
        <div className="flex items-center">
          {row.verified ? (
            <span className="text-green-500">✔ Email</span>
          ) : (
            <span className="text-red-500">✖ Email</span>
          )}
          {row.kyc ? (
            <span className="ml-2 text-green-500">✔ KYC</span>
          ) : (
            <span className="ml-2 text-red-500">✖ KYC</span>
          )}
        </div>
      ),
    },
    {
      name: "Last Login",
      selector: (row) => row.lastLogin,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`px-2 py-1 rounded ${
            row.status === "Active"
              ? "bg-green-100 text-green-600"
              : row.status === "Pending"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Input",
      cell: (row) => (
        <input
          type="text"
          className="border rounded px-2 py-1 text-sm"
          placeholder="Enter value"
          onChange={(e) =>
            setData((prevData) =>
              prevData.map((item) =>
                item.id === row.id
                  ? { ...item, inputValue: e.target.value }
                  : item
              )
            )
          }
        />
      ),
    },
  ];

  const filteredItems = data.filter(
    (item) =>
      item.user && item.user.toLowerCase().includes(filterText.toLowerCase())
  );

  const paginationOptions = {
    rowsPerPageText: "Rows per page",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  };

  return (
    <div className="p-5">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          className="border rounded px-3 py-2 w-1/3"
          placeholder="Search by name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select className="border rounded px-3 py-2">
          <option value="10">Show 10</option>
          <option value="20">Show 20</option>
          <option value="50">Show 50</option>
        </select>
      </div>
      <DataTable
        title="User Table"
        columns={columns}
        data={filteredItems}
        pagination
        paginationComponentOptions={paginationOptions}
        highlightOnHover
        responsive
      />
    </div>
  );
};

export default DataTableComponent;
