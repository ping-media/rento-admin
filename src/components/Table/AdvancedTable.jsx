import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Button, Flex } from "@mantine/core";
import { useDispatch } from "react-redux";
import {
  toggleDeleteModal,
  toggleEditModal,
} from "../../Redux/SideBarSlice/SideBarSlice";

//nested data is ok, see accessorKeys in ColumnDef below
const data = [
  {
    vehicleStation: "Agra",
    vehicleNumber: "UP80 AB 1245",
    vehicleModal: "2014",
    vehicleColor: "white",
    VehiclePrice: "1000",
    vehicleCondition: "old",
    VehicleService: "30-03-2024",
    KmRun: "15000",
    vehicleStatus: "Active",
  },
  {
    vehicleStation: "Agra",
    vehicleNumber: "UP80 AB 1245",
    vehicleModal: "2020",
    vehicleColor: "black",
    VehiclePrice: "1500",
    vehicleCondition: "new",
    VehicleService: "26-06-2024",
    KmRun: "10000",
    vehicleStatus: "Active",
  },
  {
    vehicleStation: "Agra",
    vehicleNumber: "UP80 AB 1245",
    vehicleModal: "2014",
    vehicleColor: "white",
    VehiclePrice: "1000",
    vehicleCondition: "old",
    VehicleService: "30-03-2024",
    KmRun: "15000",
    vehicleStatus: "Active",
  },
  {
    vehicleStation: "Agra",
    vehicleNumber: "UP80 AB 1245",
    vehicleModal: "2020",
    vehicleColor: "black",
    VehiclePrice: "1500",
    vehicleCondition: "new",
    VehicleService: "26-06-2024",
    KmRun: "10000",
    vehicleStatus: "Active",
  },
  {
    vehicleStation: "Agra",
    vehicleNumber: "UP80 AB 1245",
    vehicleModal: "2014",
    vehicleColor: "white",
    VehiclePrice: "1000",
    vehicleCondition: "old",
    VehicleService: "30-03-2024",
    KmRun: "15000",
    vehicleStatus: "Active",
  },
  {
    vehicleStation: "Agra",
    vehicleNumber: "UP80 AB 1245",
    vehicleModal: "2020",
    vehicleColor: "black",
    VehiclePrice: "1500",
    vehicleCondition: "new",
    VehicleService: "26-06-2024",
    KmRun: "10000",
    vehicleStatus: "Active",
  },
  {
    vehicleStation: "Agra",
    vehicleNumber: "UP80 AB 1245",
    vehicleModal: "2014",
    vehicleColor: "white",
    VehiclePrice: "1000",
    vehicleCondition: "old",
    VehicleService: "30-03-2024",
    KmRun: "15000",
    vehicleStatus: "Active",
  },
  {
    vehicleStation: "Agra",
    vehicleNumber: "UP80 AB 1245",
    vehicleModal: "2020",
    vehicleColor: "black",
    VehiclePrice: "1500",
    vehicleCondition: "new",
    VehicleService: "26-06-2024",
    KmRun: "10000",
    vehicleStatus: "Active",
  },
];

const AdvancedTable = () => {
  const dispatch = useDispatch();
  //should be memoized or stable
  const columns = [
    {
      accessorKey: "vehicleStation",
      header: "Vehicle Station",
    },
    {
      accessorKey: "vehicleNumber",
      header: "Vehicle Number",
    },
    {
      accessorKey: "vehicleModal",
      header: "Vehicle model",
    },
    {
      accessorKey: "vehicleColor",
      header: "Vehicle color",
    },
    {
      accessorKey: "VehiclePrice",
      header: "Vehicle Price/rental (per day)",
    },
    {
      accessorKey: "vehicleCondition",
      header: "Vehicle condition",
    },
    {
      accessorKey: "VehicleService",
      header: "Vehicle last service date",
    },
    {
      accessorKey: "KmRun",
      header: "Km run",
    },
    {
      accessorKey: "vehicleStatus",
      header: "Vehicle status",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <Flex gap={4}>
          <Button
            className="bg-transparent hover:bg-blue-500 group"
            onClick={() => dispatch(toggleEditModal())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-black group-hover:stroke-white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
              <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
            </svg>
          </Button>
          <Button
            className="bg-transparent hover:bg-theme group"
            onClick={() => dispatch(toggleDeleteModal())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-theme group-hover:stroke-white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </Button>
        </Flex>
      ),
    },
  ];
  // const columns = useMemo(
  //   () => [
  //     {
  //       accessorKey: "name.firstName", //access nested data with dot notation
  //       header: "First Name",
  //     },
  //     {
  //       accessorKey: "name.lastName",
  //       header: "Last Name",
  //     },
  //     {
  //       accessorKey: "address", //normal accessorKey
  //       header: "Address",
  //     },
  //     {
  //       accessorKey: "city",
  //       header: "City",
  //     },
  //     {
  //       accessorKey: "state",
  //       header: "State",
  //     },
  //     {
  //       accessorKey: "actions",
  //       header: "Actions",
  //       Cell: ({ row }) => (
  //         <Flex gap={4}>
  //           <Button
  //             className="bg-transparent hover:bg-blue-500 group"
  //             onClick={() => handleEdit(row.original)}
  //           >
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               width="20"
  //               height="20"
  //               viewBox="0 0 24 24"
  //               fill="none"
  //               className="stroke-black group-hover:stroke-white"
  //               strokeWidth="1.8"
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //             >
  //               <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
  //               <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
  //             </svg>
  //           </Button>
  //           <Button
  //             className="bg-transparent hover:bg-theme group"
  //             onClick={() => handleDelete(row.original.vehicleNumber)}
  //           >
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               width="20"
  //               height="20"
  //               viewBox="0 0 24 24"
  //               fill="none"
  //               className="stroke-theme group-hover:stroke-white"
  //               strokeWidth="1.8"
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //             >
  //               <polyline points="3 6 5 6 21 6"></polyline>
  //               <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  //               <line x1="10" y1="11" x2="10" y2="17"></line>
  //               <line x1="14" y1="11" x2="14" y2="17"></line>
  //             </svg>
  //           </Button>
  //         </Flex>
  //       ),
  //     },
  //   ],
  //   []
  // );

  const table = useMantineReactTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnActions: false,
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
  });

  return <MantineReactTable table={table} />;
};

export default AdvancedTable;
