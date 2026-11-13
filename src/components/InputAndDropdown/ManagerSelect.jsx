import ArrowSelect from "./ArrowSelect";
import useManagers from "../../hooks/use-managers";

const ManagerSelect = ({
  value,
  onChange,
  placeholder = "Select manager / fleet staff",
}) => {
  const managers = useManagers();
  return (
    <ArrowSelect
      wrapperClassName="w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-md border border-gray-300 px-5 py-3 text-sm capitalize"
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {managers.map((m) => (
        <option key={m._id} value={m._id}>
          {m.firstName} {m.lastName}
        </option>
      ))}
    </ArrowSelect>
  );
};

export default ManagerSelect;
