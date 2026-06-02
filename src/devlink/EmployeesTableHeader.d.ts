import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function EmployeesTableHeader(props: {
  activeTicketsSorting?: Types.Devlink.Slot;
  employeeStatusSortSlot?: Types.Devlink.Slot;
  lastTicketSortSlot?: Types.Devlink.Slot;
  text1?: React.ReactNode;
  text2?: React.ReactNode;
  text3?: React.ReactNode;
  text4?: React.ReactNode;
}): React.JSX.Element;
