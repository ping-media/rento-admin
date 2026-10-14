import { useEffect, useRef } from "react";

const CheckBox = ({ id, checked, handleSelect, indeterminate }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && indeterminate !== undefined) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className="inline-flex items-center" htmlFor={id}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="w-5 lg:w-4 h-5 lg:h-4 accent-red-600"
        onChange={handleSelect}
        checked={checked}
      />
    </label>
  );
};

export default CheckBox;
