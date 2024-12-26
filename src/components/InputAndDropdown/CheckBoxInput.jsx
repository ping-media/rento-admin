const CheckBoxInput = ({ handleChange, tempIds, data, isId, unique }) => {
  return (
    <>
      <label className="inline-flex items-center" htmlFor={unique}>
        <input
          id={unique}
          type="checkbox"
          className="w-4 h-4 accent-red-600"
          onChange={(e) =>
            isId ? handleChange(e.target.checked) : handleChange(isId)
          }
          checked={
            isId
              ? tempIds.length === data.length && data.length > 0
              : tempIds.includes(isId)
          }
        />
      </label>
    </>
  );
};

export default CheckBoxInput;
