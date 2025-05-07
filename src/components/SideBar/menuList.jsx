import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import AdjustRoundedIcon from "@mui/icons-material/AdjustRounded";
import EmojiTransportationOutlinedIcon from "@mui/icons-material/EmojiTransportationOutlined";
import LoyaltyOutlinedIcon from "@mui/icons-material/LoyaltyOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  AccountCircleOutlined,
  EventAvailableOutlined,
  InventoryOutlined,
  PeopleOutlineOutlined,
  TwoWheelerOutlined,
} from "@mui/icons-material";

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
    menuImg: <TwoWheelerOutlined />,
    menuTitle: "Vehicles",
    menuLink: "/all-vehicles",
    roles: ["admin", "manager"],
  },
  {
    menuImg: <PersonOutlinedIcon />,
    menuTitle: "Customers",
    menuLink: "/all-users",
    roles: ["admin"],
  },
  // {
  //   menuImg: <PersonOutlinedIcon />,
  //   menuTitle: "Users",
  //   menuLink: "#",
  //   roles: ["admin"],
  //   nestedLink: [
  //     {
  //       menuImg: <AdjustRoundedIcon />,
  //       menuTitle: "All Customers",
  //       menuLink: "/all-users",
  //       roles: ["admin"],
  //     },
  //     {
  //       menuImg: <AdjustRoundedIcon />,
  //       menuTitle: "All Managers",
  //       menuLink: "/all-managers",
  //       roles: ["admin"],
  //     },
  //   ],
  // },
  {
    menuImg: <AccountBalanceOutlinedIcon />,
    menuTitle: "Payments",
    menuLink: "/payments",
    roles: ["admin", "manager"],
  },
  {
    menuImg: <EmojiTransportationOutlinedIcon />,
    menuTitle: "Stations",
    menuLink: "/station-master",
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
    menuImg: <PeopleOutlineOutlined />,
    menuTitle: "Managers",
    menuLink: "/all-managers",
    roles: ["admin"],
  },
  {
    menuImg: <LocationOnOutlinedIcon />,
    menuTitle: "Location Master",
    menuLink: "/location-master",
    roles: ["admin"],
  },
  {
    menuImg: <TwoWheelerOutlined />,
    menuTitle: "Vehicle Master",
    menuLink: "/vehicle-master",
    roles: ["admin"],
  },
  {
    menuImg: <InventoryOutlined />,
    menuTitle: "Plan Master",
    menuLink: "/all-plans",
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
    menuTitle: "Settings",
    menuLink: "/settings",
    roles: ["admin"],
  },
];

export { menuList };
