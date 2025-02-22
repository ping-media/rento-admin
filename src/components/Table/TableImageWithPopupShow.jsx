const TableImage = ({ item, column }) => {
  return (
    <td className="p-3">
      <div className="flex items-center gap-3 text-center">
        <img src={item[column]} className="w-28 h-14 object-contain" />
      </div>
    </td>
  );
};

export default TableImage;
