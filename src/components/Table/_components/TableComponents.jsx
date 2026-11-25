import { format } from "date-fns";

export const DateTimeCell = ({ value }) => {
  if (!value) return "--";
  const d = new Date(value);
  return (
    <>
      <p>{format(d, "MMM d, yyyy")}</p>
      <p>{format(d, "hh:mm a")}</p>
    </>
  );
};
