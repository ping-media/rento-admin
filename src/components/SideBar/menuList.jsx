import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AdjustRoundedIcon from "@mui/icons-material/AdjustRounded";
import EmojiTransportationRoundedIcon from "@mui/icons-material/EmojiTransportationRounded";
import BookOnlineRoundedIcon from "@mui/icons-material/BookOnlineRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import LoyaltyRoundedIcon from "@mui/icons-material/LoyaltyRounded";

const menuList = [
  {
    menuImg: <DashboardRoundedIcon />,
    menuTitle: "Dashboard",
    menuLink: "/dashboard",
  },
  {
    menuImg: <DirectionsCarRoundedIcon />,
    menuTitle: "Vehicle Master",
    menuLink: "/vehicle-master",
  },
  {
    menuImg: <LocationOnRoundedIcon />,
    menuTitle: "Location Master",
    menuLink: "/location-master",
  },
  {
    menuImg: <EmojiTransportationRoundedIcon />,
    menuTitle: "Station Master",
    menuLink: "/station-master",
  },
  {
    menuImg: <DirectionsCarRoundedIcon />,
    menuTitle: "Manage Vehicles",
    menuLink: "/manage-vehicles",
    nestedLink: [
      {
        menuImg: <AdjustRoundedIcon />,
        menuTitle: "All Vehicles",
        menuLink: "/all-vehicles",
      },
      {
        menuImg: <AdjustRoundedIcon />,
        menuTitle: "Pending Vehicles",
        menuLink: "/pending-vehicles",
      },
      {
        menuImg: <AdjustRoundedIcon />,
        menuTitle: "Approved Vehicles",
        menuLink: "/approved-vehicles",
      },
    ],
  },
  {
    menuImg: <PersonRoundedIcon />,
    menuTitle: "Manage Users",
    menuLink: "/manage-users",
    nestedLink: [
      {
        menuImg: <AdjustRoundedIcon />,
        menuTitle: "All Users",
        menuLink: "/all-users",
      },
      {
        menuImg: <AdjustRoundedIcon />,
        menuTitle: "Pending Users",
        menuLink: "/pending-users",
      },
      {
        menuImg: <AdjustRoundedIcon />,
        menuTitle: "Approved Users",
        menuLink: "/approved-users",
      },
    ],
  },
  {
    menuImg: <DescriptionRoundedIcon />,
    menuTitle: "All Plans",
    menuLink: "/all-plans",
  },
  {
    menuImg: <BookOnlineRoundedIcon />,
    menuTitle: "Manage Bookings",
    menuLink: "/manage-bookings",
  },
  {
    menuImg: <LoyaltyRoundedIcon />,
    menuTitle: "All Coupons",
    menuLink: "/all-coupons",
  },
  {
    menuImg: <PaymentRoundedIcon />,
    menuTitle: "Payments",
    menuLink: "/payments",
  },
];

export { menuList };
