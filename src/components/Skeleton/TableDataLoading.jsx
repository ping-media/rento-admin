import Spinner from "../../components/Spinner/Spinner";

const TableDataLoading = ({ tableHeaderCount = 7 }) => {
  return (
    <tr>
      <td
        className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 text-center capitalize text-center"
        colSpan={tableHeaderCount}
      >
        <Spinner message={"loading..."} textColor="black" />
      </td>
    </tr>
  );
};

export default TableDataLoading;
