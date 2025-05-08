const TableImage = ({ item, column }) => {
  return (
    <td className="p-2">
      <div className="flex items-center gap-3 text-center">
        <div className="w-32 h-14">
          <img src={item[column]} className="w-full h-full object-cover" />
        </div>
      </div>
    </td>
  );
};

export default TableImage;
