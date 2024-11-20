import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  MRT_EditActionButtons,
  useMaterialReactTable,
} from 'material-react-table';
import { Create, DeleteForever } from "@mui/icons-material";

import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { setAddNew, setColumnData, setUpdateData } from '../../Redux/AdsSlice/VehicleSlice';
import { userColumns, vehicleColumns, vehicleTableColumns, locationColumns, planColumns, stationColumns, bookingColumns } from '../../constant';
import DeleteModal from '../Modal/DeleteModal';
import { toggleDeleteModal, toggleModal } from '../../Redux/SideBarSlice/SideBarSlice';
const CustomTable = () => {
  const { tableData, columnData } = useSelector(state => state.vehicles)
  const [locateUrl, setLocateUrl] = useState(window.location.pathname)
  const [columns, setColumns] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate();

  let actionC1 = {
    accessorKey: '_id',
    header: 'Actions',
    enableEditing: false,
    size: 80,
    Cell: ({ renderedCellValue, row }) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <DialogActions>
          <span onClick={() => {
            dispatch(setUpdateData(row.original))
            dispatch(setAddNew(true))
            //navigate(`/manage-${window.location.pathname.substr(1, window.location.pathname.length)}`)
          }} style={{ marginRight: "10px", cursor: "pointer" }}><Create /></span>
          <span onClick={() => {
            let data = JSON.parse(JSON.stringify(row.original))
            dispatch(setUpdateData(row.original))
            dispatch(toggleDeleteModal())
          }} style={{ cursor: "pointer", color: "#e23844" }}><DeleteForever /></span>
        </DialogActions>
      </Box>
    )
  }
  let imgC2 = {
    accessorFn: (row) => `${row.vehicleImage}`, //accessorFn used to join multiple data into a single cell
    id: 'vehicleImage', //id is still required when using accessorFn instead of accessorKey
    header: 'Vehicle Image',
    size: 250,
    Cell: ({ renderedCellValue, row }) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <img
          alt="avatar"
          width={"60%"}
          height={30}
          src={renderedCellValue}
          loading="lazy"
          style={{ borderRadius: '40%' }}
        />
      </Box>
    ),
  }

  let imgC3 = {
    accessorFn: (row) => `${row.locationImage}`, //accessorFn used to join multiple data into a single cell
    id: 'locationImage', //id is still required when using accessorFn instead of accessorKey
    header: 'Location Image',
    size: 250,
    Cell: ({ renderedCellValue, row }) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <img
          alt="avatar"
          width={"60%"}
          height={30}
          src={renderedCellValue}
          loading="lazy"
          style={{ borderRadius: '40%' }}
        />
      </Box>
    ),
  }

  let imgC4 = {
    accessorFn: (row) => `${row.addressProof}`, //accessorFn used to join multiple data into a single cell
    id: 'addressProof', //id is still required when using accessorFn instead of accessorKey
    header: 'Address Proof',
    size: 250,
    Cell: ({ renderedCellValue, row }) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <img
          alt="avatar"
          width={"60%"}
          height={30}
          src={renderedCellValue}
          loading="lazy"
          style={{ borderRadius: '40%' }}
        />
      </Box>
    ),
  }
  let imgC5 = {
    accessorFn: (row) => `${row.drivingLicence}`, //accessorFn used to join multiple data into a single cell
    id: 'drivingLicence', //id is still required when using accessorFn instead of accessorKey
    header: 'Driving Licence',
    size: 250,
    Cell: ({ renderedCellValue, row }) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <img
          alt="avatar"
          width={"60%"}
          height={30}
          src={renderedCellValue}
          loading="lazy"
          style={{ borderRadius: '40%' }}
        />
      </Box>
    ),
  }
  let imgC6 = {
    accessorFn: (row) => `${row.idProof}`, //accessorFn used to join multiple data into a single cell
    id: 'idProof', //id is still required when using accessorFn instead of accessorKey
    header: 'Id Proof',
    size: 250,
    Cell: ({ renderedCellValue, row }) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <img
          alt="avatar"
          width={"60%"}
          height={30}
          src={renderedCellValue}
          loading="lazy"
          style={{ borderRadius: '40%' }}
        />
      </Box>
    ),
  }

  useEffect(() => {
    if (locateUrl) {
      let arr = []
      if (
        locateUrl.includes("all-vehicles") || locateUrl.includes("pending-vehicles") || locateUrl.includes("approved-vehicles")
      ) {
        arr = vehicleTableColumns.concat([actionC1])
      } else if (
        locateUrl.includes("all-users") || locateUrl.includes("station-managers") || locateUrl.includes("customers") ||
        locateUrl.includes("kyc-approved-users") || locateUrl.includes("email-approved-users") || locateUrl.includes("phone-approved-users")
      ) {
        arr = userColumns.concat([imgC4, imgC5, imgC6, actionC1])
      } else if (locateUrl.includes("vehicle-master")) {
        arr = vehicleColumns.concat([imgC2, actionC1])
      } else if (locateUrl.includes("location-master")) {
        arr = locationColumns.concat([imgC3, actionC1])
      } else if (locateUrl.includes("manage-plans")) {
        arr = planColumns.concat([actionC1])
      } else if (locateUrl.includes("manage-station")) {
        arr = stationColumns.concat([actionC1])
      } else if (
        locateUrl.includes("all-bookings") || locateUrl.includes("confirmed-bookings") || locateUrl.includes("pending-bookings")
      ) {
        arr = bookingColumns.concat([imgC3, imgC4, imgC5, imgC6, actionC1])
      }
      setColumns(arr)
    }
  }, [locateUrl])

  const table = useMaterialReactTable({
    columns,
    data: tableData
  });

  return <MaterialReactTable table={table} />
};

export default CustomTable;
