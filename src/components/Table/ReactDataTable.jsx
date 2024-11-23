import { useState } from "react";
import DataTable from "react-data-table-component";

const columns = [
  { name: "id", selector: (row) => row.id, sortable: true },
  { name: "first_name", selector: (row) => row.first_name, sortable: true },
  { name: "last_name", selector: (row) => row.last_name, sortable: true },
  { name: "email", selector: (row) => row.email, sortable: true },
  { name: "gender", selector: (row) => row.gender, sortable: true },
];

const ReactDataTable = ({ data }) => {
  const [searchedTerm, setSearchedTerm] = useState("");
  return (
    <div className="overflow-x-auto">
      <DataTable
        columns={columns}
        data={data}
        pagination
        responsive
        striped
        highlightOnHover
      />
    </div>
  );
};

export default ReactDataTable;
