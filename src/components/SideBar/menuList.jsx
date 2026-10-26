import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LoyaltyOutlinedIcon from "@mui/icons-material/LoyaltyOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  AccountCircleOutlined,
  AccountTreeOutlined,
  EventAvailableOutlined,
  EventNoteOutlined,
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
  // {
  //   menuImg: <TwoWheelerOutlined />,
  //   menuTitle: "Vehicles",
  //   menuLink: "/all-vehicles",
  //   roles: ["admin", "manager"],
  // },
  {
    menuImg: <TwoWheelerOutlined />,
    menuTitle: "Vehicles",
    children: [
      {
        menuTitle: "All Vehicles",
        menuLink: "/all-vehicles",
        roles: ["admin", "manager"],
      },
      {
        menuTitle: "Vehicle Master",
        menuLink: "/vehicle-master",
        roles: ["admin"],
      },
      { menuTitle: "Plan Master", menuLink: "/all-plans", roles: ["admin"] },
    ],
  },
  {
    menuImg: <AccountTreeOutlined />,
    menuTitle: "Extra Addon",
    menuLink: "/extra-addon",
    roles: ["manager"],
  },
  // {
  //   menuImg: <PersonOutlinedIcon />,
  //   menuTitle: "Customers",
  //   menuLink: "/all-users",
  //   roles: ["admin"],
  // },
  {
    menuImg: <PersonOutlinedIcon />,
    menuTitle: "Users",
    children: [
      { menuTitle: "Customers", menuLink: "/all-users", roles: ["admin"] },
      { menuTitle: "Managers", menuLink: "/all-managers", roles: ["admin"] },
    ],
  },
  {
    menuImg: <AccountBalanceOutlinedIcon />,
    menuTitle: "Payments",
    menuLink: "/payments",
    roles: ["admin", "manager"],
  },
  {
    menuImg: <LocationOnOutlinedIcon />,
    menuTitle: "Hubs",
    children: [
      { menuTitle: "Stations", menuLink: "/station-master", roles: ["admin"] },
      { menuTitle: "Cities", menuLink: "/location-master", roles: ["admin"] },
    ],
  },
  // {
  //   menuImg: <EmojiTransportationOutlinedIcon />,
  //   menuTitle: "Stations",
  //   menuLink: "/station-master",
  //   roles: ["admin"],
  // },
  {
    menuImg: <ReceiptOutlinedIcon />,
    menuTitle: "Invoices",
    menuLink: "/all-invoices",
    roles: ["admin"],
  },
  {
    menuImg: <LoyaltyOutlinedIcon />,
    menuTitle: "Coupons",
    menuLink: "/all-coupons",
    roles: ["admin"],
  },
  // {
  //   menuImg: <PeopleOutlineOutlined />,
  //   menuTitle: "Managers",
  //   menuLink: "/all-managers",
  //   roles: ["admin"],
  // },
  // {
  //   menuImg: <LocationOnOutlinedIcon />,
  //   menuTitle: "Cities",
  //   menuLink: "/location-master",
  //   roles: ["admin"],
  // },
  // {
  //   menuImg: <TwoWheelerOutlined />,
  //   menuTitle: "Vehicle Master",
  //   menuLink: "/vehicle-master",
  //   roles: ["admin"],
  // },
  // {
  //   menuImg: <InventoryOutlined />,
  //   menuTitle: "Plan Master",
  //   menuLink: "/all-plans",
  //   roles: ["admin"],
  // },
  {
    menuImg: <EventNoteOutlined />,
    menuTitle: "Attendance",
    menuLink: "/attendance",
    roles: ["manager"],
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
