import notFoundImg from "../../assets/logo/internet.png";

const TableNotFound = () => {
  return (
    <tr>
      <td
        className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 text-center capitalize"
        colSpan={7}
      >
        <div className="w-16 h-16 mx-auto">
          <img
            src={notFoundImg}
            className="w-full h-full object-cover opacity-50"
            alt="DATA_NOT_FOUND"
          />
        </div>
        <span className="opacity-50">No Data Found.</span>
      </td>
    </tr>
  );
};

export default TableNotFound;
