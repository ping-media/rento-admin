import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AdjustRoundedIcon from "@mui/icons-material/AdjustRounded";
import EmojiTransportationOutlinedIcon from "@mui/icons-material/EmojiTransportationOutlined";
import BookOnlineOutlinedIcon from "@mui/icons-material/BookOnlineOutlined";
import RequestPageOutlinedIcon from "@mui/icons-material/RequestPageOutlined";
import LoyaltyOutlinedIcon from "@mui/icons-material/LoyaltyOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

const menuList = [
  {
    menuImg: <DashboardOutlinedIcon />,
    menuTitle: "Dashboard",
    menuLink: "/dashboard",
  },
  {
    menuImg: <LocationOnOutlinedIcon />,
    menuTitle: "Location Master",
    menuLink: "/location-master",
  },
  {
    menuImg: <DirectionsCarFilledOutlinedIcon />,
    menuTitle: "Vehicle Master",
    menuLink: "/vehicle-master",
  },
  {
    menuImg: <RequestPageOutlinedIcon />,
    menuTitle: "Plan Master",
    menuLink: "/all-plans",
  },
  {
    menuImg: <EmojiTransportationOutlinedIcon />,
    menuTitle: "Station",
    menuLink: "/station-master",
  },
  {
    menuImg: <DirectionsCarFilledOutlinedIcon />,
    menuTitle: "All Vehicles",
    menuLink: "/all-vehicles",
  },
  {
    menuImg: <PersonOutlinedIcon />,
    menuTitle: "Manage Users",
    menuLink: "#",
    nestedLink: [
      {
        menuImg: <AdjustRoundedIcon />,
        menuTitle: "All Customers",
        menuLink: "/all-users",
      },
      {
        menuImg: <AdjustRoundedIcon />,
        menuTitle: "All Managers",
        menuLink: "/all-managers",
      },
      {
        menuImg: <AdjustRoundedIcon />,
        menuTitle: "Users Documents",
        menuLink: "/users-documents",
      },
    ],
  },
  {
    menuImg: <BookOnlineOutlinedIcon />,
    menuTitle: "Manage Bookings",
    menuLink: "/all-bookings",
  },
  // {
  //   menuImg: <ImageOutlinedIcon />,
  //   menuTitle: "vehicle Pickup",
  //   menuLink: "/all-pickup-image",
  // },
  {
    menuImg: <LoyaltyOutlinedIcon />,
    menuTitle: "All Coupons",
    menuLink: "/all-coupons",
  },
  {
    menuImg: <AccountBalanceOutlinedIcon />,
    menuTitle: "Payments",
    menuLink: "/payments",
  },
  {
    menuImg: <ReceiptOutlinedIcon />,
    menuTitle: "Invoices",
    menuLink: "/all-invoices",
  },
  {
    menuImg: <PersonOutlinedIcon />,
    menuTitle: "Profile",
    menuLink: "/profile",
  },
];

export { menuList };
