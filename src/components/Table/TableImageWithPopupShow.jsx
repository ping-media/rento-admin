const TableImage = ({ item, column }) => {
  const widthBasedOnLocation =
    location.pathname === "/location-master" ? "w-32" : "w-20";

  return (
    <td className="px-2 py-1">
      <div className="flex items-center gap-3 text-center">
        <div className={`${widthBasedOnLocation} h-14`}>
          <img src={item[column]} className="w-full h-full object-cover" />
        </div>
      </div>
    </td>
  );
};

export default TableImage;
