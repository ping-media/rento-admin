const FilterRadioInput = ({
  title,
  searchTag,
  isChecked,
  setFilterState,
  onChangeFn,
}) => {
  // change filters
  const handleChangeValue = () => {
    setFilterState && setFilterState(title);
    if (onChangeFn) {
      onChangeFn(searchTag, title);
    }
  };

  return (
    <>
      <label className="relative flex items-center cursor-pointer">
        <input
          className="sr-only peer"
          type="radio"
          onChange={handleChangeValue}
          checked={isChecked || false}
        />
        <div className="w-8 h-8 md:w-7 md:h-7 bg-transparent border-2 border-theme rounded-full peer-checked:bg-theme peer-checked:border-theme peer-hover:shadow-lg peer-hover:shadow-red-500/50 peer-checked:shadow-lg peer-checked:shadow-red-500/50 transition duration-300 ease-in-out"></div>
        <span className="ml-2 capitalize text-xl md:text-base">{title}</span>
      </label>
    </>
  );
};

export default FilterRadioInput;
