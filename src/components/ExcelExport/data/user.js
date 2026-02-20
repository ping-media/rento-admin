import { formatFullDateAndTime } from "../../../utils";

export function transformUsers(data) {
  return data.map((item) => ({
    FullName: `${item?.firstName || "--"} ${item?.lastName || ""}`,
    CustomerNumber: item?.contact || "--",
    AltCustomerNumber: item?.altContact || "--",
    Email: item?.email || "--",
    CreatedAt: item?.createdAt ? formatFullDateAndTime(item?.createdAt) : "--",
  }));
}
