import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useListParams from "../../hooks/use-list-params";
import { getFullData } from "../../Data/index";
import ArrowSelect from "../InputAndDropdown/ArrowSelect";

const AttendancePersonFilter = () => {
  const { token } = useSelector((state) => state.user);
  const { attendanceUser, updateParams } = useListParams();
  const [people, setPeople] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getFullData(
          "/admin/getAllUsers?userType=manager&status=active&page=1&limit=200",
          token,
        );
        setPeople(res?.data?.data || []);
      } catch (error) {
        setPeople([]);
      }
    })();
  }, [token]);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm text-gray-700">
        Manager / fleet staff
        <ArrowSelect
          wrapperClassName="mt-1"
          value={attendanceUser}
          onChange={(e) => updateParams({ attendanceUser: e.target.value })}
          className="block w-full rounded-md border border-gray-300 px-5 py-3 text-sm capitalize"
        >
          <option value="">Select a person</option>
          {people.map((p) => (
            <option key={p._id} value={p._id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </ArrowSelect>
      </label>
      {attendanceUser && (
        <button
          type="button"
          onClick={() => updateParams({ attendanceUser: "" })}
          className="self-end rounded-md border border-gray-300 p-1 text-sm hover:border-theme hover:text-theme"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default AttendancePersonFilter;
