const FilterRadioInput = ({ title, searchTag, onChangeFn }) => {
  const handleChangeValue = () => {
    if (onChangeFn) {
      onChangeFn(searchTag);
    }
  };

  return (
    <>
      <label className="relative flex items-center cursor-pointer">
        <input
          className="sr-only peer"
          name="BookingFlags_radio"
          type="radio"
          onChange={handleChangeValue}
          checked={title === "All" ? true : false}
        />
        <div className="w-5 h-5 bg-transparent border-2 border-theme rounded-full peer-checked:bg-theme peer-checked:border-theme peer-hover:shadow-lg peer-hover:shadow-red-500/50 peer-checked:shadow-lg peer-checked:shadow-red-500/50 transition duration-300 ease-in-out"></div>
        <span className="ml-2 capitalize">{title}</span>
      </label>
    </>
  );
};

export default FilterRadioInput;
