const TableImage = ({ item, column, columnIndex }) => {
  return (
    <td className="p-3" key={columnIndex}>
      <div className="flex items-center gap-3 text-center">
        <img src={item[column]} className="w-28 h-20 object-contain" />
      </div>
    </td>
  );
};

export default TableImage;
