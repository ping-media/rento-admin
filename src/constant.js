import { setLoading } from "./Redux/ThemeSlice/ThemeSlice"
import store from '../src/Redux/store'
import { setTableData } from "./Redux/AdsSlice/VehicleSlice"
import { getApi, postApi } from "./response/api"
import { setError } from "./Redux/ErrorSlice/ErrorSlice"

//export const baseUrl = 'http://localhost:5000/'
export const baseUrl = "https://rent-moto-back-end-one.vercel.app"

export const staticData = [{ label: "Select Vehicle Type", value: "selectVehicleType" }, { label: "Gear", value: "gear" }, { label: "Non-Gear", value: "non-gear" }]
export const BrandData = [{ label: "Select Brand Name", value: "selectBrandName" }, { label: "Yamaha", value: "yamaha" }, { label: "Suzuki", value: "suzuki" },
{ label: "Bajaj", value: "bajaj" }, { label: "Kawasaki", value: "kawasaki" },
{ label: "Honda", value: "honda" }, { label: "Royal Enfield", value: "royalEnfield" },
{ label: "Hero", value: "hero" }, { label: "TVS", value: "tvs" },
{ label: "Mahindra", value: "mahindra" }, { label: "Tata", value: "tata" },
{ label: "Ducati", value: "ducati" }, { label: "Suzuki", value: "suzuki" },
{ label: "BMW", value: "bmw" }, { label: "Hyundai", value: "hyundai" }
]
export const colorArr = [{ label: "Select Color", value: "selectColor" }, { label: "White", value: "white" }, { label: "Black", value: "black" }, { label: "Red", value: "red" }, { label: "Blue", value: "blue" }, { label: "Green", value: "green" }, { label: "Yellow", value: "yellow" }]

export const UserTypeArr = [{ label: "Select User Type", value: "selectUserType" }, { label: "Manager", value: "manager" }, { label: "Customer", value: "customer" }, { label: "Admin", value: "admin" }]
export const statusArr = [{ label: "Select Status", value: "selectStatus" }, { label: "Active", value: "active" }, { label: "Inactive", value: "inActive" }]
export const vehicleColumns = [
    {
        accessorKey: 'vehicleName', //access nested data with dot notation
        header: 'Vehicle Name',
        size: 150,
    },
    {
        accessorKey: 'vehicleType',
        header: 'Vehicle Type',
        size: 150,
    },
    {
        accessorKey: 'vehicleBrand', //normal accessorKey
        header: 'Vehicle Brand',
        size: 150,
    },
]

export const displayTableData = async (url) => {
    const checkoToken = localStorage.getItem("token");
    if (!checkoToken) {
        window.location.href = "/";
    }
    const dispatch = store.dispatch
    dispatch(setLoading(true));
    const res = await getApi(url);
    if (res && res.status == 200) {
        dispatch(setTableData(res.data))
    }
    dispatch(setLoading(false));
}

export const displayTableData2 = async (url) => {
    const updateData = store.getState().vehicles.updateData
    const dispatch = store.dispatch
    dispatch(setLoading(true));
    const response = await postApi(url, updateData)
    if (response && response.status == 200) {
        dispatch(setError({ type: "success", message: response.message }))
        window.location.reload()
    } else {
        dispatch(setError({ type: "error", message: response.message }))
    }
    dispatch(setLoading(false));
}



export const stationColumns = [
    {
        accessorKey: 'stationId', //access nested data with dot notation
        header: 'Station Id',
        size: 150,
    },
    {
        accessorKey: 'stationName',
        header: 'Station Name',
        size: 150,
    },
    {
        accessorKey: 'locationName',
        header: 'Location Name',
        size: 150,
    },
    {
        accessorKey: 'userType',
        header: 'User Type',
        size: 150,
    },
    {
        accessorKey: 'firstName',
        header: 'Manager First Name',
        size: 150,
    },
    {
        accessorKey: 'lastName',
        header: 'Manager Last Name',
        size: 150,
    },
    {
        accessorKey: 'contact',
        header: 'Manager Contact',
        size: 150,
    }
]


export const planColumns = [
    {
        accessorKey: 'planName',
        header: 'Plan Name',
        size: 150,
    },
    {
        accessorKey: 'planPrice', //access nested data with dot notation
        header: 'Plan Price',
        size: 150,
    },
    {
        accessorKey: 'location',
        header: 'Location',
        size: 150,
    },
    {
        accessorKey: 'stationId',
        header: 'Station Id',
        size: 150,
    }
]


export const bookingColumns = [
    {
        accessorKey: 'bookingId', //access nested data with dot notation
        header: 'Booking Id',
        size: 150,
    },
    {
        accessorKey: 'firstName', //access nested data with dot notation
        header: 'User Name',
        size: 150,
    },
    {
        accessorKey: 'contact', //access nested data with dot notation
        header: 'Contact',
        size: 150,
    },
    {
        accessorKey: 'email', //access nested data with dot notation
        header: 'Email',
        size: 150,
    },    
    {
        accessorKey: 'altContact', //access nested data with dot notation
        header: 'Alternate Contact',
        size: 150,
    },
    {
        accessorKey: 'userType', //access nested data with dot notation
        header: 'User Type',
        size: 150,
    },
    {
        accessorKey: 'BookingStartDateAndTime.startDate', //access nested data with dot notation
        header: 'Booking Start Date',
        size: 150,
    },
    {
        accessorKey: 'BookingEndDateAndTime.endDate', //access nested data with dot notation
        header: 'Booking End Date',
        size: 150,
    },
    {
        accessorKey: 'BookingStartDateAndTime.startTime', //access nested data with dot notation
        header: 'Booking Start Time',
        size: 150,
    },
    {
        accessorKey: 'BookingEndDateAndTime.endTime', //access nested data with dot notation
        header: 'Booking End Time',
        size: 150,
    },
    {
        accessorKey: 'bookingPrice.totalPrice', //access nested data with dot notation
        header: 'Total Price',
        size: 150,
    },
    {
        accessorKey: 'bookingPrice.tax', //access nested data with dot notation
        header: 'Booking Tax',
        size: 150,
    },
    {
        accessorKey: 'bookingPrice.extraAddonPrice', //access nested data with dot notation
        header: 'Extra Addon Price',
        size: 150,
    },
    {
        accessorKey: 'bookingPrice.roundPrice', //access nested data with dot notation
        header: 'Round Price',
        size: 150,
    },
    {
        accessorKey: 'bookingPrice.vehiclePrice', //access nested data with dot notation
        header: 'Vehicle Price',
        size: 150,
    },
    {
        accessorKey: 'bookingStatus', //access nested data with dot notation
        header: 'Booking Status',
        size: 150,
    },
    {
        accessorKey: 'paymentStatus', //access nested data with dot notation
        header: 'Payment Status',
        size: 150,
    },
    {
        accessorKey: 'rideStatus', //access nested data with dot notation
        header: 'Ride Status',
        size: 150,
    },
    {
        accessorKey: 'paymentMethod', //access nested data with dot notation
        header: 'Payment Method',
        size: 150,
    },
    {
        accessorKey: 'payInitFrom', //access nested data with dot notation
        header: 'Payment Gateway',
        size: 150,
    },
    {
        accessorKey: 'city', //access nested data with dot notation
        header: 'City Name',
        size: 150,
    },
    {
        accessorKey: 'stationName', //access nested data with dot notation
        header: 'Station Name',
        size: 150,
    },
    {
        accessorKey: 'address', //access nested data with dot notation
        header: 'Station Address',
        size: 150,
    },
]

export const locationColumns = [
    {
        accessorKey: 'locationName', //access nested data with dot notation
        header: 'Location Name',
        size: 150,
    }
]

export const vehicleTableColumns = [
    {
        accessorKey: 'vehicleName', //access nested data with dot notation
        header: 'vehicleName',
        size: 150,
    },
    {
        accessorKey: 'vehicleStatus', //access nested data with dot notation
        header: 'Vehicle Status',
        size: 150,
    },
    {
        accessorKey: 'freeKms',
        header: 'Free Kms',
        size: 150,
    },
    {
        accessorKey: 'locationName', //normal accessorKey
        header: 'Location',
        size: 150,
    },
    {
        accessorKey: 'stationName', //normal accessorKey
        header: 'Station',
        size: 150,
    },
    {
        accessorKey: 'vehicleNumber', //normal accessorKey
        header: 'Vehicle Number',
        size: 150,
    },
    {
        accessorKey: 'vehicleModel', //normal accessorKey
        header: 'Vehicle Model',
        size: 150,
    },
    {
        accessorKey: 'extraKmsCharges', //normal accessorKey
        header: 'Extra Kms Charges',
        size: 150,
    },
    {
        accessorKey: 'vehicleColor', //normal accessorKey
        header: 'Vehicle Color',
        size: 150,
    },
    {
        accessorKey: 'perDayCost', //normal accessorKey
        header: 'Per Day Cost',
        size: 150,
    },
    {
        accessorKey: 'lastServiceDate', //normal accessorKey
        header: 'Last Service Date',
        size: 150,
    },
    {
        accessorKey: 'kmsRun', //normal accessorKey
        header: 'Kms Run',
        size: 150,
    },
    {
        accessorKey: 'isBooked', //normal accessorKey
        header: 'Is Booked',
        size: 150,
    },
    {
        accessorKey: 'condition', //normal accessorKey
        header: 'Condition',
        size: 150,
    }
]

export const userColumns = [
    {
        accessorKey: 'userType', //access nested data with dot notation
        header: 'User Type',
        size: 150,
    },
    {
        accessorKey: 'isEmailVerified',
        header: 'Email Verified',
        size: 150,
    },
    {
        accessorKey: 'isContactVerified', //normal accessorKey
        header: 'Contact Verified',
        size: 150,
    },
    {
        accessorKey: 'kycApproved', //normal accessorKey
        header: 'Kyc Approved',
        size: 150,
    },
    {
        accessorKey: 'status', //normal accessorKey
        header: 'Status',
        size: 150,
    },
    {
        accessorKey: 'altContact', //normal accessorKey
        header: 'Alternate Contact',
        size: 150,
    },
    {
        accessorKey: 'firstName', //normal accessorKey
        header: 'First Name',
        size: 150,
    },
    {
        accessorKey: 'lastName', //normal accessorKey
        header: 'Last Name',
        size: 150,
    },
    {
        accessorKey: 'contact', //normal accessorKey
        header: 'Contact',
        size: 150,
    },
    {
        accessorKey: 'email', //normal accessorKey
        header: 'Email',
        size: 150,
    }
]