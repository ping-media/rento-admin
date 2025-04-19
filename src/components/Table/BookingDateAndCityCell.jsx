import { formatFullDateAndTime } from "../../utils/index";

const BookingDateAndCityCell = ({ item, column }) => {
  return (
    <td
      className="p-2 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 capitalize"
      key="startAndEndDate"
    >
      {column === "BookingStartDateAndTime" ? (
        <>
          <p>{`${formatFullDateAndTime(item?.BookingStartDateAndTime)}`}</p>
          <p>{`${formatFullDateAndTime(item?.BookingEndDateAndTime)}`}</p>
        </>
      ) : (
        <>
          <p>{item?.city}</p>
          <p>{item?.state}</p>
        </>
      )}
    </td>
  );
};

export default BookingDateAndCityCell;
