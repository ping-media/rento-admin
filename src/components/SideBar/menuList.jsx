import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
// import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AdjustRoundedIcon from "@mui/icons-material/AdjustRounded";
import EmojiTransportationOutlinedIcon from "@mui/icons-material/EmojiTransportationOutlined";
// import BookOnlineOutlinedIcon from "@mui/icons-material/BookOnlineOutlined";
// import RequestPageOutlinedIcon from "@mui/icons-material/RequestPageOutlined";
import LoyaltyOutlinedIcon from "@mui/icons-material/LoyaltyOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  AccountCircleOutlined,
  EventAvailableOutlined,
  InventoryOutlined,
  TwoWheelerOutlined,
} from "@mui/icons-material";
// import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

const menuList = [
  {
    menuImg: <DashboardOutlinedIcon />,
    menuTitle: "Dashboard",
    menuLink: "/dashboard",
    roles: ["admin"],
  },
  {
    menuImg: <EventAvailableOutlined />,
    menuTitle: "Bookings",
    menuLink: "/all-bookings",
    roles: ["admin", "manager"],
  },
  {
    // menuImg: <DirectionsCarFilledOutlinedIcon />,
    menuImg: <TwoWheelerOutlined />,
    menuTitle: "Vehicles",
    menuLink: "/all-vehicles",
    roles: ["admin", "manager"],
  },
  {
    menuImg: <PersonOutlinedIcon />,
    menuTitle: "Users",
    menuLink: "#",
    roles: ["admin"],
    nestedLink: [
      {
        menuImg: <AdjustRoundedIcon />,
        menuTitle: "All Customers",
        menuLink: "/all-users",
        roles: ["admin"],
      },
      {
        menuImg: <AdjustRoundedIcon />,
        menuTitle: "All Managers",
        menuLink: "/all-managers",
        roles: ["admin"],
      },
    ],
  },
  {
    menuImg: <AccountBalanceOutlinedIcon />,
    menuTitle: "Payments",
    menuLink: "/payments",
    roles: ["admin", "manager"],
  },
  {
    menuImg: <EmojiTransportationOutlinedIcon />,
    menuTitle: "Station",
    menuLink: "/station-master",
    roles: ["admin"],
  },
  {
    menuImg: <LocationOnOutlinedIcon />,
    menuTitle: "Location Master",
    menuLink: "/location-master",
    roles: ["admin"],
  },
  {
    // menuImg: <DirectionsCarFilledOutlinedIcon />,
    menuImg: <TwoWheelerOutlined />,
    menuTitle: "Vehicle Master",
    menuLink: "/vehicle-master",
    roles: ["admin"],
  },
  {
    // menuImg: <RequestPageOutlinedIcon />,
    menuImg: <InventoryOutlined />,
    menuTitle: "Plan Master",
    menuLink: "/all-plans",
    roles: ["admin"],
  },
  {
    menuImg: <ReceiptOutlinedIcon />,
    menuTitle: "Invoices",
    menuLink: "/all-invoices",
    roles: ["admin", "manager"],
  },
  {
    menuImg: <LoyaltyOutlinedIcon />,
    menuTitle: "All Coupons",
    menuLink: "/all-coupons",
    roles: ["admin"],
  },
  {
    menuImg: <AccountCircleOutlined />,
    menuTitle: "Profile",
    menuLink: "/profile",
    roles: ["admin", "manager"],
  },
  {
    menuImg: <SettingsOutlinedIcon />,
    menuTitle: "General Settings",
    menuLink: "/general",
    roles: ["admin"],
  },
];

export { menuList };
